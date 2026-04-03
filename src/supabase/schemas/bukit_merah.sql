-- Create the new schema
CREATE SCHEMA IF NOT EXISTS bukit_merah;

-- Grant usage on the new schema
GRANT USAGE ON SCHEMA bukit_merah TO anon, authenticated, service_role;

-- Grant privileges for tables, routines, and sequences (existing and future)
GRANT ALL ON ALL TABLES IN SCHEMA bukit_merah TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA bukit_merah GRANT ALL ON TABLES TO anon, authenticated, service_role;

-- Create the key value store table
CREATE TABLE IF NOT EXISTS bukit_merah.kv_store_991766ee (
  key text NOT NULL,
  value jsonb NOT NULL,
  CONSTRAINT kv_store_991766ee_pkey PRIMARY KEY (key)
);

CREATE INDEX bukit_merah_kv_store_idx ON bukit_merah.kv_store_991766ee USING btree (key text_pattern_ops);

ALTER TABLE bukit_merah.kv_store_991766ee ENABLE ROW LEVEL SECURITY;

-- Policies for the new table
CREATE POLICY "Users can only access their assigned schemas"
ON bukit_merah.kv_store_991766ee
FOR ALL
USING (
    (auth.jwt() -> 'app_metadata' -> 'tenant_id')::jsonb ? 'bukit_merah'
);
