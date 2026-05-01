import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { IDrinkLog, DrinkCategory } from '@/types'

interface DrinkLogState {
  logs: IDrinkLog[]
  loading: boolean
  currentMonth: Date
  fetchLogs: (userId: string, startDate: string, endDate: string) => Promise<void>
  addLog: (log: Omit<IDrinkLog, 'id' | 'created_at'>) => Promise<{ error: string | null }>
  updateLog: (id: string, updates: Partial<IDrinkLog>) => Promise<{ error: string | null }>
  deleteLog: (id: string) => Promise<{ error: string | null }>
  setCurrentMonth: (date: Date) => void
  getLogsByDate: (date: string) => IDrinkLog[]
}

export const useDrinkLogStore = create<DrinkLogState>((set, get) => ({
  logs: [],
  loading: false,
  currentMonth: new Date(),

  fetchLogs: async (userId, startDate, endDate) => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('drink_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('log_date', startDate)
      .lte('log_date', endDate)
      .order('log_date', { ascending: false })
    if (!error && data) {
      set({ logs: data })
    }
    set({ loading: false })
  },

  addLog: async (log) => {
    const { error } = await supabase.from('drink_logs').insert(log)
    if (error) return { error: error.message }
    return { error: null }
  },

  updateLog: async (id, updates) => {
    const { error } = await supabase.from('drink_logs').update(updates).eq('id', id)
    if (error) return { error: error.message }
    return { error: null }
  },

  deleteLog: async (id) => {
    const { error } = await supabase.from('drink_logs').delete().eq('id', id)
    if (error) return { error: error.message }
    return { error: null }
  },

  setCurrentMonth: (date) => set({ currentMonth: date }),

  getLogsByDate: (date) => {
    return get().logs.filter((log) => log.log_date === date)
  },
}))
