'use client'

import { cloneElement, useEffect, useId, useRef, useState, type ReactElement } from 'react'
import {
  applyAction, commissionPosition, compareRequirement, dealStageLabels, documentCatalogue, emptyNorthpoint, evidenceLevelLabels, factKeys, factLabels, latestLocation, nextDealStages, nextRequirementStages, portalStatus, propertyNextQuestion, propertySegments, qualificationKeys, qualificationQuestions, requirementNextQuestion, requirementStageLabels, sharedStageLabel, sourceKindLabels, sourceKinds, stagesBetween, unknownPropertyItems, type DealStage, type Evidence, type NorthpointState, type PropertyRecord, type RequirementRecord,
} from '@/lib/modules/003'
import styles from './northpoint.module.css'

type Commit = (action: Record<string, unknown>) => boolean
type EvidenceDraft = { statement: string; sourceRef: string; level: string; recordedBy: string; channel: 'internal' | 'external_head_office' }
const blankEvidence = (): EvidenceDraft => ({ statement: '', sourceRef: '', level: '1', recordedBy: '', channel: 'internal' })
const segmentLabels = { farm: 'Farm', residential: 'Residential', industrial: 'Industrial', commercial: 'Commercial' }

export function NorthpointModule({ initial, onChange, now = () => new Date().toISOString(), createId = () => crypto.randomUUID() }: { initial?: NorthpointState; onChange?: (state: NorthpointState) => void; now?: () => string; createId?: () => string }) {
  const [state, setState] = useState(() => initial ?? emptyNorthpoint())
  const [error, setError] = useState('')
  const [lane, setLane] = useState<'stock' | 'buyers'>('stock')
  const [propertyId, setPropertyId] = useState<string | null>(null)
  const [requirementId, setRequirementId] = useState<string | null>(null)
  const property = state.properties.find((item) => item.id === propertyId) ?? null
  const requirement = state.requirements.find((item) => item.id === requirementId) ?? null
  function commit(action: Record<string, unknown>) {
    const result = applyAction(state, action)
    if (!result.ok) { setError(result.error); return false }
    setState(result.value); setError(''); onChange?.(result.value); return true
  }
  return (
    <section className={styles.np003} aria-label="Northpoint Realty" data-module="003">
      <p className={styles.eyebrow}>Internal module</p>
      <h1 className={styles.title}>{state.name}</h1>
      <p className={styles.lede}>Property stock, mandates and buyer requirements. Unknown figures stay unknown. Nothing is published, calculated or sent.</p>
      <dl className={styles.status}>
        {portalStatus.map((portal) => <div key={portal.id}><dt>{portal.id === 'property24' ? 'Property24' : 'Propverse'}</dt><dd>Not connected</dd></div>)}
        <div><dt>Commission</dt><dd>Not calculated</dd></div>
      </dl>
      {error ? <p className={styles.error} role="alert">{error}</p> : null}
      <div className={styles.lanes}>
        <button className={styles.tab} type="button" aria-selected={lane === 'stock'} onClick={() => { setLane('stock'); setError('') }}>Property stock</button>
        <button className={styles.tab} type="button" aria-selected={lane === 'buyers'} onClick={() => { setLane('buyers'); setError('') }}>Buyer requirements</button>
      </div>
      {lane === 'stock' ? property ? <PropertyDetail property={property} requirements={state.requirements} commit={commit} now={now} onBack={() => setPropertyId(null)} /> : <PropertyCapture commit={commit} now={now} createId={createId} properties={state.properties} onOpen={setPropertyId} /> : requirement ? <RequirementDetail requirement={requirement} properties={state.properties} commit={commit} now={now} onBack={() => setRequirementId(null)} /> : <RequirementCapture commit={commit} now={now} createId={createId} requirements={state.requirements} onOpen={setRequirementId} />}
    </section>
  )
}

function Field({ label, children }: { label: string; children: ReactElement }) {
  const id = useId()
  return <div className={styles.field}><label htmlFor={id}>{label}</label>{cloneElement(children, { id })}</div>
}

