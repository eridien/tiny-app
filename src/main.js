import { createApp, getCurrentInstance } from 'vue'
import App from './App.vue'

const app = createApp(App);

app.config.globalProperties
   .hostname = ((import.meta.env.MODE == 'development') 
      ? 'http://192.168.1.160/'
      : '');

app.mount('#app');
