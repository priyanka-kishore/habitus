import { createClient } from '@supabase/supabase-js'
import { mockService } from './mock-service'

// Flag to determine whether to use mock data
const USE_MOCK = true; // Set this to false when Supabase is back up

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Export either the real Supabase client or our mock service
export const supabase = USE_MOCK ? mockService : supabaseClient;
