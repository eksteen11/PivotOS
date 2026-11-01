'use client'
import { useEffect, useRef } from 'react'
import { PivotIcon } from './PivotIcon'

export function Dialog({ children, onClose, label, wide = false }: { children: React.ReactNode; onClose: () => void; label: string; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => { const dialog = ref.current; dialog?.showModal(); return () => dialog?.close() }, [])
  return <dialog ref={ref} className={`pivot-dialog ${wide ? 'pivot-dialog-wide' : ''}`} aria-label={label} onCancel={(event) => { event.preventDefault(); onClose() }} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}><div className="pivot-dialog-top"><span>Pivot OS <span className="pivot-dot-divider">/</span> {label}</span><button className="pivot-icon-button" type="button" onClick={onClose} aria-label="Close dialog"><PivotIcon name="close" /></button></div>{children}</dialog>
}
