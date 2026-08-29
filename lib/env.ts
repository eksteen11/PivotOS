export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const hasSupabaseEnv = Boolean(supabaseUrl && supabaseAnonKey)

export const openaiApiKey = process.env.OPENAI_API_KEY ?? ''
export const openaiModel = process.env.OPENAI_MODEL ?? 'gpt-4o-mini'
export const hasOpenaiEnv = Boolean(openaiApiKey)

export const pivotEnv =
  process.env.PIVOT_ENV || process.env.VERCEL_ENV || process.env.NODE_ENV || 'local'

export const isProduction = pivotEnv === 'production'
