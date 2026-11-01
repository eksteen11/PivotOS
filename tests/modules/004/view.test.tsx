import assert from 'node:assert/strict'
import { test } from 'node:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { captureEnquiry, emptyDraft, type EnquiryDraft } from '../../../lib/modules/004/enquiry'
import { proposeMatch } from '../../../lib/modules/004/match'
import { FarmFeedDesk } from '../../../components/modules/004/FarmFeedDesk'
import { FarmFeedEvidence } from '../../../components/modules/004/FarmFeedEvidence'

function draft(side: 'supply' | 'demand', name: string): EnquiryDraft {
  return {
    ...emptyDraft(side, side),
    productText: 'Oat hay',
    quantityText: '12',
    unit: 'tonne',
    gradeText: 'feed grade',
    qualityLevel: '2',
    qualitySource: 'Observed by Farm Feed',
    placeText: side === 'supply' ? 'Collection shed' : 'Delivery shed',
    priceText: side === 'supply' ? '1800' : '2400',
    vatTreatment: 'exclusive',
    counterpartyName: name,
    commercialRole: 'principal',
    originalWording: 'Oat hay as written',
  }
}

test('the Farm Feed desk is an internal module surface', () => {
  const html = renderToStaticMarkup(<FarmFeedDesk />)
  assert.match(html, /data-module="004"/)
  assert.match(html, /Supply · VERKOOP/)
  assert.match(html, /Demand · SOEK/)
  assert.match(html, /Quantity/)
  assert.match(html, /tonne/)
  assert.match(html, /Nothing is sent, booked or posted/)
  assert.equal(html.includes('<html'), false)
})

test('counterparty evidence stays on the internal record', () => {
  const supply = captureEnquiry(draft('supply', 'Sarel Venter'))
  const demand = captureEnquiry(draft('demand', 'Anna Buyer'))
  assert.ok(!('error' in supply) && !('error' in demand))
  if ('error' in supply || 'error' in demand) return
  const proposal = proposeMatch(supply.enquiry, demand.enquiry, { minimumMarginBps: 500 })
  const html = renderToStaticMarkup(<FarmFeedEvidence proposal={proposal} decision={null} />)
  const draftText = html.slice(html.indexOf('data-audience="counterparty"'), html.indexOf('data-audience="internal"'))
  const internal = html.slice(html.indexOf('data-audience="internal"'))
  assert.equal(draftText.includes('Sarel Venter'), false)
  assert.equal(draftText.includes('Anna Buyer'), false)
  assert.match(draftText, /not sent/)
  assert.match(internal, /Sarel Venter/)
  assert.match(html, /per unit/)
  assert.match(html, /Unknown, not zero: /)
})
