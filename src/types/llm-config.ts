/**
 * Configuration interface for LLM requests
 * This interface should match the server-side LLMConfig
 */
export interface LLMConfig {
  /** The model to use for the request */
  model?: string;
  /** Temperature setting for response creativity (0.5-0.95) */
  temperature?: number;
  /** API key if required */
  apiKey?: string;
}

/**
 * Interface for gaming service integrations
 * This interface should match the server-side GameIntegration
 */
export interface GameIntegration {
  service: 'steam' | 'epic' | 'playstation' | 'xbox';
  username: string;
  connectedAt: string;
}

/**
 * Request payload for integration endpoint
 */
export interface IntegrationRequest {
  userId: string;
  service: string;
  username: string;
}

/**
 * Response from integration endpoint
 */
export interface IntegrationResponse {
  message: string;
  integration: GameIntegration;
}

/**
 * Default configuration values
 */
export const DEFAULT_LLM_CONFIG: LLMConfig = {
  model: 'llama3.2',
  temperature: 0.7,
  apiKey: '',
};
