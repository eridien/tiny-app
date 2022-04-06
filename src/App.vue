
<template lang='pug'>
div(style="text-align:center")
  HelloWorld(msg="Hello World Vue 3 + Vite")
</template>

<script setup>
import { onMounted, getCurrentInstance  } from 'vue'
import HelloWorld from './components/HelloWorld.vue'

const app = getCurrentInstance();
const hostname = 
      app.appContext.config.globalProperties.hostname;

onMounted(async() => { 
  console.log(`\n---- mounted: ${hostname} ----\n`);
});

onMounted(async() => {
  const res = await fetch(`${hostname}index.html`, { 
    method: 'get',
    headers: {'content-type': 'text/plain'}
  });
  if (!res.ok)
    console.log('Error loading index.html:', res.statusText);
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
