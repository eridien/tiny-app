<template lang='pug'>
#app
  Header(:style="{width:'90vw', fontSize:'14px',   \
                  height:`${global.HDR_HGT-15}px`, \
                  marginLeft:'5vw',                \
                  touchAction:'none'}")
  Controls(style="width:calc(100vw-20px); \
                  touch-action:none")

</template>

<script setup>
  import {onMounted, inject, ref} from 'vue'
  import  Header     from './components/header.vue'
  import  Controls   from './components/controls.vue'
  import { initWebsocket, setVel, setYaw, clrYaw,
           stop, pwrOff, calibrate, resumeWs }
          from "./websocket.js";

  const global = inject('global');
  const evtBus = inject('evtBus'); 

  global.HDR_HGT = 65;
  global.steeringSens = 
    parseInt(localStorage.getItem('global.steeringSens') || 5);

// status from bot
  const fcBatV      = 'b';
  const fcRssi      = 'w';
  const fcCalibDone = 'c';
  const fcError     = 'e';
  const YawOfs      = 'd'; // for console log only

  evtBus.on("resumeWs",    ()      => {resumeWs();       });

  let stopped = true;

  evtBus.on('vel', (vel) => {
    if(vel) stopped = false;
    setVel(vel);      
  });
  evtBus.on('yaw', (heading) => {
    stopped = false;
    setYaw(heading); 
  });
  evtBus.on('clrYaw', () => {
    clrYaw();
  });
  evtBus.on('stop', () => {
    clrYaw();
    stop();
    stopped = true;
  });
  evtBus.on('reset', () => {
    reset();
    stopped = true;
  });
  evtBus.on('pwrOff', () => {
    pwrOff();
    stopped = true;
  });

  let calibrating = false;

  evtBus.on('startCalibration', () => { 
    console.log(`startCalibration`);
    stop();
    evtBus.emit('showMessage', {
      messageText:  'Calibrating...',
      buttonText:   'Cancel',
      callbackText: 'closeCalibration',
      busyIndicator:true,
    });
    calibrate();
    calibrating = true;
  });

  const calibrationDone = () => {
    if(!calibrating) return;
    calibrating = false;
    console.log('calibration done', 
      {YawOfs:   global.curStatus[YawOfs]});
    evtBus.emit('showMessage', {
      messageText:  'Calibrating finished.',
      buttonText:   'Close',
      callbackText: 'closeCalibration',
      busyIndicator: false,
    });
  };
  
  evtBus.on('closeCalibration', () => {
    console.log('closing calibration');
    calibrating = false;
    evtBus.emit('menuOpen', false);
  });

  const showNoWebsocket = () => {
    evtBus.emit('menuOpen', false);
    evtBus.emit('showMessage',
            {messageText:  'No connection to T-Bot. ',
             id: 'noWsMsg'});  
  };

  let websocketOpen = false;
  global.curStatus  = {};
    
  // for debug plot
  let min = Math.min();
  let max = Math.max();
  let minMaxDelay = 10;

  const websocketCB = (status) => {
    if(status.fcCmds !== undefined) {
      global.fcCmds = status.fcCmds;
      return global.fcStateCodes;
    }
    if(status.newerConn !== undefined) {
      evtBus.emit('showMessage',
          {messageText: 'Another controller has connected to ' +
                        'this T-Bot and you have been '   +
                        'disconnected. Reconnecting '     +
                        'will disconnect the other controller.',
          buttonText:   'Reconnect',
          ignoreNoWs:    true,
          callbackText: 'resumeWs'});  
      return;
    }
    if(status.websocketOpen !== undefined) {
      if(websocketOpen && !status.websocketOpen)
           showNoWebsocket();
      if(!websocketOpen && status.websocketOpen)
           evtBus.emit('closeMessage', 'noWsMsg');
      websocketOpen = status.websocketOpen;
      return;
    }
    Object.assign(global.curStatus, status);
    // console.log({j:global.curStatus.j});

    let stateChg = false;
    for(let fc in global.fcStateCodes) {
      if(status[global.fcStateCodes[fc]] !== undefined) {
        stateChg = true;
        break;
      }
    }
    if(stateChg) evtBus.emit('stateChg');

    if(status?.[fcCalibDone] === 1)
          calibrationDone();

    evtBus.emit('rssi', status?.[fcRssi]);
    evtBus.emit('batv', status?.[fcBatV]);

    const err = status?.[fcError];
    if(err) console.log(`BOT ERROR: ${err}`);
  };

  const android = () => {
  // windows: "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Mobile Safari/537.36"
  return navigator.userAgent.includes('Android');
}

  const setHeight = (android) => {
    let wrapperH;
    if(android) {
        wrapperH = 
            window.outerHeight / 
            window.devicePixelRatio - 1;
        document.getElementById('app')
                .style.height = wrapperH + 'px';
        window.scrollTo(0, 1);
    }
    else {
        window.scrollTo(0, 1);
        wrapperH = 
              window.innerHeight - 1;
        document.getElementById('app')
                .style.height = wrapperH + 'px';
    }
    console.log({android, wrapperH});
  }

  onMounted(() => {
    // global.ua = navigator.userAgent;
    // const android = global.ua.includes('Android');
    // console.log({ua:global.ua,android});

    // setTimeout(() => {
    //     window.scrollTo(0, 1);
    //     setTimeout(() => setHeight(android), 100);
    // }, 100);

    console.log(`---- App Mounted, ` +
                `hostname: ${global.hostname} ---`);

    initWebsocket(global.hostname, websocketCB);

    clrYaw();

    setTimeout(() => {
      if(!websocketOpen) showNoWebsocket();
    }, 2000);
  });
</script>
