<template lang='pug'>
div(id="wheelPane" 
    style="display:flex;           \
           justify-content:center; \
           align-items:center;")
  img( id="wheel" src="images/steering-wheel.png"
      :style="{transform:`rotate(${angle}deg)`}" )
</template>

<script setup>
  import {ref, onMounted} from 'vue'

  const props = defineProps(['HEADER_HEIGHT']);

  const angle = ref(0);

  onMounted(() => { 
    let wheelPaneEle = document.getElementById("wheelPane"); 

    let startAngle;
    const getAngle = (x, y) => {
      const centerX = window.outerWidth  * (0.25 + 0.75/2);
      const centerY = props.HEADER_HEIGHT +
        (window.outerHeight - props.HEADER_HEIGHT) / 2;
      const relX =   x-centerX;
      const relY = -(y-centerY);
      if(relX >= 0 && relX <  1e-3) relX += 2e-3;
      if(relX <  0 && relX > -1e-3) relX -= 2e-3;
      const radians = Math.atan(relY/relX);
      let   degrees = Math.round(radians*90/(Math.PI/2));
      if(relX >= 0) angle.value =  90 - degrees;
      else          angle.value = -90 - degrees;
      console.log('getAngle:', angle.value);
      return angle.value;
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
