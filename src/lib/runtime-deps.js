import { createClient } from '@supabase/supabase-js';

if (!globalThis.supabase?.createClient) {
  globalThis.supabase = { createClient };
}
