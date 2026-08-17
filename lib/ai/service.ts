import { hasOpenaiEnv, openaiApiKey, openaiModel } from '@/lib/env'

export type AiRisk = 'low' | 'medium' | 'high' | 'critical'

export type AiRecommendation = {
  kind: 'classify' | 'draft' | 'recommend' | 'agent_spec'
  title: string
  summary: string
  reason: string
  sourceContext: string[]
  confidence: number
  risk: AiRisk
  requiresApproval: boolean
  nextAction: string
  payload: Record<string, unknown>
}

export type AiService = {
  classifyInboxItem(input: {
    title: string
    content: string
    source: string | null
    entitySlug?: string | null
  }): Promise<AiRecommendation>
  generateAgentSpec(input: {
    brief: string
    entityNames: string[]
    memoryHints?: string[]
  }): Promise<AiRecommendation>
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 32)
}

export const mockAiService: AiService = {
  async classifyInboxItem({ title, content, source, entitySlug }) {
    const text = `${title} ${content}`.toLowerCase()
    const isWhatsapp = (source ?? '').includes('whatsapp') || text.includes('whatsapp')
    const isProperty = /viewing|listing|property|otp|mandate|buyer|seller/.test(text)
    const isFeed = /maize|mielies|koring|feed|safex|quote|ton/.test(text)
    const isLivestock = /cattle|bonsmara|limousin|livestock|gaankyk|gaan kyk/.test(text)
    const isFinance = /invoice|payment|remittance|vat|xero|sage|debtor/.test(text)
    const isIdea = /idea|venture|opportunity|incubator/.test(text)

    let suggested_process = 'follow_up'
    let suggested_agent = 'executive_assistant'
    let entity = entitySlug ?? 'dj'
    let urgency: 'low' | 'normal' | 'high' = 'normal'
    let nextAction = 'Create follow-up task'

    if (isLivestock) {
      suggested_process = 'lead'
      suggested_agent = 'livestock'
      entity = 'digikraal'
      urgency = 'high'
      nextAction = 'Open livestock lead process'
    } else if (isFeed) {
      suggested_process = 'quote'
      suggested_agent = 'quote'
      entity = 'farm_feed'
      urgency = 'high'
      nextAction = 'Start Farm Feed quote process'
    } else if (isProperty) {
      suggested_process = 'listing'
      suggested_agent = 'property'
      entity = 'northpoint'
      urgency = 'high'
      nextAction = 'Create viewing / listing process'
    } else if (isFinance) {
      suggested_process = 'finance'
      suggested_agent = 'finance'
      entity = 'digikraal'
      urgency = 'high'
      nextAction = 'Prepare finance follow-up for approval'
    } else if (isIdea) {
      suggested_process = 'follow_up'
      suggested_agent = 'ceo'
      entity = 'digikraal'
      nextAction = 'Route to Opportunity Lab'
    } else if (isWhatsapp) {
      suggested_process = 'lead'
      suggested_agent = 'sales'
      entity = 'digikraal'
      urgency = 'high'
      nextAction = 'Draft WhatsApp reply for approval'
    }

    return {
      kind: 'classify',
      title: 'Inbox classification ready',
      summary: `Route as ${suggested_process} to ${suggested_agent}`,
      reason: 'Matched keywords, source channel, and entity patterns from the founder knowledge base.',
      sourceContext: [source ?? 'manual', title.slice(0, 80)],
      confidence: 0.86,
      risk: urgency === 'high' ? 'medium' : 'low',
      requiresApproval: false,
      nextAction,
      payload: {
        suggested_process,
        suggested_agent,
        urgency,
        entity_slug: entity,
      },
    }
  },

  async generateAgentSpec({ brief, entityNames, memoryHints }) {
    const name = brief.split(/[.!?\n]/)[0]?.trim().slice(0, 48) || 'Operations Agent'
    const slug = slugify(name) || 'operations_agent'
    return {
      kind: 'agent_spec',
      title: 'Agent specification drafted',
      summary: `Create ${name} for ${entityNames[0] ?? 'your business'}`,
      reason: 'Deterministic mock AI used because no live model is required for the demo.',
      sourceContext: [brief.slice(0, 120), ...(memoryHints ?? []).slice(0, 2)],
      confidence: 0.9,
      risk: 'low',
      requiresApproval: true,
      nextAction: 'Review and create agent',
      payload: {
        name,
        role: 'Specialist',
        slug,
        job_description: `${name} supports ${entityNames.join(', ') || 'Pivot OS'} by preparing work, drafting communications, and escalating risky actions for founder approval.`,
        tools: ['Gmail', 'WhatsApp', 'Calendar'],
        first_actions: ['Review inbox', 'Draft next actions', 'Queue approvals'],
      },
    }
  },
}

export async function getAiService(): Promise<AiService> {
  if (!hasOpenaiEnv) return mockAiService

  return {
    async classifyInboxItem(input) {
      try {
        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: openaiModel,
            temperature: 0.1,
            response_format: { type: 'json_object' },
            messages: [
              {
                role: 'system',
                content: 'Classify founder inbox items for Pivot OS. Return JSON only: suggested_process, suggested_agent, urgency (low|normal|high), entity_slug, summary, reason, nextAction, confidence (0-1).',
              },
              {
                role: 'user',
                content: JSON.stringify(input),
              },
            ],
          }),
        })
        if (!resp.ok) return mockAiService.classifyInboxItem(input)
        const raw = await resp.json()
        const content = raw?.choices?.[0]?.message?.content
        const parsed = typeof content === 'string' ? JSON.parse(content) as Record<string, unknown> : {}
        const fallback = await mockAiService.classifyInboxItem(input)
        return {
          ...fallback,
          summary: String(parsed.summary ?? fallback.summary),
          reason: String(parsed.reason ?? fallback.reason),
          nextAction: String(parsed.nextAction ?? fallback.nextAction),
          confidence: typeof parsed.confidence === 'number' ? parsed.confidence : fallback.confidence,
          payload: {
            ...fallback.payload,
            suggested_process: parsed.suggested_process ?? fallback.payload.suggested_process,
            suggested_agent: parsed.suggested_agent ?? fallback.payload.suggested_agent,
            urgency: parsed.urgency ?? fallback.payload.urgency,
            entity_slug: parsed.entity_slug ?? fallback.payload.entity_slug,
            source: 'openai',
          },
        }
      } catch {
        return mockAiService.classifyInboxItem(input)
      }
    },
    generateAgentSpec: mockAiService.generateAgentSpec,
  }
}
