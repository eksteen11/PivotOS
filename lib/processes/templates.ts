export const PROCESS_TEMPLATES = [
  { slug: 'lead', name: 'Lead process', steps: ['Qualify lead', 'Send proposal', 'Schedule demo', 'Close'] },
  { slug: 'quote', name: 'Quote process', steps: ['Gather requirements', 'Prepare quote', 'Send quote', 'Follow up'] },
  { slug: 'legal', name: 'Legal process', steps: ['Review document', 'Flag risks', 'Draft amendments', 'Sign-off'] },
  { slug: 'finance', name: 'Finance process', steps: ['Match invoice', 'Approve payment', 'Record transaction'] },
  { slug: 'follow_up', name: 'Follow-up process', steps: ['Draft message', 'Send', 'Log outcome'] },
  { slug: 'listing', name: 'Listing process', steps: ['Prepare listing', 'Publish', 'Schedule viewings'] },
  { slug: 'document_review', name: 'Document review', steps: ['Ingest document', 'Summarize', 'Recommend action'] },
] as const

export function templateBySlug(slug: string) {
  return PROCESS_TEMPLATES.find((t) => t.slug === slug)
}
