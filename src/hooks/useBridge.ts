import { onMounted, onUnmounted, Ref, isRef } from 'vue'

export type MsgData = {
    method?: string
    callbackId?: string
    data?: any
}
let _callbackId = 0

export default function useBridge(
    brdgingSupplier: {
        [key: string]: (...args: any[]) => any
    },
    target: Window | Ref<Window> = window,
    msgPre = 'yzMsg:'
) {
    const asyncGetDataList: {
        [callbackId: string]: {
            resolve: (data: any) => void
            reject: (err: any) => void
        }
    } = {}

    /**
     * 发送消息
     * @param data
     */
    const sendMessage = (data: MsgData) => {
        const win = isRef(target) ? target.value : target
        win.postMessage(`${msgPre}${JSON.stringify(data)}`, '*')
    }

    /**
     * 处理 app 通信的异步返回
     * @param msgData
     * @param timeout
     * @returns
     */
    const asyncGetData = <T = any>(
        msgData: MsgData,
        timeout = 5000
    ): Promise<T> => {
        _callbackId++
        const callbackId = `yzCallbackId:${_callbackId}`
        return new Promise((resolve, reject) => {
            asyncGetDataList[callbackId] = {
                resolve,
                reject,
            }
            sendMessage({
                ...msgData,
                callbackId,
            })
            setTimeout(() => {
                if (asyncGetDataList[callbackId]) {
                    reject(new Error('timeout'))
                    delete asyncGetDataList[callbackId]
                }
            }, timeout)
        })
    }

    const asyncSetData = (callbackId: string, data: any) => {
        sendMessage({
            callbackId,
            data,
        })
    }

    const onMessage = (evt: MessageEvent) => {
        const msg = String(evt.data)
        if (!msg.startsWith(msgPre)) {
            return
        }
        const data: MsgData = JSON.parse(msg.substring(msgPre.length))

        const method = data.method || ''

        if (
            typeof data === 'object' &&
            data.callbackId &&
            !brdgingSupplier[method]
        ) {
            const callbackId = data.callbackId
            if (callbackId && asyncGetDataList[callbackId]) {
                const { resolve } = asyncGetDataList[callbackId]
                delete asyncGetDataList[callbackId]
                resolve(data.data)
                return
            }
        } else if (method) {
            if (brdgingSupplier[method]) {
                return brdgingSupplier[method](data)
            } else {
                console.log('on msg:', method, data, brdgingSupplier)
            }
        }
    }

    window.addEventListener('message', onMessage, false)

    onUnmounted(() => {
        window.removeEventListener('message', onMessage, false)
    })

    return {
        sendMessage,
        asyncGetData,
        asyncSetData,
    }
}
