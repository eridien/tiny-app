import {createApp} from 'vue'
import App         from './App.vue'
import mitt        from 'mitt'

const BOT_HOSTNAME_DEV = "192.168.1.155"; // hahn-fi
// const BOT_HOSTNAME_DEV = "192.168.1.145"; // hahn-fi
// const BOT_HOSTNAME_DEV = "192.168.86.55"; // pinkpalace

const global = {};
global.env = import.meta.env.MODE;
if(global.env == 'development')
     global.hostname = BOT_HOSTNAME_DEV;
else global.hostname = location.hostname;

const app = createApp(App);
app.provide('global', global);
app.provide('evtBus', mitt()); 
app.mount('body');
