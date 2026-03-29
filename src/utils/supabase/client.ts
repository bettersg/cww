import { createClient } from '@jsr/supabase__supabase-js';
import { projectId, publicAnonKey, tenantId } from './info';
import { decodeJwt } from '../jwtHelpers';


const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey, {
  global: {
    headers: {
      'x-tenant-id': tenantId,
    },
  },
});


export const verifyUserTenant = (accessToken: string | undefined | null): boolean => {
  if (!accessToken) return false;
  const decoded = decodeJwt(accessToken);
  const userTenantIds = decoded?.app_metadata?.tenant_id;
  return !!(userTenantIds && Array.isArray(userTenantIds) && userTenantIds.includes(tenantId));
};
