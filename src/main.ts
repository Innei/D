import { createApp } from 'vue'

import App from './App.vue'

import 'virtual:uno.css'
import './assets/main.css'

import { createPinia } from 'pinia'

import { VueQueryPlugin } from '@tanstack/vue-query'

import router from './router'
import { queryClient } from './utils/query'

const pinia = createPinia()

createApp(App)
  .use(router)
  .use(VueQueryPlugin, {
    queryClient,
  })
  .use(pinia)
  .mount('#app')
