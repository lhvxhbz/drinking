import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { IProfile, IFriendship } from '@/types'

interface FriendsState {
  friends: (IProfile & { friendship_id: string })[]
  pendingRequests: (IFriendship & { requester_profile: IProfile })[]
  searchResults: IProfile[]
  loading: boolean

  fetchFriends: (userId: string) => Promise<void>
  fetchPendingRequests: (userId: string) => Promise<void>
  searchUsers: (query: string, currentUserId: string) => Promise<void>
  sendRequest: (requesterId: string, addresseeId: string) => Promise<{ error: string | null }>
  acceptRequest: (friendshipId: string) => Promise<{ error: string | null }>
  rejectRequest: (friendshipId: string) => Promise<{ error: string | null }>
  removeFriend: (friendshipId: string) => Promise<{ error: string | null }>
}

export const useFriendsStore = create<FriendsState>((set) => ({
  friends: [],
  pendingRequests: [],
  searchResults: [],
  loading: false,

  fetchFriends: async (userId) => {
    set({ loading: true })
    const { data } = await supabase
      .from('friendships')
      .select('id, requester, addressee, status, created_at')
      .eq('status', 'accepted')
      .or(`requester.eq.${userId},addressee.eq.${userId}`)

    if (!data || data.length === 0) {
      set({ friends: [], loading: false })
      return
    }

    const friendIds = data.map((f) =>
      f.requester === userId ? f.addressee : f.requester
    )

    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .in('id', friendIds)

    const friends = data.map((f) => {
      const friendId = f.requester === userId ? f.addressee : f.requester
      const profile = profiles?.find((p) => p.id === friendId)
      return { ...profile!, friendship_id: f.id }
    })

    set({ friends, loading: false })
  },

  fetchPendingRequests: async (userId) => {
    const { data } = await supabase
      .from('friendships')
      .select('*')
      .eq('addressee', userId)
      .eq('status', 'pending')

    if (!data || data.length === 0) {
      set({ pendingRequests: [] })
      return
    }

    const requesterIds = data.map((f) => f.requester)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .in('id', requesterIds)

    const pendingRequests = data.map((f) => ({
      ...f,
      requester_profile: profiles?.find((p) => p.id === f.requester)!,
    }))

    set({ pendingRequests })
  },

  searchUsers: async (query, currentUserId) => {
    if (!query.trim()) {
      set({ searchResults: [] })
      return
    }
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .ilike('username', `%${query}%`)
      .neq('id', currentUserId)
      .limit(20)

    set({ searchResults: data ?? [] })
  },

  sendRequest: async (requesterId, addresseeId) => {
    const { error } = await supabase
      .from('friendships')
      .insert({ requester: requesterId, addressee: addresseeId, status: 'pending' })
    return { error: error?.message ?? null }
  },

  acceptRequest: async (friendshipId) => {
    const { error } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', friendshipId)
    return { error: error?.message ?? null }
  },

  rejectRequest: async (friendshipId) => {
    const { error } = await supabase
      .from('friendships')
      .update({ status: 'rejected' })
      .eq('id', friendshipId)
    return { error: error?.message ?? null }
  },

  removeFriend: async (friendshipId) => {
    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('id', friendshipId)
    return { error: error?.message ?? null }
  },
}))
