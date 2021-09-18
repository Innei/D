/*
 * @Author: Innei
 * @Date: 2020-11-18 15:37:35
 * @LastEditTime: 2021-03-14 14:38:47
 * @LastEditors: Innei
 * @FilePath: /nai-vue/src/main.ts
 * Mark: Coding with Love
 */
import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import './assets/main.css'
import 'normalize.css'
import router from './router'
createApp(App).use(router).mount('#app')
