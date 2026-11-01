import { createRequire } from 'node:module'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const require = createRequire(join(process.cwd(), 'package.json'))
const esbuild = require('esbuild')
const outfile = join(mkdtempSync(join(tmpdir(), 'livestock-desk-')), 'render.cjs')

await esbuild.build({
  stdin: {
    contents: `const { renderToStaticMarkup } = require('react-dom/server')
const { LivestockDesk } = require('./components/modules/005/LivestockDesk')
const { sampleDeskModel } = require('./lib/modules/005/case')
function sampleDeskHtml() {
  return renderToStaticMarkup(LivestockDesk({ model: sampleDeskModel() }))
}
module.exports = { sampleDeskHtml }
`,
    resolveDir: process.cwd(),
    loader: 'ts',
    sourcefile: 'render-desk.ts',
  },
  bundle: true,
  format: 'cjs',
  platform: 'node',
  outfile,
  jsx: 'automatic',
})

process.stdout.write(require(outfile).sampleDeskHtml())
