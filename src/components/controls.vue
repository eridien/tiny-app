<template lang='pug'>
#controls(
    :style="{display:'flex', touchAction:'none',      \
             minWidth: 'calc(100vw-30px)',            \
             minHeight:`calc(100vh - ${global.HDR_HGT}px)`}")
    
  Vel-pane(
      :style="{border:'1px solid black',               \
               width:'24%',                            \
               minHeight:`calc(100vh - ${global.HDR_HGT}px)`}")

  Wheel-pane(
      :style="{border:'1px solid black', width:'75%',  \
              minHeight:`calc(100vh - ${global.HDR_HGT}px)`}")

  #cover(v-if="menuOpen || messageOpen"
         style="position:absolute; left:0;       \
                width:100%; height:100%;         \
                opacity:0.3;                     \
                background-color:black;")

  Message(v-show="messageOpen"
          :messageText="messageText"
          :messageText2="messageText2"
          :busy="busy"
          :buttonText2="buttonText2"
          :callbackText2="callbackText2"
          :buttonText="buttonText"
          :callbackText="callbackText"
           style="position:fixed; z-index:1001;  \
                  left:5vw; width: 70vw;        \
                  top:90px;")
</template>

<script setup>
  import {ref, inject} from 'vue'
  import  VelPane      from './velPane.vue';
  import  WheelPane    from './wheelPane.vue';
  import  Message      from './message.vue';

  const global = inject('global');
  const evtBus = inject('evtBus');   

  const val = localStorage.getItem('steeringSens');  
  if(val === null) {
    val = 5;
    localStorage.setItem('steeringSens', val);
  }
  global.steeringSens = val;

  const menuOpen      = ref(false);
  const messageOpen   = ref(false)

  let msgId = '';

  evtBus.on('menuOpen', open => {
    menuOpen.value = open;
  });

  ///////// POPUP MESSAGE MANAGEMENT ///////////
  const messageText   = ref('');
  const messageText2  = ref('');
  const busy          = ref(false);
  const buttonText2   = ref('');
  const callbackText2 = ref('');
  const buttonText    = ref('');
  const callbackText  = ref('');
  let   ignoreNoWs    = false;

  evtBus.on('showMessage', (params) => {
    console.log('showing message', params.id);
    console.log('ignoreNoWs:',     params.ignoreNoWs);
    if(params.id == 'noWsMsg' && ignoreNoWs) {
      console.log('ignoring noWsMsg');
      return;
    }
    ignoreNoWs          = params.ignoreNoWs;
    messageText.value   = params.messageText;
    messageText2.value  = params.messageText2;
    busy.value          = params.busy;
    buttonText2.value   = params.buttonText2;
    callbackText2.value = params.callbackText2;
    buttonText.value    = params.buttonText;
    callbackText.value  = params.callbackText;
    msgId               = params.id;
    messageOpen.value   = true;
    evtBus.emit('menuOpen', false);
  });

  evtBus.on('closeMessage', (id) => {
    if(!id || id == msgId) {
      console.log('closing message', id);
      messageText.value   = '';
      messageText2.value  = '';
      busy.value          = false; 
      buttonText2.value   = ''; 
      callbackText2.value = ''; 
      buttonText.value    = ''; 
      callbackText.value  = '';       
      messageOpen.value   = false;
      msgId = '';
    }
  });

</script>
