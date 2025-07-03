<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8"
  >
    <!-- TextareaInput component demo -->
    <div class="mx-auto w-full">
      <TextareaInput
        v-model="userInput"
        label="Enter your message"
        placeholder="Type your message here..."
        :rows="5"
        :max-length="500"
        :show-character-count="true"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />

      <!-- Display the current value for testing -->
      <div
        v-if="userInput"
        class="mt-4 p-3 bg-white rounded-md border"
      >
        <h3 class="text-sm font-medium text-gray-700 mb-2">Current Input:</h3>
        <p class="text-sm text-gray-600 whitespace-pre-wrap">{{ userInput }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TextareaInput from './TextareaInput.vue';

// Displays a simple hello message and textarea demo
const userInput = ref('');

/**
 * Handle textarea focus events
 */
const handleFocus = (event: FocusEvent): void => {
  console.log('Textarea focused:', event);
};

/**
 * Handle textarea blur events
 */
const handleBlur = (event: FocusEvent): void => {
  console.log('Textarea blurred:', event);
};

/**
 * Handle textarea keydown events
 */
const handleKeydown = (event: KeyboardEvent): void => {
  console.log('Key pressed:', event.key);
};
</script>
