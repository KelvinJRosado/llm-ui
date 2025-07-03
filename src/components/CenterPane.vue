<template>
  <div class="center-pane-container">
    <!-- Show info and start button if chat not started -->
    <div
      v-if="!chatStarted"
      class="center-pane-info"
    >
      <p class="info-text">
        Welcome to the LLM UI! This app lets you chat with an AI assistant.
        Click the button below to start a new chat session.
      </p>
      <button
        class="start-chat-btn"
        @click="startChat"
        :disabled="startingChat"
      >
        {{ startingChat ? 'Starting...' : 'Start chat' }}
      </button>
    </div>
    <!-- Chat UI -->
    <template v-else>
      <div class="center-pane-history">
        <ChatHistory :messages="chatMessages" />
      </div>
      <div class="center-pane-input input-flex-col">
        <UserInputPanel
          @send-message="handleSendMessage"
          @new-chat="newChat"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ChatHistory, { type ChatMessage } from './ChatHistory.vue';
import UserInputPanel from './UserInputPanel.vue';
import { type LLMConfig } from '../types/llm-config';

// Props to receive configuration from parent
interface Props {
  llmConfig: LLMConfig;
}

const props = defineProps<Props>();

// Track if chat has started
const chatStarted = ref(false);
// Track if chat is being started
const startingChat = ref(false);
// Store chatId from API
const chatId = ref<string | null>(null);

// Chat messages array - stores the conversation history
const chatMessages = ref<ChatMessage[]>([
  // Example:
  // {
  //   content: 'Hello! How can I help you today?',
  //   isUser: false,
  //   timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  // },
]);

/**
 * Start a new chat session by calling the API
 */
const startChat = async (): Promise<void> => {
  startingChat.value = true;
  try {
    const response = await fetch('http://localhost:5000/chats', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    console.log('Chat started:', data);
    chatId.value = data.chatId || null;
    chatStarted.value = true;
  } catch (error) {
    console.error('Failed to start chat:', error);
  } finally {
    startingChat.value = false;
  }
};

/**
 * Start a new chat and clear chat history
 */
const newChat = async (): Promise<void> => {
  chatMessages.value = [];
  await startChat();
};

/**
 * Handle sending a new message from the user
 * @param message - The message content from the user
 */
const handleSendMessage = async (message: string): Promise<void> => {
  // Add user message to chat history
  const userMessageRequest = {
    content: message,
    config: {
      model: props.llmConfig.model,
      temperature: props.llmConfig.temperature,
    },
  };

  // Ensure chatId is available
  if (!chatId.value) {
    console.error('No chat session started.');
    return;
  }

  chatMessages.value.push({
    content: userMessageRequest.content,
    isUser: true,
    timestamp: new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }),
  });

  try {
    // Send user message to the API and await AI response
    const response = await fetch(
      `http://localhost:5000/chats/${chatId.value}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userMessageRequest),
      }
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const interaction = await response.json();
    chatMessages.value.push(interaction.response);
  } catch (error) {
    console.error('Failed to send message or receive response:', error);
  }
};
</script>

<style scoped>
.center-pane-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  /* Remove background for unified look */
  margin-left: 1%;
  margin-right: 1%;
}
.center-pane-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}
.info-text {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: #333;
}
.start-chat-btn {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background 0.2s;
}
.start-chat-btn:disabled {
  background: #a5b4fc;
  cursor: not-allowed;
}
.center-pane-history {
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 1rem;
}
.center-pane-history > * {
  flex: 1 1 0%;
  min-height: 0;
}
.center-pane-input {
  flex-shrink: 0;
  padding-bottom: 1.5rem; /* Add padding to separate input from bottom */
  padding-top: 0.5rem; /* Add padding to separate from chat history */
}
.center-pane-input.input-flex-col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-bottom: 1.5rem;
  padding-top: 0.5rem;
}
</style>
