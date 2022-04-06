import { createApp, getCurrentInstance } from 'vue'
import App from './App.vue'

const app = createApp(App);

if(import.meta.env.MODE == 'development') {
  app.config.globalProperties.hostname = '192.168.1.160';
  app.config.globalProperties.images   = 'images';
}
else {
  app.config.globalProperties.hostname = '';
  app.config.globalProperties.images   = '';
}

app.mount('#app');
