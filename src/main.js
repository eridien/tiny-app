import {createApp} from 'vue'
import App         from './App.vue'
import mitt        from 'mitt'

const app = createApp(App);

const global = app.config.globalProperties;
app.provide('global', global);
app.provide('evtBus', mitt()); 

if(import.meta.env.MODE == 'development')
     global.hostname = '192.168.1.145';
else global.hostname = location.hostname;

app.mount('body');
