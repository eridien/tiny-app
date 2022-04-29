<template lang='pug'>
#burgerMenu(style="border-radius:12px; font-size:28px; \
                   background-color:#c8c8c8;           \
                   display:table;\
                   position:relative;")
  div
    .button(@click="settingsEvt" ) Settings 
    .button(@click="stopEvt"     ) Stop
    .button(@click="pwrOffEvt"   ) Power Off
    .button(@click="closeMenuEvt") Close 

  #cover(v-show="settingsOpen"
         style="position:absolute;               \
                left:0; top:0;                   \
                border-radius:12px;              \
                width:100%; height:100%;         \
                opacity:0.3;                     \
                background-color:black;          \
                display: table-cell;")

  Settings(v-show="settingsOpen"
          style="position:fixed; z-index:1001;  \
                top:90px; right:70px;"
          @steering="steeringEvt")
</template>

<style>
.button {
  border:1px solid black;
  margin:20px; padding:10px;
  background-color:white;
  border-radius:15px;
}
</style>

<script setup>
  import {ref, watch} from 'vue'
  import Settings from './settings.vue';

  const props= defineProps(['closing']);
  const emit = defineEmits(['stop', 'pwrOff', 'closeMenu']);

  const settingsOpen = ref(false);

  const steeringEvt = ()=> {

  }
  
  const closeMenu = ()=> {
    settingsOpen.value = false;
    emit('closeMenu' );
  }

  const settingsEvt = ()=> {
    settingsOpen.value = true;
  }

  const stopEvt = () => {
    emit('stop');
    closeMenu();
  }

  const pwrOffEvt = () => {
    emit('pwrOff');
    closeMenu();
  }

  const closeMenuEvt = () => closeMenu();

  watch(() => props.closing, () => {
    settingsOpen.value = false;
    closeMenu();
  });

</script>
