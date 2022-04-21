<template lang='pug'>
#app(style="position:fixed;")
  Header(:rssi="rssi" :batv="batv" 
         :style="{width:'80vw', height:`${HDR_HGT-15}px`, \
                 padding:'5px', margin:'0 5vw 0 5vw'}"
         @stop="stopEvt" @pwrOff="pwrOffEvt" )
  Controls(:HDR_HGT="HDR_HGT" 
            style="width=100%;"
           @accel="setAccel" @angle="setYaw"
           @stop="stopEvt"
           :resetCtrls="resetCtrls")
</template>

<script setup>
  import {onMounted, getCurrentInstance, ref } from 'vue'
  import  Header     from './components/header.vue'
  import  Controls   from './components/controls.vue'
  import {initWebsocket, setAccel, setYaw, stop, pwrOff} 
                          from "./websocket.js";

  const HDR_HGT = 65;

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
  
  const resetCtrls = ref(0);

  const stopEvt = () => {    
    console.log(`app stopEvt`);

    resetCtrls.value++; 
    stop();
  }
  const pwrOffEvt = () => {
    console.log(`app pwrOffEvt`);

    resetCtrls.value++; 
    pwrOff();
  }

  const app = getCurrentInstance();
  const {hostname} = 
         app.appContext.config.globalProperties;

  onMounted(async() => { 
    console.log(`---- App Mounted, ` +
                `hostname: ${hostname} ---`);
    // initWebsocket(hostname, websocketCB);
  });
</script>

<style>
</style>