<template>
  <div class="flex h-screen">
    <LeftPane class="flex-1" />
    <CenterPane class="flex-1" />
    <RightPane class="flex-1" />
  </div>
</template>

<script setup lang="ts">
import LeftPane from './LeftPane.vue';
import CenterPane from './CenterPane.vue';
import RightPane from './RightPane.vue';
</script>
