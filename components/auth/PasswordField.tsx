'use client'
import { useId, useState } from 'react'

export function PasswordField({ label = 'Password', value, onChange, autoComplete = 'current-password', minLength }: { label?: string; value: string; onChange: (value: string) => void; autoComplete?: string; minLength?: number }) {
  const id = useId()
  const [visible, setVisible] = useState(false)
  return <div className="account-field"><label htmlFor={id}>{label}</label><span className="account-password-input"><input id={id} type={visible ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} minLength={minLength} maxLength={128} required /><button type="button" onClick={() => setVisible((current) => !current)} aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`} aria-pressed={visible}>{visible ? 'Hide' : 'Show'}</button></span></div>
}
