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

  const props = defineProps(['HEADER_HEIGHT']);

  const angle = 90;

  onMounted(() => { 
    let wheelPaneEle = document.getElementById("wheelPane"); 

    let startAngle;
    const getAngle = (x, y) => {
      const centerX = window.outerWidth  * (0.25 + 0.75/2);
      const centerY = 
        (window.outerHeight - props.HEADER_HEIGHT / 2);
      const relX = Math.round(x-centerX);
      const relY = Math.round(y-centerY);
      const radians = Math.atan(relY/relX);
      const degrees = radians * 90 / Math.PI;
      console.log("getAngle:", {radians,degrees,relX, relY});

      let angle = 45;

      return angle;
    };

    wheelPaneEle.addEventListener('touchstart', (event) => {
      let touch = event.touches[0];
      const startX = touch.pageX;
      const startY = touch.pageY;
      console.log("touchstart:", 
                   Math.round(startX), Math.round(startY));
      startAngle = getAngle(startX, startY);
    });

    wheelPaneEle.addEventListener("touchmove", () => {
      const touch = event.changedTouches[0];
      const touchX = Math.round(touch.pageX);
      const touchY = Math.round(touch.pageY);
      // console.log("moving", touchX, touchY);
      getAngle(touchX, touchY);
    });

    wheelPaneEle.addEventListener('touchend', (event) => {
      console.log("touchend");
    });  
  });
</script>

<style>
</style>
