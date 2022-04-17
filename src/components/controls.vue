<template lang='pug'>
#ctrls(style="min-height: calc(100vh - 100px);                   \
              display:flex;")
  #accelerator(style="border:1px solid blue; width:25%;          \
                      min-height: calc(100vh - 100px);")
  #wheelPane(style="border:1px solid red; width:75%; display:flex;   \
                      min-height: calc(100vh - 100px);            \
                      justify-content:center; align-items:center;")
    img( id="wheel" src="images/steering-wheel.png"
                 :style="{transform:`rotate(${angle}deg)`}" )

</template>

<script setup>
  import {onMounted} from 'vue'

  // commands to bot
  const setAccel = (accel) => this.$emit('setAccel', accel);
  const setYaw   = (yaw)   => this.$emit('setYaw',   yaw);
  const stop     = ()      => this.$emit('stop');
  const pwrOff   = ()      => this.$emit('pwrOff');

  const angle    = 90;

  //  =================  TOUCH  ===============

  let clickTO = null;

  const clrClickTO = () => {
    if(clickTO) {
      clearTimeout(clickTO);
      clickTO = null;
    }
  }
  let touchX  = 0;
  let touchY  = 0;

  const setTouchPos = (event) => {
    if(event) {
      const touch = event.changedTouches[0];
      touchX = Math.round(touch.pageX);
      touchY = Math.round(touch.pageY);
    }
  }
  const MAX_CLICK_DIST = 7;
  const MAX_CLICK_TIME = 250;

  let wheelPaneEle;

  onMounted(async () => { 
    wheelPaneEle = document.getElementById("wheelPane"); 

    let startX;
    let startY;
    let touching = false;
    let isClick  = true;

    const chkMove = (event) => {
      if(!touching) return;
      if(!isClick) setTouchPos(event);
      if(isClick && (Math.abs(touchX - startX) > MAX_CLICK_DIST ||
                    Math.abs(touchY - startY) > MAX_CLICK_DIST)) {
        clrClickTO();
        isClick = false;
      }
      if(!isClick) {
        setTouchPos(event);
        // calcPwrCmds(touchX, touchY);
      }
    }
    wheelEle.addEventListener("touchmove", chkMove);

    wheelPaneEle.addEventListener('touchstart', (event) => {
      touching = true;
      let touch = event.touches[0];
      touchX    = touch.pageX;
      touchY    = touch.pageY;
      startX    = touchX;
      startY    = touchY;
      startTime = Date.now();
      isClick   = true;  // assume click, not press, for now
      // console.log("touchstart:", {startX: Math.round(startX), startY: Math.round(startY)});
      clickTO = setTimeout(() => {
        clrClickTO();
        isClick = false;
        chkMove();
      }, MAX_CLICK_TIME);
    });

    let chkTouchEndTO = null;
    wheelEle.addEventListener('touchend', (event) => {
      if(sendPwrCmdL || sendPwrCmdR) {
        chkTouchEndTO = setTimeout((event) => chkTouchEnd(event), 20);
        return;
      }
      if(chkTouchEndTO) { clearTimeout(chkTouchEndTO); chkTouchEndTO = null; };
      chkMove(event);
      clrClickTO();
      if(isClick) {
        console.log("fast click -- BRAKE");
        lastPwrL    = null;
        lastPwrR    = null;
        sendPwrCmdL = false;
        sendPwrCmdR = false;
        sendBrakeL  = true;
        sendBrakeR  = true;
        sendWs();
      }
      touching = false;
    });  
  });
</script>

<style>
#wheel{
  width: 60vmin; 
  height:60vmin;
}
</style>
