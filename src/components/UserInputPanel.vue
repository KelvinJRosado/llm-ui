<template>
  <div class="flex items-end space-x-3 p-4 bg-white border-t border-gray-200">
    <!-- Message input textarea -->
    <div class="flex-1">
      <textarea
        v-model="messageText"
        ref="textareaRef"
        rows="3"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        placeholder="Type your message here..."
        @keydown="handleKeydown"
        @input="adjustTextareaHeight"
      />
    </div>

    <!-- Send button -->
    <button
      @click="sendMessage"
      :disabled="!messageText.trim()"
      class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors min-w-[80px] h-10"
    >
      Send
    </button>
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
    textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 120)}px`;
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
