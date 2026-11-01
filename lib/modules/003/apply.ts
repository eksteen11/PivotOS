import {
  amountFromInput, bannedField, calendarDate, commercialStage, commissionPosition, dealStageLabels, dealStages, documentCatalogue, emptyDocuments, emptyMandate, emptyQualification, factKeys, factLabels, fail, latestFact, latestLocation, matchFactKeys, moduleIdentity, nextDealStages, ok, parseEvidence, personName, propertySegments, qualificationKeys, qualificationQuestions, requiredText, requirementFlow, requirementSkipped, requirementStages, requirementTerminals, sourceKinds, stagesBetween, timestamp, transactionTypes, unknownAsking, unknownMatchFacts, type DealStage, type Evidence, type FactKey, type FactRecord, type Mandate, type MatchReport, type NorthpointState, type PropertyRecord, type PropertySegment, type QualificationKey, type RequirementRecord, type RequirementStage, type Result, type SourceKind, type SourceRecord, type StageMove, type StatedAmount, type TransactionType,
} from './foundation'

type Audience = 'internal' | 'external'

function record(value: unknown): Record<string, unknown> | null {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null
}

function only(row: Record<string, unknown>, keys: readonly string[]) {
  const extra = Object.keys(row).find((key) => !keys.includes(key))
  return extra ? fail<never>(`Unexpected field “${extra}”.`) : null
}

function parseAmount(value: unknown): Result<StatedAmount> {
  const row = record(value)
  if (!row) return fail('An amount was unreadable.')
  if (row.state === 'unknown') return only(row, ['state']) ?? ok({ state: 'unknown' })
  if (row.state !== 'stated') return fail('An amount must be stated or unknown.')
  const extra = only(row, ['state', 'amount', 'currency', 'evidence'])
  if (extra) return extra
  if (row.currency !== 'ZAR') return fail('Amounts are recorded in ZAR only.')
  if (typeof row.amount !== 'number' || !Number.isFinite(row.amount) || row.amount <= 0 || !/^\d+(\.\d{1,2})?$/.test(String(row.amount))) return fail('A stated amount must be above zero and is never stored as zero.')
  const evidence = parseEvidence(row.evidence, 1)
  if (!evidence.ok) return evidence
  return ok({ state: 'stated', amount: row.amount, currency: 'ZAR', evidence: evidence.value })
}

function parseSource(value: unknown): Result<SourceRecord> {
  const row = record(value)
  if (!row) return fail('A source is required.')
  const extra = only(row, ['kind', 'note', 'recordedBy', 'recordedAt', 'connected'])
  if (extra) return extra
  if (!sourceKinds.includes(row.kind as SourceKind)) return fail('Choose the source you actually used.')
  if (row.connected !== false) return fail('A source connection was claimed. None is configured.')
  const note = requiredText(row.note, 2000, 'Source note')
  if (!note.ok) return note
  const recordedBy = personName(row.recordedBy, 'Recorded by')
  if (!recordedBy.ok) return recordedBy
  const recordedAt = timestamp(row.recordedAt)
  if (!recordedAt.ok) return recordedAt
  return ok({ kind: row.kind as SourceKind, note: note.value, recordedBy: recordedBy.value, recordedAt: recordedAt.value, connected: false })
}

function parseMove(value: unknown): Result<StageMove> {
  const row = record(value)
  if (!row) return fail('A stage record was unreadable.')
  const extra = only(row, ['at', 'from', 'to', 'skipped', 'actor', 'reviewer', 'reason', 'evidence', 'requirementId'])
  if (extra) return extra
  const at = timestamp(row.at)
  if (!at.ok) return at
  const actor = personName(row.actor, 'Actor')
  if (!actor.ok) return actor
  const reviewer = personName(row.reviewer, 'Reviewer')
  if (!reviewer.ok) return reviewer
  const reason = requiredText(row.reason, 2000, 'Reason')
  if (!reason.ok) return reason
  const evidence = parseEvidence(row.evidence, 1)
  if (!evidence.ok) return evidence
  if (!Array.isArray(row.skipped) || row.skipped.some((item) => typeof item !== 'string')) return fail('Skipped stages must be listed.')
  if (row.requirementId !== null && typeof row.requirementId !== 'string') return fail('A match link was unreadable.')
  return ok({ at: at.value, from: String(row.from), to: String(row.to), skipped: row.skipped.map(String), actor: actor.value, reviewer: reviewer.value, reason: reason.value, evidence: evidence.value, requirementId: row.requirementId === null ? null : String(row.requirementId) })
}

function parseFacts(value: unknown, segment: PropertySegment): Result<FactRecord[]> {
  if (!Array.isArray(value)) return fail('Property facts were unreadable.')
  const facts: FactRecord[] = []
  for (const item of value) {
    const row = record(item)
    if (!row) return fail('A property fact was unreadable.')
    const extra = only(row, ['key', 'statement', 'evidence'])
    if (extra) return extra
    if (!(factKeys[segment] as readonly string[]).includes(String(row.key))) return fail('That fact does not belong to this property segment.')
    const statement = requiredText(row.statement, 500, 'Fact')
    if (!statement.ok) return statement
    const evidence = parseEvidence(row.evidence, 1)
    if (!evidence.ok) return evidence
    facts.push({ key: row.key as FactKey, statement: statement.value, evidence: evidence.value })
  }
  return ok(facts)
}

function checkDealHistory(property: PropertyRecord): string | null {
  let stage: DealStage = 'lead'
  for (const move of property.history) {
    if (move.from !== stage || !dealStages.includes(move.to as DealStage)) return 'Stage history does not match the property.'
    const to = move.to as DealStage
    if (to === 'commission_due' || to === 'commission_paid') return commissionPosition(property.mandate.commissionTerms).reason
    const skipped = stagesBetween(stage, to)
    if (skipped.join() !== move.skipped.join()) return 'Skipped stages must stay listed in the history.'
    if (to !== 'closed' && (skipped.includes('otp_signed') || skipped.includes('northpoint_scrutiny'))) return 'OTP signature and Northpoint scrutiny cannot be skipped.'
    if (dealStages.indexOf(to) >= dealStages.indexOf('property_matched') && to !== 'closed' && !move.requirementId) return 'A buyer requirement link is required from matching onward.'
    stage = to
  }
  if (stage !== property.stage) return 'Stage history does not match the property.'
  const entered = property.history.some((move) => move.to === 'northpoint_scrutiny')
  const continued = property.history.find((move) => move.from === 'northpoint_scrutiny' && move.to !== 'closed')
  if (!entered && property.scrutiny.state !== 'not_sent') return 'Scrutiny has not been sent.'
  if (continued && (property.scrutiny.state !== 'response_recorded' || continued.evidence.channel !== 'external_head_office')) return 'Northpoint head-office scrutiny cannot be closed from inside Pivot.'
  if (entered && !continued && property.scrutiny.state !== 'sent') return 'Scrutiny was sent. It is not an approval.'
  if (property.scrutiny.responseIsApproval !== false) return 'Pivot cannot record head-office scrutiny as its own approval.'
  const needsAttorney = property.history.some((move) => move.to !== 'closed' && dealStages.indexOf(move.to as DealStage) >= dealStages.indexOf('transfer_instructed'))
  if (needsAttorney !== Boolean(property.attorney.current)) return 'Name the transfer attorney you were given. Pivot does not choose one.'
  if (property.stage !== 'lead' && property.stage !== 'closed' && !latestLocation(property)) return 'Where is the property? Unknown location stops progression.'
  if (property.stage !== 'closed' && dealStages.indexOf(property.stage) >= dealStages.indexOf('otp_preparation') && property.mandate.status !== 'signature_recorded') return 'A signed mandate must be recorded before OTP preparation. This is not a legal opinion.'
  if (property.stage !== 'closed' && dealStages.indexOf(property.stage) >= dealStages.indexOf('otp_signed') && property.documents.some((item) => item.references.length === 0)) return 'A required document reference is missing. Recording it is not legal clearance.'
  return null
}

