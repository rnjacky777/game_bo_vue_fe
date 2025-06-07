import { createApp } from 'vue'
import App from './app.vue'
import './assets/styles/main.css'
import router from './router'
const app = createApp(App)
app.use(router)
app.mount('#app')
