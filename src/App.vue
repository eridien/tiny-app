<template lang='pug'>
#app
  Header(:rssi="rssi" :batv="batv" 
         :style="{width:'100vw',            \
                  height:`${HDR_HGT-15}px`, \
                  margin:'0 5vw 0 5vw'}"
         @menuOpenStateEvt="menuOpenStateEvt"
         @stop="stopEvt" @pwrOff="pwrOffEvt"
         @showMessage="showMessageEvt")
  Controls(:HDR_HGT="HDR_HGT"
            style="width:calc(100vw-20px);"
           :resetCtrls="resetCtrls"
           :menuOpenState="menuOpenState"
           :showMessage="showMessage"
           @vel="setVel"   @angle="setYaw"
           @stop="stopEvt" 
           @showMessage="showMessageEvt")
</template>

<script setup>
  import {onMounted, getCurrentInstance, ref } from 'vue'
  import  Header     from './components/header.vue'
  import  Controls   from './components/controls.vue'
  import {initWebsocket, setVel, setYaw, stop, pwrOff} 
                          from "./websocket.js";

  const HDR_HGT = 65;

  const rssi          = ref(0);
  const batv          = ref(0);
  const menuOpenState = ref(false)
  const showMessage   = ref(null);

// status constants from bot
  const fcTime        = 't';
  const fcElapsedMs   = 'm';
  const fcBatV        = 'b';
  const fcRssi        = 'w';
  const fcVelPwm      = 'v';
  const fcYawRate     = 'y';
  const fcYawErrInt   = 'i';
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

  const menuOpenStateEvt = (open) => {  
    menuOpenState.value = open;
  }

  const stopEvt = () => {    
    resetCtrls.value++; 
    stop();
  }
  const pwrOffEvt = () => {
    resetCtrls.value++; 
    pwrOff();
  }
  const showMessageEvt = (msgText, doneText) => {
    showMessage.value=[msgText, doneText];
  }

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