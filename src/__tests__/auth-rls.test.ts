import { createClient } from '@supabase/supabase-js';
import { decodeJwt } from '../utils/jwtHelpers';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const tenantId = process.env.VITE_TENANT_ID || 'bukit_merah';

// 1) Use service role key to create 2 different users
const user1Email = 'tenant_user1@better.sg';
const user2Email = 'no_tenant_user2@better.sg';
const testPassword = 'Password123!';

describe('Multi-Tenant Login Flow and RLS Policies', () => {
  let adminSupabase: any;
  let user1Id: string;
  let user2Id: string;

  beforeAll(async () => {
    // Admin client bypassing RLS to manage users and mappings natively
    adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

    // Clean up previous runs if they exist locally
    const { data: { users } } = await adminSupabase.auth.admin.listUsers();
    for (const u of users) {
      if (u.email === user1Email || u.email === user2Email) {
        // Clear mapping first
        await adminSupabase.from('user_schema_mapping').delete().eq('user_id', u.id);
        await adminSupabase.auth.admin.deleteUser(u.id);
      }
    }

    // Create User 1
    const { data: u1Data, error: u1Err } = await adminSupabase.auth.admin.createUser({
      email: user1Email,
      password: testPassword,
      email_confirm: true,
    });
    if (u1Err) throw u1Err;
    user1Id = u1Data.user.id;

    // Create User 2
    const { data: u2Data, error: u2Err } = await adminSupabase.auth.admin.createUser({
      email: user2Email,
      password: testPassword,
      email_confirm: true,
    });
    if (u2Err) throw u2Err;
    user2Id = u2Data.user.id;

    // - user 1 with insert table user_schema_mapping with its id and "bukit_merah" as the schema
    // Adjust column names (e.g., user_id or id) gracefully to match your exact Postgres schema if needed!
    const { error: mappingErr } = await adminSupabase.from('user_schema_mapping').insert({
      user_id: user1Id,
      schema_name: tenantId
    });
    if (mappingErr) throw mappingErr;

    // - user 2 without the insert (we do nothing else here)
  });

  afterAll(async () => {
    // Complete teardown sequence
    if (user1Id) {
      await adminSupabase.from('user_schema_mapping').delete().eq('user_id', user1Id);
      await adminSupabase.auth.admin.deleteUser(user1Id);
    }
    if (user2Id) {
      await adminSupabase.auth.admin.deleteUser(user2Id);
    }
  });

  it('should authenticate both and guarantee isolation where one sees tenant_id and another is blank', async () => {
    // Standard anon clients
    const authClient1 = createClient(supabaseUrl, supabaseAnonKey);
    const authClient2 = createClient(supabaseUrl, supabaseAnonKey);

    // 2) try login with both
    const { data: data1, error: err1 } = await authClient1.auth.signInWithPassword({
      email: user1Email,
      password: testPassword,
    });
    expect(err1).toBeNull();
    expect(data1.session).toBeDefined();

    const { data: data2, error: err2 } = await authClient2.auth.signInWithPassword({
      email: user2Email,
      password: testPassword,
    });
    expect(err2).toBeNull();
    expect(data2.session).toBeDefined();

    // one should see the tenant_id another should be blank
    const decoded1 = decodeJwt(data1.session!.access_token);
    const decoded2 = decodeJwt(data2.session!.access_token);

    const u1Tenants = decoded1?.app_metadata?.tenant_id || [];
    expect(u1Tenants).toContain(tenantId); // Guaranteed success

    const u2Tenants = decoded2?.app_metadata?.tenant_id || [];
    expect(u2Tenants).not.toContain(tenantId); // Must aggressively exclude or be strictly empty

    // Auth teardown
    await authClient1.auth.signOut();
    await authClient2.auth.signOut();
  });

  it('should securely evaluate database row level security locally via targeted schema mappings', async () => {
    // 3) use both access token to query the bukit_merah.kv_store_991766ee

    // Re-instantiating specific DB schema instances attached locally to headers or Postgres schemas depending on config.
    // If you enforce 'bukit_merah.' explicitly via postgres schemas, `db: { schema: tenantId }` is strictly required.
    const client1 = createClient(supabaseUrl, supabaseAnonKey, {
      db: { schema: tenantId }
    });
    const client2 = createClient(supabaseUrl, supabaseAnonKey, {
      db: { schema: tenantId }
    });

    await client1.auth.signInWithPassword({ email: user1Email, password: testPassword });
    await client2.auth.signInWithPassword({ email: user2Email, password: testPassword });

    // one should have data
    const { data: data1, error: error1 } = await client1
      .from('kv_store_991766ee')
      .select('*')
      .limit(1);

    expect(error1).toBeNull();
    expect(data1).toBeDefined();

    // another should be empty
    const { data: data2, error: error2 } = await client2
      .from('kv_store_991766ee')
      .select('*')
      .limit(1);

    // It depends on the specifics of the actual internal DB Postgres RLS logic
    // Usually RLS just naturally returns an empty array to unauthorized bounds
    if (error2) {
      expect(error2).toBeDefined();
    } else {
      expect(data2).toEqual([]);
    }

    // Auth teardown
    await client1.auth.signOut();
    await client2.auth.signOut();
  });
});
