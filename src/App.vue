<template lang='pug'>
#app
  Header(:style="{width:'100vw',                   \
                  height:`${global.HDR_HGT-15}px`, \
                  margin:'0 5vw 0 5vw'}")

  Controls(style="width:calc(100vw-20px);")

</template>

<script setup>
  import {onMounted, ref, inject, 
          getCurrentInstance } from 'vue'
  import  Header     from './components/header.vue'
  import  Controls   from './components/controls.vue'
  import {initWebsocket, setVel, setYaw, stop, pwrOff} 
                          from "./websocket.js";

  const global = inject('global');
  const evtBus = inject('evtBus');   

  global.HDR_HGT = 65;

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
    evtBus.emit('rssi', status?.[fcRssi]);
    evtBus.emit('batv', status?.[fcBatV]);
    const err = status?.[fcError];
    if(err) console.log(`BOT ERROR: ${err}`);
  }
  evtBus.on('stop',   () => { stop();  });
  evtBus.on('pwrOff', () => { pwrOff();});

  onMounted(async() => { 
    console.log(`---- App Mounted, ` +
                `hostname: ${global.hostName} ---`);
    initWebsocket(global.hostname, websocketCB);
  });
</script>

<style>
</style>