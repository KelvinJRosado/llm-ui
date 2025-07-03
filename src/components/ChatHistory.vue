<template>
  <div
    ref="chatContainer"
    class="flex flex-col h-full max-h-96 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl p-6 space-y-5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
  >
    <!-- Chat messages -->
    <div
      v-for="message in messages"
      :key="message.id"
      :class="['flex', message.isUser ? 'justify-end' : 'justify-start']"
    >
      <div
        :class="[
          'max-w-xs lg:max-w-md px-6 py-4 shadow-lg border',
          message.isUser
            ? 'bg-blue-500 text-white border-blue-600 rounded-3xl rounded-br-lg'
            : 'bg-white text-gray-800 border-gray-300 rounded-3xl rounded-bl-lg',
        ]"
      >
        <!-- Message content -->
        <p class="text-sm leading-relaxed whitespace-pre-wrap mb-3">
          {{ message.content }}
        </p>

        <!-- Timestamp -->
        <div
          :class="[
            'text-xs opacity-75',
            message.isUser ? 'text-blue-100' : 'text-gray-500',
          ]"
        >
          {{ formatTimestamp(message.timestamp) }}
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="messages.length === 0"
      class="flex items-center justify-center h-32 text-gray-500 text-sm font-medium bg-white/50 rounded-xl border border-gray-200"
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