function EvidenceFields({ draft, setDraft, channel = false }: { draft: EvidenceDraft; setDraft: (next: EvidenceDraft) => void; channel?: boolean }) {
  return (
    <>
      <Field label="Evidence"><textarea className={styles.control} value={draft.statement} onChange={(event) => setDraft({ ...draft, statement: event.target.value })} /></Field>
      <Field label="Evidence source"><input className={styles.control} value={draft.sourceRef} onChange={(event) => setDraft({ ...draft, sourceRef: event.target.value })} /></Field>
      <Field label="Evidence level"><select className={styles.control} value={draft.level} onChange={(event) => setDraft({ ...draft, level: event.target.value })}>{([1, 2, 3, 4, 5] as const).map((level) => <option key={level} value={level}>{level} · {evidenceLevelLabels[level]}</option>)}</select></Field>
      <Field label="Evidence recorder"><input className={styles.control} value={draft.recordedBy} onChange={(event) => setDraft({ ...draft, recordedBy: event.target.value })} /></Field>
      {channel ? <Field label="Evidence channel"><select className={styles.control} value={draft.channel} onChange={(event) => setDraft({ ...draft, channel: event.target.value as EvidenceDraft['channel'] })}><option value="internal">Internal</option><option value="external_head_office">External head office</option></select></Field> : null}
    </>
  )
}

function evidenceFrom(draft: EvidenceDraft, at: string): Evidence {
  return { level: Number(draft.level) as Evidence['level'], statement: draft.statement, sourceRef: draft.sourceRef, recordedBy: draft.recordedBy, recordedAt: at, channel: draft.channel }
}

function PropertyCapture({ commit, now, createId, properties, onOpen }: { commit: Commit; now: () => string; createId: () => string; properties: PropertyRecord[]; onOpen: (id: string) => void }) {
  const [form, setForm] = useState({ label: '', segment: 'farm', transaction: 'sale', partyLabel: '', partyRole: 'seller', location: '', sourceKind: 'phone', sourceNote: '', recordedBy: '', confidential: false })
  const formRef = useRef(form)
  function update(patch: Partial<typeof form>) { setForm((current) => { const next = { ...current, ...patch }; formRef.current = next; return next }) }
  return (
    <div>
      <form className={styles.card} onSubmit={(event) => { event.preventDefault(); const id = createId(); if (commit({ type: 'capture_property', id, at: now(), ...formRef.current })) onOpen(id) }}>
        <h2>Capture a property</h2>
        <Field label="Property"><input className={styles.control} value={form.label} onChange={(event) => update({ label: event.target.value })} /></Field>
        <Field label="Segment"><select className={styles.control} value={form.segment} onChange={(event) => update({ segment: event.target.value })}>{propertySegments.map((item) => <option key={item} value={item}>{segmentLabels[item]}</option>)}</select></Field>
        <Field label="Sale or rental"><select className={styles.control} value={form.transaction} onChange={(event) => update({ transaction: event.target.value, partyRole: event.target.value === 'rental' ? 'landlord' : 'seller' })}><option value="sale">Sale</option><option value="rental">Rental</option></select></Field>
        <Field label="Seller or landlord"><input className={styles.control} value={form.partyLabel} onChange={(event) => update({ partyLabel: event.target.value })} /></Field>
        <Field label="Role"><select className={styles.control} value={form.partyRole} onChange={(event) => update({ partyRole: event.target.value })}><option value="seller">Seller</option><option value="landlord">Landlord</option></select></Field>
        <Field label="Location, if you were told"><input className={styles.control} value={form.location} onChange={(event) => update({ location: event.target.value })} /></Field>
        <Field label="Source"><select className={styles.control} value={form.sourceKind} onChange={(event) => update({ sourceKind: event.target.value })}>{sourceKinds.map((item) => <option key={item} value={item}>{sourceKindLabels[item]}</option>)}</select></Field>
        <Field label="What was said"><textarea className={styles.control} value={form.sourceNote} onChange={(event) => update({ sourceNote: event.target.value })} /></Field>
        <Field label="Recorded by"><input className={styles.control} value={form.recordedBy} onChange={(event) => update({ recordedBy: event.target.value })} /></Field>
        <label className={styles.check}><input type="checkbox" checked={form.confidential} onChange={(event) => update({ confidential: event.target.checked })} /> Confidential inside Pivot</label>
        <div className={styles.actions}><button className={styles.primary} type="submit">Save property</button></div>
      </form>
      <div className={styles.list}>{properties.map((item) => <button key={item.id} className={styles.item} type="button" onClick={() => onOpen(item.id)}><b>{item.label}</b><small>{dealStageLabels[item.stage]} · {item.asking.state === 'unknown' ? 'Asking price unknown' : 'Asking price stated'}</small></button>)}</div>
    </div>
  )
}

