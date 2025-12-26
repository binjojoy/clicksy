import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = "https://nsjovdsmratfqdmzetdg.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zam92ZHNtcmF0ZnFkbXpldGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NTc2MTUsImV4cCI6MjA3NTQzMzYxNX0.8hFneGiRFHspwDIurbeZzwbyCJSx8Nbu7mh7oDcPRJM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);