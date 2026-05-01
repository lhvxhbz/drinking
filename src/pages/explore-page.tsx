import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { DrinkLogCard } from '@/features/drink-log/drink-log-card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { IDrinkLog, IProfile } from '@/types'

type FeedItem = IDrinkLog & { profile: IProfile }

export default function ExplorePage() {
  const { user } = useAuthStore()
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchFeed(user.id)
  }, [user])

  const fetchFeed = async (userId: string) => {
    setLoading(true)

    // 获取好友 id 列表
    const { data: friendships } = await supabase
      .from('friendships')
      .select('requester, addressee')
      .eq('status', 'accepted')
      .or(`requester.eq.${userId},addressee.eq.${userId}`)

    if (!friendships || friendships.length === 0) {
      setFeed([])
      setLoading(false)
      return
    }

    const friendIds = friendships.map((f) =>
      f.requester === userId ? f.addressee : f.requester
    )

    // 获取好友的推荐饮品
    const { data: logs } = await supabase
      .from('drink_logs')
      .select('*')
      .in('user_id', friendIds)
      .eq('is_recommended', true)
      .order('created_at', { ascending: false })
      .limit(50)

    if (!logs || logs.length === 0) {
      setFeed([])
      setLoading(false)
      return
    }

    // 获取好友资料
    const uniqueUserIds = [...new Set(logs.map((l) => l.user_id))]
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .in('id', uniqueUserIds)

    const profileMap = new Map(profiles?.map((p) => [p.id, p]))

    const feedItems = logs.map((log) => ({
      ...log,
      profile: profileMap.get(log.user_id)!,
    }))

    setFeed(feedItems)
    setLoading(false)
  }

  if (loading) {
    return <div className="p-6 text-center text-muted-foreground">加载中...</div>
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">探索</h1>

      {feed.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          暂无好友推荐，添加好友后这里会显示他们的推荐饮品
        </p>
      ) : (
        <div className="space-y-4">
          {feed.map((item) => (
            <div key={item.id}>
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-[10px]">
                    {item.profile.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{item.profile.username}</span>
                <span className="text-xs text-muted-foreground">推荐</span>
              </div>
              <DrinkLogCard log={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