function parseProperty(value: unknown): Result<PropertyRecord> {
  const row = record(value)
  if (!row) return fail('A property was unreadable.')
  const extra = only(row, ['id', 'label', 'segment', 'transaction', 'partyLabel', 'partyRole', 'locationHistory', 'asking', 'askingHistory', 'confidential', 'source', 'mandate', 'facts', 'documents', 'stage', 'history', 'publication', 'attorney', 'scrutiny', 'legalDetermination', 'visibility', 'capturedAt'])
  if (extra) return extra
  const id = requiredText(row.id, 80, 'Property')
  if (!id.ok || !/^[\w-]{1,80}$/.test(id.value)) return fail('A property reference is required.')
  const label = requiredText(row.label, 180, 'Property')
  if (!label.ok) return label
  if (!propertySegments.includes(row.segment as PropertySegment) || !transactionTypes.includes(row.transaction as TransactionType)) return fail('Choose the property segment and whether it is a sale or a rental.')
  const segment = row.segment as PropertySegment
  const transaction = row.transaction as TransactionType
  const partyLabel = requiredText(row.partyLabel, 180, 'Seller or landlord')
  if (!partyLabel.ok) return partyLabel
  if ((transaction === 'sale' && row.partyRole !== 'seller') || (transaction === 'rental' && row.partyRole !== 'landlord')) return fail(transaction === 'sale' ? 'A sale is captured with a seller.' : 'A rental is captured with a landlord.')
  const partyRole = transaction === 'sale' ? 'seller' : 'landlord'
  const asking = parseAmount(row.asking)
  if (!asking.ok) return asking
  if (!Array.isArray(row.askingHistory)) return fail('Earlier asking figures were unreadable.')
  const askingHistory: Extract<StatedAmount, { state: 'stated' }>[] = []
  for (const item of row.askingHistory) {
    const earlier = parseAmount(item)
    if (!earlier.ok) return earlier
    if (earlier.value.state !== 'stated') return fail('An unknown amount cannot be stored as an earlier figure.')
    askingHistory.push(earlier.value)
  }
  const source = parseSource(row.source)
  if (!source.ok) return source
  const facts = parseFacts(row.facts, segment)
  if (!facts.ok) return facts
  const capturedAt = timestamp(row.capturedAt)
  if (!capturedAt.ok) return capturedAt
  if (row.confidential !== true && row.confidential !== false) return fail('Say whether the property is confidential inside Pivot.')
  if (row.legalDetermination !== 'none' || row.visibility !== 'internal') return fail('Pivot cannot make a legal determination, and this property stays internal.')
  if (!dealStages.includes(row.stage as DealStage)) return fail('That property stage is not part of Northpoint.')
  const publication = record(row.publication)
  if (!publication || publication.property24 !== 'not_connected' || publication.propverse !== 'not_connected') return fail('A portal connection was claimed. None is configured.')
  const publicationExtra = only(publication, ['property24', 'propverse', 'manualReference'])
  if (publicationExtra) return publicationExtra
  const manual = publication.manualReference === null ? null : requiredText(publication.manualReference, 300, 'Manual reference')
  if (manual && !manual.ok) return manual
  const attorney = record(row.attorney)
  if (!attorney) return fail('The attorney record was unreadable.')
  const attorneyExtra = only(attorney, ['current', 'history'])
  if (attorneyExtra) return attorneyExtra
  const attorneyCurrent = attorney.current === null ? null : requiredText(attorney.current, 180, 'Transfer attorney')
  if (attorneyCurrent && !attorneyCurrent.ok) return attorneyCurrent
  if (!Array.isArray(attorney.history)) return fail('The attorney record was unreadable.')
  const attorneyHistory: PropertyRecord['attorney']['history'] = []
  for (const item of attorney.history) {
    const entry = record(item)
    if (!entry) return fail('The attorney record was unreadable.')
    const name = requiredText(entry.value, 180, 'Transfer attorney')
    if (!name.ok) return name
    const when = timestamp(entry.at)
    if (!when.ok) return when
    attorneyHistory.push({ value: name.value, at: when.value })
  }
  const scrutiny = record(row.scrutiny)
  if (!scrutiny || scrutiny.responseIsApproval !== false || !['not_sent', 'sent', 'response_recorded'].includes(String(scrutiny.state))) return fail('Scrutiny cannot be recorded as an approval.')
  const mandate = parseMandate(row.mandate)
  if (!mandate.ok) return mandate
  const documents = parseDocuments(row.documents)
  if (!documents.ok) return documents
  if (!Array.isArray(row.locationHistory) || !Array.isArray(row.history)) return fail('Property history was unreadable.')
  const locationHistory: PropertyRecord['locationHistory'] = []
  for (const item of row.locationHistory) {
    const place = record(item)
    if (!place) return fail('A location was unreadable.')
    const placeExtra = only(place, ['value', 'evidence'])
    if (placeExtra) return placeExtra
    const text = requiredText(place.value, 180, 'Location')
    if (!text.ok) return text
    const evidence = parseEvidence(place.evidence, 1)
    if (!evidence.ok) return evidence
    locationHistory.push({ value: text.value, evidence: evidence.value })
  }
  const history: StageMove[] = []
  for (const item of row.history) {
    const move = parseMove(item)
    if (!move.ok) return move
    history.push(move.value)
  }
  const property: PropertyRecord = {
    id: id.value, label: label.value, segment, transaction, partyLabel: partyLabel.value, partyRole, locationHistory, asking: asking.value, askingHistory, confidential: row.confidential, source: source.value, mandate: mandate.value, facts: facts.value, documents: documents.value, stage: row.stage as DealStage, history, publication: { property24: 'not_connected', propverse: 'not_connected', manualReference: manual && manual.ok ? manual.value : null }, attorney: { current: attorneyCurrent && attorneyCurrent.ok ? attorneyCurrent.value : null, history: attorneyHistory }, scrutiny: { state: scrutiny.state as PropertyRecord['scrutiny']['state'], responseIsApproval: false }, legalDetermination: 'none', visibility: 'internal', capturedAt: capturedAt.value,
  }
  if ((property.attorney.history.at(-1)?.value ?? null) !== property.attorney.current) return fail('The attorney record was unreadable.')
  const historyError = checkDealHistory(property)
  if (historyError) return fail(historyError)
  if (mandate.value.status === 'signature_recorded' && documents.value.find((item) => item.key === 'mandate')?.references.length !== 1) return fail('The signed mandate reference must match the mandate record.')
  return ok(property)
}

