<template lang='pug'>
div(style="width:75%; display:flex;         \
           min-height: calc(100vh - 100px); \
           justify-content:center;          \
           align-items:center;")
  img( id="wheel" src="images/steering-wheel.png"
               :style="{transform:`rotate(${angle}deg)`}" )
</template>

<script setup>
  import {onMounted} from 'vue';

  onMounted(async () => { 
    console.log(`---- wheelPane mounted ----`);
  });
</script>

<style>
</style>
