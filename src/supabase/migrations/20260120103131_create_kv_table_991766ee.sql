-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.kv_store_991766ee (
  key text NOT NULL,
  value jsonb NOT NULL,
  CONSTRAINT kv_store_991766ee_pkey PRIMARY KEY (key)
);