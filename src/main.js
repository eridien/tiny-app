import {createApp} from 'vue'
import App         from './App.vue'
import mitt        from 'mitt'

// const BOT_HOSTNAME_DEV = "192.168.1.231"; // Tb
// const BOT_HOSTNAME_DEV = "192.168.1.236"; // Bowie
// const BOT_HOSTNAME_DEV = "192.168.1.237"; // Wyatt
const BOT_HOSTNAME_DEV = "192.168.1.238"; // Cam

// const BOT_HOSTNAME_DEV = "192.168.86.55"; // Tb (Pink Palace)

const global = {};
global.env = import.meta.env.MODE;
global.dev = (global.env == 'development');
if(global.dev)
     global.hostname = BOT_HOSTNAME_DEV;
else global.hostname = location.hostname;

const app = createApp(App);
app.provide('global', global);
app.provide('evtBus', mitt()); 
app.mount('body');
