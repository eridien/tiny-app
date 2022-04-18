<template lang='pug'>
div(id="wheelPane" 
    style="display:flex;           \
           justify-content:center; \
           align-items:center;")
  img( id="wheel" src="images/steering-wheel.png"
      :style="{transform:`rotate(${angle}deg)`}" )
</template>

<script setup>
  import {onMounted} from 'vue'

  const angle = 90;

  onMounted(() => { 
    let wheelPaneEle = document.getElementById("wheelPane"); 

    const MAX_CLICK_DIST = 7;
    const MAX_CLICK_TIME = 250;

    // let startX;
    // let startY;

    let touching  = false;
    // let isClick   = true;
    // let clickTO   = null;

    // const clrClickTO = () => {
    //   if(clickTO) clearTimeout(clickTO);
    //   clickTO = null;
    // }

    // let touchX  = 0;
    // let touchY  = 0;
    // const setTouchPos = (event) => {
    //   if(event) {
    //     const touch = event.changedTouches[0];
    //     touchX = Math.round(touch.pageX);
    //     touchY = Math.round(touch.pageY);
    //   }
    // }

    const chkMove = (event) => {
      if(!touching) return;

      const touch = event.changedTouches[0];
      const touchX = Math.round(touch.pageX);
      const touchY = Math.round(touch.pageY);

      // setTouchPos(event);
      console.log("moving", touchX, touchY);
      // if(!isClick) setTouchPos(event);
      // if(isClick && (Math.abs(touchX - startX) > MAX_CLICK_DIST ||
      //                Math.abs(touchY - startY) > MAX_CLICK_DIST)) {
      //   clrClickTO();
      //   isClick = false;
      // }
      // if(!isClick) {
        // setTouchPos(event);
        // calcPwrCmds(touchX, touchY);
      // }
    }
    wheelPaneEle.addEventListener("touchmove", chkMove);

    wheelPaneEle.addEventListener('touchstart', (event) => {
      touching = true;
      let touch = event.touches[0];
      // touchX    = touch.pageX;
      // touchY    = touch.pageY;
      const startX = touch.pageX;
      const startY = touch.pageY;
      // assume click, not press, for now
      // isClick   = true;  
      console.log("touchstart:", {
                      startX: Math.round(startX), 
                      startY: Math.round(startY)});
      // clickTO = setTimeout(() => {
      //   clrClickTO();
      //   isClick = false;
      //   chkMove();
      // }, MAX_CLICK_TIME);
    });

    wheelPaneEle.addEventListener('touchend', function (event) {
      chkMove(event);
      // clrClickTO();
      // this is now @click="..." in parent
      // if(isClick) {
      //   console.log("fast click -- STOP");
      //   emit('stopEvent');
      // }
      touching = false;
    });  
  });
</script>

<style>
</style>