function parseMandate(value: unknown): Result<Mandate> {
  const row = record(value)
  if (!row) return fail('A mandate was unreadable.')
  const extra = only(row, ['status', 'type', 'commissionTerms', 'expiry', 'preparedBy', 'reviewedBy', 'events', 'signatureEvidence', 'legalDetermination', 'headOffice'])
  if (extra) return extra
  if (row.legalDetermination !== 'none' || row.headOffice !== 'external_and_not_replaceable') return fail('A mandate review is not a legal determination, and head office is not replaceable.')
  const statuses = ['missing', 'proposed', 'terms_recorded', 'awaiting_review', 'reviewed', 'signature_recorded']
  if (!statuses.includes(String(row.status))) return fail('That mandate step is not available.')
  const status = row.status as Mandate['status']
  if (status === 'missing' ? row.type !== null : !['sole', 'open', 'joint'].includes(String(row.type))) return fail('What mandate type was stated? Sole, open or joint.')
  const terms = row.commissionTerms === null ? null : requiredText(row.commissionTerms, 2000, 'Commission terms')
  if (terms && !terms.ok) return terms
  const expiry = row.expiry === null ? null : calendarDate(row.expiry)
  if (expiry && !expiry.ok) return expiry
  const prepared = row.preparedBy === null ? null : personName(row.preparedBy, 'Prepared by')
  if (prepared && !prepared.ok) return prepared
  const reviewed = row.reviewedBy === null ? null : personName(row.reviewedBy, 'Reviewed by')
  if (reviewed && !reviewed.ok) return reviewed
  if (!Array.isArray(row.events)) return fail('Mandate history was unreadable.')
  const events: Mandate['events'] = []
  for (const item of row.events) {
    const event = record(item)
    if (!event) return fail('Mandate history was unreadable.')
    const eventExtra = only(event, ['at', 'kind', 'actor', 'note'])
    if (eventExtra) return eventExtra
    const at = timestamp(event.at)
    if (!at.ok) return at
    const actor = personName(event.actor, 'Mandate actor')
    if (!actor.ok) return actor
    const note = requiredText(event.note, 2000, 'Mandate note')
    if (!note.ok) return note
    if (!['proposed', 'terms', 'submitted', 'accepted', 'returned', 'signature'].includes(String(event.kind))) return fail('Mandate history was unreadable.')
    events.push({ at: at.value, kind: event.kind as Mandate['events'][number]['kind'], actor: actor.value, note: note.value })
  }
  const signature = row.signatureEvidence === null ? null : parseEvidence(row.signatureEvidence, 3)
  if (signature && !signature.ok) return signature
  const latestTerms = [...events].reverse().find((event) => event.kind === 'terms')?.note ?? null
  if (latestTerms !== (terms?.value ?? null)) return fail('Commission terms must stay in the words that were entered.')
  const last = events.at(-1)?.kind ?? null
  const expected: Record<Mandate['status'], string | null> = { missing: null, proposed: 'proposed', terms_recorded: events.at(-1)?.kind === 'returned' ? 'returned' : 'terms', awaiting_review: 'submitted', reviewed: 'accepted', signature_recorded: 'signature' }
  if (status === 'terms_recorded' && last !== 'terms' && last !== 'returned') return fail('Mandate history does not match its step.')
  if (status !== 'terms_recorded' && last !== expected[status]) return fail('Mandate history does not match its step.')
  if ((status === 'reviewed' || status === 'signature_recorded') !== Boolean(reviewed?.value)) return fail('A person must review the mandate before a signature is recorded.')
  if (status === 'signature_recorded' && (!expiry || !signature || !events.some((event) => event.kind === 'accepted'))) return fail('Record the signed mandate from the document, after review, with its expiry.')
  if (status !== 'signature_recorded' && (expiry || signature)) return fail('Expiry and signature evidence belong to the signed mandate record.')
  if (status === 'missing' && (prepared || events.length)) return fail('Mandate history does not match its step.')
  if (status !== 'missing' && !prepared) return fail('Who prepared the mandate?')
  return ok({ status, type: status === 'missing' ? null : row.type as Mandate['type'], commissionTerms: terms?.value ?? null, expiry: expiry?.value ?? null, preparedBy: prepared?.value ?? null, reviewedBy: reviewed?.value ?? null, events, signatureEvidence: signature?.value ?? null, legalDetermination: 'none', headOffice: 'external_and_not_replaceable' })
}

function parseDocuments(value: unknown): Result<PropertyRecord['documents']> {
  if (!Array.isArray(value) || value.length !== documentCatalogue.length) return fail('The document checklist is incomplete.')
  const documents: PropertyRecord['documents'] = []
  for (const [index, item] of value.entries()) {
    const row = record(item)
    const expected = documentCatalogue[index]
    if (!row || row.key !== expected.key || row.label !== expected.label || row.clearance !== 'not_determined' || !Array.isArray(row.references)) return fail('A document reference is not legal clearance.')
    const extra = only(row, ['key', 'label', 'clearance', 'references'])
    if (extra) return extra
    const references: PropertyRecord['documents'][number]['references'] = []
    for (const reference of row.references) {
      const ref = record(reference)
      if (!ref) return fail('A document reference was unreadable.')
      const refExtra = only(ref, ['reference', 'evidence'])
      if (refExtra) return refExtra
      const text = requiredText(ref.reference, 300, 'Document reference')
      if (!text.ok) return text
      const evidence = parseEvidence(ref.evidence, 3)
      if (!evidence.ok) return evidence
      references.push({ reference: text.value, evidence: evidence.value })
    }
    documents.push({ key: expected.key, label: expected.label, clearance: 'not_determined', references })
  }
  return ok(documents)
}

function parseRequirement(value: unknown): Result<RequirementRecord> {
  const row = record(value)
  if (!row) return fail('A buyer requirement was unreadable.')
  const extra = only(row, ['id', 'partyLabel', 'role', 'segment', 'transaction', 'locations', 'budgetMin', 'budgetMax', 'timeframe', 'mustHaves', 'exclusions', 'textHistory', 'qualification', 'consent', 'consentHistory', 'statements', 'source', 'stage', 'history', 'visibility', 'outbound', 'sentByPivot', 'capturedAt'])
  if (extra) return extra
  const id = requiredText(row.id, 80, 'Requirement')
  if (!id.ok || !/^[\w-]{1,80}$/.test(id.value)) return fail('A requirement reference is required.')
  const partyLabel = requiredText(row.partyLabel, 180, 'Buyer or tenant')
  if (!partyLabel.ok) return partyLabel
  if (!['buyer', 'tenant', 'investor'].includes(String(row.role)) || !propertySegments.includes(row.segment as PropertySegment) || !transactionTypes.includes(row.transaction as TransactionType)) return fail('Choose who is looking, the segment, and sale or rental.')
  const role = row.role as RequirementRecord['role']
  const transaction = row.transaction as TransactionType
  if ((role === 'buyer' && transaction !== 'sale') || (role === 'tenant' && transaction !== 'rental')) return fail(role === 'buyer' ? 'A buyer requirement is a sale. Use tenant for a rental.' : 'A tenant requirement is a rental.')
  const source = parseSource(row.source)
  if (!source.ok) return source
  const budgetMin = parseAmount(row.budgetMin)
  if (!budgetMin.ok) return budgetMin
  const budgetMax = parseAmount(row.budgetMax)
  if (!budgetMax.ok) return budgetMax
  const capturedAt = timestamp(row.capturedAt)
  if (!capturedAt.ok) return capturedAt
  if (row.visibility !== 'internal' || row.outbound !== 'not_enabled' || row.sentByPivot !== false) return fail('Buyer requirements stay internal. Pivot does not send them.')
  if (!requirementStages.includes(row.stage as RequirementStage)) return fail('That requirement stage is not part of Northpoint.')
  const qualification = record(row.qualification)
  if (!qualification) return fail('Qualification was unreadable.')
  const qualificationExtra = only(qualification, qualificationKeys)
  if (qualificationExtra) return qualificationExtra
  const parsedQualification = emptyQualification()
  for (const key of qualificationKeys) {
    const item = record(qualification[key])
    if (!item) return fail('Qualification was unreadable.')
    if (item.state === 'unknown') {
      const itemExtra = only(item, ['state'])
      if (itemExtra) return itemExtra
      parsedQualification[key] = { state: 'unknown' }
    } else if (item.state === 'stated') {
      const itemExtra = only(item, ['state', 'evidence'])
      if (itemExtra) return itemExtra
      const evidence = parseEvidence(item.evidence, 1)
      if (!evidence.ok) return evidence
      parsedQualification[key] = { state: 'stated', evidence: evidence.value }
    } else return fail('Qualification can be stated or unknown. It cannot be cleared.')
  }
  const statements = parseFacts(row.statements, row.segment as PropertySegment)
  if (!statements.ok) return statements
  if (!Array.isArray(row.locations) || !Array.isArray(row.textHistory) || !Array.isArray(row.consentHistory) || !Array.isArray(row.history)) return fail('Requirement history was unreadable.')
  const locations: RequirementRecord['locations'] = []
  for (const item of row.locations) {
    const place = record(item)
    if (!place) return fail('A location was unreadable.')
    const text = requiredText(place.value, 180, 'Location')
    if (!text.ok) return text
    const evidence = parseEvidence(place.evidence, 1)
    if (!evidence.ok) return evidence
    locations.push({ value: text.value, evidence: evidence.value })
  }
  const timeframe = row.timeframe === null ? null : requiredText(row.timeframe, 180, 'Time frame')
  if (timeframe && !timeframe.ok) return timeframe
  const mustHaves = row.mustHaves === null ? null : requiredText(row.mustHaves, 500, 'Must-haves')
  if (mustHaves && !mustHaves.ok) return mustHaves
  const exclusions = row.exclusions === null ? null : requiredText(row.exclusions, 500, 'Exclusions')
  if (exclusions && !exclusions.ok) return exclusions
  const consent = row.consent === 'unknown' || row.consent === 'stated_yes' || row.consent === 'stated_no' ? row.consent : null
  if (!consent) return fail('Consent must be unknown, stated yes, or stated no.')
  const history: StageMove[] = []
  for (const item of row.history) {
    const move = parseMove(item)
    if (!move.ok) return move
    history.push(move.value)
  }
  const textHistory: RequirementRecord['textHistory'] = []
  for (const item of row.textHistory) {
    const entry = record(item)
    if (!entry) return fail('Requirement wording was unreadable.')
    const entryExtra = only(entry, ['field', 'value', 'evidence'])
    if (entryExtra) return entryExtra
    if (entry.field !== 'timeframe' && entry.field !== 'mustHaves' && entry.field !== 'exclusions') return fail('Requirement wording was unreadable.')
    const text = requiredText(entry.value, entry.field === 'timeframe' ? 180 : 500, 'Requirement detail')
    if (!text.ok) return text
    const evidence = parseEvidence(entry.evidence, 1)
    if (!evidence.ok) return evidence
    textHistory.push({ field: entry.field, value: text.value, evidence: evidence.value })
  }
  const consentHistory: RequirementRecord['consentHistory'] = []
  for (const item of row.consentHistory) {
    const entry = record(item)
    if (!entry) return fail('Consent history was unreadable.')
    const entryExtra = only(entry, ['value', 'evidence'])
    if (entryExtra) return entryExtra
    if (entry.value !== 'stated_yes' && entry.value !== 'stated_no') return fail('Consent must be stated yes or stated no.')
    const evidence = parseEvidence(entry.evidence, 1)
    if (!evidence.ok) return evidence
    consentHistory.push({ value: entry.value, evidence: evidence.value })
  }
  const requirement: RequirementRecord = {
    id: id.value, partyLabel: partyLabel.value, role, segment: row.segment as PropertySegment, transaction, locations, budgetMin: budgetMin.value, budgetMax: budgetMax.value, timeframe: timeframe && timeframe.ok ? timeframe.value : null, mustHaves: mustHaves && mustHaves.ok ? mustHaves.value : null, exclusions: exclusions && exclusions.ok ? exclusions.value : null, textHistory, qualification: parsedQualification, consent, consentHistory, statements: statements.value, source: source.value, stage: row.stage as RequirementStage, history, visibility: 'internal', outbound: 'not_enabled', sentByPivot: false, capturedAt: capturedAt.value,
  }
  const historyError = checkRequirementHistory(requirement)
  if (historyError) return fail(historyError)
  return ok(requirement)
}

