import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://srpvpyfhyikryidqihhh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNycHZweWZoeWlrcnlpZHFpaGhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1MDE5NDMsImV4cCI6MjEwMzA3Nzk0M30.vUZVK82-QyJ1OZGvxfyXAsM0ykT9PDFkXAjgVEIx5zc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function inspectAllDatabaseTables() {
  console.log('--- SUPABASE DATABASE INSPECTION ---');

  // Check users table
  const { data: users, error: usersErr } = await supabase.from('users').select('*');
  console.log('\n[USERS TABLE]:', usersErr ? `Error: ${usersErr.message}` : `Count: ${users?.length}`);
  if (users && users.length > 0) {
    console.log(users);
  }

  // Check roles table
  const { data: roles, error: rolesErr } = await supabase.from('roles').select('*');
  console.log('\n[ROLES TABLE]:', rolesErr ? `Error: ${rolesErr.message}` : `Count: ${roles?.length}`);
  if (roles && roles.length > 0) {
    console.log(roles);
  }

  // Check products table
  const { data: products, error: prodErr } = await supabase.from('products').select('*');
  console.log('\n[PRODUCTS TABLE]:', prodErr ? `Error: ${prodErr.message}` : `Count: ${products?.length}`);

  // Check orders table
  const { data: orders, error: orderErr } = await supabase.from('orders').select('*');
  console.log('\n[ORDERS TABLE]:', orderErr ? `Error: ${orderErr.message}` : `Count: ${orders?.length}`);
}

inspectAllDatabaseTables().catch(console.error);
