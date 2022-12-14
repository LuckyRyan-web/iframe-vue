/**
 *
 * @author liuyuan
 * @date 2022-09-24 17:11
 * @since 0.0.0
 */
import {
    defineComponent,
    ref,
    PropType,
    onMounted,
    watch,
    onUnmounted,
} from 'vue'
import classnames from 'classnames'
import style from './style.module.scss'
// import { reg, ResultRegType } from '@/lib/getIpc'
import { getIpc, IPC } from '@/lib/ipc'
import useBridge from '@/hooks/useBridge'

export default defineComponent({
    props: {
        msg: {
            type: String,
            default: '',
        },
        info: {
            type: Object as PropType<ApiUser.Msg>,
            default: () => {
                return {
                    name: 'hello typings',
                }
            },
        },
    },
    setup() {
        const count = ref(0)

        const ipcVal = ref<IPC | null>(null)

        onMounted(() => {
            const timer = setInterval(() => {
                const ipc = getIpc()

                if (ipc) {
                    ipcVal.value = ipc

                    ipc.on('load', (ctx) => {
                        console.log(ctx)
                    })

                    clearInterval(timer)
                }
            })
        })

        const sendCount = () => {
            count.value++

            if (!ipcVal.value) {
                console.error('ipc 获取通信失败')
            }

            ipcVal.value?.send({
                name: 'sendCount',
                context: {
                    count: count.value,
                },
            })

            ipcVal.value?.on('load', (ctx) => {
                console.log(ctx)
            })
        }

        return {
            count,
            sendCount,
        }
    },
    render() {
        return (
            <div>
                <h1>{this.msg}</h1>
                <h1>{this.info.name}</h1>
                <div class={style.card}>
                    <button
                        type="button"
                        onClick={() => {
                            this.sendCount()
                        }}
                    >
                        count is {this.count}
                    </button>
                    <p>
                        Edit
                        <code>components/HelloWorld.vue</code> to test HMR
                    </p>
                    <p>
                        Check out
                        <a
                            href="https://vuejs.org/guide/quick-start.html#local"
                            target="_blank"
                        >
                            create-vue
                        </a>
                        , the official Vue + Vite starter
                    </p>
                    <p>
                        Install
                        <a
                            href="https://github.com/johnsoncodehk/volar"
                            target="_blank"
                        >
                            Volar
                        </a>
                        in your IDE for a better DX
                    </p>
                    <p class="read-the-docs">
                        Click on the Vite and Vue logos to learn more
                    </p>
                </div>
            </div>
        )
    },
})
