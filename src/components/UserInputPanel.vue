<template>
  <div class="flex items-end gap-6 p-6 bg-white border-t border-gray-200">
    <!-- Message input textarea -->
    <div class="flex-1 min-w-0">
      <textarea
        v-model="messageText"
        ref="textareaRef"
        rows="3"
        class="w-full px-5 py-4 border-2 border-gray-300 rounded-3xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200 shadow-sm text-sm"
        placeholder="Type your message here..."
        @keydown="handleKeydown"
        @input="adjustTextareaHeight"
      />
    </div>

    <!-- Send button -->
    <div class="flex-shrink-0">
      <button
        @click="sendMessage"
        :disabled="!messageText.trim()"
        class="px-8 py-4 bg-blue-500 text-white rounded-3xl hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 min-w-[120px] shadow-lg font-semibold text-sm"
      >
        Send
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';

/**
 * Events emitted by the UserInputPanel component
 */
interface Emits {
  (e: 'send-message', message: string): void;
}

// Component emits
const emit = defineEmits<Emits>();

// Reactive state
const messageText = ref<string>('');
const textareaRef = ref<HTMLTextAreaElement>();

/**
 * Send the current message
 */
const sendMessage = (): void => {
  const message = messageText.value.trim();
  if (message) {
    emit('send-message', message);
    messageText.value = '';
    resetTextareaHeight();
  }
};

/**
 * Handle keydown events in the textarea
 * @param event - The keyboard event
 */
const handleKeydown = (event: KeyboardEvent): void => {
  // Send message on Ctrl+Enter or Cmd+Enter
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    sendMessage();
  }
};

/**
 * Adjust textarea height based on content
 */
const adjustTextareaHeight = async (): Promise<void> => {
  await nextTick();
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
    textareaRef.value.style.height = `${Math.min(
      textareaRef.value.scrollHeight,
      120
    )}px`;
  }
};

/**
 * Reset textarea height to default
 */
const resetTextareaHeight = async (): Promise<void> => {
  await nextTick();
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
  }
};
</script>
