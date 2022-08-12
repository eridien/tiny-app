<template lang='pug'>
#wheelPane(style="display:flex;                        \
                  justify-content:center;              \
                  align-items:center;")
  img(id="wheel" src="/images/steering-wheel.png"
        :style="{transform:`rotate(${wheelAngle}deg)`, \
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
      let angle;
      const relX =   x-centerX;
      const relY = -(y-centerY);

      if(!global.turnMode) { // using absolute yaw
        angle = 90 - Math.atan2(relY, relX)*180/Math.PI;
            if(angle >  180) angle -= 360;
        else if(angle < -180) angle += 360;
      }
      else {  // using turn rate
        angle = (relX / window.outerWidth) * 180;
      }
      // console.log({relX:relX.toFixed(0), 
      //              relY:relY.toFixed(0), angle:angle.toFixed(0)});
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

        // adjust turn rate or yaw based on sensitivity
        let   sens     = global.steeringSens;  //     1 to 9
        const sensOfs  = ((sens-1) * 6/8) + 1; //     1 to 7
        const factSens = sensOfs / 6;              // 0.166 to 1.166

        if(!global.turnMode) { // using absolute yaw
          let diff = touchAngle - lastTouchAngle;
          if(diff < -180) diff += 360;
          if(diff > +180) diff -= 360;  // -180 to +180
          wheelAngle.value += diff;
          heading          += diff;
          // console.log('move', {lastTouch:lastTouchAngle.toFixed(2), 
          //                     touch:touchAngle.toFixed(2), 
          //                     diff:diff.toFixed(2),
          //                     wheel:wheelAngle.value.toFixed(2), 
          //                     heading:heading.toFixed(2),
          //                     });
          lastTouchAngle = touchAngle;
          let factVel = 1;

          // cut turn rate based on current speed
          // if(global.vel >= 0.3)                           // 0.3 to 1
          //   factVel = 1/((global.vel-0.3) * 1.0/0.7 + 1); //   1 to 0.5

          // combined factor is 0.083 to 1.166
          const yaw  = heading * factSens * factVel;
          // console.log({heading: heading.toFixed(3), 
          //              sens: sens.toFixed(3),  ofs: ofs.toFixed(3), 
          //              fact: fact.toFixed(3),  yaw: yaw.toFixed(3)});
          evtBus.emit('yaw', yaw);
        }
        else {  // using turn rate
          wheelAngle.value = touchAngle;
          // turnRate is in degress/sec
          let turnRate = touchAngle/180*3000*factSens;
          if(turnRate > +1000) turnRate = +1000;
          if(turnRate < -1000) turnRate = -1000;
          evtBus.emit('turnRate', turnRate);
        }
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
        // else {
          // // clear wheel when lifting finger
          // wheelAngle.value = 0;
          // heading          = 0;
          // evtBus.emit('clrYaw');
        // }
      },
      {passive:false, capture:true}
    );

    evtBus.on('stop', () => {
      wheelAngle.value = 0;
      heading          = 0;
      clicking         = false;
    });

    window.addEventListener('resize', () => {
      getCenterXY();
      evtBus.emit('stop');
    });
  });
</script>