function PropertyDetail({ property, requirements, commit, now, onBack }: { property: PropertyRecord; requirements: RequirementRecord[]; commit: Commit; now: () => string; onBack: () => void }) {
  const [screen, setScreen] = useState<'next' | 'stage' | 'facts'>('next')
  const [draft, setDraft] = useState(blankEvidence)
  const [text, setText] = useState('')
  const [person, setPerson] = useState('')
  const [choice, setChoice] = useState('sole')
  const [decision, setDecision] = useState('accept')
  const [stage, setStage] = useState<DealStage>(nextDealStages(property.stage)[0] ?? 'closed')
  const [skip, setSkip] = useState(false)
  const [requirementId, setRequirementId] = useState(requirements[0]?.id ?? '')
  const [attorney, setAttorney] = useState('')
  const [fact, setFact] = useState<(typeof factKeys)[typeof property.segment][number]>(factKeys[property.segment][0])
  const question = propertyNextQuestion(property)
  useEffect(() => { setText('') }, [question])
  const money = commissionPosition(property.mandate.commissionTerms)
  const stageOptions = nextDealStages(property.stage)
  const selectedStage = stageOptions.includes(stage) ? stage : stageOptions[0] ?? 'closed'
  const skipped = selectedStage === property.stage ? [] : stagesBetween(property.stage, selectedStage)
  const place = latestLocation(property)
  const missingDocument = property.documents.find((item) => item.references.length === 0 && item.key !== 'mandate')
  return (
    <div>
      <button className={styles.secondary} type="button" onClick={onBack}>Back to stock</button>
      <article className={styles.card}>
        <h2>{property.label}</h2>
        <p className={styles.meta}>{dealStageLabels[property.stage]} · Shared stage: {sharedStageLabel(property.stage)}</p>
        <p>{place ? `Location: ${place}` : 'Location: Unknown'}</p>
        <p>{property.asking.state === 'unknown' ? 'Asking price: Unknown' : `Asking price stated: R ${property.asking.amount}`}</p>
        <p>Commission: Not calculated. {money.reason}</p>
        {property.mandate.commissionTerms ? <blockquote className={styles.source}>{property.mandate.commissionTerms}</blockquote> : null}
        <p>No legal determination is recorded. Head-office scrutiny: {property.scrutiny.state === 'not_sent' ? 'not sent' : property.scrutiny.state === 'sent' ? 'sent, not approved here' : 'response recorded, not approved here'}.</p>
        <blockquote className={styles.source}>{property.source.note}</blockquote>
        {unknownPropertyItems(property).length ? <p className={styles.warning}>Still unknown: {unknownPropertyItems(property).join(', ')}.</p> : null}
        {property.confidential ? <p className={styles.warning}>Confidential. Keep this inside Pivot.</p> : null}
        <div className={styles.tabs}>
          <button className={styles.tab} type="button" aria-selected={screen === 'next'} onClick={() => setScreen('next')}>Next step</button>
          <button className={styles.tab} type="button" aria-selected={screen === 'stage'} onClick={() => setScreen('stage')}>Move stage</button>
          <button className={styles.tab} type="button" aria-selected={screen === 'facts'} onClick={() => setScreen('facts')}>Specialist facts</button>
        </div>
        {screen === 'next' ? <form onSubmit={(event) => { event.preventDefault(); const at = now(); const evidence = evidenceFrom(draft, at); if (!place) commit({ type: 'record_location', propertyId: property.id, at, location: text, evidence }); else if (property.mandate.status === 'missing') commit({ type: 'propose_mandate', propertyId: property.id, at, mandateType: choice, actor: person }); else if (property.mandate.status === 'proposed') commit({ type: 'record_terms', propertyId: property.id, at, terms: text, actor: person }); else if (property.mandate.status === 'terms_recorded') commit({ type: 'submit_mandate', propertyId: property.id, at, actor: person }); else if (property.mandate.status === 'awaiting_review') commit({ type: 'review_mandate', propertyId: property.id, at, reviewer: person, decision, note: text }); else if (property.mandate.status === 'reviewed') commit({ type: 'record_signature', propertyId: property.id, at, actor: person, expiry: text, evidence }); else if (missingDocument) commit({ type: 'record_document', propertyId: property.id, at, key: missingDocument.key, reference: text, evidence }) }}>
          <p className={styles.help}>{question ?? 'No mandate question is waiting. Use Move stage for the pipeline.'}</p>
          {!place ? <Field label="Location"><input className={styles.control} value={text} onChange={(event) => setText(event.target.value)} /></Field> : null}
          {place && property.mandate.status === 'missing' ? <Field label="Mandate type"><select className={styles.control} value={choice} onChange={(event) => setChoice(event.target.value)}><option value="sole">Sole</option><option value="open">Open</option><option value="joint">Joint</option></select></Field> : null}
          {place && property.mandate.status === 'proposed' ? <Field label="Commission terms, as stated"><textarea className={styles.control} value={text} onChange={(event) => setText(event.target.value)} /></Field> : null}
          {place && property.mandate.status === 'terms_recorded' ? <p className={styles.help}>The review request stays inside Pivot.</p> : null}
          {place && property.mandate.status === 'awaiting_review' ? <><Field label="Review decision"><select className={styles.control} value={decision} onChange={(event) => setDecision(event.target.value)}><option value="accept">Accept for the file</option><option value="return">Return</option></select></Field><Field label="Review note"><textarea className={styles.control} value={text} onChange={(event) => setText(event.target.value)} /></Field></> : null}
          {place && property.mandate.status === 'reviewed' ? <Field label="Expiry date"><input className={styles.control} value={text} placeholder="YYYY-MM-DD" onChange={(event) => setText(event.target.value)} /></Field> : null}
          {place && missingDocument && property.mandate.status === 'signature_recorded' ? <Field label={`${missingDocument.label} reference`}><input className={styles.control} value={text} onChange={(event) => setText(event.target.value)} /></Field> : null}
          {place && (property.mandate.status === 'reviewed' || property.mandate.status === 'signature_recorded') ? <EvidenceFields draft={draft} setDraft={setDraft} /> : null}
          {!place ? <EvidenceFields draft={draft} setDraft={setDraft} /> : null}
          {property.mandate.status !== 'signature_recorded' || !place ? <Field label="Your name"><input className={styles.control} value={person} onChange={(event) => setPerson(event.target.value)} /></Field> : null}
          <div className={styles.actions}><button className={styles.primary} type="submit">{!place ? 'Save location' : property.mandate.status === 'missing' ? 'Propose mandate' : property.mandate.status === 'proposed' ? 'Save stated terms' : property.mandate.status === 'terms_recorded' ? 'Record the review request' : property.mandate.status === 'awaiting_review' ? 'Record the review' : property.mandate.status === 'reviewed' ? 'Record signed mandate' : missingDocument ? 'Record document reference' : 'Mandate recorded'}</button></div>
        </form> : null}
        {screen === 'stage' ? <form onSubmit={(event) => { event.preventDefault(); const at = now(); commit({ type: 'advance_property', propertyId: property.id, at, to: selectedStage, actor: person, reviewer: draft.recordedBy, reason: text, evidence: evidenceFrom(draft, at), acknowledgeSkip: skip, requirementId, attorneyRef: attorney }) }}>
          <p className={styles.help}>Commission due and commission paid are not available. No split rule is configured.</p>
          <Field label="Next stage"><select className={styles.control} value={selectedStage} onChange={(event) => setStage(event.target.value as DealStage)}>{stageOptions.map((item) => <option key={item} value={item}>{dealStageLabels[item]}</option>)}</select></Field>
          {skipped.length ? <label className={styles.check}><input type="checkbox" checked={skip} onChange={(event) => setSkip(event.target.checked)} /> Record these as skipped: {skipped.map((item) => dealStageLabels[item]).join(', ')}</label> : null}
          {selectedStage !== 'closed' && selectedStage !== 'qualified' ? <Field label="Buyer requirement"><select className={styles.control} value={requirementId} onChange={(event) => setRequirementId(event.target.value)}><option value="">Choose</option>{requirements.map((item) => <option key={item.id} value={item.id}>{item.partyLabel}</option>)}</select></Field> : null}
          {selectedStage === 'transfer_instructed' || selectedStage === 'transfer_in_progress' || selectedStage === 'registered_or_lease_commenced' ? <Field label="Transfer attorney"><input className={styles.control} value={attorney} onChange={(event) => setAttorney(event.target.value)} /></Field> : null}
          <Field label="Reason"><textarea className={styles.control} value={text} onChange={(event) => setText(event.target.value)} /></Field>
          <EvidenceFields draft={draft} setDraft={setDraft} channel />
          <Field label="Actor"><input className={styles.control} value={person} onChange={(event) => setPerson(event.target.value)} /></Field>
          {property.stage === 'northpoint_scrutiny' ? <p className={styles.warning}>You are recording a head-office response. Pivot has not checked it with head office and cannot approve the OTP.</p> : null}
          <div className={styles.actions}><button className={styles.primary} type="submit">Record reviewed move</button></div>
        </form> : null}
        {screen === 'facts' ? <form onSubmit={(event) => { event.preventDefault(); commit({ type: 'record_fact', propertyId: property.id, at: now(), key: fact, statement: text, evidence: evidenceFrom(draft, now()) }) }}>
          <Field label="Fact"><select className={styles.control} value={fact} onChange={(event) => setFact(event.target.value as typeof fact)}>{factKeys[property.segment].map((item) => <option key={item} value={item}>{factLabels[item]}</option>)}</select></Field>
          <Field label="What was stated"><textarea className={styles.control} value={text} onChange={(event) => setText(event.target.value)} /></Field>
          <EvidenceFields draft={draft} setDraft={setDraft} />
          <div className={styles.actions}><button className={styles.primary} type="submit">Save stated fact</button></div>
          <ul>{property.facts.map((item, index) => <li key={`${item.key}-${index}`}>{factLabels[item.key]}: {item.statement}</li>)}</ul>
        </form> : null}
        <h3>Checklist</h3>
        <ul>{documentCatalogue.map((item) => { const slot = property.documents.find((doc) => doc.key === item.key); return <li key={item.key}>{item.label}: {slot?.references.length ? 'Reference recorded. Not legal clearance.' : 'Missing'}</li> })}</ul>
      </article>
    </div>
  )
}

