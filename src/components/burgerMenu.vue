<template lang='pug'>
#burgerMenu(style="border-radius:12px; font-size:28px; \
                   background-color:#c8c8c8;")
  .button(@click="pwrOffEvt"   ) Power Off
  .button(@click="closeMenuEvt") Close 
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
  const emit = defineEmits(['pwrOff', 'close']);

  const pwrOffEvt    = () => emit('pwrOff');
  const closeMenuEvt = () => emit('close' );
</script>
