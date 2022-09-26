/**
 *
 * @author liuyuan
 * @date 2022-09-24 17:14
 * @since 0.0.0
 */
import { defineComponent } from 'vue'
// import classnames from 'classnames'
import style from './style.module.scss'
import Hello from './components/Hello'
import vueSvg from './assets/vue.svg'

export default defineComponent({
    setup() {
        return {}
    },
    render() {
        return (
            <div>
                <div>
                    <a href="https://vitejs.dev" target="_blank">
                        <img
                            src="/vite.svg"
                            class={style.logo}
                            alt="Vite logo"
                        />
                    </a>
                    <a href="https://vuejs.org/" target="_blank">
                        <img src={vueSvg} class={style.logo} alt="Vue logo" />
                    </a>
                </div>

                <Hello msg="Vite + Vue"></Hello>
            </div>
        )
    },
})
