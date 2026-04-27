import { useCallback, useEffect, useState } from 'react'

import { supabase } from '../supabase/client'

export type EntityRole = 'owner' | 'admin' | 'member' | 'viewer'

export type EntityMember = {
  id: string
  userId: string
  role: EntityRole
  createdAt: string
}

export type EntityInvite = {
  id: string
  email: string
  role: EntityRole
  token: string
  expiresAt: string
  acceptedAt: string | null
  revokedAt: string | null
  createdAt: string
}

export function useEntityTeam(entityId: string | null) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [members, setMembers] = useState<EntityMember[]>([])
  const [invites, setInvites] = useState<EntityInvite[]>([])

  const refresh = useCallback(async () => {
    if (!entityId || !supabase) {
      setMembers([])
      setInvites([])
      return
    }

    setLoading(true)
    setError(null)
    try {
      const [membersRes, invitesRes] = await Promise.all([
        supabase
          .from('entity_members')
          .select('id,user_id,role,created_at')
          .eq('entity_id', entityId)
          .order('created_at', { ascending: true }),
        supabase
          .from('entity_invites')
          .select('id,email,role,token,expires_at,accepted_at,revoked_at,created_at')
          .eq('entity_id', entityId)
          .order('created_at', { ascending: false }),
      ])

      if (membersRes.error) throw membersRes.error
      if (invitesRes.error) throw invitesRes.error

      setMembers(
        (membersRes.data ?? []).map((x: any) => ({
          id: x.id,
          userId: x.user_id,
          role: x.role as EntityRole,
          createdAt: x.created_at,
        })),
      )
      setInvites(
        (invitesRes.data ?? []).map((x: any) => ({
          id: x.id,
          email: x.email,
          role: x.role as EntityRole,
          token: x.token,
          expiresAt: x.expires_at,
          acceptedAt: x.accepted_at,
          revokedAt: x.revoked_at,
          createdAt: x.created_at,
        })),
      )
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load team.')
    } finally {
      setLoading(false)
    }
  }, [entityId])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { loading, error, members, invites, refresh }
}

export async function createEntityInvite(input: {
  entityId: string
  email: string
  role: EntityRole
  invitedBy: string
}) {
  if (!supabase) throw new Error('Supabase not configured.')
  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()

  const { error } = await supabase.from('entity_invites').insert({
    entity_id: input.entityId,
    invited_by: input.invitedBy,
    email: input.email.trim().toLowerCase(),
    role: input.role,
    token,
    expires_at: expiresAt,
  })

  if (error) throw error
}

export async function revokeEntityInvite(inviteId: string) {
  if (!supabase) throw new Error('Supabase not configured.')
  const { error } = await supabase
    .from('entity_invites')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', inviteId)
  if (error) throw error
}

export async function changeEntityMemberRole(memberId: string, role: EntityRole) {
  if (!supabase) throw new Error('Supabase not configured.')
  const { error } = await supabase.from('entity_members').update({ role }).eq('id', memberId)
  if (error) throw error
}

