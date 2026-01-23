import { projectId } from '../../utils/supabase/info';
import { supabase } from '../../utils/supabase/client';

export const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-991766ee`;

/**
 * Get standard headers for API requests
 * Includes Content-Type and Authorization with user access token
 */
export const getHeaders = async (): Promise<HeadersInit> => {
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;

  if (!accessToken) {
    throw new Error('No active session found. Please log in.');
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  };
};

/**
 * Check if the API server is healthy and user is authenticated
 */
export async function checkServerHealth(): Promise<boolean> {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers,
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
    const headers = await getHeaders();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
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