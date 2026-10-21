import type { AnchorHTMLAttributes, ReactNode } from 'react'

export default function Link({ href, children, ...rest }: { href: string; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      {...rest}
      onClick={(event) => {
        event.preventDefault()
        const url = new URL(href, window.location.origin)
        window.history.pushState({}, '', `${url.pathname}${url.search}`)
        window.dispatchEvent(new PopStateEvent('popstate'))
      }}
    >
      {children}
    </a>
  )
}
