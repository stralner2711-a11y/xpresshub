import { createClient } from '@supabase/supabase-js';

if (!globalThis.supabase?.createClient) {
  const clients = new Map();
  globalThis.supabase = {
    createClient(url, key, options = {}) {
      const cacheKey = `${String(url || '').trim()}|${String(key || '')}`;
      if (!clients.has(cacheKey)) clients.set(cacheKey, createClient(url, key, options));
      return clients.get(cacheKey);
    },
  };
}
