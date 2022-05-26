<template lang='pug'>
#app
  Header(:style="{width:'100vw',                   \
                  height:`${global.HDR_HGT-15}px`, \
                  margin:'0 5vw 0 5vw'}")
  Controls(style="width:calc(100vw-20px);")

</template>

<script setup>
  import {onMounted, inject, ref} from 'vue'
  import  Header     from './components/header.vue'
  import  Controls   from './components/controls.vue'
  import { initWebsocket,  
           setVel, setYaw, stop, reset, pwrOff, calibrate,
           setYawPk, setYawIk, setMaxYawIk, 
           setName, resumeWs,
           setBoostMs, setBoostPwm }
          from "./websocket.js";

  const global = inject('global');
  const evtBus = inject('evtBus'); 

  global.HDR_HGT = 65;

// status from bot
  const fcBatV      = 'b';
  const fcRssi      = 'w';
  const YawOfs      = 'd';
  const fcCalibDone = 'c';
  const fcError     = 'e';

  // wifi ssid suffix from bot
  global.fcName     = 'n';
  
  // debug from bot
  global.fcStateCodes = {
    fcBatV          : 'b',
    fcRssi          : 'w',
    fcVelTgt        : 'v',
    fcYawTgt        : 't',
    fcYawRate       : 'y',
    fcYawRateErr    : 'z',
    fcYawRateErrInt : 'i',
    fcLeftPwm       : 'l',
    fcRightPwm      : 'r',

  // motion constants echoed from bot
    fcBoostMsC      : 'j',
    fcBoostPwmC     : 'm',
    fcCompassC      : 'O',
  }

  evtBus.on('setYawPk',       (awPk)=> {setYawPk(awPk);      });
  evtBus.on('setYawIk',       (awIk)=> {setYawIk(awIk);      });
  evtBus.on('setMaxYawIk',    (max) => {setMaxYawIk(max);    });
  evtBus.on('setBoostMs',     (bms) => {setBoostMs(bms);     });
  evtBus.on('setBoostPwm',    (btP) => {setBoostPwm(btP);    });

  evtBus.on("setWifiName", (name)  => {setName(name);    }); 
  evtBus.on("resumeWs",    ()      => {resumeWs();       });

  let stopped = true;

  evtBus.on('vel', (vel) => {
    if(vel) stopped = false;
    setVel(vel);      
  });
  evtBus.on('yaw', (yaw) => {
    if(yaw) stopped = false;
    setYaw(yaw); 
  });
  evtBus.on('stop', () => {
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
            {messageText:  'Waiting for connection to a T-Bot. ',
             messageText2: 'Turn on the T-Bot and set ' +
                           'your phone wi-fi to ' +
                           `T-Bot-${global.curStatus.n}.`, 
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


    /////////////////  PLOT DEBUG  /////////////////

    const dbgStr = (fc, name, div = 1, wid = 3) => {
      const str = Math.round(+global.curStatus[fc] / div)
                 .toString().padStart(wid);
      return `${name}:${str}, `;
    }

    const plotStr = (fc, char, div) => {
      const zeroLen  =  15;
      const zeroChar = '|';
      const totalLen = Math.round(
            zeroLen + global.curStatus[fc] / div);
      let str;
      if(totalLen > zeroLen) 
        str = zeroChar.padStart(zeroLen) +
                  char.padStart(totalLen-zeroLen)
      else if(totalLen == zeroLen) 
        str = char.padStart(zeroLen);
      else // (totalLen < zeroLen) 
        str = char.padStart(totalLen) +
          zeroChar.padStart(zeroLen-totalLen);
      return str;
    }

    const now = new Date();
    if(!stopped) {
      // console.log(global.curStatus);
      if(minMaxDelay-- < 0) {
        const err = +global.curStatus.z;
        max = Math.max(max, err);
        min = Math.min(min, err);
      }

      console.log(
        now.getUTCSeconds()
            .toString().padStart(2,'0') + ':' + 
        now.getUTCMilliseconds()
            .toString().padStart(3,'0') + ' ' + 
        // global.curStatus.b.toString().padStart(4) + ', ' +
        dbgStr('v','vel')          +
        dbgStr('t','tgt',    1, 4) +
        dbgStr('y','yaw', 1000, 4) +
        // dbgStr('z','err',    1, 4) +
        // dbgStr('i','int',   10, 4) +
        dbgStr('l','lft')          +
        dbgStr('r','rgt')          +

        // min.toString().padStart(4) +
        // max.toString().padStart(4) +
        plotStr('o', '*', 20)
      );
    };

    //////////////  END PLOT DEBUG  //////////////

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
    const footerH = 0; // debug?
      // document.getElementById('footer')
               //.offsetHeight;
    if(android) {
        const wrapperH = 
            window.outerHeight / 
            window.devicePixelRatio - footerH - 1;
        document.getElementById('app')
                .style.height = wrapperH + 'px';
        window.scrollTo(0, 1);
    }
    else {
        window.scrollTo(0, 1);
        //var headerH = document
        //  .getElementById('header').offsetHeight;
        const wrapperH = 
              window.innerHeight - footerH - 1;
        document.getElementById('app')
                .style.height = wrapperH + 'px';
    }
  }

  onMounted(() => {
    global.ua = navigator.userAgent;
    const android = global.ua.includes('Android');
    console.log({ua:global.ua,android});

    setTimeout(() => {
        window.scrollTo(0, 1);
        setTimeout(() => setHeight(android), 100);
    }, 100);

    console.log(`---- App Mounted, ` +
                `hostname: ${global.hostname} ---`);
    initWebsocket(global.hostname, websocketCB);
    // setTimeout(() => {
    //   if(!websocketOpen) showNoWebsocket();
    // }, 2000);
  });
</script>
