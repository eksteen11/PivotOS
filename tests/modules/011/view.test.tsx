import assert from 'node:assert/strict'
import { test } from 'node:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { DigitalProductDesk } from '../../../components/modules/011/DigitalProductDesk'
import { exampleDeskState } from '../../../lib/modules/011/desk'

test('the digital product desk is an internal module with honest unavailable integrations', () => {
  const html = renderToStaticMarkup(<DigitalProductDesk initial={exampleDeskState()} />)
  assert.match(html, /data-module="011"/)
  assert.match(html, /data-company="digikraal"/)
  assert.match(html, /data-jira="not-connected"/)
  assert.match(html, /data-github="not-connected"/)
  assert.match(html, /data-public-site="not-published-from-pivot"/)
  assert.match(html, /data-payments="unavailable"/)
  assert.match(html, /data-separate-app="false"/)
  assert.match(html, /data-provider="not-connected"/)
  assert.match(html, /Linked source is stale/)
  assert.match(html, /Jira is not connected/)
  assert.match(html, /GitHub is not connected/)
  assert.match(html, /not published from Pivot/)
  assert.match(html, /Payments are unavailable/)
  assert.match(html, /not an approved release/)
  assert.match(html, /MRK-241/)
  assert.match(html, /Example only/)
  assert.match(html, /Internal Pivot OS module/)
  assert.equal(html.includes('Site is live'), false)
  assert.equal(html.includes('Deployed'), false)
  assert.equal(html.includes('<html'), false)
})
