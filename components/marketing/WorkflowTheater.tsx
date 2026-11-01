import type { CSSProperties } from 'react'
import { PivotIcon, PivotMark } from '@/components/workspace/PivotIcon'
import './workflow-theater.css'

type Story = { name: string; message: string; task: string; facts: string[] }
type Props = { step: number; story: Story; running: boolean }
type MotionStyle = CSSProperties & { [key: `--${string}`]: string | number }
const headlines = ['Every signal. One place.', 'The moving parts, aligned.', 'Your judgement. Centre stage.', 'A next step. Never a loose end.']
const labels = ['CAPTURE THE CONTEXT', 'BRING THE PLAN TOGETHER', 'KEEP THE DECISION YOURS', 'CARRY THE WORK FORWARD']
const fragments = [
  ['Voice note', 'A new enquiry', 'The original message', 'People & places', 'One saved context'],
  ['The right business', 'Missing details', 'A clear owner', 'The next action', 'A practical plan'],
  ['Check the facts', 'Review the draft', 'Your decision', 'Nothing sent', 'You stay in control'],
  ['An owner', 'The next action', 'Visible progress', 'Original context', 'A saved history'],
]
const documents: MotionStyle[] = [
  { '--doc-x': '-310px', '--doc-y': '-100px', '--doc-turn': '-40deg', '--delay': '80ms' },
  { '--doc-x': '310px', '--doc-y': '-90px', '--doc-turn': '35deg', '--delay': '160ms' },
  { '--doc-x': '-235px', '--doc-y': '130px', '--doc-turn': '-65deg', '--delay': '40ms' },
  { '--doc-x': '250px', '--doc-y': '135px', '--doc-turn': '55deg', '--delay': '120ms' },
  { '--doc-x': '-100px', '--doc-y': '-160px', '--doc-turn': '20deg', '--delay': '190ms' },
  { '--doc-x': '110px', '--doc-y': '160px', '--doc-turn': '-25deg', '--delay': '220ms' },
]
const sparks = Array.from({ length: 16 }, (_, index) => {
  const angle = index * Math.PI * 2 / 16
  return { '--burst-x': `${Math.round(Math.cos(angle) * (index % 2 ? 215 : 280))}px`, '--burst-y': `${Math.round(Math.sin(angle) * (index % 2 ? 120 : 170))}px`, '--burst-turn': `${index * 29}deg`, '--delay': `${index * 17}ms` } as MotionStyle
})

function VoiceWave() {
  return <svg viewBox="0 0 100 30" fill="none" aria-hidden="true">{[9, 16, 23, 12, 27, 19, 10, 22, 16, 8, 20, 13].map((height, index) => <path key={index} d={`M${5 + index * 8} ${15 - height / 2}v${height}`} stroke="currentColor" strokeWidth="3" strokeLinecap="round" />)}</svg>
}

