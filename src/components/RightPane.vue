<template>
  <div class="side-pane right-pane">
    <span class="side-pane-placeholder">Right Pane (Placeholder)</span>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.side-pane.right-pane {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #f9fafb;
  border-left: 1px solid #e5e7eb;
}
.side-pane-placeholder {
  color: #9ca3af;
}
</style>
