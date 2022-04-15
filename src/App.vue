<template lang='pug'>
div
  Header(id="head" :rssi="rssi" :batv="batv")
  Controls(id="control" 
          @setAccel="setAccelEvent" @setYaw="setYawEvent"
          @stop="stopEvent"         @pwrOff="pwrOffEvent")
</template>

<script setup>
  import {onMounted, getCurrentInstance, ref } from 'vue'
  import  Header          from './components/header.vue'
  import  Controls        from './components/controls.vue'
  import {initWebsocket, setAccel, setYaw, stop, pwrOff} 
                          from "./websocket.js";

  const setAccelEvent = (accel) => setAccel(accel);
  const setYawEvent   = (yaw)   => setYaw(accel);
  const stopEvent     = ()      => stop();
  const pwrOffEvent   = ()      => pwrOff();

  const rssi = ref(0);
  const batv = ref(0);

// status constants from bot
  const fcRssi        = 'w';
  const fcBatV        = 'b';
  const fcTime        = 't';
  const fcElapsedMs   = 'm';
  const fcAccelX      = 'a';
  const fcYawRate     = 'y';
  const fcAccelErrInt = 'i';
  const fcYawErrInt   = 'j';
  const fcLeftPwm     = 'l';
  const fcRightPwm    = 'r';
  const fcError       = 'e';

  const websocketCB = (status) => {
    rssi.value = status?.[fcRssi];
    batv.value = status?.[fcBatV];
    const err  = status?.[fcError];
    if(err) console.log(`BOT ERROR: ${err}`);
  }

  const app = getCurrentInstance();
  const {hostname} = 
        app.appContext.config.globalProperties;

  onMounted(async() => { 
    console.log(`\n---- App Mounted, ` +
                `hostname: ${hostname} ---\n`);
    initWebsocket(hostname, websocketCB);
  });
</script>

<style>
* { padding: 0; margin: 0; }

html, body {
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
   box-sizing: border-box;
}

body > * {
  flex-shrink: 0;
}

#head { background-color: yellow; }

#control {
  background-color: orange;
  flex-grow: 1;
}
</style>