function RequirementCapture({ commit, now, createId, requirements, onOpen }: { commit: Commit; now: () => string; createId: () => string; requirements: RequirementRecord[]; onOpen: (id: string) => void }) {
  const [form, setForm] = useState({ partyLabel: '', role: 'buyer', segment: 'farm', transaction: 'sale', sourceKind: 'phone', sourceNote: '', recordedBy: '' })
  const formRef = useRef(form)
  function update(patch: Partial<typeof form>) { setForm((current) => { const next = { ...current, ...patch }; formRef.current = next; return next }) }
  return (
    <div>
      <form className={styles.card} onSubmit={(event) => { event.preventDefault(); const id = createId(); if (commit({ type: 'capture_requirement', id, at: now(), ...formRef.current })) onOpen(id) }}>
        <h2>Capture a buyer requirement</h2>
        <Field label="Buyer or tenant"><input className={styles.control} value={form.partyLabel} onChange={(event) => update({ partyLabel: event.target.value })} /></Field>
        <Field label="Who is looking"><select className={styles.control} value={form.role} onChange={(event) => update({ role: event.target.value, transaction: event.target.value === 'tenant' ? 'rental' : 'sale' })}><option value="buyer">Buyer</option><option value="tenant">Tenant</option><option value="investor">Investor</option></select></Field>
        <Field label="Segment"><select className={styles.control} value={form.segment} onChange={(event) => update({ segment: event.target.value })}>{propertySegments.map((item) => <option key={item} value={item}>{segmentLabels[item]}</option>)}</select></Field>
        <Field label="Sale or rental"><select className={styles.control} value={form.transaction} onChange={(event) => update({ transaction: event.target.value })}><option value="sale">Sale</option><option value="rental">Rental</option></select></Field>
        <Field label="Source"><select className={styles.control} value={form.sourceKind} onChange={(event) => update({ sourceKind: event.target.value })}>{sourceKinds.map((item) => <option key={item} value={item}>{sourceKindLabels[item]}</option>)}</select></Field>
        <Field label="What was said"><textarea className={styles.control} value={form.sourceNote} onChange={(event) => update({ sourceNote: event.target.value })} /></Field>
        <Field label="Recorded by"><input className={styles.control} value={form.recordedBy} onChange={(event) => update({ recordedBy: event.target.value })} /></Field>
        <div className={styles.actions}><button className={styles.primary} type="submit">Save requirement</button></div>
      </form>
      <div className={styles.list}>{requirements.map((item) => <button key={item.id} className={styles.item} type="button" onClick={() => onOpen(item.id)}><b>{item.partyLabel}</b><small>{requirementStageLabels[item.stage]} · {item.budgetMin.state === 'unknown' && item.budgetMax.state === 'unknown' ? 'Budget unknown' : 'Budget stated'}</small></button>)}</div>
    </div>
  )
}

