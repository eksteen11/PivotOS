'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { startsAtIso, DOOR_COMPANIES, type DoorCompanyId, type DoorCompanyOption, type DoorMeeting } from '@/lib/door/meetings'

export function FrontDoor({
  items,
  companies,
  deskHref = '/today',
  week,
}: {
  items: DoorMeeting[]
  companies: DoorCompanyOption[]
  deskHref?: string
  week?: { label: string; isCurrent: boolean; previousHref: string; nextHref: string; currentHref: string }
}) {
  const [door, setDoor] = useState<DoorCompanyId | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)

  const visible = door ? items.filter((item) => item.company === door) : items
  const creating = openId === 'new'
  const open = creating ? null : visible.find((item) => item.id === openId) ?? null
  const companyLabel = DOOR_COMPANIES.find((item) => item.id === door)?.label
  const showing = creating || open !== null

  return (
    <section className="min-h-screen bg-[#F6F3EC] text-[#1A1C1C]">
      <header className="flex items-center gap-6 border-b border-black/10 px-5 py-4 sm:px-8">
        <button
          type="button"
          onClick={() => {
            setDoor(null)
            setOpenId(null)
          }}
          className="shrink-0 text-2xl font-extrabold tracking-[-0.04em]"
        >
          Pivot OS
        </button>
        <nav className="flex gap-5 overflow-x-auto text-[15px] text-[#5c5c5c]">
          {DOOR_COMPANIES.map((item) => {
            const active = door === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setDoor(item.id)
                  setOpenId(null)
                }}
                className={`shrink-0 pb-1 ${active ? 'font-semibold text-[#1A1C1C]' : ''}`}
              >
                <span className={active ? 'border-b-2 border-[#1F8A4C] pb-1' : ''}>{item.label}</span>
              </button>
            )
          })}
        </nav>
        <Link href={deskHref} className="ml-auto shrink-0 text-sm font-semibold text-[#1F8A4C]">
          Open desk
        </Link>
      </header>

      <div className="lg:grid lg:min-h-[calc(100vh-65px)] lg:grid-cols-[minmax(280px,380px)_1fr]">
        <div className={showing ? 'hidden lg:block' : 'block'}>
          <div className="border-black/10 px-5 py-6 sm:px-8 lg:border-r lg:py-8">
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-[28px] font-extrabold tracking-[-0.03em]">Meetings</h1>
              <button type="button" onClick={() => setOpenId('new')} className="shrink-0 text-sm font-semibold text-[#1F8A4C]">
                New meeting
              </button>
            </div>
            {week ? (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                <Link href={week.previousHref} className="font-semibold text-[#1F8A4C]">Previous week</Link>
                <span className="font-semibold">{week.label}</span>
                <Link href={week.nextHref} className="font-semibold text-[#1F8A4C]">Next week</Link>
                {week.isCurrent ? null : <Link href={week.currentHref} className="font-semibold text-[#1F8A4C]">This week</Link>}
              </div>
            ) : null}
            {visible.length === 0 ? (
              <p className="mt-8 max-w-xs text-[15px] leading-6 text-[#5c5c5c]">
                {companyLabel
                  ? `No meetings in ${companyLabel} ${week && !week.isCurrent ? `for ${week.label}` : 'today or this week'}.`
                  : week && !week.isCurrent ? `No meetings for ${week.label}.` : 'No meetings today or this week.'}
              </p>
            ) : (
              <div className="mt-6">
                <MeetingGroup label="Today" items={visible.filter((item) => item.when === 'today')} openId={open?.id ?? null} onOpen={setOpenId} />
                <MeetingGroup label={week && !week.isCurrent ? week.label : 'This week'} items={visible.filter((item) => item.when === 'week')} openId={open?.id ?? null} onOpen={setOpenId} />
              </div>
            )}
          </div>
        </div>

        <div className={showing ? 'block px-5 py-6 sm:px-10 lg:py-8' : 'hidden px-5 py-6 sm:px-10 lg:block lg:py-8'}>
          {creating ? (
            <NewMeeting companies={companies} preferred={door} onCancel={() => setOpenId(null)} />
          ) : open ? (
            <article>
              <button type="button" onClick={() => setOpenId(null)} className="mb-6 text-sm font-semibold text-[#1F8A4C] lg:hidden">
                Back
              </button>
              <h2 className="text-[32px] font-extrabold tracking-[-0.03em]">{open.title}</h2>
              <p className="mt-2 text-[15px] text-[#6b6b6b]">
                {DOOR_COMPANIES.find((item) => item.id === open.company)?.label} · Meetings
              </p>
              <dl className="mt-8 max-w-xl space-y-5 text-[16px] leading-7">
                <Record label="Description" value={open.description} />
                <Record label="People" value={open.people} />
                <Record label="When" value={open.timeLabel} />
                {open.link ? (
                  <div>
                    <dt className="text-sm text-[#6b6b6b]">Link</dt>
                    <dd className="mt-1">
                      {open.link.startsWith('http') ? (
                        <a href={open.link} className="font-semibold text-[#1F8A4C]" target="_blank" rel="noreferrer">
                          {open.link}
                        </a>
                      ) : (
                        open.link
                      )}
                    </dd>
                  </div>
                ) : null}
                <Record label="Place" value={open.place} />
              </dl>
            </article>
          ) : (
            <p className="max-w-sm text-[15px] leading-6 text-[#6b6b6b]">
              {companyLabel ? `${companyLabel} meetings for today and this week are on the left.` : 'Pick a meeting, or add one.'}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

function MeetingGroup({
  label,
  items,
  openId,
  onOpen,
}: {
  label: string
  items: DoorMeeting[]
  openId: string | null
  onOpen: (id: string) => void
}) {
  if (items.length === 0) return null
  return (
    <section className="mt-6">
      <h2 className="text-sm font-semibold text-[#6b6b6b]">{label}</h2>
      <ul className="mt-2 divide-y divide-black/10 border-y border-black/10">
        {items.map((item) => {
          const selected = openId === item.id
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onOpen(item.id)}
                className={`flex w-full gap-3 py-4 text-left ${selected ? 'bg-[#EFEBE3]' : ''}`}
              >
                <span className={`w-1 shrink-0 rounded-full ${selected ? 'bg-[#1F8A4C]' : 'bg-transparent'}`} />
                <span>
                  <span className="block text-[17px] font-bold tracking-[-0.02em]">{item.title}</span>
                  <span className="mt-0.5 block text-sm text-[#6b6b6b]">
                    {DOOR_COMPANIES.find((door) => door.id === item.company)?.label} · {item.timeLabel}
                  </span>
                </span>
              </button>
              <Link href={`/today/meetings/${item.id}`} className="mb-3 ml-4 inline-block text-sm text-[#1F8A4C]">Open meeting</Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function Record({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div>
      <dt className="text-sm text-[#6b6b6b]">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  )
}

function NewMeeting({ companies, preferred, onCancel }: { companies: DoorCompanyOption[]; preferred: DoorCompanyId | null; onCancel: () => void }) {
  const router = useRouter()
  const [description, setDescription] = useState('')
  const [entityId, setEntityId] = useState(companies.find((company) => company.id === preferred)?.entityId ?? companies[0]?.entityId ?? '')
  const [people, setPeople] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [link, setLink] = useState('')
  const [place, setPlace] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const ready = description.trim() && entityId && people.trim() && date && time && (link.trim() || place.trim())

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    const dueAt = startsAtIso(date, time)
    if (!ready || !dueAt) return
    setBusy(true)
    setError('')
    const response = await fetch('/api/meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: description.trim(),
        content: description.trim(),
        entity_id: entityId,
        due_at: dueAt,
        people: people.trim(),
        link: link.trim(),
        place: place.trim(),
      }),
    })
    setBusy(false)
    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      setError(typeof body.error === 'string' ? body.error : 'The meeting was not saved.')
      return
    }
    onCancel()
    router.refresh()
  }

  return (
    <section>
      <button type="button" onClick={onCancel} className="mb-6 text-sm font-semibold text-[#1F8A4C] lg:hidden">
        Back
      </button>
      <h2 className="text-[32px] font-extrabold tracking-[-0.03em]">New meeting</h2>
      {companies.length === 0 ? <p className="mt-6 max-w-sm text-[15px] leading-6 text-[#5c5c5c]">The companies are not ready yet.</p> : null}
      {companies.length === 0 ? null : (
      <form onSubmit={(event) => void submit(event)} className="mt-8 max-w-xl space-y-5">
        <Field label="Description" value={description} onChange={setDescription} />
        <label className="block text-sm text-[#6b6b6b]">
          Company
          <select className="mt-1 w-full border border-black/15 bg-white px-3 py-3 text-[16px] text-[#1A1C1C]" value={entityId} onChange={(event) => setEntityId(event.target.value)}>
            {companies.map((company) => (
              <option key={company.entityId} value={company.entityId}>{company.label}</option>
            ))}
          </select>
        </label>
        <Field label="People" value={people} onChange={setPeople} />
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm text-[#6b6b6b]">
            Date
            <input type="date" className="mt-1 w-full border border-black/15 bg-white px-3 py-3 text-[16px]" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
          <label className="block text-sm text-[#6b6b6b]">
            Time
            <input type="time" className="mt-1 w-full border border-black/15 bg-white px-3 py-3 text-[16px]" value={time} onChange={(event) => setTime(event.target.value)} />
          </label>
        </div>
        <Field label="Link" value={link} onChange={setLink} />
        <Field label="Place" value={place} onChange={setPlace} />
        <p className="text-sm text-[#6b6b6b]">Add a link, a place, or both.</p>
        {error ? <p className="text-sm text-[#1A1C1C]">{error}</p> : null}
        <button type="submit" disabled={!ready || busy} className="bg-[#1F8A4C] px-5 py-3 text-[15px] font-semibold text-white disabled:opacity-40">
          {busy ? 'Saving…' : 'Save meeting'}
        </button>
      </form>
      )}
    </section>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm text-[#6b6b6b]">
      {label}
      <input className="mt-1 w-full border border-black/15 bg-white px-3 py-3 text-[16px] text-[#1A1C1C]" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}
