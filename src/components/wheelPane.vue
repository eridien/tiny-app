<template lang='pug'>
#wheelPane(style="display:flex;           \
                  justify-content:center; \
                  align-items:center;")
  img(id="wheel" src="images/steering-wheel.png"
        :style="{transform:`rotate(${angle}deg)`}" )
</template>

<script setup>
  import {ref, watch, onMounted} from 'vue'

  const props = defineProps(['stop']);
  const emit  = defineEmits(['angle']);

  const angle = ref(0);

  const stopAllPropogation= (event) => {
    event.stopPropagation();
    event.stopImmediatePropagation();
    event.preventDefault();
  }

  onMounted(() => { 
    const paneEle  = document.getElementById('wheelPane');
    const wheelEle = document.getElementById('wheel');
    const paneHgt  = paneEle.offsetHeight;

    paneEle.addEventListener("touchmove", 
      (event) => {
        stopAllPropogation(event);
        
        let touch = null;
        for(let chgdTouch of event.changedTouches) {
          if(chgdTouch.target == paneEle ||
             chgdTouch.target == wheelEle) 
            touch = chgdTouch;
        }

        if(touch == null) return;

        const x = touch.pageX;
        const y = touch.pageY;
        const centerX = window.outerWidth  
                          * (0.25 + 0.75/2);
        const hdrHgt  = window.outerHeight - paneHgt;
        const centerY = 
                hdrHgt + (window.outerHeight - hdrHgt) / 2;
        const relX =   x-centerX;
        const relY = -(y-centerY);
        if(relX >= 0 && relX <  1e-3) relX += 2e-3;
        if(relX <  0 && relX > -1e-3) relX -= 2e-3;
        const radians = Math.atan(relY/relX);
        let   degrees = Math.round(radians*90/(Math.PI/2));
        if(relX >= 0) angle.value =  90 - degrees;
        else          angle.value = -90 - degrees;
        emit('angle', angle.value);
      }
    );
  });

  watch(() => props.stop, () => {
    angle.value = 0;
    emit('angle', angle.value);
  });
</script>

<style>
</style>