export function WorkflowTheater({ step, story, running }: Props) {
  return <div className="pl-theater pl-scene" data-step={step} data-running={running ? 'true' : 'false'} aria-label={`${labels[step]} · sample workflow`}>
    <div className="pl-theater-grid" aria-hidden="true" />
    <div className="pl-theater-topline"><span><span className="pl-theater-light" />A WORLD OF WORK. COMING TOGETHER.</span><span>0{step + 1} <i>/</i> 04</span></div>
    <div className="pl-theater-title"><span>{labels[step]}</span><h3>{headlines[step]}</h3></div>
    <div className="pl-theater-stage">
      <svg className="pl-orbital-map" viewBox="0 0 800 380" fill="none" aria-hidden="true">
        <ellipse cx="400" cy="190" rx="315" ry="136" stroke="currentColor" strokeDasharray="3 13" />
        <ellipse cx="400" cy="190" rx="235" ry="166" stroke="currentColor" strokeOpacity=".5" />
        <path d="M32 190h120M648 190h120M400 10v45M400 325v45" stroke="currentColor" />
        <circle cx="85" cy="190" r="5" fill="currentColor" /><circle cx="715" cy="190" r="5" fill="currentColor" />
      </svg>
      <div className="pl-impact-ring" aria-hidden="true" />
      <div className="pl-information-burst" aria-hidden="true">{sparks.map((style, index) => <span key={index} style={style} className={index % 3 === 0 ? 'is-cross' : ''} />)}</div>
      <div className="pl-document-burst" aria-hidden="true">{documents.map((style, index) => <span key={index} style={style}><svg viewBox="0 0 44 54" fill="none"><rect x="1" y="1" width="42" height="52" rx="6" fill="currentColor" fillOpacity=".1" stroke="currentColor" /><rect x="9" y="10" width="10" height="10" rx="2" fill="currentColor" fillOpacity=".5" /><path d="M9 29h26M9 36h26M9 43h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></span>)}</div>
      <div className="pl-screen-deck" aria-hidden="true"><div /><div /></div>
      <div className="pl-cinema-screen">
        <div className="pl-cinema-chrome"><span><i /><i /><i /></span><b>{story.name}</b><span>DEMO</span></div>
        {step === 0 ? <div className="pl-cinema-content pl-capture-screen"><div className="pl-cinema-source"><span className="pl-cinema-icon"><PivotIcon name="inbox" size={20} /></span><div><small>THE ORIGINAL MESSAGE</small><strong>A new conversation.</strong></div><span className="pl-cinema-badge">Captured</span></div><blockquote>“{story.message}”</blockquote><div className="pl-cinema-voice"><span className="pl-voice-play" aria-hidden="true">▶</span><VoiceWave /><span>Sample voice note</span></div><div className="pl-cinema-footnote"><PivotIcon name="lock" size={12} />Original context stays attached.</div></div>
          : step === 1 ? <div className="pl-cinema-content pl-plan-screen"><span className="pl-cinema-kicker"><PivotIcon name="systems" size={15} />PROPOSED WORK PLAN</span><h4>{story.task}</h4><div className="pl-cinema-tasks">{story.facts.map((fact, index) => <div key={fact} style={{ '--item-delay': `${160 + index * 130}ms` } as MotionStyle}><span>0{index + 1}</span><strong>{fact}</strong><span className="pl-task-square" /></div>)}</div><div className="pl-cinema-footnote"><PivotIcon name="work" size={13} />One plan. The full picture.</div></div>
          : step === 2 ? <div className="pl-cinema-content pl-review-screen"><div className="pl-review-identity"><span className="pl-approval-lock"><PivotIcon name="lock" size={25} /></span><span className="pl-cinema-badge is-amber">Approval required</span></div><h4>Ready for your judgement.</h4><p>{story.facts[2]}. Review the details before anything moves.</p><div className="pl-cinema-reviewer"><span className="pl-review-avatar">DJ</span><div><strong>The decision stays with you.</strong><span>Nothing is sent from this demonstration.</span></div><PivotIcon name="lock" size={18} /></div></div>
          : <div className="pl-cinema-content pl-follow-screen"><span className="pl-cinema-kicker"><PivotIcon name="work" size={15} />TRACK THE NEXT ACTION</span><h4>{story.task}</h4><div className="pl-cinema-timeline"><div><span className="pl-timeline-dot" /><span>Owner</span><strong>Drikus</strong></div><div><span className="pl-timeline-dot" /><span>Next action</span><strong>{story.facts[0]}</strong></div><div><span className="pl-timeline-dot is-waiting" /><span>State</span><strong>Awaiting review</strong></div></div><div className="pl-cinema-footnote"><PivotIcon name="lock" size={12} />The context moves with the work.</div></div>}
      </div>
      <div className="pl-flying-note pl-note-one" aria-hidden="true"><span className="pl-note-icon"><PivotIcon name={step === 0 ? 'inbox' : step === 1 ? 'systems' : step === 2 ? 'lock' : 'work'} size={18} /></span><span>{fragments[step][0]}</span></div>
      <div className="pl-flying-note pl-note-two" aria-hidden="true"><span className="pl-note-icon"><PivotIcon name="calendar" size={18} /></span><span>{fragments[step][1]}</span></div>
      <div className="pl-flying-note pl-note-three" aria-hidden="true"><span className="pl-note-avatar">DJ</span><span>{fragments[step][2]}</span></div>
      <div className="pl-flying-note pl-note-four" aria-hidden="true"><span className="pl-note-icon"><PivotIcon name="lock" size={17} /></span><span>{fragments[step][3]}</span></div>
      <div className="pl-floating-mark" aria-hidden="true"><PivotMark /></div>
    </div>
    <div className="pl-theater-bottomline"><span><PivotIcon name="arrow" size={15} />{fragments[step][4]}</span><span>YOUR WORLD, CONNECTED.</span></div>
    <div className="pl-theater-timer" aria-hidden="true"><span /></div>
  </div>
}
