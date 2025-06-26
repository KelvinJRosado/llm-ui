<template>
  <div id="app">
    <Home />
  </div>
</template>

<script setup lang="ts">
  import Home from './components/Home.vue';
</script>

<style>
  #app {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
      'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
      'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0;
    padding: 0;
  }

  body {
    margin: 0;
    padding: 0;
  }
</style>
