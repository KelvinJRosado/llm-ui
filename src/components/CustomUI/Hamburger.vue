<template>
  <div class="w-full">
    <!-- Toggle Button -->
    <button
      @click="isOpen = !isOpen"
      class="flex items-center px-4 py-2 mt-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      :aria-expanded="isOpen"
      aria-controls="hamburger-content"
      type="button"
    >
      <span v-if="isOpen">Hide</span>
      <span v-else>Show</span>
      <svg
        :class="[
          'ml-2 h-5 w-5 transition-transform',
          isOpen ? 'rotate-90' : '',
        ]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
    <!-- Collapsible Content -->
    <TransitionRoot
      as="template"
      :show="isOpen"
    >
      <div
        id="hamburger-content"
        class="mt-4"
      >
        <slot />
      </div>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TransitionRoot } from '@headlessui/vue';

/**
 * Hamburger component: Collapsible section with a toggle button and slot for content.
 * - Uses Headless UI's TransitionRoot for smooth transitions.
 * - Accessible with ARIA attributes.
 */
const isOpen = ref(true);
</script>
