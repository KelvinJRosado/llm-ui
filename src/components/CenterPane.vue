<template>
  <div
    class="flex flex-col h-full w-full bg-gray-50"
    style="margin-left: 1%; margin-right: 1%"
  >
    <!-- Chat History Section (top half) -->
    <div class="flex-1 p-4">
      <ChatHistory :messages="chatMessages" />
    </div>

    <!-- User Input Panel (bottom) -->
    <div class="flex-shrink-0">
      <UserInputPanel @send-message="handleSendMessage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ChatHistory, { type ChatMessage } from './ChatHistory.vue';
import UserInputPanel from './UserInputPanel.vue';

// Chat messages array - stores the conversation history
const chatMessages = ref<ChatMessage[]>([
  // Sample messages for demonstration
  {
    id: '1',
    content: 'Hello! How can I help you today?',
    isUser: false,
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
  },
  {
    id: '2',
    content: "Hi there! I'm looking for help with my project.",
    isUser: true,
    timestamp: new Date(Date.now() - 4 * 60 * 1000), // 4 minutes ago
  },
  {
    id: '3',
    content: "I'd be happy to help! What kind of project are you working on?",
    isUser: false,
    timestamp: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
  },
]);

/**
 * Handle sending a new message from the user
 * @param message - The message content from the user
 */
const handleSendMessage = (message: string): void => {
  // Add user message to chat history
  const userMessage: ChatMessage = {
    id: `user-${Date.now()}`,
    content: message,
    isUser: true,
    timestamp: new Date(),
  };

  chatMessages.value.push(userMessage);

  // Simulate AI response after a short delay
  setTimeout(() => {
    const aiMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      content:
        'Thank you for your message! This is a simulated AI response. In a real application, this would be connected to an AI service.',
      isUser: false,
      timestamp: new Date(),
    };

    chatMessages.value.push(aiMessage);
  }, 1000);
};
</script>
