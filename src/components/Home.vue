<template>
  <div class="home-container">
    <!-- LeftPane: 1/6 width -->
    <LeftPane class="home-pane left" />
    <!-- CenterPane: 4/6 width -->
    <CenterPane class="home-pane center" />
    <!-- RightPane: 1/6 width -->
    <RightPane class="home-pane right" />
  </div>
</template>

<script setup lang="ts">
import LeftPane from './LeftPane.vue';
import CenterPane from './CenterPane.vue';
import RightPane from './RightPane.vue';
</script>

<style scoped>
.home-container {
  display: flex;
  height: 100vh;
}
.home-pane.left {
  flex-basis: 16.6667%;
}
.home-pane.center {
  flex-basis: 66.6667%;
}
.home-pane.right {
  flex-basis: 16.6667%;
}
</style>
