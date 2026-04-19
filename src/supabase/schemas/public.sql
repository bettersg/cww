-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

-- Create the mapping table in public schema
CREATE TABLE IF NOT EXISTS public.user_schema_mapping (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    schema_name TEXT NOT NULL,
    PRIMARY KEY (user_id, schema_name)
);

-- Function to support auth multitenancy
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb 
LANGUAGE plpgsql 
STABLE
AS $$
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
$$;

ALTER FUNCTION public.custom_access_token_hook(jsonb) SECURITY DEFINER;

-- Enable RLS on the mapping table (so only admins or the user themselves can see it)
ALTER TABLE public.user_schema_mapping ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own schema mappings"
ON public.user_schema_mapping
FOR SELECT 
TO authenticated 
USING ( (select auth.uid()) = user_id );
