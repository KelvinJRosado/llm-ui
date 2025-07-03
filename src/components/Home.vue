<template>
  <div class="home-container">
    <!-- LeftPane: 1/6 width -->
    <LeftPane class="home-pane left" />
    <!-- CenterPane: 4/6 width -->
    <CenterPane
      class="home-pane center"
      :llm-config="llmConfig"
    />
    <!-- RightPane: 1/6 width -->
    <RightPane
      class="home-pane right"
      :llm-config="llmConfig"
      @update-config="handleConfigUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LeftPane from './LeftPane.vue';
import CenterPane from './CenterPane.vue';
import RightPane from './RightPane.vue';
import { type LLMConfig, DEFAULT_LLM_CONFIG } from '../types/llm-config';

// Manage LLM configuration state
const llmConfig = ref<LLMConfig>({ ...DEFAULT_LLM_CONFIG });

/**
 * Handle configuration updates from RightPane
 * @param updatedConfig - Partial configuration updates
 */
const handleConfigUpdate = (updatedConfig: Partial<LLMConfig>): void => {
  llmConfig.value = { ...llmConfig.value, ...updatedConfig };
};
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
