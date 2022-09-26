import EventEmitter from 'eventemitter3'

export interface MsgData {
    name: string
    context?: any
}

export function reg(iframe: HTMLIFrameElement, targetOrigin = '*') {
    const eventEmitter = new EventEmitter()

    const eventNames: string[] = []

    const receiveMessage = (ev: MessageEvent<MsgData>) => {
        if (!ev.data.name) {
            // console.log(ev.data)
            return
        }
        if (!eventNames.includes(ev.data.name)) {
            eventNames.push(ev.data.name)
        }
        eventEmitter.emit(ev.data.name, ev.data.context)
    }

    window.addEventListener('message', receiveMessage, false)

    const ipc = {
        send: (msg: MsgData) => {
            if (iframe.contentWindow) {
                iframe.contentWindow.postMessage(msg, targetOrigin)
            } else {
                console.warn('iframe contentWindow is NUll')
            }
        },
        on: eventEmitter.on.bind(eventEmitter),
        once: eventEmitter.once.bind(eventEmitter),
        off: eventEmitter.off.bind(eventEmitter),
        eventNames,
        destroy: () => {
            window.removeEventListener('message', receiveMessage, false)
            eventEmitter.removeAllListeners()
        },
        /**
         * 框架的路由跳转
         * @param path
         */
        // routerPush: (path: string) => {
        //     if (window.__lite) {
        //         window.__lite.router.push(path)
        //     }
        // },
    }

    return ipc
}
export type ResultRegType = ReturnType<typeof reg>
