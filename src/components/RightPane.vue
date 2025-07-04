<template>
  <div class="side-pane right-pane">
    <!-- Header Section (Red) -->
    <div class="section header-section">
      <h3 class="section-title">Model Configuration</h3>
      <p class="helper-text">
        Configure and fine-tune the models used by the server for optimal
        performance
      </p>
    </div>

    <!-- Model Selection Section (Green) -->
    <div class="section model-section">
      <h4 class="section-label">Model Select</h4>
      <div class="input-group">
        <label
          for="model-select"
          class="input-label"
          >Model</label
        >
        <select
          id="model-select"
          v-model="selectedModel"
          class="select-input"
        >
          <option value="llama3.2">LLama 3.2</option>
          <option value="deepseek-ai/DeepSeek-R1-0528">DeepSeek R1</option>
        </select>
      </div>
    </div>

    <!-- Configuration Section (Blue) -->
    <div class="section config-section">
      <h4 class="section-label">Configuration</h4>

      <div class="input-group">
        <label
          for="api-key"
          class="input-label"
          >API Key</label
        >
        <input
          id="api-key"
          v-model="apiKey"
          type="password"
          placeholder="Enter your API key"
          class="text-input"
        />
      </div>

      <div class="input-group">
        <label
          for="temperature"
          class="input-label"
        >
          Temperature: {{ temperature }}
        </label>
        <input
          id="temperature"
          v-model="temperature"
          type="range"
          min="0.5"
          max="0.95"
          value="0.75"
          step="0.05"
          class="slider-input"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { type LLMConfig } from '../types/llm-config';

  // Props to receive configuration from parent
  interface Props {
    llmConfig: LLMConfig;
  }

  const props = defineProps<Props>();

  // Emit configuration updates to parent
  const emit = defineEmits<{
    updateConfig: [config: Partial<LLMConfig>];
  }>();

  // Local reactive state for form inputs
  const selectedModel = ref<string>(props.llmConfig.model || 'llama3.2');
  const apiKey = ref<string>(props.llmConfig.apiKey || '');
  const temperature = ref<number>(props.llmConfig.temperature || 0.7);

  // Watch for changes and emit updates to parent
  watch(selectedModel, (newValue) => {
    emit('updateConfig', { model: newValue });
  });

  watch(apiKey, (newValue) => {
    emit('updateConfig', { apiKey: newValue });
  });

  watch(temperature, (newValue) => {
    emit('updateConfig', { temperature: newValue });
  });
</script>

<style scoped>
  .side-pane.right-pane {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #f9fafb;
    border-left: 1px solid #e5e7eb;
    overflow-y: auto;
    max-width: 340px; /* Set a max width to prevent overflow */
    min-width: 280px; /* Optional: ensures usability at small sizes */
    width: 100%;
    box-sizing: border-box;
  }

  .section {
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  /* Header Section (Red) */
  .header-section {
    background: #fef2f2;
    border-top: 3px solid #ef4444;
  }

  .section-title {
    margin: 0 0 0.5rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
  }

  .helper-text {
    margin: 0;
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.4;
  }

  /* Model Selection Section (Green) */
  .model-section {
    background: #f0fdf4;
    border-top: 3px solid #22c55e;
  }

  /* Configuration Section (Blue) */
  .config-section {
    background: #eff6ff;
    border-top: 3px solid #3b82f6;
    flex: 1;
  }

  .section-label {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
  }

  .input-group {
    margin-bottom: 1rem;
  }

  .input-label {
    display: block;
    margin-bottom: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  .select-input,
  .text-input {
    width: 100%;
    min-width: 0; /* Prevents input overflow */
    box-sizing: border-box;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    background: white;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }

  .select-input:focus,
  .text-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .slider-input {
    width: 100%;
    height: 0.25rem;
    background: #d1d5db;
    border-radius: 0.125rem;
    outline: none;
    -webkit-appearance: none;
    appearance: none;
  }

  .slider-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 1rem;
    height: 1rem;
    background: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
  }

  .slider-input::-moz-range-thumb {
    width: 1rem;
    height: 1rem;
    background: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }

  .slider-input:focus {
    background: #bfdbfe;
  }
</style>
