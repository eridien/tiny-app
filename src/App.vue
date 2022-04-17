<template lang='pug'>
div
  Header(id="head" :rssi="rssi" :batv="batv")
  Controls(@setAccel="setAccelEvent" @setYaw="setYawEvent"
           @stop="stopEvent"         @pwrOff="pwrOffEvent" )
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
    console.log(`---- App Mounted, ` +
                `hostname: ${hostname} ---`);
    initWebsocket(hostname, websocketCB);
  });
</script>

<style>
</style>
