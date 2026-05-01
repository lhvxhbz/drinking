import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserMinus } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'
import { useFriendsStore } from '@/stores/friends'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

export function FriendList() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { friends, loading, fetchFriends, removeFriend } = useFriendsStore()

  useEffect(() => {
    if (user) fetchFriends(user.id)
  }, [user])

  const handleRemove = async (friendshipId: string, name: string) => {
    if (!confirm(`确定要删除好友 ${name} 吗？`)) return
    const { error } = await removeFriend(friendshipId)
    if (error) {
      toast.error(error)
    } else {
      toast.success('已删除好友')
      if (user) fetchFriends(user.id)
    }
  }

  if (loading) {
    return <p className="text-center text-muted-foreground py-8">加载中...</p>
  }

  if (friends.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        还没有好友，搜索用户名添加吧
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {friends.map((f) => (
        <Card key={f.friendship_id} className="cursor-pointer hover:bg-accent/30 transition-colors">
          <CardContent className="py-3 flex items-center justify-between">
            <div
              className="flex items-center gap-3 flex-1"
              onClick={() => navigate(`/friends/${f.id}`)}
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  {f.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{f.username}</p>
                {f.bio && (
                  <p className="text-xs text-muted-foreground line-clamp-1">{f.bio}</p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => handleRemove(f.friendship_id, f.username)}
            >
              <UserMinus className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
