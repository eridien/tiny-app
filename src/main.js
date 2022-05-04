import {createApp} from 'vue'
import App         from './App.vue'
import mitt        from 'mitt'

const global = {};

const BOT_HOSTNAME_DEV = "192.168.1.145"; // hahn-fi
// const BOT_HOSTNAME_DEV = "192.168.86.55"; // pinkpalace

if(import.meta.env.MODE == 'development')
     global.hostname = BOT_HOSTNAME_DEV;
else global.hostname = location.hostname;

const app = createApp(App);
app.provide('global', global);
app.provide('evtBus', mitt()); 
app.mount('body');
