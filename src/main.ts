import { createApp } from 'vue'

import 'virtual:uno.css'
import './assets/main.css'

import { createPinia } from 'pinia'
import { RouterView } from 'vue-router'

import { VueQueryPlugin } from '@tanstack/vue-query'

import { router } from './router'
import { queryClient } from './utils/query'

const pinia = createPinia()

createApp(RouterView)
  .use(router)
  .use(VueQueryPlugin, {
    queryClient,
  })
  .use(pinia)
  .mount('#app')
