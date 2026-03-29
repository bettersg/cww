create extension if not exists "pg_net" with schema "extensions";

  create table "public"."user_schema_mapping" (
    "user_id" uuid not null,
    "schema_name" text not null
      );


alter table "public"."user_schema_mapping" enable row level security;

CREATE UNIQUE INDEX user_schema_mapping_pkey ON public.user_schema_mapping USING btree (user_id, schema_name);

alter table "public"."user_schema_mapping" add constraint "user_schema_mapping_pkey" PRIMARY KEY using index "user_schema_mapping_pkey";

alter table "public"."user_schema_mapping" add constraint "user_schema_mapping_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_schema_mapping" validate constraint "user_schema_mapping_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
DECLARE
  claims jsonb;
  _user_id uuid;
  tenant_list text[];
BEGIN
  -- Extract user ID from the event payload
  _user_id := (event->>'user_id')::uuid;

  -- Fetch the list of schemas for this user
  SELECT array_agg(schema_name) INTO tenant_list
  FROM public.user_schema_mapping 
  WHERE user_id = _user_id;

  -- Get existing claims
  claims := event->'claims';

  -- Inject tenant_id into app_metadata within the claims
  claims := jsonb_set(
    claims,
    '{app_metadata,tenant_id}',
    (array_to_json(COALESCE(tenant_list, '{}'::text[])))::jsonb
  );

  -- Return the modified claims
  RETURN jsonb_build_object('claims', claims);
END;
$function$
;

grant delete on table "public"."user_schema_mapping" to "anon";

grant insert on table "public"."user_schema_mapping" to "anon";

grant references on table "public"."user_schema_mapping" to "anon";

grant select on table "public"."user_schema_mapping" to "anon";

grant trigger on table "public"."user_schema_mapping" to "anon";

grant truncate on table "public"."user_schema_mapping" to "anon";

grant update on table "public"."user_schema_mapping" to "anon";

grant delete on table "public"."user_schema_mapping" to "authenticated";

grant insert on table "public"."user_schema_mapping" to "authenticated";

grant references on table "public"."user_schema_mapping" to "authenticated";

grant select on table "public"."user_schema_mapping" to "authenticated";

grant trigger on table "public"."user_schema_mapping" to "authenticated";

grant truncate on table "public"."user_schema_mapping" to "authenticated";

grant update on table "public"."user_schema_mapping" to "authenticated";

grant delete on table "public"."user_schema_mapping" to "service_role";

grant insert on table "public"."user_schema_mapping" to "service_role";

grant references on table "public"."user_schema_mapping" to "service_role";

grant select on table "public"."user_schema_mapping" to "service_role";

grant trigger on table "public"."user_schema_mapping" to "service_role";

grant truncate on table "public"."user_schema_mapping" to "service_role";

grant update on table "public"."user_schema_mapping" to "service_role";


  create policy "Users can view their own schema mappings"
  on "public"."user_schema_mapping"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));
