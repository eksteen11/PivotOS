import { notFound } from 'next/navigation'

import { ProcessDetailClient } from '@/components/processes/ProcessDetailClient'
import { createClient } from '@/lib/supabase/server'
import type { Process, ProcessStep } from '@/lib/types/database'

export default async function ProcessDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sb = await createClient()
  const { data } = await sb
    .from('processes')
    .select('*, agents(name), entities(slug,name), process_steps(*)')
    .eq('id', id)
    .maybeSingle()

  if (!data) notFound()
  const process = data as Process
  const steps = ([...(process.process_steps ?? [])] as ProcessStep[]).sort((a, b) => a.sort_order - b.sort_order)

  return <ProcessDetailClient process={process} steps={steps} />
}
