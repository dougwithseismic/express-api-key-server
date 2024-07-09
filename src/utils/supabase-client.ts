// @@filename: src/utils/supabase-client.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from '../config/logger';

let supabase: SupabaseClient;

export const initSupabase = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    logger.error('Supabase URL or Key is missing');
    process.exit(1);
  }

  supabase = createClient(supabaseUrl, supabaseKey);
  logger.info('Supabase client initialized');
};

export const getSupabase = (): SupabaseClient => {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }
  return supabase;
};
