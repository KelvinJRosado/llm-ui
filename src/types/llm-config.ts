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
 * Default configuration values
 */
export const DEFAULT_LLM_CONFIG: LLMConfig = {
  model: 'llama3.2',
  temperature: 0.7,
  apiKey: '',
};