function checkRequirementHistory(requirement: RequirementRecord) {
  let stage: RequirementStage = 'new'
  for (const move of requirement.history) {
    if (move.from !== stage || !requirementStages.includes(move.to as RequirementStage)) return 'Stage history does not match the requirement.'
    const skipped = requirementSkipped(stage, move.to as RequirementStage)
    if (skipped.join() !== move.skipped.join()) return 'Skipped stages must stay listed in the history.'
    stage = move.to as RequirementStage
  }
  if (stage !== requirement.stage) return 'Stage history does not match the requirement.'
  if ((requirement.consentHistory.at(-1)?.value ?? 'unknown') !== requirement.consent) return 'Consent history does not match.'
  if (requirement.consent === 'unknown' && requirement.consentHistory.length) return 'Consent history does not match.'
  for (const field of ['timeframe', 'mustHaves', 'exclusions'] as const) {
    const latest = [...requirement.textHistory].reverse().find((item) => item.field === field)
    if ((latest?.value ?? null) !== requirement[field]) return 'Requirement wording does not match its history.'
  }
  return null
}

export function readState(value: unknown): Result<NorthpointState> {
  const banned = bannedField(value)
  if (banned) return fail(`“${banned}” is not recorded. Pivot will not calculate, approve or send it.`)
  let identity: ReturnType<typeof moduleIdentity>
  try { identity = moduleIdentity() } catch (error) { return fail(error instanceof Error ? error.message : 'Northpoint is not the catalogue module.') }
  const row = record(value)
  if (!row) return fail('The Northpoint session was unreadable.')
  const extra = only(row, ['version', 'module', 'company', 'name', 'visibility', 'properties', 'requirements'])
  if (extra) return extra
  if (row.version !== 1 || row.module !== '003' || row.company !== 'northpoint' || row.name !== identity.name || row.visibility !== 'internal') return fail('This session is not the internal Northpoint module.')
  if (!Array.isArray(row.properties) || !Array.isArray(row.requirements) || row.properties.length > 200 || row.requirements.length > 200) return fail('This session is full or unreadable.')
  const properties: PropertyRecord[] = []
  const requirements: RequirementRecord[] = []
  const ids = new Set<string>()
  for (const item of row.properties) {
    const property = parseProperty(item)
    if (!property.ok) return property
    if (ids.has(property.value.id)) return fail('That reference is already used.')
    ids.add(property.value.id)
    properties.push(property.value)
  }
  for (const item of row.requirements) {
    const requirement = parseRequirement(item)
    if (!requirement.ok) return requirement
    if (ids.has(requirement.value.id)) return fail('That reference is already used.')
    ids.add(requirement.value.id)
    requirements.push(requirement.value)
  }
  for (const property of properties) {
    for (const move of property.history) {
      if (move.requirementId && !requirements.some((item) => item.id === move.requirementId)) return fail('The buyer requirement link is not in this session.')
    }
  }
  return ok({ version: 1, module: '003', company: 'northpoint', name: identity.name, visibility: 'internal', properties, requirements })
}

export function emptyNorthpoint(): NorthpointState {
  const identity = moduleIdentity()
  return { version: 1, module: '003', company: 'northpoint', name: identity.name, visibility: 'internal', properties: [], requirements: [] }
}

function sourceFrom(kind: unknown, note: unknown, recordedBy: unknown, recordedAt: unknown): Result<SourceRecord> {
  if (!sourceKinds.includes(kind as SourceKind)) return fail('Choose the source you actually used.')
  const text = requiredText(note, 2000, 'What was said')
  if (!text.ok) return text
  const person = personName(recordedBy, 'Recorded by')
  if (!person.ok) return person
  const at = timestamp(recordedAt)
  if (!at.ok) return at
  return ok({ kind: kind as SourceKind, note: text.value, recordedBy: person.value, recordedAt: at.value, connected: false })
}

function statedPlace(value: unknown, evidence: Evidence, label: string): Result<{ value: string; evidence: Evidence }> {
  const text = requiredText(value, 180, label)
  if (!text.ok) return text
  return ok({ value: text.value, evidence })
}

