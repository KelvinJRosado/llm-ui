<template>
  <div class="flex h-screen">
    <!-- LeftPane: 1/6 width -->
    <LeftPane class="basis-1/6" />
    <!-- CenterPane: 4/6 width -->
    <CenterPane class="basis-4/6" />
    <!-- RightPane: 1/6 width -->
    <RightPane class="basis-1/6" />
  </div>
</template>

<script setup lang="ts">
import LeftPane from './LeftPane.vue';
import CenterPane from './CenterPane.vue';
import RightPane from './RightPane.vue';
</script>
