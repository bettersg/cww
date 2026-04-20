-- Create the new schema
CREATE SCHEMA IF NOT EXISTS clementi;

-- Grant usage on the new schema
GRANT USAGE ON SCHEMA clementi TO anon, authenticated, service_role;

-- Grant privileges for tables, routines, and sequences (existing and future)
GRANT ALL ON ALL TABLES IN SCHEMA clementi TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA clementi GRANT ALL ON TABLES TO anon, authenticated, service_role;

-- Create the key value store table
CREATE TABLE IF NOT EXISTS clementi.kv_store_991766ee (
  key text NOT NULL,
  value jsonb NOT NULL,
  CONSTRAINT kv_store_991766ee_pkey PRIMARY KEY (key)
);

CREATE INDEX clementi_kv_store_idx ON clementi.kv_store_991766ee USING btree (key text_pattern_ops);

ALTER TABLE clementi.kv_store_991766ee ENABLE ROW LEVEL SECURITY;

-- Policies for the new table
CREATE POLICY "Users can only access their assigned schemas"
ON clementi.kv_store_991766ee
FOR ALL
USING (
    (auth.jwt() -> 'app_metadata' -> 'tenant_id')::jsonb ? 'clementi'
);