export function propertyNextQuestion(property: PropertyRecord) {
  if (!latestLocation(property)) return 'Where is the property? It stays unknown until you are told.'
  if (property.mandate.status === 'missing') return 'What mandate type was stated? Sole, open or joint.'
  if (property.mandate.status === 'proposed') return 'What commission terms were stated? Keep the words. Nothing is calculated.'
  if (property.mandate.status === 'terms_recorded') return 'A person needs to review this mandate. Nothing is sent.'
  if (property.mandate.status === 'awaiting_review') return 'Record the review. This is not head-office approval.'
  if (property.mandate.status === 'reviewed') return 'Record the signed mandate only from the signed document. This is not a legal opinion.'
  if (property.stage !== 'closed' && dealStages.indexOf(property.stage) >= dealStages.indexOf('negotiation')) {
    const missing = property.documents.find((item) => item.references.length === 0)
    if (missing) return `${missing.label} is not recorded. A file name or link text is not legal clearance.`
  }
  return null
}

export function requirementNextQuestion(requirement: RequirementRecord) {
  if (!requirement.locations.length) return 'Which place was requested? Unknown location stops qualification.'
  if (requirement.budgetMin.state === 'unknown' && requirement.budgetMax.state === 'unknown') return 'What budget was stated? Unknown stays unknown and is not stored as zero.'
  if (!requirement.timeframe) return 'What time frame was stated?'
  for (const key of qualificationKeys) if (requirement.qualification[key].state !== 'stated') return qualificationQuestions[key]
  if (requirement.consent === 'unknown') return 'Was consent stated? It is not assumed, and nothing is sent.'
  return null
}

function norm(value: string) { return value.trim().toLowerCase().replace(/\s+/g, ' ') }

export function compareRequirement(requirement: RequirementRecord, property: PropertyRecord, audience: Audience = 'internal'): MatchReport {
  const hidden = (action: string): MatchReport => ({ propertyId: property.id, requirementId: requirement.id, withheld: true, hardMatches: [], compromises: [], hardMismatches: [], missing: [], aligned: null, recommendedAction: action, clientMessage: null, sent: false, published: false })
  if (audience !== 'internal') return hidden('This comparison is internal to Pivot.')
  const hardMatches: string[] = []
  const compromises: string[] = []
  const hardMismatches: string[] = []
  const missing: string[] = []
  if (requirement.segment !== property.segment) hardMismatches.push(`Segment differs. Requirement: ${requirement.segment}. Property: ${property.segment}.`)
  if (requirement.transaction !== property.transaction) hardMismatches.push('Sale or rental differs.')
  if (requirement.consent === 'stated_no') hardMismatches.push('Consent was stated as no.')
  if (!hardMismatches.length) {
    const place = latestLocation(property)
    if (!place || !requirement.locations.length) missing.push('Location is unknown on one side.')
    else if (requirement.locations.some((item) => place.toLowerCase().includes(item.value.toLowerCase()) || item.value.toLowerCase().includes(place.toLowerCase()))) hardMatches.push('Location uses overlapping words.')
    else hardMismatches.push('Location words do not overlap. No map was used.')
    if (!hardMismatches.length && property.asking.state === 'unknown') missing.push('Asking price is unknown and is not treated as zero.')
    if (!hardMismatches.length && requirement.budgetMin.state === 'unknown' && requirement.budgetMax.state === 'unknown') missing.push('Budget is unknown and is not treated as zero.')
    if (!hardMismatches.length && property.asking.state === 'stated' && (requirement.budgetMin.state === 'stated' || requirement.budgetMax.state === 'stated')) {
      const asking = property.asking.amount
      const above = requirement.budgetMax.state === 'stated' && asking > requirement.budgetMax.amount
      const below = requirement.budgetMin.state === 'stated' && asking < requirement.budgetMin.amount
      if (above) hardMismatches.push('The stated asking figure is above the stated maximum.')
      else if (below) compromises.push('The stated asking figure is below the stated minimum.')
      else hardMatches.push('The stated asking figure sits inside the stated budget.')
    }
    if (!hardMismatches.length && requirement.consent !== 'stated_yes') missing.push('Consent is not a stated yes. Nothing can be sent.')
    if (!hardMismatches.length) {
      for (const key of matchFactKeys[property.segment]) {
        const left = latestFact(requirement.statements, key)
        const right = latestFact(property.facts, key)
        const label = factLabels[key]
        if (!left || !right) missing.push(`${label} is not stated on both sides. ${property.segment === 'farm' ? 'Farm matching does not use bedrooms.' : 'It stays unknown.'}`)
        else if (norm(left.statement) === norm(right.statement)) hardMatches.push(`${label} uses the same words (${evidenceLevelLabels(right)}).`)
        else compromises.push(`${label} wording differs. Requirement: “${left.statement}”. Property: “${right.statement}”.`)
      }
    }
  }
  const aligned = hardMismatches.length || missing.length || compromises.length ? null : `${hardMatches.length} stated facts use the same words`
  let recommendedAction = hardMismatches.length ? 'Do not present this property for this requirement.' : missing.length ? `Ask only for this before anyone calls it a match: ${missing[0]}` : compromises.length ? 'A person needs to judge the different wording before anyone calls it a match.' : 'A person may review this comparison. Nothing has been sent.'
  if (property.confidential) recommendedAction = `Confidential. Keep this inside Pivot. ${recommendedAction}`
  return { propertyId: property.id, requirementId: requirement.id, withheld: false, hardMatches, compromises, hardMismatches, missing, aligned, recommendedAction, clientMessage: null, sent: false, published: false }
}

function evidenceLevelLabels(fact: FactRecord) {
  return fact.evidence.level === 1 ? 'stated by the other party' : fact.evidence.level === 2 ? 'observed by the agent' : fact.evidence.level === 3 ? 'confirmed by a document' : fact.evidence.level === 4 ? 'confirmed by a professional' : 'recorded at a higher evidence level'
}

function qualificationError(requirement: RequirementRecord) {
  if (!requirement.locations.length) return 'Which place was requested? Unknown location stops qualification.'
  if (requirement.budgetMin.state === 'unknown' && requirement.budgetMax.state === 'unknown') return 'What budget was stated? Unknown stays unknown and is not stored as zero.'
  if (!requirement.timeframe) return 'What time frame was stated?'
  for (const key of qualificationKeys) if (requirement.qualification[key].state !== 'stated') return qualificationQuestions[key]
  return null
}

function moveEvidence(value: unknown, minLevel: number, channel?: Evidence['channel']) {
  const evidence = parseEvidence(value, minLevel)
  if (!evidence.ok) return evidence
  if (channel && evidence.value.channel !== channel) return fail<Evidence>('Record the head-office response as external evidence. Pivot cannot close scrutiny itself.')
  return evidence
}

