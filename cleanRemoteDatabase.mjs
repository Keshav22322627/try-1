import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://srpvpyfhyikryidqihhh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNycHZweWZoeWlrcnlpZHFpaGhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1MDE5NDMsImV4cCI6MjEwMzA3Nzk0M30.vUZVK82-QyJ1OZGvxfyXAsM0ykT9PDFkXAjgVEIx5zc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function cleanAndSeedRemoteDatabase() {
  console.log('=== CLEANING ALL ROWS IN REMOTE SUPABASE DATABASE ===');

  // 1. Delete orders
  const { error: err1 } = await supabase.from('orders').delete().neq('id', 'NONE');
  console.log('Orders cleared:', err1 ? err1.message : 'OK');

  // 2. Delete payments if table exists
  try {
    await supabase.from('payments').delete().neq('id', 'NONE');
    console.log('Payments cleared');
  } catch (e) {
    console.log('Payments delete note:', e.message);
  }

  // 3. Delete complaints if table exists
  try {
    await supabase.from('complaints').delete().neq('id', 'NONE');
    console.log('Complaints cleared');
  } catch (e) {
    console.log('Complaints delete note:', e.message);
  }

  // 4. Delete existing users
  const { error: errUsersDel } = await supabase.from('users').delete().neq('id', 'NONE');
  console.log('Users cleared:', errUsersDel ? errUsersDel.message : 'OK');

  console.log('Target Admin Email: mr.k22322627@gmail.com');
  console.log('=== CLEANUP COMPLETE ===');
}

cleanAndSeedRemoteDatabase().catch(console.error);
