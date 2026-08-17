import { WorkspaceShell } from '@/components/workspace/WorkspaceShell'
import { getEntities, getInboxItems, getProcesses } from '@/lib/data/queries'

async function loadWorkspace(entitySlug: string) {
  const entities = await getEntities()
  const entity = entities.find((e) => e.slug === entitySlug)
  const entityIds = entity ? [entity.id] : []
  const [processes, inbox] = await Promise.all([
    getProcesses(entityIds),
    getInboxItems(entityIds),
  ])
  return { entity, processes, inbox }
}

export async function NorthpointWorkspace() {
  const { entity, processes, inbox } = await loadWorkspace('northpoint')
  return (
    <WorkspaceShell
      title="Northpoint Realty"
      subtitle="First commercial lane. Seller intake, listings, buyers, viewings and documents."
      entityName={entity?.name ?? 'Northpoint Realty'}
      processes={processes}
      inbox={inbox}
      focusItems={['Seller / property acquisition', 'Listing & marketing', 'Buyer pipeline', 'Viewings', 'OTP to transfer', 'Documents & compliance']}
      engine="commercial"
    />
  )
}
