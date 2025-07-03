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

    <!-- Send button and New Chat button -->
    <div class="user-input-buttons-wrapper">
      <button
        @click="newChat"
        class="user-input-new-chat-btn"
      >
        New Chat
      </button>
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
  (e: 'new-chat'): void;
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
 * Start a new chat session
 */
const newChat = (): void => {
  emit('new-chat');
};

/**
 * Handle keydown events in the textarea
 * @param event - The keyboard event
 */
const handleKeydown = (event: KeyboardEvent): void => {
  // Send message on Enter (without Shift), allow newline with Shift+Enter
  if (event.key === 'Enter' && !event.shiftKey) {
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
  gap: 2.5rem; /* Increased gap for more space */
  padding: 1.5rem;
  background: #fff;
  border-top: 1px solid #e5e7eb;
}
.user-input-textarea-wrapper {
  flex: 1 1 0%;
  min-width: 0;
  margin-right: 0.5rem; /* Add margin to further separate from button */
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
.user-input-buttons-wrapper {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
}
.user-input-new-chat-btn {
  padding: 1rem 1.5rem;
  background: #10b981;
  color: #fff;
  border: none;
  border-radius: 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.08);
  cursor: pointer;
  transition: background 0.2s;
}
.user-input-new-chat-btn:hover {
  background: #059669;
}
.user-input-send-wrapper {
  flex-shrink: 0;
  min-width: 130px; /* Ensure button never overlaps textarea */
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
