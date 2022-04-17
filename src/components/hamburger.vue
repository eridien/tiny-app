<template lang='pug'>
img(id="hamburger" :src="`images/hamburger.png`" 
    :style="{width:'25px', height:'25px', \
              margin:'10px 20px 40px 0'}"
    @click="hamburgerClick")
</template>

<script setup>
import {onMounted} from 'vue'

const hamburgerClick = () => {
  console.log('hamburgerClick');
}

onMounted(async () => { 
  console.log(`\n---- hamburger mounted ----\n`);
});

</script>

<style>
</style>
