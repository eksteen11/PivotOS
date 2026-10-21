import { requireFounder } from '@/lib/auth/requireFounder'

export const dynamic = 'force-dynamic'

export default async function DoorLayout({ children }: { children: React.ReactNode }) {
  await requireFounder()
  return <section className="min-h-screen bg-[#F6F3EC]">{children}</section>
}