function applyPropertyMove(property: PropertyRecord, action: Record<string, unknown>, requirements: RequirementRecord[]): Result<PropertyRecord> {
  const to = action.to as DealStage
  if (!nextDealStages(property.stage).includes(to)) return fail(to === 'commission_due' || to === 'commission_paid' ? commissionPosition(property.mandate.commissionTerms).reason : 'Choose a later stage, or close the record.')
  const skipped = stagesBetween(property.stage, to)
  if (to !== 'closed' && (skipped.includes('otp_signed') || skipped.includes('northpoint_scrutiny'))) return fail('OTP signature and Northpoint scrutiny cannot be skipped.')
  if (skipped.length && action.acknowledgeSkip !== true) return fail(`These stages will be kept as skipped: ${skipped.map((stage) => dealStageLabels[stage]).join(', ')}. Confirm that skip.`)
  const minLevel = to === 'registered_or_lease_commenced' ? 4 : to === 'otp_signed' ? 3 : 1
  const leavingScrutiny = property.stage === 'northpoint_scrutiny' && to !== 'closed'
  const evidence = moveEvidence(action.evidence, minLevel, leavingScrutiny ? 'external_head_office' : undefined)
  if (!evidence.ok) return evidence
  const actor = personName(action.actor, 'Actor')
  if (!actor.ok) return actor
  const reviewer = personName(action.reviewer, 'Reviewer')
  if (!reviewer.ok) return reviewer
  const reason = requiredText(action.reason, 2000, 'Reason')
  if (!reason.ok) return reason
  const at = timestamp(action.at)
  if (!at.ok) return at
  if (to !== 'closed' && !latestLocation(property)) return fail('Where is the property? Unknown location stops progression.')
  let requirementId: string | null = null
  if (to !== 'closed' && dealStages.indexOf(to) >= dealStages.indexOf('property_matched')) {
    const requirement = requirements.find((item) => item.id === action.requirementId)
    if (!requirement) return fail('Choose the buyer requirement this stage refers to.')
    if ((requirementFlow as readonly string[]).indexOf(requirement.stage) < (requirementFlow as readonly string[]).indexOf('qualified')) return fail('Qualify the buyer requirement before linking it. Unknown budget and consent are not a match.')
    const report = compareRequirement(requirement, property, 'internal')
    if (report.hardMismatches.length || report.missing.length) return fail(report.hardMismatches[0] ?? report.missing[0])
    requirementId = requirement.id
  }
  if (to === 'otp_preparation' && property.mandate.status !== 'signature_recorded') return fail('A signed mandate must be recorded before OTP preparation. This is not a legal opinion.')
  if (to === 'otp_signed') {
    const missing = property.documents.find((item) => item.references.length === 0)
    if (missing) return fail(`${missing.label} is missing. Recording it is not legal clearance.`)
  }
  if (to === 'northpoint_scrutiny' && property.stage !== 'otp_signed') return fail('Scrutiny starts only from a recorded OTP. Pivot cannot perform that scrutiny.')
  let attorney = property.attorney
  if (to !== 'closed' && dealStages.indexOf(to) >= dealStages.indexOf('transfer_instructed')) {
    const name = requiredText(action.attorneyRef, 180, 'Transfer attorney')
    if (!name.ok) return name
    attorney = { current: name.value, history: [...property.attorney.history, { value: name.value, at: at.value }] }
  }
  const scrutiny = { ...property.scrutiny, responseIsApproval: false as const }
  if (to === 'northpoint_scrutiny') scrutiny.state = 'sent'
  if (leavingScrutiny) scrutiny.state = 'response_recorded'
  const move: StageMove = { at: at.value, from: property.stage, to, skipped, actor: actor.value, reviewer: reviewer.value, reason: reason.value, evidence: evidence.value, requirementId }
  return ok({ ...property, stage: to, history: [...property.history, move], attorney, scrutiny })
}

function blankProperty(input: Record<string, unknown>): Result<PropertyRecord> {
  const id = requiredText(input.id, 80, 'Property')
  if (!id.ok || !/^[\w-]{1,80}$/.test(id.value)) return fail('A property reference is required.')
  const label = requiredText(input.label, 180, 'Property')
  if (!label.ok) return label
  if (!propertySegments.includes(input.segment as PropertySegment) || !transactionTypes.includes(input.transaction as TransactionType)) return fail('Choose the property segment and whether it is a sale or a rental.')
  const partyLabel = requiredText(input.partyLabel, 180, 'Seller or landlord')
  if (!partyLabel.ok) return partyLabel
  const transaction = input.transaction as TransactionType
  if ((transaction === 'sale' && input.partyRole !== 'seller') || (transaction === 'rental' && input.partyRole !== 'landlord')) return fail(transaction === 'sale' ? 'A sale is captured with a seller.' : 'A rental is captured with a landlord.')
  const partyRole = transaction === 'sale' ? 'seller' : 'landlord'
  const source = sourceFrom(input.sourceKind, input.sourceNote, input.recordedBy, input.at)
  if (!source.ok) return source
  const at = timestamp(input.at)
  if (!at.ok) return at
  const location = typeof input.location === 'string' && input.location.trim() ? requiredText(input.location, 180, 'Location') : ok('')
  if (!location.ok) return location
  const evidence: Evidence = { level: 1, statement: location.value || source.value.note, sourceRef: source.value.note, recordedBy: source.value.recordedBy, recordedAt: source.value.recordedAt, channel: 'internal' }
  return ok({
    id: id.value, label: label.value, segment: input.segment as PropertySegment, transaction, partyLabel: partyLabel.value, partyRole, locationHistory: location.value ? [{ value: location.value, evidence }] : [], asking: { state: 'unknown' }, askingHistory: [], confidential: input.confidential === true, source: source.value, mandate: emptyMandate(), facts: [], documents: emptyDocuments(), stage: 'lead', history: [], publication: { property24: 'not_connected', propverse: 'not_connected', manualReference: null }, attorney: { current: null, history: [] }, scrutiny: { state: 'not_sent', responseIsApproval: false }, legalDetermination: 'none', visibility: 'internal', capturedAt: at.value,
  })
}

function withProperty(state: NorthpointState, id: unknown, change: (property: PropertyRecord) => Result<PropertyRecord>): Result<NorthpointState> {
  const property = state.properties.find((item) => item.id === id)
  if (!property) return fail('That property is not in this session.')
  const next = change(property)
  if (!next.ok) return next
  return ok({ ...state, properties: state.properties.map((item) => item.id === property.id ? next.value : item) })
}

function withRequirement(state: NorthpointState, id: unknown, change: (requirement: RequirementRecord) => Result<RequirementRecord>): Result<NorthpointState> {
  const requirement = state.requirements.find((item) => item.id === id)
  if (!requirement) return fail('That requirement is not in this session.')
  const next = change(requirement)
  if (!next.ok) return next
  return ok({ ...state, requirements: state.requirements.map((item) => item.id === requirement.id ? next.value : item) })
}

