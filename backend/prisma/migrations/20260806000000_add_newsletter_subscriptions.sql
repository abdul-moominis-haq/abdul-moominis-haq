-- Migration: add newsletter_subscriptions table
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  confirmed boolean DEFAULT false NOT NULL,
  confirmation_token text,
  confirmed_at timestamptz,
  unsubscribed boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscriptions (email);

-- Ensure extension for gen_random_uuid() exists (pgcrypto)
CREATE EXTENSION IF NOT EXISTS pgcrypto;
