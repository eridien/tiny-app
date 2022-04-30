<template lang='pug'>
#wheelPane(style="display:flex;             \
                  justify-content:center;   \
                  align-items:center;")
  img(id="wheel" src="/images/steering-wheel.png"
        :style="{transform:`rotate(${angle}deg)`,  \
                 width:'65vmin', height:'65vmin'}" )
</template>

<script setup>
  import {ref, onMounted, inject} from 'vue'

  const evtBus = inject('evtBus'); 

  const angle = ref(0);

  onMounted(() => { 

    const paneEle  = document.getElementById('wheelPane');
    const wheelEle = document.getElementById('wheel');
    
    const getCenterX = ()=> {
      return window.outerWidth * (0.25 + 0.75/2);
    }
    const getCenterY = ()=> {
      const  paneHgt = paneEle.offsetHeight;
      const  hdrHgt  = window.outerHeight - paneHgt;
      return hdrHgt + (window.outerHeight - hdrHgt) / 2;
    }

    const drawWheel = (x,y) => {
      const paneHgt = paneEle.offsetHeight;
      const hdrHgt  = window.outerHeight - paneHgt;
      let   relX    =   x-getCenterX();
      const relY    = -(y-getCenterY());
      if(relX >= 0 && relX <  1e-3) relX += 2e-3;
      if(relX <  0 && relX > -1e-3) relX -= 2e-3;
      const radians = Math.atan(relY/relX);
      let   degrees = Math.round(radians*90/(Math.PI/2));
      if(relX >= 0) angle.value =  90 - degrees;
      else          angle.value = -90 - degrees;
    }

    evtBus.on('stop', () => {
      angle.value = 0;
      drawWheel(getCenterX(), getCenterY() - 1);
    });
  
    const stopAllPropogation= (event) => {
      if(!event) return;
      event.stopPropagation();
      event.stopImmediatePropagation();
      event.preventDefault();
    }

    window.addEventListener('resize', () => {
      const paneHgt = paneEle.offsetHeight;
      const hdrHgt  = window.outerHeight - paneHgt;
      drawWheel(getCenterX(), getCenterY());
      evtBus.emit('stop');
    });

    let clickStarted = false;

    paneEle.addEventListener("touchstart", 
      (event) => {
        stopAllPropogation();
        clickStarted = true;
      },
      {passive:false, capture:true}
    );

    paneEle.addEventListener("touchend", 
      () => {
        stopAllPropogation();
        if(clickStarted) {
          evtBus.emit('stop');
          clickStarted = false;
        }
      },
      {passive:false, capture:true}
    );
    paneEle.addEventListener("touchmove", 
      (event) => {
        stopAllPropogation(event);
        clickStarted = false;

        let touch = null;
        for(let chgdTouch of event.changedTouches) {
          if(chgdTouch.target == paneEle ||
             chgdTouch.target == wheelEle) 
            touch = chgdTouch;
        }
        if(touch != null) {
          drawWheel(touch.pageX, touch.pageY);
          evtBus.emit('angle', angle.value);
        }
      },
      {passive:false, capture:true}
    );
  });
</script>

<style>
</style>
