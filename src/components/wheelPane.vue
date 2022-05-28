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

  onMounted(() => { 

    const paneEle  = document.getElementById('wheelPane');
    const wheelEle = document.getElementById('wheel');

    let centerX;
    let centerY;
    const getCenterXY = ()=> {
      centerX = window.outerWidth * 0.625;
      centerY = window.outerHeight - paneEle.offsetHeight/2;
    }
    getCenterXY();

    // get angle of xy,  -180 to +180
    const getAngle = (x,y) => {
      const relX =   x-centerX;
      const relY = -(y-centerY);
      let angle = 90 - Math.atan2(relY, relX)*180/Math.PI;
           if(angle >  180) angle -= 360;
      else if(angle < -180) angle += 360;
      return angle;
    }

    const stopAllPropogation= (event) => {
      if(!event) return;
      event.stopPropagation();
      event.stopImmediatePropagation();
      event.preventDefault();
    }

    let clickStarted = false;

    paneEle.addEventListener("touchstart", 
      (event) => {
        stopAllPropogation();

        let touch = null;
        for(let chgdTouch of event.changedTouches) {
          if(chgdTouch.target == paneEle ||
             chgdTouch.target == wheelEle) 
            touch = chgdTouch;
        }
        if(touch == null) return
        clickStarted = true;
      },
      {passive:false, capture:true}
    );
    
    let lastAngle = 0;

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
          const thisAngle = getAngle(touch.pageX, touch.pageY);
          let diff  = thisAngle - lastAngle;
          if(diff < -180) diff += 360;
          if(diff > +180) diff -= 360;
          angle.value += diff;
          lastAngle = thisAngle;
          // console.log({thisAngle:thisAngle.toFixed(2)});
          evtBus.emit('yaw', angle.value);
        }
      },
      {passive:false, capture:true}
    );

    paneEle.addEventListener("touchend", 
      () => {
        stopAllPropogation();
        if(clickStarted) {
          // touch click
          evtBus.emit('stop');
          clickStarted = false;
        }
      },
      {passive:false, capture:true}
    );

    evtBus.on('stop', () => {
      clickStarted = false;
    });

    window.addEventListener('resize', () => {
      getCenterXY();
      evtBus.emit('stop');
    });
  });
</script>
