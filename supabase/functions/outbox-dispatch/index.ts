import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

type OutboxRow = {
  id: string
  user_id: string
  item_id: string | null
  event_type: string
  payload: Record<string, any>
  attempts: number
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const expected = Deno.env.get('OUTBOX_DISPATCH_TOKEN')
    const auth = req.headers.get('Authorization') ?? ''
    if (!expected || auth !== `Bearer ${expected}`) return json({ error: 'Unauthorized' }, 401)

    const url = Deno.env.get('SUPABASE_URL')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!url || !serviceKey) return json({ error: 'Missing Supabase env' }, 500)

    const outUrl = Deno.env.get('WEBHOOK_OUT_URL')
    const outToken = Deno.env.get('WEBHOOK_OUT_TOKEN')
    if (!outUrl || !outToken) return json({ error: 'Missing outbound webhook env' }, 500)

    const admin = createClient(url, serviceKey, { auth: { persistSession: false } })
    const nowIso = new Date().toISOString()

    const { data, error } = await admin
      .from('sync_outbox')
      .select('id,user_id,item_id,event_type,payload,attempts')
      .eq('status', 'pending')
      .or(`next_attempt_at.is.null,next_attempt_at.lte.${nowIso}`)
      .order('created_at', { ascending: true })
      .limit(25)

    if (error) return json({ error: 'Query failed', detail: error.message }, 400)
    const rows = (data ?? []) as OutboxRow[]
    if (rows.length === 0) return json({ ok: true, processed: 0 }, 200)

    let processed = 0
    for (const row of rows) {
      const res = await fetch(outUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${outToken}`,
        },
        body: JSON.stringify({
          id: row.id,
          user_id: row.user_id,
          item_id: row.item_id,
          event_type: row.event_type,
          payload: row.payload ?? {},
          sent_at: new Date().toISOString(),
        }),
      })

      if (res.ok) {
        await admin.from('sync_outbox').update({ status: 'sent', last_error: null }).eq('id', row.id)
        processed++
        continue
      }

      const errText = await res.text()
      const attempts = (row.attempts ?? 0) + 1
      const backoffSeconds = Math.min(3600, Math.pow(2, Math.min(attempts, 6)) * 30)
      const next = new Date(Date.now() + backoffSeconds * 1000).toISOString()
      const terminalFailure = attempts >= 8

      await admin
        .from('sync_outbox')
        .update({
          attempts,
          last_error: errText.slice(0, 1000),
          next_attempt_at: terminalFailure ? null : next,
          status: terminalFailure ? 'failed' : 'pending',
        })
        .eq('id', row.id)

      processed++
    }

    return json({ ok: true, processed }, 200)
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

