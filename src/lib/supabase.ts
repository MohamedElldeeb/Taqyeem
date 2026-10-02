import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yqghkumzazhppkqrvtfa.supabase.co'
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_lnvhklN0xwVfi4yS2Fud4w_z3SOqgTG'

export const supabase = createClient(supabaseUrl, supabasePublishableKey)
