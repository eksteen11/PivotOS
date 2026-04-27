# Edge Functions (AI + Webhooks)

Functions:
- `ai-capture-structure`
- `ai-daily-plan`
- `webhook-in`
- `outbox-dispatch`

Env vars to set in Supabase:
- `OPENAI_API_KEY`
- `OPENAI_MODEL` (optional, default: `gpt-4o-mini`)

Webhook env vars (Supabase secrets):
- `WEBHOOK_IN_TOKEN`
- `WEBHOOK_OUT_URL`
- `WEBHOOK_OUT_TOKEN`
- `OUTBOX_DISPATCH_TOKEN`

