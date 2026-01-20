/**
 * API Client Configuration
 * Base configuration for all API requests to Supabase Edge Functions
 */

import { projectId, publicAnonKey } from '../../utils/supabase/info';

export const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-991766ee`;

/**
 * Get standard headers for API requests
 * Includes Content-Type and Authorization with public anon key
 */
export const getHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
});

/**
 * Check if the API server is healthy
 */
export async function checkServerHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return response.ok;
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
}

/**
 * Generic API request handler with error handling
 * @param endpoint - API endpoint path
 * @param options - Fetch options
 * @returns Parsed JSON response
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `API request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // Check if it's a network error (server not responding)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error(`API Error [${endpoint}]: Server not responding. The Supabase Edge Function may not be deployed.`);
      throw new Error('Server not responding. Please ensure the Supabase Edge Function is deployed.');
    }
    
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}