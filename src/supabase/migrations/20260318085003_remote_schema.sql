alter table "public"."kv_store_991766ee" enable row level security;
CREATE INDEX kv_store_991766ee_key_idx ON public.kv_store_991766ee USING btree (key text_pattern_ops);
