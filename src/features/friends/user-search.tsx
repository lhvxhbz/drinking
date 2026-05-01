import { useState, useCallback } from 'react'
import { Search, UserPlus, Check } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'
import { useFriendsStore } from '@/stores/friends'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

export function UserSearch() {
  const { user } = useAuthStore()
  const { searchResults, searchUsers, sendRequest, friends } = useFriendsStore()
  const [query, setQuery] = useState('')
  const [sentIds, setSentIds] = useState<Set<string>>(new Set())

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value)
      if (user) searchUsers(value, user.id)
    },
    [user]
  )

  const handleSend = async (addresseeId: string) => {
    if (!user) return
    const { error } = await sendRequest(user.id, addresseeId)
    if (error) {
      toast.error(error)
    } else {
      setSentIds((prev) => new Set(prev).add(addresseeId))
      toast.success('好友请求已发送')
    }
  }

  const isFriend = (id: string) => friends.some((f) => f.id === id)

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="搜索用户名..."
          className="pl-9"
        />
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-2">
          {searchResults.map((profile) => (
            <Card key={profile.id}>
              <CardContent className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>
                      {profile.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{profile.username}</p>
                    {profile.bio && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{profile.bio}</p>
                    )}
                  </div>
                </div>
                {isFriend(profile.id) ? (
                  <span className="text-xs text-muted-foreground">已是好友</span>
                ) : sentIds.has(profile.id) ? (
                  <Button variant="ghost" size="sm" disabled>
                    <Check className="h-4 w-4 mr-1" /> 已发送
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => handleSend(profile.id)}>
                    <UserPlus className="h-4 w-4 mr-1" /> 添加
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {query && searchResults.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-4">未找到用户</p>
      )}
    </div>
  )
}
