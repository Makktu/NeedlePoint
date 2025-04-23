import { OPENROUTER_API_KEY } from './secrets';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

const llmTemperature = 0.2;

// Helper function to log responses to file
async function logResponseToFile(response) {
  // Only for testing
  if (Platform.OS === 'web') {
    console.log('Response logging not available on web');
    return;
  }

  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const logDir = `${FileSystem.documentDirectory}llm-logs/`;
    const logFile = `${logDir}response-${timestamp}.json`;

    // Create directory if it doesn't exist
    const dirInfo = await FileSystem.getInfoAsync(logDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(logDir, { intermediates: true });
    }

    // Write the response to file
    await FileSystem.writeAsStringAsync(
      logFile,
      JSON.stringify(response, null, 2)
    );

    console.log(`Response logged to ${logFile}`);
  } catch (error) {
    console.error('Failed to log response:', error);
  }
}

class ApiService {
  constructor() {
    this.useOpenRouter = true;
    this.localEndpoint = 'http://localhost:1234/v1/chat/completions';
    this.openRouterEndpoint = 'https://openrouter.ai/api/v1/chat/completions';
    this.defaultModel = 'deepseek/deepseek-chat-v3-0324:free';
    this.openRouterModel = 'deepseek/deepseek-chat-v3-0324:free'; // Default OpenRouter model - change when needed
  }

  // google/gemma-3-27b-it:free
  // anthropic/claude-3.5-sonnet
  // deepseek/deepseek-chat-v3-0324:free

  toggleApiSource(useOpenRouter) {
    this.useOpenRouter = useOpenRouter;
    return this.useOpenRouter;
  }

  getEndpoint() {
    return this.useOpenRouter ? this.openRouterEndpoint : this.localEndpoint;
  }

  getModel() {
    return this.useOpenRouter ? this.openRouterModel : this.defaultModel;
  }

  setLocalEndpoint(endpoint) {
    this.localEndpoint = endpoint;
  }

  setOpenRouterModel(model) {
    this.openRouterModel = model;
  }

  async sendRequest(messages, llmTemperature) {
    const endpoint = this.getEndpoint();
    const model = this.getModel();
    console.log(model);

    const headers = {
      'Content-Type': 'application/json',
    };

    // Add OpenRouter API key if using OpenRouter
    if (this.useOpenRouter) {
      headers['Authorization'] = `Bearer ${OPENROUTER_API_KEY}`;
      headers['HTTP-Referer'] =
        '[https://needlepoint.app](https://needlepoint.app)'; // Replace with your domain
      headers['X-Title'] = 'NeedlePoint'; // Optional app name for OpenRouter
    }

    // Create payload with strict model enforcement for OpenRouter
    const payload = {
      model: model,
      messages: messages,
      temperature: llmTemperature,
    };

    // Add OpenRouter-specific parameters to prevent model fallback
    if (this.useOpenRouter) {
      payload.route = 'fallback:none'; // Strict setting to prevent any fallback
      payload.transforms = ['middle-out'];
      // Force specific model only
      payload.models = [model];
    }

    // console.log('Sending payload to', endpoint);
    // console.log('Using model:', model);
    // console.log('Full payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `HTTP error: ${response.status}`
      );
    }

    const data = await response.json();

    // Verify the model used matches what we requested (for OpenRouter)
    if (this.useOpenRouter && data.model && data.model !== model) {
      // Special handling for ":free" suffix models - OpenRouter returns the model name without the suffix
      const requestedModelBase = model.split(':')[0];
      if (data.model === requestedModelBase && model.endsWith(':free')) {
        console.log(
          `Model returned without :free suffix. Requested: ${model}, Received: ${data.model}. This is acceptable.`
        );
      } else {
        console.error(
          `Model mismatch! Requested: ${model}, Received: ${data.model}`
        );
        throw new Error(
          `Model mismatch! The API used ${data.model} instead of the requested ${model}. Request aborted.`
        );
      }
    }

    // Log the response to file
    await logResponseToFile(data);

    return data;
  }

  async testConnection() {
    const endpoint = this.getEndpoint();
    const model = this.getModel();

    const headers = {
      'Content-Type': 'application/json',
    };

    // Add OpenRouter API key if using OpenRouter
    if (this.useOpenRouter) {
      headers['Authorization'] = `Bearer ${OPENROUTER_API_KEY}`;
      headers['HTTP-Referer'] = window.location.origin; // Required by OpenRouter
      headers['X-Title'] = "What's The Problem?"; // Optional app name for OpenRouter
    }

    // Create payload with strict model enforcement for OpenRouter
    const payload = {
      model: model,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello' },
      ],
      temperature: llmTemperature,
    };

    // Add OpenRouter-specific parameters to prevent model fallback
    if (this.useOpenRouter) {
      payload.route = 'fallback:none'; // Strict setting to prevent any fallback
      payload.transforms = ['middle-out'];
      // Force specific model only
      payload.models = [model];
    }

    // console.log('Testing connection with model:', model);
    // console.log('Full payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `HTTP error: ${response.status}`
      );
    }

    const data = await response.json();

    // Verify the model used matches what we requested (for OpenRouter)
    if (this.useOpenRouter && data.model && data.model !== model) {
      // Special handling for ":free" suffix models - OpenRouter returns the model name without the suffix
      const requestedModelBase = model.split(':')[0];
      if (data.model === requestedModelBase && model.endsWith(':free')) {
        console.log(
          `Model returned without :free suffix. Requested: ${model}, Received: ${data.model}. This is acceptable.`
        );
      } else {
        console.error(
          `Model mismatch! Requested: ${model}, Received: ${data.model}`
        );
        throw new Error(
          `Model mismatch! The API used ${data.model} instead of the requested ${model}. Request aborted.`
        );
      }
    }

    return data;
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
