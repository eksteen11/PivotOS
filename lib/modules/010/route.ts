import { getSystem } from '../../workspace/catalogue'
import { receivingCapabilities, type CapitalGates, type ReceivingCapability, type RouteSuggestion } from './contract'

export function gatesRequire008(gates: CapitalGates): boolean {
  return gates.materialCapital || gates.newEntity || gates.propertyAcquisition || gates.externalFunding || gates.borrowing || gates.strategicPartnership || gates.newLineOfBusiness
}

export function capabilityLabel(id: ReceivingCapability): string {
  if (id === 'new-capability') return 'Proposed new capability'
  return getSystem(id)?.name ?? id
}

export function assignRoute(requested: readonly ReceivingCapability[], gates: CapitalGates, reason: string): RouteSuggestion {
  const next: ReceivingCapability[] = []
  const push = (id: ReceivingCapability) => { if (!next.includes(id)) next.push(id) }
  for (const id of requested) push(id)
  if (gatesRequire008(gates) || next.includes('008')) push('008')
  if (gates.newLineOfBusiness) {
    push('new-capability')
    push('008')
  }
  if (next.length === 0) {
    return { capabilities: [], requires008: false, approved: false, reason: 'No capability is suggested yet. This is still only an idea.' }
  }
  const requires008 = next.includes('008')
  const base = reason.trim() || 'A person set this route.'
  const extra = requires008 && !base.includes('008') ? ' Capability 008 is on the route and has not approved capital.' : ''
  return { capabilities: next, requires008, approved: false, reason: `${base}${extra}` }
}

export function suggestRoute(input: { text: string } & Partial<CapitalGates>): RouteSuggestion {
  const text = input.text.toLowerCase()
  const gates: CapitalGates = {
    materialCapital: Boolean(input.materialCapital),
    newEntity: Boolean(input.newEntity),
    propertyAcquisition: Boolean(input.propertyAcquisition),
    externalFunding: Boolean(input.externalFunding),
    borrowing: Boolean(input.borrowing),
    strategicPartnership: Boolean(input.strategicPartnership),
    newLineOfBusiness: Boolean(input.newLineOfBusiness),
  }
  const capabilities: ReceivingCapability[] = []
  const reasons: string[] = []
  const add = (ids: ReceivingCapability[], reason: string) => {
    let added = false
    for (const id of ids) if (!capabilities.includes(id)) { capabilities.push(id); added = true }
    if (added) reasons.push(reason)
  }
  if (/custom feeding|farm feed|feed software/.test(text)) add(['004'], 'Feed, custom feeding and Farm Feed software belong to Farm Feed. This does not create a second workflow or an approval.')
  if (/northpoint/.test(text)) add(['003'], 'Northpoint agency work stays in Northpoint. This idea is not a listing approval.')
  if (/livestock export|cattle export|export cattle/.test(text)) add(['005', '007', '009'], 'Livestock export stays with livestock, partner trading and finance administration. Those links are not approvals.')
  else if (/livestock agency|livestock sale|livestock auction/.test(text)) add(['005'], 'A livestock sale belongs to the livestock agency. Opportunity Lab does not run the sale.')
  if (!/northpoint/.test(text) && /\bbridging\b/.test(text)) add(['006', '008'], 'Property bridging belongs to principal property and Capability 008. Naming it does not approve it.')
  else if (!/northpoint/.test(text) && /\b(property|land)\b/.test(text)) add(['006'], 'Land and property belong to principal property, not a second project system.')
  if (/partner farming|livestock trading|trading setup/.test(text)) add(['007'], 'Partner farming and trading stay in that lane. This is not a partnership agreement.')
  if (/\binvestor\b|\bspv\b|venture capital|strategic venture/.test(text)) add(['008'], 'Capital and venture governance belong to Capability 008. The route is not capital approval.')
  if (/\btreasury\b|\baccounting\b|vat return/.test(text)) add(['009'], 'Finance administration stays with the finance lane. The statutory ledger is not replaced.')
  if (/marketplace|digital product|website product/.test(text)) add(['011'], 'A product or website idea can be handed to the digital lane only after acceptance.')
  return assignRoute(capabilities, gates, reasons.join(' '))
}

export function isReceivingCapability(value: string): value is ReceivingCapability {
  return (receivingCapabilities as readonly string[]).includes(value)
}
