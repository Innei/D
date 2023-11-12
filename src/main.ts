import { createApp } from 'vue'

import App from './App.vue'

import './assets/main.css'

import { createPinia } from 'pinia'

import { VueQueryPlugin } from '@tanstack/vue-query'

import router from './router'

const pinia = createPinia()

createApp(App).use(router).use(VueQueryPlugin).use(pinia).mount('#app')
