<template lang='pug'>
Slide(id="burgerMenu" right="true" 
      width="200" noOverlay="true"
      closeOnNavigation="true"
     isOpen="menuOpen" 
     @closeMenu="menuOpen = false")
  #pwrOff(@click="pwrOffEvt") Power Off
  #closeMenu(@click="closeMenuEvt") Close 
</template>

<script setup>
  import { Slide } from 'vue3-burger-menu'  

  const emit = defineEmits(['pwrOff']);

  let   menuOpen = false;           

  const pwrOffEvt = () => {
    console.log('pwrOffEvt');
    emit('pwrOff');
    menuOpen = false;
  }
  const closeMenuEvt = () => {
    menuOpen = false;
  }
</script>

<style>
 .bm-burger-button {
    position: fixed;
    width: 36px;
    height: 30px;
    left: 85vw;
    top: 15px;
    cursor: pointer;
  }
  .bm-burger-bars {
    background-color: #373a47;
  }
  .line-style {
    position: absolute;
    height: 3px;
    left: 0;
    right: 0;
  }
  .cross-style {
    display:none;
    position: absolute;
    top: 12px;
    right: 2px;
    cursor: pointer;
  }
  .bm-cross {
    background: #bdc3c7;
  }
  .bm-cross-button {
    height: 24px;
    width: 24px;
  }
  .bm-menu {
    height: 180px; 
    position: fixed;
    z-index: 1000;
    top: 65px;
    left: 0;
    background-color: #ddd;
    overflow-x: hidden; /* Disable horizontal scroll */
    padding-top: 6px;
    transition: 0.05s;
  }
  .bm-item-list {
    color: black;
    margin-left: 6%;
    font-size: 20px;
    width:170px;
  }
  .bm-item-list > * {
    background-color: white;
    border: 1px solid black;
    margin: 10px;
    display: flex;
    text-decoration: none;
    padding: 0.7em;
    font-weight: 700;
    font-size:25px;
    color: black;
  }
</style>