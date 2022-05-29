<template lang='pug'>
#wheelPane(style="display:flex;                      \
                  justify-content:center;            \
                  align-items:center;")
  img(id="wheel" src="/images/steering-wheel.png"
        :style="{transform:`rotate(${wheelAngle}deg)`,  \
                 width:'65vmin', height:'65vmin'}" )
</template>

<script setup>
  import {ref, onMounted, inject} from 'vue'

  const global = inject('global');
  const evtBus = inject('evtBus'); 

  const wheelAngle = ref(0);

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

    let clicking       = false;
    let firstTouch     = true;
    let lastTouchAngle = 0.0;
    let heading        = 0.0;

    paneEle.addEventListener("touchstart", 
      (event) => {
        stopAllPropogation();
        clicking = true;
        let touch = null;
        for(let chgdTouch of event.changedTouches) {
          if(chgdTouch.target == paneEle ||
            chgdTouch.target == wheelEle) 
            touch = chgdTouch;
        }
        if(touch === null) return
        lastTouchAngle = getAngle(touch.pageX, touch.pageY);
        if(firstTouch) {
          firstTouch = false;
          wheelAngle.value = lastTouchAngle;
          // console.log('start', {
          //     wheelAngle:    wheelAngle.value.toFixed(2),         
          //     lastTouchAngle:lastTouchAngle.toFixed(2)});
        }
      },
      {passive:false, capture:true}
    );
    
    paneEle.addEventListener("touchmove", 
      (event) => {
        stopAllPropogation(event);
        clicking  = false;
        let touch = null;
        for(let chgdTouch of event.changedTouches) {
          if(chgdTouch.target == paneEle ||
             chgdTouch.target == wheelEle) 
            touch = chgdTouch;
        }
        if(touch === null) return;
        const touchAngle = getAngle(touch.pageX, touch.pageY);
        let diff = touchAngle - lastTouchAngle;
        if(diff < -180) diff += 360;
        if(diff > +180) diff -= 360;
        wheelAngle.value += diff;
        heading          += diff;
        // console.log('move', {lastTouch:lastTouchAngle.toFixed(2), 
        //                     touch:touchAngle.toFixed(2), 
        //                     diff:diff.toFixed(2),
        //                     wheel:wheelAngle.value.toFixed(2), 
        //                     heading:heading.toFixed(2),
        //                     });
        lastTouchAngle = touchAngle;
        evtBus.emit('yaw', heading);
      },
      {passive:false, capture:true}
    );

    paneEle.addEventListener("touchend", 
      () => {
        stopAllPropogation();
        if(clicking) {
          // touch click
          evtBus.emit('stop');
          clicking = false;
        }
      },
      {passive:false, capture:true}
    );

    evtBus.on('stop', () => {
      clicking = false;
    });

    window.addEventListener('resize', () => {
      getCenterXY();
      evtBus.emit('stop');
    });
  });
</script>
