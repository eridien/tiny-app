<template lang='pug'>
div(style="text-align:center")
  Header(:rssi="rssi" :batv="batv")
</template>

<script setup>
  import {onMounted, getCurrentInstance, ref } from 'vue'
  import  Header         from './components/header.vue'
  import {initWebsocket} from "./websocket.js";

  const app = getCurrentInstance();
  const {hostname} = 
        app.appContext.config.globalProperties;

  const rssi = ref(0);
  const batv = ref(0);
  const websocketCB = (status) => {
    if(status.w) rssi.value = status.w;
    if(status.b) batv.value = status.b;
  }

  onMounted(async() => { 
    console.log(`\n---- mounted, ` +
                `hostname: ${hostname} ---\n`);
    initWebsocket(hostname, websocketCB);
  });
</script>

<style>
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
