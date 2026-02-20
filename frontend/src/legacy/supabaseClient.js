import { createClient } from '@supabase/supabase-js';

// 1. Load variables using Vite's "import.meta.env" (NOT process.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. Safety check to ensure they are loaded
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase variables are missing! Check your .env file.');
}

// 3. Initialize and Export
export const supabase = createClient(supabaseUrl, supabaseAnonKey);