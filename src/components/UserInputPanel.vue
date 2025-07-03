<template>
  <div class="user-input-panel">
    <!-- Message input textarea -->
    <div class="user-input-textarea-wrapper">
      <textarea
        v-model="messageText"
        ref="textareaRef"
        rows="3"
        class="user-input-textarea"
        placeholder="Type your message here..."
        @keydown="handleKeydown"
        @input="adjustTextareaHeight"
      />
    </div>

    <!-- Send button -->
    <div class="user-input-send-wrapper">
      <button
        @click="sendMessage"
        :disabled="!messageText.trim()"
        class="user-input-send-btn"
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

<style scoped>
.user-input-panel {
  display: flex;
  align-items: flex-end;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #fff;
  border-top: 1px solid #e5e7eb;
}
.user-input-textarea-wrapper {
  flex: 1 1 0%;
  min-width: 0;
}
.user-input-textarea {
  width: 100%;
  padding: 1.25rem 1.25rem;
  border: 2px solid #d1d5db;
  border-radius: 1.5rem;
  resize: none;
  font-size: 0.95rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: border 0.2s, box-shadow 0.2s;
}
.user-input-textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px #2563eb33;
}
.user-input-send-wrapper {
  flex-shrink: 0;
}
.user-input-send-btn {
  padding: 1rem 2rem;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  min-width: 120px;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.08);
  cursor: pointer;
  transition: background 0.2s;
}
.user-input-send-btn:hover:not(:disabled) {
  background: #1d4ed8;
}
.user-input-send-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
</style>
