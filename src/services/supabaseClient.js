// India Hyundai Power - PostgreSQL / Supabase Client Connector

import { createClient } from '@supabase/supabase-js';

const env = (typeof import.meta !== 'undefined' && import.meta.env) || {};

const SUPABASE_URL = env.VITE_SUPABASE_URL || 'https://srpvpyfhyikryidqihhh.supabase.co';
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNycHZweWZoeWlrcnlpZHFpaGhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1MDE5NDMsImV4cCI6MjEwMzA3Nzk0M30.vUZVK82-QyJ1OZGvxfyXAsM0ykT9PDFkXAjgVEIx5zc';

export const isPostgreSQLConfigured = Boolean(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes('your-supabase-project')
);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
