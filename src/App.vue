
<template lang='pug'>
div(style="text-align:center")
  HelloWorld(msg="Hello Tiny-bot")
</template>

<script setup>
import { onMounted, getCurrentInstance  } from 'vue'
import HelloWorld      from './components/HelloWorld.vue'
import {initWebsocket} from "./websocket.js";

const app = getCurrentInstance();
const {hostname, images} = 
      app.appContext.config.globalProperties;

onMounted(async() => { 
  console.log(`\n---- mounted, ` +
              `hostname: ${hostname}, images: ${images} ----\n`);
  initWebsocket(hostname, images, );
});

onMounted(async() => {
  const res = await fetch(`http://${hostname}/index.html`, { 
    method: 'get',
    headers: {'content-type': 'text/plain'}
  });
  if (!res.ok)
    console.log('Error loading index.html:', res.statusText);
  else
    console.log(await res.text());
});

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
