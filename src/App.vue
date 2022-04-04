
<template lang='pug'>
div(style="text-align:center")
  img(alt="Vue logo" src="./assets/logo.png")
  HelloWorld(msg="Mello World Vue 3 + Vite")
</template>

<script setup>
import { onMounted } from 'vue'
import HelloWorld from './components/HelloWorld.vue'

onMounted(async() => { 
  console.log('\n---- mounted ----\n');
});

onMounted(async() => {
  const res = await fetch('http://192.168.1.159/test2.txt', { 
    method: 'get',
    headers: {'content-type': 'text/plain'}
  });
  if (!res.ok)
    console.log('Error loading test2.txt:', res.statusText);
  else
    console.log(await res.text());
});

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
