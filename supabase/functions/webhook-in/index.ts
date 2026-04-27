import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

type Input = {
  user_id: string
  text: string
  entity_slug?: string
  division_slug?: string | null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const expected = Deno.env.get('WEBHOOK_IN_TOKEN')
    const auth = req.headers.get('Authorization') ?? ''
    if (!expected || auth !== `Bearer ${expected}`) return json({ error: 'Unauthorized' }, 401)

    const url = Deno.env.get('SUPABASE_URL')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!url || !serviceKey) return json({ error: 'Missing Supabase env' }, 500)

    const admin = createClient(url, serviceKey, { auth: { persistSession: false } })

    const body = (await req.json()) as Input
    const userId = (body?.user_id ?? '').toString().trim()
    const text = (body?.text ?? '').toString().trim()
    const entitySlug = (body?.entity_slug ?? 'dj').toString().trim()
    const divisionSlug = body?.division_slug ?? null

    if (!userId || !text) return json({ error: 'Missing user_id or text' }, 400)

    const { data: entity, error: entityErr } = await admin
      .from('entities')
      .select('id,slug')
      .eq('user_id', userId)
      .eq('slug', entitySlug)
      .maybeSingle()

    if (entityErr) return json({ error: 'Entity lookup failed', detail: entityErr.message }, 400)

    const entityId = entity?.id ?? null
    let divisionId: string | null = null

    if (entitySlug === 'digikraal' && divisionSlug && entityId) {
      const { data: division, error: divErr } = await admin
        .from('divisions')
        .select('id,slug')
        .eq('user_id', userId)
        .eq('entity_id', entityId)
        .eq('slug', divisionSlug)
        .maybeSingle()

      if (divErr) return json({ error: 'Division lookup failed', detail: divErr.message }, 400)
      divisionId = division?.id ?? null
    }

    const { data: inserted, error: insErr } = await admin
      .from('items')
      .insert({
        user_id: userId,
        entity_id: entityId,
        division_id: divisionId,
        type: 'note',
        status: 'inbox',
        priority: 2,
        title: null,
        content: text,
        due_at: null,
        scheduled_blocks: [],
        meta: { entity_slug: entitySlug, division_slug: divisionSlug },
        client_updated_at: new Date().toISOString(),
        deleted_at: null,
      })
      .select('id')
      .single()

    if (insErr) return json({ error: 'Insert failed', detail: insErr.message }, 400)

    return json({ ok: true, id: inserted.id }, 200)
  } catch (e) {
    return json({ error: 'Unhandled', detail: `${e}` }, 500)
  }
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

