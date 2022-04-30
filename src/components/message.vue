<template lang='pug'>
#message(style="border-radius:12px; font-size:28px; \
                 background-color:white;             \
                 margin:20px; padding:20px;") 
  div {{msgText}}
  div(@click="doneClick"
    style="float:right; font-size:26px;   \
            background-color:#ddd;         \
            border-radius:6px;             \
            padding:5px; margin:20px 5px 0 0") {{btnText}}
</template>

<script setup>
  import {onMounted, ref} from 'vue';

  const emit = defineEmits(['closeMenu']);

  const sensVal = ref(5);

  const doneClick = () => emit('closeMenu');
</script>

<style>
</style>
