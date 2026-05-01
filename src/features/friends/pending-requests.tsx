import { useEffect } from 'react'
import { Check, X } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'
import { useFriendsStore } from '@/stores/friends'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

export function PendingRequests() {
  const { user } = useAuthStore()
  const { pendingRequests, fetchPendingRequests, acceptRequest, rejectRequest } = useFriendsStore()

  useEffect(() => {
    if (user) fetchPendingRequests(user.id)
  }, [user])

  const handleAccept = async (id: string) => {
    const { error } = await acceptRequest(id)
    if (error) {
      toast.error(error)
    } else {
      toast.success('已接受好友请求')
      if (user) {
        fetchPendingRequests(user.id)
        useFriendsStore.getState().fetchFriends(user.id)
      }
    }
  }

  const handleReject = async (id: string) => {
    const { error } = await rejectRequest(id)
    if (error) {
      toast.error(error)
    } else {
      toast.success('已拒绝')
      if (user) fetchPendingRequests(user.id)
    }
  }

  if (pendingRequests.length === 0) return null

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">
        好友请求 ({pendingRequests.length})
      </h3>
      {pendingRequests.map((req) => (
        <Card key={req.id}>
          <CardContent className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  {req.requester_profile.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{req.requester_profile.username}</p>
                <p className="text-xs text-muted-foreground">想加你为好友</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" onClick={() => handleAccept(req.id)}>
                <Check className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleReject(req.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
