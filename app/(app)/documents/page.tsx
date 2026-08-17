import { getEntities } from '@/lib/data/queries'
import { resolveEntityIds } from '@/lib/scope/entityScope'
import { getEntityScopeSlug } from '@/lib/scope/getEntityScopeSlug'
import { createClient } from '@/lib/supabase/server'

type DocumentRow = {
  id: string
  title: string
  mime?: string | null
  summary?: string | null
  entities?: { name: string } | null
}

export default async function DocumentsPage() {
  const sb = await createClient()
  const entities = await getEntities()
  const scope = await getEntityScopeSlug()
  const entityIds = resolveEntityIds(entities, scope)

  let q = sb
    .from('documents')
    .select('id,title,mime,summary,entities(name)')
    .order('created_at', { ascending: false })
    .limit(50)
  if (entityIds.length) q = q.in('entity_id', entityIds)
  const { data } = await q
  const documents = (data ?? []) as unknown as DocumentRow[]

  return (
    <section className="mx-auto max-w-xl space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">Files</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Documents</h1>
        <p className="mt-2 text-sm text-muted">{documents.length} files linked to this business view.</p>
      </div>
      {documents.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-black/10 bg-white/80 p-8 text-sm text-muted">
          No documents yet. Upload and Drive sync are not connected.
        </p>
      ) : (
        <ul className="space-y-3">
          {documents.map((doc) => (
            <li key={doc.id} className="rounded-2xl border border-black/[0.07] bg-white/85 px-4 py-3">
              <p className="font-semibold">{doc.title}</p>
              <p className="mt-1 text-sm text-muted">{doc.summary || doc.mime || 'Document'}</p>
              {doc.entities?.name ? <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-accent">{doc.entities.name}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