function dispatch(state: NorthpointState, action: Record<string, unknown>): Result<NorthpointState> {
  if (action.type === 'capture_property') {
    if (state.properties.length >= 200) return fail('This session is full.')
    const property = blankProperty(action)
    if (!property.ok) return property
    if (state.properties.some((item) => item.id === property.value.id) || state.requirements.some((item) => item.id === property.value.id)) return fail('That reference is already used.')
    return ok({ ...state, properties: [property.value, ...state.properties] })
  }
  if (action.type === 'record_location') return withProperty(state, action.propertyId, (property) => {
    const evidence = parseEvidence(action.evidence, 1)
    if (!evidence.ok) return evidence
    const place = statedPlace(action.location, evidence.value, 'Location')
    if (!place.ok) return place
    return ok({ ...property, locationHistory: [...property.locationHistory, place.value] })
  })
  if (action.type === 'record_asking') return withProperty(state, action.propertyId, (property) => {
    const asking = amountFromInput(action.amount, action.evidence)
    if (!asking.ok) return asking
    if (asking.value.state === 'unknown') return fail('Leave the asking price blank only while it is unknown. A blank entry does not replace a stated figure.')
    const askingHistory = property.asking.state === 'stated' ? [...property.askingHistory, property.asking] : property.askingHistory
    return ok({ ...property, asking: asking.value, askingHistory })
  })
  if (action.type === 'record_fact') return withProperty(state, action.propertyId, (property) => {
    if (!(factKeys[property.segment] as readonly string[]).includes(String(action.key))) return fail(property.segment === 'farm' ? 'Farm facts are water, zoning, servitudes, infrastructure and land size. Bedrooms are not used.' : 'That fact does not belong to this property segment.')
    const statement = requiredText(action.statement, 500, factLabels[action.key as FactKey] ?? 'Fact')
    if (!statement.ok) return statement
    const evidence = parseEvidence(action.evidence, 1)
    if (!evidence.ok) return evidence
    return ok({ ...property, facts: [...property.facts, { key: action.key as FactKey, statement: statement.value, evidence: evidence.value }] })
  })
  if (action.type === 'propose_mandate') return withProperty(state, action.propertyId, (property) => {
    if (property.mandate.status !== 'missing') return fail('The mandate type is already recorded.')
    if (!['sole', 'open', 'joint'].includes(String(action.mandateType))) return fail('What mandate type was stated? Sole, open or joint.')
    const actor = personName(action.actor, 'Prepared by')
    if (!actor.ok) return actor
    const at = timestamp(action.at)
    if (!at.ok) return at
    return ok({ ...property, mandate: { ...property.mandate, status: 'proposed', type: action.mandateType as Mandate['type'], preparedBy: actor.value, events: [{ at: at.value, kind: 'proposed', actor: actor.value, note: String(action.mandateType) }] } })
  })
  if (action.type === 'record_terms') return withProperty(state, action.propertyId, (property) => {
    if (property.mandate.status !== 'proposed' && property.mandate.status !== 'terms_recorded') return fail('Reviewed terms cannot be edited in place. Return the mandate before changing the words.')
    const terms = requiredText(action.terms, 2000, 'Commission terms')
    if (!terms.ok) return terms
    const actor = personName(action.actor, 'Recorded by')
    if (!actor.ok) return actor
    const at = timestamp(action.at)
    if (!at.ok) return at
    return ok({ ...property, mandate: { ...property.mandate, status: 'terms_recorded', commissionTerms: terms.value, reviewedBy: null, events: [...property.mandate.events, { at: at.value, kind: 'terms', actor: actor.value, note: terms.value }] } })
  })
  if (action.type === 'submit_mandate') return withProperty(state, action.propertyId, (property) => {
    if (property.mandate.status !== 'terms_recorded') return fail('Record the stated commission terms before review.')
    if (!latestLocation(property)) return fail('Where is the property? Unknown location stops mandate review.')
    const actor = personName(action.actor, 'Prepared by')
    if (!actor.ok) return actor
    const at = timestamp(action.at)
    if (!at.ok) return at
    return ok({ ...property, mandate: { ...property.mandate, status: 'awaiting_review', events: [...property.mandate.events, { at: at.value, kind: 'submitted', actor: actor.value, note: 'Review requested inside Pivot. Nothing was sent.' }] } })
  })
  if (action.type === 'review_mandate') return withProperty(state, action.propertyId, (property) => {
    if (property.mandate.status !== 'awaiting_review') return fail('The mandate is not waiting for review.')
    const reviewer = personName(action.reviewer, 'Reviewer')
    if (!reviewer.ok) return reviewer
    const note = requiredText(action.note, 2000, 'Review note')
    if (!note.ok) return note
    const at = timestamp(action.at)
    if (!at.ok) return at
    if (action.decision === 'return') return ok({ ...property, mandate: { ...property.mandate, status: 'terms_recorded', reviewedBy: null, events: [...property.mandate.events, { at: at.value, kind: 'returned', actor: reviewer.value, note: note.value }] } })
    if (action.decision !== 'accept') return fail('Accept the review or return it. This is not head-office approval.')
    return ok({ ...property, mandate: { ...property.mandate, status: 'reviewed', reviewedBy: reviewer.value, events: [...property.mandate.events, { at: at.value, kind: 'accepted', actor: reviewer.value, note: note.value }] } })
  })
  if (action.type === 'reopen_mandate') return withProperty(state, action.propertyId, (property) => {
    if (property.mandate.status !== 'reviewed') return fail('A signed mandate record stays as it was.')
    const actor = personName(action.actor, 'Recorded by')
    if (!actor.ok) return actor
    const note = requiredText(action.note, 2000, 'Reason')
    if (!note.ok) return note
    const at = timestamp(action.at)
    if (!at.ok) return at
    return ok({ ...property, mandate: { ...property.mandate, status: 'terms_recorded', reviewedBy: null, events: [...property.mandate.events, { at: at.value, kind: 'returned', actor: actor.value, note: note.value }] } })
  })
  if (action.type === 'record_signature') return withProperty(state, action.propertyId, (property) => {
    if (property.mandate.status !== 'reviewed') return fail('A person must review the mandate before a signature is recorded.')
    const expiry = calendarDate(action.expiry)
    if (!expiry.ok) return expiry
    const evidence = parseEvidence(action.evidence, 3)
    if (!evidence.ok) return evidence
    const actor = personName(action.actor, 'Recorded by')
    if (!actor.ok) return actor
    const at = timestamp(action.at)
    if (!at.ok) return at
    const documents = property.documents.map((item) => item.key === 'mandate' ? { ...item, references: [{ reference: evidence.value.sourceRef, evidence: evidence.value }] } : item)
    return ok({ ...property, documents, mandate: { ...property.mandate, status: 'signature_recorded', expiry: expiry.value, signatureEvidence: evidence.value, events: [...property.mandate.events, { at: at.value, kind: 'signature', actor: actor.value, note: evidence.value.statement }] } })
  })
  if (action.type === 'record_document') return withProperty(state, action.propertyId, (property) => {
    if (action.key === 'mandate') return fail('Record the signed mandate in the mandate step.')
    const slot = property.documents.find((item) => item.key === action.key)
    if (!slot) return fail('That document is not on the Northpoint checklist.')
    const reference = requiredText(action.reference, 300, 'Document reference')
    if (!reference.ok) return reference
    const evidence = parseEvidence(action.evidence, 3)
    if (!evidence.ok) return evidence
    return ok({ ...property, documents: property.documents.map((item) => item.key === slot.key ? { ...item, clearance: 'not_determined' as const, references: [...item.references, { reference: reference.value, evidence: evidence.value }] } : item) })
  })
  if (action.type === 'record_reference') return withProperty(state, action.propertyId, (property) => {
    const reference = requiredText(action.reference, 300, 'Manual reference')
    if (!reference.ok) return reference
    const person = personName(action.recordedBy, 'Recorded by')
    if (!person.ok) return person
    return ok({ ...property, publication: { property24: 'not_connected', propverse: 'not_connected', manualReference: reference.value } })
  })
  if (action.type === 'advance_property') return withProperty(state, action.propertyId, (property) => applyPropertyMove(property, action, state.requirements))
  if (action.type === 'capture_requirement') {
    if (state.requirements.length >= 200) return fail('This session is full.')
    const requirement = blankRequirement(action)
    if (!requirement.ok) return requirement
    if (state.properties.some((item) => item.id === requirement.value.id) || state.requirements.some((item) => item.id === requirement.value.id)) return fail('That reference is already used.')
    return ok({ ...state, requirements: [requirement.value, ...state.requirements] })
  }
  if (action.type === 'add_location') return withRequirement(state, action.requirementId, (requirement) => {
    const evidence = parseEvidence(action.evidence, 1)
    if (!evidence.ok) return evidence
    const place = statedPlace(action.location, evidence.value, 'Location')
    if (!place.ok) return place
    return ok({ ...requirement, locations: [...requirement.locations, place.value] })
  })
  if (action.type === 'record_budget') return withRequirement(state, action.requirementId, (requirement) => {
    const amount = amountFromInput(action.amount, action.evidence)
    if (!amount.ok) return amount
    if (amount.value.state === 'unknown') return fail('Leave a budget blank when it is unknown. It is not stored as zero.')
    if (action.bound !== 'min' && action.bound !== 'max') return fail('Record the stated minimum or maximum.')
    return ok({ ...requirement, budgetMin: action.bound === 'min' ? amount.value : requirement.budgetMin, budgetMax: action.bound === 'max' ? amount.value : requirement.budgetMax })
  })
  if (action.type === 'record_text') return withRequirement(state, action.requirementId, (requirement) => {
    if (action.field !== 'timeframe' && action.field !== 'mustHaves' && action.field !== 'exclusions') return fail('That detail is not part of the requirement.')
    const text = requiredText(action.value, action.field === 'timeframe' ? 180 : 500, 'Requirement detail')
    if (!text.ok) return text
    const evidence = parseEvidence(action.evidence, 1)
    if (!evidence.ok) return evidence
    return ok({ ...requirement, [action.field]: text.value, textHistory: [...requirement.textHistory, { field: action.field, value: text.value, evidence: evidence.value }] })
  })
  if (action.type === 'state_qualification') return withRequirement(state, action.requirementId, (requirement) => {
    if (!qualificationKeys.includes(action.key as QualificationKey)) return fail('That qualification question is not part of Northpoint.')
    const evidence = parseEvidence(action.evidence, 1)
    if (!evidence.ok) return evidence
    return ok({ ...requirement, qualification: { ...requirement.qualification, [action.key as QualificationKey]: { state: 'stated', evidence: evidence.value } } })
  })
  if (action.type === 'record_consent') return withRequirement(state, action.requirementId, (requirement) => {
    if (action.value !== 'stated_yes' && action.value !== 'stated_no') return fail('Consent must be stated yes or stated no. It is not assumed.')
    const evidence = parseEvidence(action.evidence, 1)
    if (!evidence.ok) return evidence
    return ok({ ...requirement, consent: action.value, consentHistory: [...requirement.consentHistory, { value: action.value, evidence: evidence.value }] })
  })
  if (action.type === 'record_requirement_fact') return withRequirement(state, action.requirementId, (requirement) => {
    if (!(factKeys[requirement.segment] as readonly string[]).includes(String(action.key))) return fail(requirement.segment === 'farm' ? 'Farm requirements use water, zoning, servitudes, infrastructure and land size. Bedrooms are not used.' : 'That fact does not belong to this requirement.')
    const statement = requiredText(action.statement, 500, factLabels[action.key as FactKey] ?? 'Fact')
    if (!statement.ok) return statement
    const evidence = parseEvidence(action.evidence, 1)
    if (!evidence.ok) return evidence
    return ok({ ...requirement, statements: [...requirement.statements, { key: action.key as FactKey, statement: statement.value, evidence: evidence.value }] })
  })
  if (action.type === 'advance_requirement') return withRequirement(state, action.requirementId, (requirement) => applyRequirementMove(requirement, action))
  return fail('That action is not available.')
}

