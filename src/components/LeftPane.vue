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
            <div class="helper-container">
              <div
                class="helper-icon"
                :title="getHelperText(service.key)"
              >
                ?
              </div>
            </div>
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
              {{
                connecting[service.key]
                  ? 'Disconnecting...'
                  : isHovering[service.key]
                  ? 'Disconnect?'
                  : 'Connected'
              }}
            </button>
          </div>

          <!-- Games List Section -->
          <div
            v-if="
              connectedServices[service.key] &&
              gamesList[service.key]?.length > 0
            "
            class="games-section"
          >
            <button
              @click="toggleGamesList(service.key)"
              class="games-toggle"
            >
              <span
                class="caret"
                :class="{ expanded: gamesExpanded[service.key] }"
                >▶</span
              >
              <span>{{ gamesList[service.key].length }} games found</span>
            </button>

            <div
              v-if="gamesExpanded[service.key]"
              class="games-list"
            >
              <div
                v-for="(game, index) in paginatedGames(service.key)"
                :key="`${service.key}-${index}`"
                class="game-row"
              >
                <input
                  v-model="gameSelections[service.key][index]"
                  type="checkbox"
                  :id="`game-${service.key}-${index}`"
                  class="game-checkbox"
                />
                <label
                  :for="`game-${service.key}-${index}`"
                  class="game-label"
                >
                  {{ game.name }}
                  <span
                    v-if="game.playMinutes"
                    class="playtime"
                  >
                    ({{ formatPlaytime(game.playMinutes) }})
                  </span>
                </label>
              </div>

              <div
                v-if="gamesList[service.key].length > 10"
                class="pagination-controls"
              >
                <button
                  @click="previousPage(service.key)"
                  :disabled="currentPage[service.key] === 0"
                  class="pagination-button"
                >
                  ← Previous
                </button>
                <span class="page-info">
                  Page {{ currentPage[service.key] + 1 }} of
                  {{ totalPages(service.key) }}
                </span>
                <button
                  @click="nextPage(service.key)"
                  :disabled="
                    currentPage[service.key] >= totalPages(service.key) - 1
                  "
                  class="pagination-button"
                >
                  Next →
                </button>
              </div>
            </div>
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
  import type { IntegrationRequest, Game } from '../types/llm-config';

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
   * Reactive state for games list from integrations
   */
  const gamesList = reactive<Record<string, Game[]>>({
    steam: [],
    epic: [],
    playstation: [],
    xbox: [],
  });

  /**
   * Reactive state for games list expansion
   */
  const gamesExpanded = reactive<Record<string, boolean>>({
    steam: false,
    epic: false,
    playstation: false,
    xbox: false,
  });

  /**
   * Reactive state for current page of games
   */
  const currentPage = reactive<Record<string, number>>({
    steam: 0,
    epic: 0,
    playstation: 0,
    xbox: 0,
  });

  /**
   * Reactive state for game selections (checkboxes)
   */
  const gameSelections = reactive<Record<string, Record<number, boolean>>>({
    steam: {},
    epic: {},
    playstation: {},
    xbox: {},
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
      const response = await fetch('http://127.0.0.1:5000/integration');
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

      const response = await fetch('http://127.0.0.1:5000/integration', {
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

      // Handle games data if returned
      if (data.games && Array.isArray(data.games)) {
        gamesList[serviceKey] = data.games;
        initializeGameSelections(serviceKey, data.games);
      }

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
      const response = await fetch(
        `http://127.0.0.1:5000/integration/${serviceKey}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to disconnect service');
      }

      // Update connected services state
      connectedServices[serviceKey] = '';
      isHovering[serviceKey] = false;

      // Clear games data
      gamesList[serviceKey] = [];
      gamesExpanded[serviceKey] = false;
      currentPage[serviceKey] = 0;
      gameSelections[serviceKey] = {};

      showMessage(`Successfully disconnected ${serviceKey} account`, 'success');

      console.log('Integration removed:', serviceKey);
    } catch (error) {
      console.error('Failed to disconnect service:', error);

      // Clear integration anyway to fix the disconnect bug
      connectedServices[serviceKey] = '';
      isHovering[serviceKey] = false;
      gamesList[serviceKey] = [];
      gamesExpanded[serviceKey] = false;
      currentPage[serviceKey] = 0;
      gameSelections[serviceKey] = {};

      showMessage(
        `Service disconnected locally due to server error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        'error'
      );
    } finally {
      connecting[serviceKey] = false;
    }
  };

  /**
   * Get helper text for a specific service
   * @param serviceKey The service key
   * @returns Helper text for the service
   */
  const getHelperText = (serviceKey: string): string => {
    const helperTexts: Record<string, string> = {
      steam:
        'Get this value by checking the URL after going to your Steam profile from your account',
      epic: 'Enter your Epic Games username',
      playstation: 'Enter your PlayStation Network username',
      xbox: 'Enter your Xbox Live gamertag',
    };

    return helperTexts[serviceKey] || '';
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

  /**
   * Initialize game selections for a service
   * @param serviceKey The service key
   * @param games The games array
   */
  const initializeGameSelections = (
    serviceKey: string,
    games: Game[]
  ): void => {
    gameSelections[serviceKey] = {};
    games.forEach((_, index) => {
      gameSelections[serviceKey][index] = true; // All checkboxes start checked
    });
  };

  /**
   * Toggle the games list expansion for a service
   * @param serviceKey The service key
   */
  const toggleGamesList = (serviceKey: string): void => {
    gamesExpanded[serviceKey] = !gamesExpanded[serviceKey];
  };

  /**
   * Get paginated games for a service
   * @param serviceKey The service key
   * @returns Array of games for current page
   */
  const paginatedGames = (serviceKey: string): Game[] => {
    const games = gamesList[serviceKey] || [];
    const start = currentPage[serviceKey] * 10;
    const end = start + 10;
    return games.slice(start, end);
  };

  /**
   * Get total pages for a service
   * @param serviceKey The service key
   * @returns Total number of pages
   */
  const totalPages = (serviceKey: string): number => {
    const games = gamesList[serviceKey] || [];
    return Math.ceil(games.length / 10);
  };

  /**
   * Go to previous page
   * @param serviceKey The service key
   */
  const previousPage = (serviceKey: string): void => {
    if (currentPage[serviceKey] > 0) {
      currentPage[serviceKey]--;
    }
  };

  /**
   * Go to next page
   * @param serviceKey The service key
   */
  const nextPage = (serviceKey: string): void => {
    if (currentPage[serviceKey] < totalPages(serviceKey) - 1) {
      currentPage[serviceKey]++;
    }
  };

  /**
   * Format playtime from minutes to hours and minutes
   * @param minutes The playtime in minutes
   * @returns Formatted playtime string
   */
  const formatPlaytime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    } else {
      return `${remainingMinutes}m`;
    }
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

  .helper-container {
    margin-left: auto;
  }

  .helper-icon {
    width: 1rem;
    height: 1rem;
    background: #e5e7eb;
    color: #6b7280;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: help;
    transition: all 0.2s ease;
  }

  .helper-icon:hover {
    background: #3b82f6;
    color: #ffffff;
    transform: scale(1.1);
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

  /* Games section styles */
  .games-section {
    margin-top: 0.75rem;
    border-top: 1px solid #e5e7eb;
    padding-top: 0.75rem;
  }

  .games-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    padding: 0.5rem 0;
    cursor: pointer;
    font-size: 0.875rem;
    color: #6b7280;
    width: 100%;
    text-align: left;
  }

  .games-toggle:hover {
    color: #374151;
  }

  .caret {
    transition: transform 0.2s ease;
    font-size: 0.75rem;
  }

  .caret.expanded {
    transform: rotate(90deg);
  }

  .games-list {
    max-height: 300px;
    overflow-y: auto;
    margin-top: 0.5rem;
    padding: 0.5rem;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
  }

  .game-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0;
    border-bottom: 1px solid #e5e7eb;
  }

  .game-row:last-child {
    border-bottom: none;
  }

  .game-checkbox {
    width: 1rem;
    height: 1rem;
    accent-color: #3b82f6;
    cursor: pointer;
  }

  .game-label {
    flex: 1;
    font-size: 0.875rem;
    color: #374151;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .playtime {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: normal;
  }

  .pagination-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.75rem;
    padding: 0.5rem;
    background: #ffffff;
    border-top: 1px solid #e5e7eb;
  }

  .pagination-button {
    padding: 0.25rem 0.75rem;
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    color: #374151;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .pagination-button:hover:not(:disabled) {
    background: #e5e7eb;
  }

  .pagination-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .page-info {
    font-size: 0.75rem;
    color: #6b7280;
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

    .games-list {
      max-height: 200px;
    }

    .pagination-controls {
      flex-direction: column;
      gap: 0.5rem;
    }

    .pagination-button {
      width: 100%;
    }
  }
</style>
