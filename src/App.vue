<template lang='pug'>
#app(style="position:fixed;")
  Header(:rssi="rssi" :batv="batv" 
        :style="{width:'65vw', height:`${HDR_HGT-15}px`,  \
                 padding:'5px', margin:'0 5vw 0 5vw'}")
  Controls(:HDR_HGT="HDR_HGT" 
           style="width=100%;"
          :closeOnNavigation="true"
           @accel="accel"  @angle="angle"
           @stop="stopEvt" @pwrOff="pwrOffEvt")
  Slide(right="true" width="200" noOverlay="true"
       :isOpen="menuOpen" 
       @closeMenu="menuOpen = false")
    #stop(  @click="stopEvt")   Stop
    #pwrOff(@click="pwrOffEvt") Power Off
</template>

<script setup>
  import {onMounted, getCurrentInstance, ref } from 'vue'
  import  Header          from './components/header.vue'
  import  Controls        from './components/controls.vue'
  import {initWebsocket, setAccel, setYaw, stop, pwrOff} 
                          from "./websocket.js";
  import { Slide } from 'vue3-burger-menu'  

  const HDR_HGT = 65;
  let   menuOpen = false;           

  const stopEvt = () => {
    stop();
    menuOpen = false;
  }

  const pwrOffEvt = () => {
    pwrOff();
    menuOpen = false;
  }

  const accel = accel => setAccel(accel);
  const angle = angle => setYaw(angle);

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
    // initWebsocket(hostname, websocketCB);
  });
</script>

<style>
 .bm-burger-button {
    position: fixed;
    width: 36px;
    height: 30px;
    left: 85vw;
    top: 15px;
    cursor: pointer;
  }
  .bm-burger-bars {
    background-color: #373a47;
  }
  .line-style {
    position: absolute;
    height: 3px;
    left: 0;
    right: 0;
  }
  .cross-style {
    position: absolute;
    top: 12px;
    right: 2px;
    cursor: pointer;
  }
  .bm-cross {
    background: #bdc3c7;
  }
  .bm-cross-button {
    height: 24px;
    width: 24px;
  }
  .bm-menu {
    height: 170px; 
    position: fixed;
    z-index: 1000;
    top: 65px;
    left: 0;
    background-color: #ddd;
    overflow-x: hidden; /* Disable horizontal scroll */
    padding-top: 6px;
    transition: 0.05s;
  }
  .bm-item-list {
    color: black;
    margin-left: 6%;
    font-size: 20px;
    width:170px;
  }
  .bm-item-list > * {
    background-color: white;
    border: 1px solid black;
    margin: 10px;
    display: flex;
    text-decoration: none;
    padding: 0.7em;
    font-weight: 700;
    font-size:25px;
    color: black;
  }
</style>