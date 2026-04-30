import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bxhlkgrdiscnytusqfmd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4aGxrZ3JkaXNjbnl0dXNxZm1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0ODgyNTIsImV4cCI6MjA5MzA2NDI1Mn0.HEh-ECnbPxpqXT0naAIeCoIoyJNjlMWL9qQbni89MbE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
