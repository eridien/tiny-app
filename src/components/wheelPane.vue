<template lang='pug'>
div(id="wheelPane" 
    style="display:flex;           \
           justify-content:center; \
           align-items:center;")
  img( id="wheel" src="images/steering-wheel.png"
      :style="{transform:`rotate(${angle}deg)`}" )
</template>

<script setup>
  import {ref, watch, onMounted} from 'vue'

  const props = defineProps(['HDR_HGT', 'stop']);

  const angle = ref(0);

  watch(() => props.stop, () => angle.value = 0);

  onMounted(() => { 

    const setAngle = (x, y) => {
      const centerX = window.outerWidth  * (0.25 + 0.75/2);
      const centerY = props.HDR_HGT +
        (window.outerHeight - props.HDR_HGT) / 2;
      const relX =   x-centerX;
      const relY = -(y-centerY);
      if(relX >= 0 && relX <  1e-3) relX += 2e-3;
      if(relX <  0 && relX > -1e-3) relX -= 2e-3;
      const radians = Math.atan(relY/relX);
      let   degrees = Math.round(radians*90/(Math.PI/2));
      if(relX >= 0) angle.value =  90 - degrees;
      else          angle.value = -90 - degrees;
    };

    document.getElementById("wheelPane")
            .addEventListener("touchmove", (event) => {
      const touch = event.changedTouches[0];
      setAngle(touch.pageX, touch.pageY);
    });
  });
</script>

<style>
</style>
