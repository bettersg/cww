import { createClient } from '@jsr/supabase__supabase-js';
import { projectId, publicAnonKey, tenantId } from './info';

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey, {
  global: {
    headers: {
      'x-tenant-id': tenantId,
    },
  },
});

export const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const verifyUserTenant = (accessToken: string | undefined | null): boolean => {
  if (!accessToken) return false;
  const decoded = decodeJwt(accessToken);
  const userTenantIds = decoded?.app_metadata?.tenant_id;
  return !!(userTenantIds && Array.isArray(userTenantIds) && userTenantIds.includes(tenantId));
};
