<template lang='pug'>
#wheelPane(style="display:flex;                      \
                  justify-content:center;            \
                  align-items:center;")
  img(id="wheel" src="/images/steering-wheel.png"
        :style="{transform:`rotate(${angle}deg)`,  \
                 width:'65vmin', height:'65vmin'}" )
</template>

<script setup>
  import {ref, onMounted, inject} from 'vue'

  const global = inject('global');
  const evtBus = inject('evtBus'); 

  const angle = ref(0);

// max steering sensitivity is SENS_FACTOR**(5-steeringSens)
  const SENS_FACTOR = 1.2;

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

    const calcAngle = (x,y) => {
      let   relX =   x-getCenterX();
      const relY = -(y-getCenterY());

      // deg is -180 to +180 clockwise, top is zero
      const deg = 90 - Math.atan2(relY, relX) * 180 / Math.PI;
      if(deg < -180) deg += 360;

      let diff = deg - angle.value;
           if(diff >  180) diff -= 360;
      else if(diff < -180) diff += 360;

      angle.value += diff;
    }

    let clickStarted = false;

    evtBus.on('stop', () => {
      angle.value  = 0;
      clickStarted = false;
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
      calcAngle(getCenterX(), getCenterY());
      evtBus.emit('stop');
    });

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
          // touch click
          if(angle.value != 0) {
            // first click just straightens wheel
            angle.value = 0;
            evtBus.emit('yaw', 0);
          }
          else 
            // second click stops
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
          calcAngle(touch.pageX, touch.pageY);
          const yaw = angle.value * 
              Math.pow(SENS_FACTOR, global.steeringSens-5);
          evtBus.emit('yaw', yaw);
        }
      },
      {passive:false, capture:true}
    );
  });
</script>
