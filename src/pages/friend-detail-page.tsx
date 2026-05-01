import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { useFriendsStore } from '@/stores/friends'
import { DrinkLogCard } from '@/features/drink-log/drink-log-card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import type { IProfile, IDrinkLog } from '@/types'

export default function FriendDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { friends, fetchFriends } = useFriendsStore()

  const [profile, setProfile] = useState<IProfile | null>(null)
  const [logs, setLogs] = useState<IDrinkLog[]>([])
  const [loading, setLoading] = useState(true)

  const isFriend = friends.some((f) => f.id === id)

  useEffect(() => {
    if (!user || !id) return
    fetchFriends(user.id)
  }, [user, id])

  useEffect(() => {
    if (!id) return
    fetchProfileAndLogs(id)
  }, [id])

  const fetchProfileAndLogs = async (friendId: string) => {
    setLoading(true)
    const [profileRes, logsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', friendId).single(),
      supabase
        .from('drink_logs')
        .select('*')
        .eq('user_id', friendId)
        .eq('is_recommended', true)
        .order('log_date', { ascending: false })
        .limit(50),
    ])

    setProfile(profileRes.data)
    setLogs(logsRes.data ?? [])
    setLoading(false)
  }

  if (loading) {
    return <div className="p-6 text-center text-muted-foreground">加载中...</div>
  }

  if (!profile) {
    return <div className="p-6 text-center text-muted-foreground">用户不存在</div>
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/friends')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* 用户信息 */}
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-lg">
            {profile.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-semibold">{profile.username}</h1>
          {profile.bio && <p className="text-sm text-muted-foreground">{profile.bio}</p>}
          <Badge variant="secondary" className="mt-1">
            {isFriend ? '好友' : '非好友'}
          </Badge>
        </div>
      </div>

      {/* 推荐饮品 */}
      <h2 className="text-lg font-medium mb-4">推荐的饮品</h2>
      {logs.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">暂无推荐</p>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <DrinkLogCard key={log.id} log={log} />
          ))}
        </div>
      )}
    </div>
  )
}
