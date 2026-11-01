'use client'

import { composePartnerDesk } from '@/lib/modules/007/desk'
import type { PartnerBooks, WaterfallInput } from '@/lib/modules/007/contract'
import './partner-farming.css'

export type PartnerFarmingDeskProps = {
  books: PartnerBooks
  waterfall: WaterfallInput
  onOpen: (id: string) => void
}

export function PartnerFarmingDesk({ books, waterfall, onOpen }: PartnerFarmingDeskProps) {
  const view = composePartnerDesk(books, waterfall)
  return (
    <section
      className="partner-farming"
      aria-label="Partner Farming and Trading"
      data-module={view.moduleId}
      data-partnership={view.partnershipId}
      data-money-moved="false"
      data-paid="false"
      data-provider={view.providerStatus}
      data-profit-state={view.profitState}
      data-payable={view.payable ? 'true' : 'false'}
      data-split={view.split}
    >
      <header>
        <p className="partner-farming-kicker">007 · Digikraal · Partner farming and trading</p>
        <h2>{view.action.title}</h2>
        <p>{view.action.detail}</p>
      </header>
      <button className="partner-farming-primary" type="button" onClick={() => onOpen(view.action.id)}>{view.action.button}</button>
      <section className="partner-farming-block" aria-label="Cash custody">
        <h3>Cash custody</h3>
        <ul>
          {view.cash.map((row) => (
            <li key={row.location}>
              <span>{row.label}</span>
              <span>Expected {row.expected}</span>
              <span>Counted {row.counted}</span>
              <span>{row.variance === 'Ties' || row.variance === 'Not counted' ? row.variance : `Variance ${row.variance}`}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="partner-farming-block" aria-label="Stock">
        <h3>Stock</h3>
        {view.stock.length ? (
          <ul>
            {view.stock.map((row) => (
              <li key={row.id}>
                <span>{row.label}</span>
                <span>Expected {row.expected}</span>
                <span>Counted {row.counted}</span>
                <span>{row.variance === 'Ties' || row.variance === 'Not counted' ? row.variance : `Variance ${row.variance}`}</span>
              </li>
            ))}
          </ul>
        ) : <p>No stock is on this record.</p>}
      </section>
      <p className="partner-farming-split">{view.splitLabel}</p>
      {view.hiddenOtherPartnerships ? <p>Other partnerships stay off this desk.</p> : null}
      <footer>
        <span>This screen does not move money.</span>
        <span>Bank and Xero are not connected.</span>
      </footer>
      <details>
        <summary>Assumptions in this calculation</summary>
        <ul>{view.assumptions.map((item) => <li key={item}>{item}</li>)}</ul>
      </details>
    </section>
  )
}
