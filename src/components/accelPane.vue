<template lang='pug'>
div(style="border:1px solid blue; width:25%; \
           min-height: calc(100vh - 100px);")
</template>

<script setup>
  import {onMounted} from 'vue'

  onMounted(async () => { 
    console.log(`---- accelPane mounted ----`);
  });
</script>

<style>
</style>
