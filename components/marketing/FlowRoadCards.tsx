'use client'

import { Fragment, useEffect, useRef, useState, type CSSProperties } from 'react'
import { PivotIcon } from '@/components/workspace/PivotIcon'
import './flow-road-cards.css'

type Stage = { label: string; icon: string; description: string }
type Props = { stages: Stage[]; activeStep: number; onExplore: (index: number) => void }
type MotionStyle = CSSProperties & { [key: `--${string}`]: string | number }
const cargo = [['MESSAGE', 'VOICE NOTE', 'CONTEXT'], ['OWNER', 'NEXT STEP', 'THE PLAN'], ['THE FACTS', 'YOUR CALL', 'REVIEW'], ['NEXT MOVE', 'PROGRESS', 'OUTCOME']]

function ScatteredWords({ text }: { text: string }) {
  return <>{text.split(' ').map((word, index) => <Fragment key={`${word}-${index}`}><span className="pl-road-word" style={{ '--scatter-x': `${(index % 5 - 2) * 25}px`, '--scatter-y': `${-25 - index % 4 * 20}px`, '--scatter-turn': `${index % 2 ? 16 : -14}deg`, '--word-delay': `${index * 12}ms` } as MotionStyle}>{word}</span>{' '}</Fragment>)}</>
}

export function FlowRoadCards({ stages, activeStep, onExplore }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [enabled, setEnabled] = useState(true)
  const [reduced, setReduced] = useState(true)
  const [pageVisible, setPageVisible] = useState(true)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    const visibility = () => setPageVisible(!document.hidden)
    update(); visibility()
    media.addEventListener('change', update)
    document.addEventListener('visibilitychange', visibility)
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .15 })
    if (root.current) observer.observe(root.current)
    return () => { media.removeEventListener('change', update); document.removeEventListener('visibilitychange', visibility); observer.disconnect() }
  }, [])
  return <div className="pl-road-experience" ref={root} data-moving={visible && enabled && !reduced && pageVisible ? 'true' : 'false'}>
    <div className="pl-road-intro"><span><span />CONTEXT IN MOTION</span>{!reduced && <button type="button" onClick={() => setEnabled((value) => !value)} aria-label={enabled ? 'Pause moving words' : 'Play moving words'}>{enabled ? 'Ⅱ Pause movement' : '▷ Play movement'}</button>}</div>
    <div className="pl-road-grid">{stages.map((stage, index) => <article key={stage.label} className={`pl-road-card pl-road-card-${index}${activeStep === index ? ' is-active' : ''}`} aria-label={`${stage.label} workflow`}>
      <div className="pl-road-content"><div className="pl-road-card-top"><PivotIcon name={stage.icon} size={26} /><span>0{index + 1}</span></div>
        <div className="pl-road-track" aria-hidden="true"><svg className="pl-road-drawing" viewBox="0 0 320 80" fill="none"><path d="M-40 50C35 50 70 10 140 35S235 65 360 22" stroke="currentColor" strokeWidth="18" strokeOpacity=".07" /><path d="M-40 50C35 50 70 10 140 35S235 65 360 22" stroke="currentColor" strokeOpacity=".35" strokeDasharray="4 7" /></svg>{cargo[index].map((word, order) => <span className="pl-road-cargo" key={word} style={{ '--cargo-delay': `${-order * 2.4 - index * .7}s` } as MotionStyle}><span>{word}</span><i /><i /></span>)}</div>
        <h3><ScatteredWords text={`${stage.label}.`} /></h3><p><ScatteredWords text={stage.description} /></p>
      </div>
      <div className="pl-vapor-dust" aria-hidden="true">{Array.from({ length: 12 }, (_, particle) => <i key={particle} style={{ '--dust-x': `${(particle % 6 - 2.5) * 34}px`, '--dust-y': `${-40 - Math.floor(particle / 3) * 26}px`, '--dust-delay': `${particle * 24}ms` } as MotionStyle} />)}</div>
      <button type="button" className="pl-road-explore" aria-label={`Explore ${stage.label} example`} onClick={() => onExplore(index)}><span>Explore more</span><PivotIcon name="arrow" size={18} /></button>
      <span className="pl-road-hover-hint" aria-hidden="true">{index === 0 ? 'HOVER TO CLEAR THE WAY' : 'MAKE ROOM FOR THE NEXT MOVE'}</span>
    </article>)}</div>
  </div>
}
