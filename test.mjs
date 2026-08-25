import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://srpvpyfhyikryidqihhh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNycHZweWZoeWlrcnlpZHFpaGhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1MDE5NDMsImV4cCI6MjEwMzA3Nzk0M30.vUZVK82-QyJ1OZGvxfyXAsM0ykT9PDFkXAjgVEIx5zc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function test() {
  console.log('--- SUPABASE TEST ---');
  const u = await supabase.from('users').select('*');
  console.log('USERS:', u.data?.length, u.error);

  const o = await supabase.from('orders').select('*');
  console.log('ORDERS:', o.data?.length, o.error);

  const p = await supabase.from('products').select('*');
  console.log('PRODUCTS:', p.data?.length, p.error);
}

test().catch(console.error);
