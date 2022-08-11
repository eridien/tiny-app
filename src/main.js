import {createApp} from 'vue'
import App         from './App.vue'
import mitt        from 'mitt'

const BOT_HOSTNAME_DEV = "192.168.1.199" // 6-5  => a020a60404c9
// const BOT_HOSTNAME_DEV = "192.168.1.218" // 7-3 Cameron green  AC:0B:FB:E2:6D:9D
// const BOT_HOSTNAME_DEV = "192.168.1.219" // 7-4 Wyatt   silver AC:0B:FB:E2:6E:21
// const BOT_HOSTNAME_DEV = "192.168.1.220" // 7-5 Bowie   blue   AC:0B:FB:E0:68:0F

// -- non t-bot --
// const BOT_HOSTNAME_DEV = "192.168.1.137" // hvac
// const BOT_HOSTNAME_DEV = "192.168.1.206" // => crbug ??
// const BOT_HOSTNAME_DEV = "192.168.1.134" // => 2cf43260eedf  ?? 
// const BOT_HOSTNAME_DEV = "192.168.1.135" // => d8bfc0dbaf6f  ??

// -- old --
// const BOT_HOSTNAME_DEV = "192.168.1.231"; // Tb
// const BOT_HOSTNAME_DEV = "192.168.1.236"; // Bowie
// const BOT_HOSTNAME_DEV = "192.168.1.237"; // Wyatt
// const BOT_HOSTNAME_DEV = "192.168.1.238"; // Cam
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
