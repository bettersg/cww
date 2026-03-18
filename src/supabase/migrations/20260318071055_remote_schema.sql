CREATE INDEX kv_store_991766ee_key_idx1 ON public.kv_store_991766ee USING btree (key text_pattern_ops)
CREATE INDEX kv_store_991766ee_key_idx2 ON public.kv_store_991766ee USING btree (key text_pattern_ops)
CREATE INDEX kv_store_991766ee_key_idx3 ON public.kv_store_991766ee USING btree (key text_pattern_ops)
create policy "Enable Update policy"
  on "public"."kv_store_991766ee"
  as permissive
  for all
  to authenticated
using (true)
with check (true)
create policy "Enable read access for all users"
  on "public"."kv_store_991766ee"
  as permissive
  for select
  to authenticated
using (true)