function blankRequirement(input: Record<string, unknown>): Result<RequirementRecord> {
  const id = requiredText(input.id, 80, 'Requirement')
  if (!id.ok || !/^[\w-]{1,80}$/.test(id.value)) return fail('A requirement reference is required.')
  const partyLabel = requiredText(input.partyLabel, 180, 'Buyer or tenant')
  if (!partyLabel.ok) return partyLabel
  if (!['buyer', 'tenant', 'investor'].includes(String(input.role)) || !propertySegments.includes(input.segment as PropertySegment) || !transactionTypes.includes(input.transaction as TransactionType)) return fail('Choose who is looking, the segment, and sale or rental.')
  const role = input.role as RequirementRecord['role']
  const transaction = input.transaction as TransactionType
  if ((role === 'buyer' && transaction !== 'sale') || (role === 'tenant' && transaction !== 'rental')) return fail(role === 'buyer' ? 'A buyer requirement is a sale. Use tenant for a rental.' : 'A tenant requirement is a rental.')
  const source = sourceFrom(input.sourceKind, input.sourceNote, input.recordedBy, input.at)
  if (!source.ok) return source
  const at = timestamp(input.at)
  if (!at.ok) return at
  return ok({ id: id.value, partyLabel: partyLabel.value, role, segment: input.segment as PropertySegment, transaction, locations: [], budgetMin: { state: 'unknown' }, budgetMax: { state: 'unknown' }, timeframe: null, mustHaves: null, exclusions: null, textHistory: [], qualification: emptyQualification(), consent: 'unknown', consentHistory: [], statements: [], source: source.value, stage: 'new', history: [], visibility: 'internal', outbound: 'not_enabled', sentByPivot: false, capturedAt: at.value })
}

function applyRequirementMove(requirement: RequirementRecord, action: Record<string, unknown>): Result<RequirementRecord> {
  const to = action.to as RequirementStage
  if (!requirementStages.includes(to)) return fail('That requirement stage is not part of Northpoint.')
  const allowed = (awaitNext(requirement.stage))
  if (!allowed.includes(to)) return fail('Choose a later stage, or close the requirement.')
  const skipped = requirementSkipped(requirement.stage, to)
  if (skipped.length && action.acknowledgeSkip !== true) return fail(`These stages will be kept as skipped: ${skipped.join(', ')}. Confirm that skip.`)
  const flowIndex = (requirementFlow as readonly string[]).indexOf(to)
  const minLevel = to === 'properties_sent' || to === 'viewing_completed' ? 2 : 1
  const evidence = parseEvidence(action.evidence, minLevel)
  if (!evidence.ok) return evidence
  const actor = personName(action.actor, 'Actor')
  if (!actor.ok) return actor
  const reviewer = personName(action.reviewer, 'Reviewer')
  if (!reviewer.ok) return reviewer
  const reason = requiredText(action.reason, 2000, 'Reason')
  if (!reason.ok) return reason
  const at = timestamp(action.at)
  if (!at.ok) return at
  if (flowIndex >= (requirementFlow as readonly string[]).indexOf('qualified')) {
    const gap = qualificationError(requirement)
    if (gap) return fail(gap)
  }
  if (flowIndex >= (requirementFlow as readonly string[]).indexOf('matching')) {
    if (requirement.consent === 'stated_no') return fail('Consent was stated as no. Do not match or contact this person.')
    if (requirement.consent !== 'stated_yes') return fail('Consent is unknown. It is not assumed.')
  }
  const move: StageMove = { at: at.value, from: requirement.stage, to, skipped, actor: actor.value, reviewer: reviewer.value, reason: reason.value, evidence: evidence.value, requirementId: null }
  return ok({ ...requirement, stage: to, history: [...requirement.history, move], outbound: 'not_enabled', sentByPivot: false })
}

function awaitNext(from: RequirementStage) {
  if ((requirementTerminals as readonly string[]).includes(from)) return []
  return [...requirementFlow.slice((requirementFlow as readonly string[]).indexOf(from) + 1), ...requirementTerminals]
}

export function applyAction(state: unknown, action: unknown): Result<NorthpointState> {
  const banned = bannedField(state) ?? bannedField(action)
  if (banned) return fail(`“${banned}” is not recorded. Pivot will not calculate, approve or send it.`)
  const current = readState(state)
  if (!current.ok) return current
  const row = record(action)
  if (!row || typeof row.type !== 'string') return fail('That action is not available.')
  const next = dispatch(current.value, row)
  if (!next.ok) return next
  return readState(next.value)
}

export function stalledItems(state: NorthpointState, now: string, thresholdDays: number): Result<{ id: string; kind: 'property' | 'requirement'; label: string; days: number }[]> {
  if (!Number.isInteger(thresholdDays) || thresholdDays < 1 || thresholdDays > 365) return fail('Choose a detection window in whole days. This is not a company deadline.')
  const parsedNow = timestamp(now)
  if (!parsedNow.ok) return parsedNow
  const nowMs = Date.parse(parsedNow.value)
  const items = [
    ...state.properties.filter((item) => item.stage !== 'closed').map((item) => ({ id: item.id, kind: 'property' as const, label: item.label, at: item.history.at(-1)?.at ?? item.capturedAt })),
    ...state.requirements.filter((item) => !(requirementTerminals as readonly string[]).includes(item.stage)).map((item) => ({ id: item.id, kind: 'requirement' as const, label: item.partyLabel, at: item.history.at(-1)?.at ?? item.capturedAt })),
  ]
  return ok(items.flatMap((item) => {
    const days = Math.floor((nowMs - Date.parse(item.at)) / 86_400_000)
    return days >= thresholdDays ? [{ id: item.id, kind: item.kind, label: item.label, days }] : []
  }))
}

export function sharedStageLabel(stage: DealStage) {
  return commercialStage(stage).label
}

export function unknownPropertyItems(property: PropertyRecord) {
  return [...unknownAsking(property), ...unknownMatchFacts(property.segment, property.facts)]
}
