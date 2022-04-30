import {createApp} from 'vue'
import App         from './App.vue'
import mitt        from 'mitt'

const app = createApp(App);

app.provide('global', app.config.globalProperties);
app.provide('evtBus', mitt()); 

if(import.meta.env.MODE == 'development')
     app.provide('hostname', '192.168.1.145');
else app.provide('hostname', location.hostname);

app.mount('body');
