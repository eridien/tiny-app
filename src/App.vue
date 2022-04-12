<template lang='pug'>
div(style="text-align:center")
  Header(:images="images" :rssi="rssi" :batv="batv")
</template>

<script setup>
  import {onMounted, getCurrentInstance, ref } from 'vue'
  import  Header         from './components/header.vue'
  import {initWebsocket} from "./websocket.js";

  const app = getCurrentInstance();
  const {hostname, images} = 
        app.appContext.config.globalProperties;

  const rssi = ref(0);
  const batv = ref(0);
  const websocketCB = (status) => {
    if(status.w) rssi.value = status.w;
    if(status.b) batv.value = status.b;
  }

  onMounted(async() => { 
    console.log(`\n---- mounted, ` +
                `hostname: ${hostname}, images: ${images} ----\n`);
    initWebsocket(hostname, images, websocketCB);
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
