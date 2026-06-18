'use client'

import { useState } from 'react'

import { AgentAiSpark } from '@/components/agents/AgentAiSpark'
import { AgentFactoryWizard } from '@/components/agents/AgentFactoryWizard'
import type { GeneratedAgent } from '@/lib/ai/generateAgent'
import type { Entity } from '@/lib/types/database'

type Suggestion = {
  title: string
  description: string
  preset?: { name: string; role: string; slug: string }
}

type Props = {
  entities: Entity[]
  suggestion?: Suggestion
}

export function AgentFactoryShell({ entities, suggestion }: Props) {
  const [aiDraft, setAiDraft] = useState<GeneratedAgent | null>(null)

  return (
    <div className="space-y-6">
      <AgentAiSpark entities={entities} onGenerated={setAiDraft} />
      {aiDraft ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-sm text-emerald-950">
          <p className="font-medium">AI designed: {aiDraft.name}</p>
          {aiDraft.tools.length > 0 ? (
            <p className="mt-1 text-emerald-900/80">Tools: {aiDraft.tools.join(', ')}</p>
          ) : null}
          {aiDraft.first_actions.length > 0 ? (
            <ul className="mt-2 list-inside list-disc text-emerald-900/80">
              {aiDraft.first_actions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
      <AgentFactoryWizard
        entities={entities}
        suggestion={suggestion}
        aiDraft={aiDraft}
        onClearAi={() => setAiDraft(null)}
      />
    </div>
  )
}
