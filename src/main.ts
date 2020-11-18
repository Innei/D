import { createApp } from 'vue'
import App from './App'
import './assets/tailwind.css'
import 'normalize.css'
import router from './router'
createApp(App)
  .use(router)
  .mount('#app')
