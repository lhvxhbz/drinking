export type DrinkCategory = 'coffee' | 'milk_tea' | 'juice' | 'soda' | 'other'

export type FriendshipStatus = 'pending' | 'accepted' | 'rejected'

export interface IProfile {
  id: string
  username: string
  avatar_url: string | null
  bio: string | null
  created_at: string
}

export interface IDrinkLog {
  id: string
  user_id: string
  drink_name: string
  category: DrinkCategory
  brand: string | null
  rating: number // 0.5-5, step 0.5
  comment: string | null
  photo_url: string | null
  is_recommended: boolean
  log_date: string // YYYY-MM-DD
  created_at: string
}

export interface IFriendship {
  id: string
  requester: string
  addressee: string
  status: FriendshipStatus
  created_at: string
}

export interface IDrinkLike {
  id: string
  user_id: string
  drink_log_id: string
  created_at: string
}

export const DRINK_CATEGORY_LABELS: Record<DrinkCategory, string> = {
  coffee: '咖啡',
  milk_tea: '奶茶',
  juice: '果汁',
  soda: '汽水',
  other: '其他',
}

export const DRINK_CATEGORY_EMOJIS: Record<DrinkCategory, string> = {
  coffee: '☕',
  milk_tea: '🧋',
  juice: '🧃',
  soda: '🥤',
  other: '🍵',
}
