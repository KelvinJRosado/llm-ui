<template>
  <div class="side-pane left-pane">
    <div class="integrations-container">
      <h3 class="integrations-title">Gaming Service Integrations</h3>

      <div class="integration-form">
        <div
          v-for="service in gamingServices"
          :key="service.key"
          class="service-row"
        >
          <div class="service-info">
            <div class="service-icon">{{ service.icon }}</div>
            <span class="service-name">{{ service.name }}</span>
          </div>

          <div class="service-controls">
            <input
              v-if="!connectedServices[service.key]"
              v-model="usernames[service.key]"
              type="text"
              :placeholder="`Enter ${service.name} username`"
              class="username-input"
              :disabled="connecting[service.key]"
            />
            <div
              v-else
              class="connected-username"
            >
              {{ connectedServices[service.key] }}
            </div>
            
            <button
              v-if="!connectedServices[service.key]"
              @click="connectService(service.key)"
              class="connect-button"
              :disabled="
                !usernames[service.key]?.trim() || connecting[service.key]
              "
            >
              {{ connecting[service.key] ? 'Connecting...' : 'Connect' }}
            </button>
            <button
              v-else
              @click="disconnectService(service.key)"
              @mouseenter="isHovering[service.key] = true"
              @mouseleave="isHovering[service.key] = false"
              class="disconnect-button"
              :class="{ 'hover-disconnect': isHovering[service.key] }"
              :disabled="connecting[service.key]"
            >
              {{ connecting[service.key] ? 'Disconnecting...' : (isHovering[service.key] ? 'Disconnect?' : 'Connected') }}
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="message"
        class="message"
        :class="messageType"
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import type {
    IntegrationRequest,
  } from '../types/llm-config';

  /**
   * Gaming services configuration
   */
  const gamingServices = [
    { key: 'steam', name: 'Steam', icon: '🎮' },
    { key: 'epic', name: 'Epic', icon: '🏪' },
    { key: 'playstation', name: 'PlayStation', icon: '🎯' },
    { key: 'xbox', name: 'Xbox', icon: '🎲' },
  ] as const;

  /**
   * Reactive state for usernames
   */
  const usernames = reactive<Record<string, string>>({
    steam: '',
    epic: '',
    playstation: '',
    xbox: '',
  });

  /**
   * Reactive state for connected services
   */
  const connectedServices = reactive<Record<string, string>>({
    steam: '',
    epic: '',
    playstation: '',
    xbox: '',
  });

  /**
   * Reactive state for connection status
   */
  const connecting = reactive<Record<string, boolean>>({
    steam: false,
    epic: false,
    playstation: false,
    xbox: false,
  });

  /**
   * Reactive state for hover status
   */
  const isHovering = reactive<Record<string, boolean>>({
    steam: false,
    epic: false,
    playstation: false,
    xbox: false,
  });

  /**
   * Message state for user feedback
   */
  const message = ref<string>('');
  const messageType = ref<'success' | 'error'>('success');

  /**
   * Load existing integrations on component mount
   */
  onMounted(async () => {
    await loadIntegrations();
  });

  /**
   * Load existing integrations from the server
   */
  const loadIntegrations = async (): Promise<void> => {
    try {
      const response = await fetch('http://localhost:5000/integration');
      if (!response.ok) {
        throw new Error('Failed to load integrations');
      }
      
      const data = await response.json();
      
      // Update connected services based on the new structure
      for (const [service, username] of Object.entries(data.integrations)) {
        if (typeof username === 'string' && username.trim()) {
          connectedServices[service] = username;
        }
      }
    } catch (error) {
      console.error('Failed to load integrations:', error);
    }
  };

  /**
   * Connect a gaming service by sending username to the server
   * @param serviceKey The service key to connect
   */
  const connectService = async (serviceKey: string): Promise<void> => {
    const username = usernames[serviceKey]?.trim();
    if (!username) {
      showMessage('Please enter a username', 'error');
      return;
    }

    connecting[serviceKey] = true;
    message.value = '';

    try {
      const payload: IntegrationRequest = {
        service: serviceKey,
        username,
      };

      const response = await fetch('http://localhost:5000/integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to connect service');
      }

      const data = await response.json();
      
      // Update connected services state
      connectedServices[serviceKey] = username;
      usernames[serviceKey] = ''; // Clear the input
      
      showMessage(
        `Successfully connected ${serviceKey} account: ${username}`,
        'success'
      );

      console.log('Integration saved:', data);
    } catch (error) {
      console.error('Failed to connect service:', error);
      showMessage(
        `Failed to connect ${serviceKey}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        'error'
      );
    } finally {
      connecting[serviceKey] = false;
    }
  };

  /**
   * Disconnect a gaming service by sending DELETE request to the server
   * @param serviceKey The service key to disconnect
   */
  const disconnectService = async (serviceKey: string): Promise<void> => {
    connecting[serviceKey] = true;
    message.value = '';

    try {
      const response = await fetch(`http://localhost:5000/integration/${serviceKey}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to disconnect service');
      }

      // Update connected services state
      connectedServices[serviceKey] = '';
      isHovering[serviceKey] = false;
      
      showMessage(
        `Successfully disconnected ${serviceKey} account`,
        'success'
      );

      console.log('Integration removed:', serviceKey);
    } catch (error) {
      console.error('Failed to disconnect service:', error);
      showMessage(
        `Failed to disconnect ${serviceKey}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        'error'
      );
    } finally {
      connecting[serviceKey] = false;
    }
  };

  /**
   * Show a message to the user
   * @param msg The message to display
   * @param type The message type (success or error)
   */
  const showMessage = (msg: string, type: 'success' | 'error'): void => {
    message.value = msg;
    messageType.value = type;

    // Auto-hide message after 5 seconds
    setTimeout(() => {
      message.value = '';
    }, 5000);
  };
</script>

<style scoped>
  .side-pane.left-pane {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #f9fafb;
    border-right: 1px solid #e5e7eb;
    padding: 1rem;
    min-width: 300px;
  }

  .integrations-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
  }

  .integrations-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .integration-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .service-row {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
  }

  .service-row:hover {
    border-color: #d1d5db;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .service-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .service-icon {
    font-size: 1.25rem;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f3f4f6;
    border-radius: 0.375rem;
  }

  .service-name {
    font-weight: 500;
    color: #374151;
    font-size: 0.875rem;
  }

  .service-controls {
    display: flex;
    gap: 0.5rem;
  }

  .username-input {
    flex: 1;
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #374151;
    background: #ffffff;
    transition: border-color 0.2s ease;
  }

  .username-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }

  .username-input:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
  }

  .username-input::placeholder {
    color: #9ca3af;
  }

  .connect-button {
    padding: 0.5rem 1rem;
    background: #3b82f6;
    color: #ffffff;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .connect-button:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
  }

  .connect-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .connect-button:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }

  .disconnect-button {
    padding: 0.5rem 1rem;
    background: #10b981;
    color: #ffffff;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .disconnect-button:hover:not(:disabled) {
    background: #059669;
    transform: translateY(-1px);
  }

  .disconnect-button.hover-disconnect {
    background: #ef4444;
  }

  .disconnect-button.hover-disconnect:hover:not(:disabled) {
    background: #dc2626;
  }

  .disconnect-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .disconnect-button:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }

  .connected-username {
    flex: 1;
    padding: 0.5rem 0.75rem;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #166534;
    font-weight: 500;
  }

  .message {
    padding: 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    margin-top: auto;
  }

  .message.success {
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #a7f3d0;
  }

  .message.error {
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  }

  /* Responsive design for smaller screens */
  @media (max-width: 768px) {
    .side-pane.left-pane {
      min-width: 250px;
      padding: 0.75rem;
    }

    .service-controls {
      flex-direction: column;
    }

    .connect-button {
      width: 100%;
    }
  }
</style>
