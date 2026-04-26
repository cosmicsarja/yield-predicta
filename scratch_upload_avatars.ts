import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://defurrurcwefokbbbknz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlZnVycnVyY3dlZm9rYmJia256Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMjg1OTIsImV4cCI6MjA5MTkwNDU5Mn0.qrZrXtdTjsxug7x7hMZLm47fjc87CwT-H6ZZThaPtHw";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testUpload() {
  const fileBody = new Blob(["test"], { type: 'text/plain' });
  const { data, error } = await supabase.storage.from('avatars').upload('test.txt', fileBody, { upsert: true });
  console.log("Upload Data:", data);
  console.log("Upload Error:", error);
}

testUpload();
