import Link from 'next/link'

export const metadata = { title: 'Install Pivot OS' }

export default function InstallPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-6 px-6 py-12 text-ink">
      <p className="text-sm font-bold text-accent">Pivot OS</p>
      <h1 className="text-4xl font-bold tracking-tight">Your desk. On your phone.</h1>
      <p>Add Pivot OS to your home screen for a dedicated app window and quick access to your workspace.</p>
      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="mb-3 text-xl font-semibold">iPhone or iPad</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Open this site in Safari.</li>
          <li>Open the Share menu and choose <strong>Add to Home Screen</strong>.</li>
          <li>Keep <strong>Open as Web App</strong> enabled if shown, then tap <strong>Add</strong>.</li>
        </ol>
      </section>
      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="mb-3 text-xl font-semibold">Android</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Open this site in Chrome.</li>
          <li>Open the browser menu and choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
          <li>Confirm the installation, then open Pivot from your home screen.</li>
        </ol>
      </section>
      <p className="text-sm text-muted">Sign in to access your workspace. Live work needs an internet connection. If you lose your connection, Pivot will show a reconnect screen.</p>
      <Link href="/today" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-accent px-6 font-semibold text-white">Open my desk</Link>
    </main>
  )
}
