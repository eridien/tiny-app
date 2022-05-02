import {createApp} from 'vue'
import App         from './App.vue'
import mitt        from 'mitt'

const global = {};

if(import.meta.env.MODE == 'development')
     global.hostname = '192.168.1.145';
else global.hostname = location.hostname;

const app = createApp(App);
app.provide('global', global);
app.provide('evtBus', mitt()); 
app.mount('body');
