<template lang='pug'>
img(id="hamburger" :src="`images/hamburger.png`" 
    style="{}"
    @click="hamburgerClick")
</template>

<script setup>
import {onMounted} from 'vue'

const hamburgerClick = () => {
  console.log('hamburgerClick');
}

onMounted(async () => { 
  // console.log(`---- hamburger mounted ----`);
});

</script>

<style>
</style>