function RequirementDetail({ requirement, properties, commit, now, onBack }: { requirement: RequirementRecord; properties: PropertyRecord[]; commit: Commit; now: () => string; onBack: () => void }) {
  const [screen, setScreen] = useState<'next' | 'stage' | 'matches'>('next')
  const [draft, setDraft] = useState(blankEvidence)
  const [text, setText] = useState('')
  const [bound, setBound] = useState<'min' | 'max'>('max')
  const [stage, setStage] = useState(nextRequirementStages(requirement.stage)[0] ?? 'closed_lost')
  const [skip, setSkip] = useState(false)
  const [person, setPerson] = useState('')
  const [fact, setFact] = useState<(typeof factKeys)[typeof requirement.segment][number]>(factKeys[requirement.segment][0])
  const question = requirementNextQuestion(requirement)
  useEffect(() => { setText('') }, [question])
  const reports = properties.map((property) => ({ property, report: compareRequirement(requirement, property, 'internal') }))
  return (
    <div>
      <button className={styles.secondary} type="button" onClick={onBack}>Back to buyers</button>
      <article className={styles.card}>
        <h2>{requirement.partyLabel}</h2>
        <p className={styles.meta}>{requirementStageLabels[requirement.stage]} · Outbound is not enabled</p>
        <blockquote className={styles.source}>{requirement.source.note}</blockquote>
        <p>{question ?? 'Qualification questions are answered. Consent is still not a permission to send.'}</p>
        <div className={styles.tabs}>
          <button className={styles.tab} type="button" aria-selected={screen === 'next'} onClick={() => setScreen('next')}>Next step</button>
          <button className={styles.tab} type="button" aria-selected={screen === 'stage'} onClick={() => setScreen('stage')}>Move stage</button>
          <button className={styles.tab} type="button" aria-selected={screen === 'matches'} onClick={() => setScreen('matches')}>Internal matches</button>
        </div>
        {screen === 'next' ? <form onSubmit={(event) => { event.preventDefault(); const at = now(); const evidence = evidenceFrom(draft, at); if (!requirement.locations.length) commit({ type: 'add_location', requirementId: requirement.id, at, location: text, evidence }); else if (requirement.budgetMin.state === 'unknown' && requirement.budgetMax.state === 'unknown') commit({ type: 'record_budget', requirementId: requirement.id, at, bound, amount: text, evidence }); else if (!requirement.timeframe) commit({ type: 'record_text', requirementId: requirement.id, at, field: 'timeframe', value: text, evidence }); else { const key = qualificationKeys.find((item) => requirement.qualification[item].state !== 'stated'); if (key) commit({ type: 'state_qualification', requirementId: requirement.id, at, key, evidence }); else if (requirement.consent === 'unknown') commit({ type: 'record_consent', requirementId: requirement.id, at, value: text === 'no' ? 'stated_no' : 'stated_yes', evidence }); else commit({ type: 'record_requirement_fact', requirementId: requirement.id, at, key: fact, statement: text, evidence }) }}}>
          {!requirement.locations.length ? <Field label="Requested place"><input className={styles.control} value={text} onChange={(event) => setText(event.target.value)} /></Field> : null}
          {requirement.locations.length && requirement.budgetMin.state === 'unknown' && requirement.budgetMax.state === 'unknown' ? <><Field label="Budget bound"><select className={styles.control} value={bound} onChange={(event) => setBound(event.target.value as 'min' | 'max')}><option value="max">Maximum</option><option value="min">Minimum</option></select></Field><Field label="Budget amount"><input className={styles.control} value={text} onChange={(event) => setText(event.target.value)} /></Field></> : null}
          {requirement.locations.length && (requirement.budgetMin.state === 'stated' || requirement.budgetMax.state === 'stated') && !requirement.timeframe ? <Field label="Time frame"><input className={styles.control} value={text} onChange={(event) => setText(event.target.value)} /></Field> : null}
          {requirement.timeframe && requirement.consent === 'unknown' && qualificationKeys.every((item) => requirement.qualification[item].state === 'stated') ? <Field label="Consent stated"><select className={styles.control} value={text || 'yes'} onChange={(event) => setText(event.target.value)}><option value="yes">Yes</option><option value="no">No</option></select></Field> : null}
          {requirement.consent !== 'unknown' ? <><Field label="Specialist fact"><select className={styles.control} value={fact} onChange={(event) => setFact(event.target.value as typeof fact)}>{factKeys[requirement.segment].map((item) => <option key={item} value={item}>{factLabels[item]}</option>)}</select></Field><Field label="What was stated"><textarea className={styles.control} value={text} onChange={(event) => setText(event.target.value)} /></Field></> : null}
          <EvidenceFields draft={draft} setDraft={setDraft} />
          {qualificationKeys.some((item) => requirement.qualification[item].state !== 'stated') && requirement.timeframe ? <p className={styles.help}>{qualificationQuestions[qualificationKeys.find((item) => requirement.qualification[item].state !== 'stated') ?? 'intent']}</p> : null}
          <div className={styles.actions}><button className={styles.primary} type="submit">Save stated answer</button></div>
        </form> : null}
        {screen === 'stage' ? <form onSubmit={(event) => { event.preventDefault(); commit({ type: 'advance_requirement', requirementId: requirement.id, at: now(), to: stage, actor: person, reviewer: draft.recordedBy, reason: text, evidence: evidenceFrom({ ...draft, level: stage === 'properties_sent' || stage === 'viewing_completed' ? '2' : draft.level }, now()), acknowledgeSkip: skip }) }}>
          <Field label="Next stage"><select className={styles.control} value={stage} onChange={(event) => setStage(event.target.value as typeof stage)}>{nextRequirementStages(requirement.stage).map((item) => <option key={item} value={item}>{requirementStageLabels[item]}</option>)}</select></Field>
          {stage !== nextRequirementStages(requirement.stage)[0] ? <label className={styles.check}><input type="checkbox" checked={skip} onChange={(event) => setSkip(event.target.checked)} /> Confirm the skipped stages stay in the history</label> : null}
          <Field label="Reason"><textarea className={styles.control} value={text} onChange={(event) => setText(event.target.value)} /></Field>
          <EvidenceFields draft={draft} setDraft={setDraft} />
          <Field label="Actor"><input className={styles.control} value={person} onChange={(event) => setPerson(event.target.value)} /></Field>
          <div className={styles.actions}><button className={styles.primary} type="submit">Record reviewed move</button></div>
        </form> : null}
        {screen === 'matches' ? <div>
          <h3>Internal comparison</h3>
          {reports.length === 0 ? <p>No property is in this session.</p> : reports.map(({ property, report }) => <article key={property.id} className={styles.card}><h3>{property.confidential ? 'Confidential property' : property.label}</h3><p>{report.recommendedAction}</p>{report.clientMessage ? null : <p>No client message was prepared.</p>}{report.hardMismatches.map((item) => <p key={item}>{item}</p>)}{report.missing.map((item) => <p key={item}>{item}</p>)}</article>)}
        </div> : null}
      </article>
    </div>
  )
}
