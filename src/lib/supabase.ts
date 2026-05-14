import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cjzwbyxnbvwiautcznxl.supabase.co';
const supabaseAnonKey = 'sb_publishable_fhpFLO9TKaz4GPNtJk0WLw_T-_Vp9rD';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
