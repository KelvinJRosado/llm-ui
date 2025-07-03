<template>
  <div
    ref="chatContainer"
    class="chat-history-container"
  >
    <!-- Chat messages -->
    <div
      v-for="message in messages"
      :key="message.id"
      :class="message.isUser ? 'chat-row user' : 'chat-row ai'"
    >
      <div :class="message.isUser ? 'chat-bubble user' : 'chat-bubble ai'">
        <!-- Message content -->
        <p class="chat-message-content">
          {{ message.content }}
        </p>
        <!-- Timestamp -->
        <div
          :class="message.isUser ? 'chat-timestamp user' : 'chat-timestamp ai'"
        >
          {{ formatTimestamp(message.timestamp) }}
        </div>
      </div>
    </div>
    <!-- Empty state -->
    <div
      v-if="messages.length === 0"
      class="chat-empty-state"
    >
      💬 No messages yet. Start a conversation!
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

/**
 * Interface for chat message structure
 */
interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

/**
 * Props for the ChatHistory component
 */
interface Props {
  messages: ChatMessage[];
}

// Component props
const props = defineProps<Props>();

// Template ref for the chat container
const chatContainer = ref<HTMLElement>();

/**
 * Format timestamp for display
 * @param timestamp - The timestamp to format
 * @returns Formatted time string
 */
const formatTimestamp = (timestamp: Date): string => {
  return timestamp.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Scroll to bottom of chat when new messages are added
 */
const scrollToBottom = async (): Promise<void> => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

// Watch for new messages and auto-scroll
watch(
  () => props.messages.length,
  () => {
    scrollToBottom();
  },
  { immediate: true }
);

// Export the ChatMessage interface for use in parent components
export type { ChatMessage };
</script>

<style scoped>
.chat-history-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 24rem;
  overflow-y: auto;
  /* Remove background and border-radius for unified look */
  padding: 1.5rem;
  gap: 1.25rem;
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb transparent;
}
.chat-history-container::-webkit-scrollbar {
  width: 8px;
}
.chat-history-container::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 4px;
}
.chat-row {
  display: flex;
}
.chat-row.user {
  justify-content: flex-end;
}
.chat-row.ai {
  justify-content: flex-start;
}
.chat-bubble {
  max-width: 20rem;
  min-width: 0;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid #e5e7eb;
  border-radius: 1.5rem;
  font-size: 1rem;
  word-break: break-word;
}
.chat-bubble.user {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}
.chat-bubble.ai {
  background: #fff;
  color: #1f2937;
  border-color: #d1d5db;
}
.chat-message-content {
  font-size: 0.95rem;
  line-height: 1.6;
  white-space: pre-wrap;
  margin-bottom: 0.75em;
}
.chat-timestamp {
  font-size: 0.8rem;
  opacity: 0.75;
}
.chat-timestamp.user {
  color: #dbeafe;
}
.chat-timestamp.ai {
  color: #6b7280;
}
.chat-empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 8rem;
  color: #6b7280;
  font-size: 0.95rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
}
</style>
