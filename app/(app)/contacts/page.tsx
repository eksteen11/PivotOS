import { getEntities } from '@/lib/data/queries'
import { resolveEntityIds } from '@/lib/scope/entityScope'
import { getEntityScopeSlug } from '@/lib/scope/getEntityScopeSlug'
import { createClient } from '@/lib/supabase/server'

type ContactRow = {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  company?: string | null
  entities?: { name: string } | null
}

export default async function ContactsPage() {
  const sb = await createClient()
  const entities = await getEntities()
  const scope = await getEntityScopeSlug()
  const entityIds = resolveEntityIds(entities, scope)

  let q = sb
    .from('contacts')
    .select('id,name,email,phone,company,entities(name)')
    .order('name')
    .limit(50)
  if (entityIds.length) q = q.in('entity_id', entityIds)
  const { data } = await q
  const contacts = (data ?? []) as unknown as ContactRow[]

  return (
    <section className="mx-auto max-w-xl space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">People</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Contacts</h1>
        <p className="mt-2 text-sm text-muted">{contacts.length} people linked to this business view.</p>
      </div>
      {contacts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-black/10 bg-white/80 p-8 text-sm text-muted">
          No contacts yet. They will appear as inbox items, deals and meetings grow.
        </p>
      ) : (
        <ul className="space-y-3">
          {contacts.map((c) => (
            <li key={c.id} className="rounded-2xl border border-black/[0.07] bg-white/85 px-4 py-3">
              <p className="font-semibold">{c.name}</p>
              <p className="mt-1 text-sm text-muted">{[c.company, c.email, c.phone].filter(Boolean).join(' · ') || 'No details yet'}</p>
              {c.entities?.name ? <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-accent">{c.entities.name}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
