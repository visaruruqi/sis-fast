import 'reflect-metadata'
import { createApp } from 'vue'
import Observer from 'mobx-vue-lite'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'

const app = createApp(App)
app.use(router)
app.use(Observer)
app.mount('#app')
