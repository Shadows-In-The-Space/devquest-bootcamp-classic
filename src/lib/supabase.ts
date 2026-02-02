import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = 'https://gvnbviydepkogzyjpqwe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2bmJ2aXlkZXBrb2d6eWpwcXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyMjU1MjgsImV4cCI6MjA4MzgwMTUyOH0.s29Fbw74sa48Pdl_y2lie0vomz_4fWka1mDw0kMueJU';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
