create schema if not exists "bukit_merah";


create table "bukit_merah"."kv_store_991766ee" (
"key" text not null,
"value" jsonb not null
);


alter table "bukit_merah"."kv_store_991766ee" enable row level security;

CREATE INDEX bukit_merah_kv_store_idx ON bukit_merah.kv_store_991766ee USING btree (key text_pattern_ops);

CREATE UNIQUE INDEX kv_store_991766ee_pkey ON bukit_merah.kv_store_991766ee USING btree (key);

alter table "bukit_merah"."kv_store_991766ee" add constraint "kv_store_991766ee_pkey" PRIMARY KEY using index "kv_store_991766ee_pkey";

grant delete on table "bukit_merah"."kv_store_991766ee" to "anon";

grant insert on table "bukit_merah"."kv_store_991766ee" to "anon";

grant references on table "bukit_merah"."kv_store_991766ee" to "anon";

grant select on table "bukit_merah"."kv_store_991766ee" to "anon";

grant trigger on table "bukit_merah"."kv_store_991766ee" to "anon";

grant truncate on table "bukit_merah"."kv_store_991766ee" to "anon";

grant update on table "bukit_merah"."kv_store_991766ee" to "anon";

grant delete on table "bukit_merah"."kv_store_991766ee" to "authenticated";

grant insert on table "bukit_merah"."kv_store_991766ee" to "authenticated";

grant references on table "bukit_merah"."kv_store_991766ee" to "authenticated";

grant select on table "bukit_merah"."kv_store_991766ee" to "authenticated";

grant trigger on table "bukit_merah"."kv_store_991766ee" to "authenticated";

grant truncate on table "bukit_merah"."kv_store_991766ee" to "authenticated";

grant update on table "bukit_merah"."kv_store_991766ee" to "authenticated";

grant delete on table "bukit_merah"."kv_store_991766ee" to "service_role";

grant insert on table "bukit_merah"."kv_store_991766ee" to "service_role";

grant references on table "bukit_merah"."kv_store_991766ee" to "service_role";

grant select on table "bukit_merah"."kv_store_991766ee" to "service_role";

grant trigger on table "bukit_merah"."kv_store_991766ee" to "service_role";

grant truncate on table "bukit_merah"."kv_store_991766ee" to "service_role";

grant update on table "bukit_merah"."kv_store_991766ee" to "service_role";


create policy "Users can only access their assigned schemas"
on "bukit_merah"."kv_store_991766ee"
as permissive
for all
to public
using ((((auth.jwt() -> 'app_metadata'::text) -> 'tenant_id'::text) ? 'bukit_merah'::text));
