import { supabase } from '../supabase/client'

export type AiCaptureResult = {
  tasks: { title: string; entity_slug?: string; division_slug?: string | null; due_at?: string | null; priority?: number }[]
  notes?: string[]
}

export type AiDailyPlanResult = {
  top3: string[]
  blocks: { label: string; minutes: number }[]
}

export async function aiCaptureToStructure(input: { text: string }) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.functions.invoke('ai-capture-structure', { body: input })
  if (error) throw error
  return data as AiCaptureResult
}

export async function aiBuildDailyPlan(input: { context: string; tasks: { title: string }[] }) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.functions.invoke('ai-daily-plan', { body: input })
  if (error) throw error
  return data as AiDailyPlanResult
}

