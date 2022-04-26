<template lang='pug'>
#app(style="position:fixed;")
  Header(:rssi="rssi" :batv="batv" 
         :style="{width:'80vw', height:`${HDR_HGT-15}px`, \
                 padding:'5px', margin:'0 5vw 0 5vw'}"
         @stop="stopEvt" @pwrOff="pwrOffEvt" )
  Controls(:HDR_HGT="HDR_HGT" 
            style="width=100%;"
           @vel="setVel" @angle="setYaw"
           @stop="stopEvt"
           :resetCtrls="resetCtrls"
           :ctrlDisabled="ctrlDisabled")
</template>

<script setup>
  import {onMounted, getCurrentInstance, ref } from 'vue'
  import  Header     from './components/header.vue'
  import  Controls   from './components/controls.vue'
  import {initWebsocket, setVel, setYaw, stop, pwrOff} 
                          from "./websocket.js";

  const HDR_HGT = 65;

  const rssi = ref(0);
  const batv = ref(0);

// status constants from bot
  const fcTime        = 't';
  const fcElapsedMs   = 'm';
  const fcBatV        = 'b';
  const fcRssi        = 'w';
  const fcVelPwm      = 'v';
  const fcYawRate     = 'y';
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
  
  const ctrlDisabled = ref(false);
  const resetCtrls   = ref(0);

  const menuOpened = () => ctrlDisabled.value = true;
  const stopEvt = () => {    
    resetCtrls.value++; 
    stop();
  }
  const pwrOffEvt = () => {
    resetCtrls.value++; 
    pwrOff();
  }
  const menuClosed = () => ctrlDisabled.value = false;

  const app = getCurrentInstance();
  const {hostname} = 
         app.appContext.config.globalProperties;

  onMounted(async() => { 
    console.log(`---- App Mounted, ` +
                `hostname: ${hostname} ---`);
    initWebsocket(hostname, websocketCB);
  });
</script>

<style>
</style>