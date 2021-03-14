/*
 * @Author: Innei
 * @Date: 2020-11-18 15:37:35
 * @LastEditTime: 2021-03-14 13:52:48
 * @LastEditors: Innei
 * @FilePath: /nai-vue/src/main.ts
 * Mark: Coding with Love
 */
import { createApp } from 'vue'
import App from './App'
import './assets/tailwind.css'
import 'normalize.css'
import router from './router'
import './assets/main.css'
createApp(App).use(router).mount('#app')

// FIXME: this is only polyfill for old version unified.
// @ts-ignore
// window.process = {
//   env: {},
//   cwd: () => {},
// }
