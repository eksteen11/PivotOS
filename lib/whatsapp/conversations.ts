import { isFounderPrivateContext, type WhatsappContext } from './contexts'
import { groupsCoexistenceSupported } from './capabilities'

export type WhatsappThreadKind = 'direct' | 'group'

export type WhatsappThreadMessage = {
  id: string
  providerMessageId: string
  direction: 'inbound' | 'outbound' | 'echo'
  fromE164: string
  body: string
  mediaKind: string
  receivedAt: string
  context: WhatsappContext | null
  source: 'messages' | 'smb_message_echoes' | 'history' | 'local'
}

export type WhatsappConversation = {
  id: string
  ownerId: string
  kind: WhatsappThreadKind
  contactKey: string
  displayName: string
  groupId: string | null
  context: WhatsappContext | null
  privacy: 'founder-private' | 'company-visible' | 'needs-clarification'
  messages: WhatsappThreadMessage[]
  unreadCount: number
  openedAt: string | null
  readAt: string | null
  groupSupport: 'supported' | 'not-supported' | 'unverified'
  syncNote: string
}

export function contactKeyFromE164(value: string) {
  const digits = value.replace(/\D/g, '')
  return digits || 'unknown'
}

export function conversationIdFor(ownerId: string, kind: WhatsappThreadKind, contactOrGroup: string) {
  return `${ownerId}:${kind}:${contactOrGroup}`
}

export function buildConversation(input: {
  ownerId: string
  kind: WhatsappThreadKind
  contactKey: string
  displayName?: string
  groupId?: string | null
  context?: WhatsappContext | null
  messages?: WhatsappThreadMessage[]
}): WhatsappConversation {
  const groupSupported = groupsCoexistenceSupported()
  const kind = input.kind
  const privacy = !input.context
    ? 'needs-clarification'
    : isFounderPrivateContext(input.context)
      ? 'founder-private'
      : 'company-visible'
  const messages = [...(input.messages ?? [])].sort((a, b) => a.receivedAt.localeCompare(b.receivedAt))
  return {
    id: conversationIdFor(input.ownerId, kind, kind === 'group' ? (input.groupId || input.contactKey) : input.contactKey),
    ownerId: input.ownerId,
    kind,
    contactKey: input.contactKey,
    displayName: input.displayName?.trim() || (kind === 'group' ? 'WhatsApp group' : `+${input.contactKey}`),
    groupId: kind === 'group' ? input.groupId ?? input.contactKey : null,
    context: input.context ?? null,
    privacy,
    messages,
    unreadCount: messages.length,
    openedAt: null,
    readAt: null,
    groupSupport: kind === 'group' ? (groupSupported ? 'supported' : 'not-supported') : 'supported',
    syncNote: kind === 'group' && !groupSupported
      ? 'Meta coexistence does not synchronise Business-app group chats. This thread is held as unsupported until a verified path exists.'
      : 'Unread clears only when this conversation is opened in Pivot.',
  }
}

/**
 * Mark read ONLY when the founder opens the conversation.
 * Preview lists and AI processing must not call this.
 */
export function openConversation(conversation: WhatsappConversation, openedAt: string): WhatsappConversation {
  if (!Number.isFinite(Date.parse(openedAt))) return conversation
  return {
    ...conversation,
    openedAt,
    readAt: openedAt,
    unreadCount: 0,
  }
}

export function conversationStillUnread(conversation: WhatsappConversation) {
  return conversation.unreadCount > 0 && !conversation.readAt
}

export function appendThreadMessage(
  conversation: WhatsappConversation,
  message: WhatsappThreadMessage,
): WhatsappConversation {
  if (conversation.messages.some((row) => row.providerMessageId === message.providerMessageId)) {
    return conversation
  }
  if (conversation.kind === 'group' && conversation.groupSupport === 'not-supported') {
    return {
      ...conversation,
      syncNote: 'Group message retained locally as unsupported under coexistence — not silently dropped.',
      messages: [...conversation.messages, message].sort((a, b) => a.receivedAt.localeCompare(b.receivedAt)),
      unreadCount: conversation.readAt ? conversation.unreadCount + 1 : conversation.unreadCount + 1,
    }
  }
  const opened = Boolean(conversation.openedAt && !conversationStillUnread(conversation))
  return {
    ...conversation,
    messages: [...conversation.messages, message].sort((a, b) => a.receivedAt.localeCompare(b.receivedAt)),
    unreadCount: opened ? 1 : conversation.unreadCount + 1,
    readAt: opened ? null : conversation.readAt,
  }
}

export function listConversationsForLens(
  conversations: WhatsappConversation[],
  lens: 'founder' | 'digikraal' | 'farm-feed' | 'northpoint',
) {
  if (lens === 'founder') return conversations
  return conversations.filter((row) => {
    if (row.privacy !== 'company-visible' || !row.context) return false
    if (row.context === 'digikraal') return lens === 'digikraal'
    if (row.context === 'farm-feed') return lens === 'farm-feed'
    if (row.context === 'northpoint') return lens === 'northpoint'
    return false
  })
}
