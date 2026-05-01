import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserSearch } from '@/features/friends/user-search'
import { FriendList } from '@/features/friends/friend-list'
import { PendingRequests } from '@/features/friends/pending-requests'

export default function FriendsPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">好友</h1>

      <Tabs defaultValue="list">
        <TabsList className="w-full">
          <TabsTrigger value="list" className="flex-1">好友列表</TabsTrigger>
          <TabsTrigger value="search" className="flex-1">搜索添加</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4 space-y-4">
          <PendingRequests />
          <FriendList />
        </TabsContent>

        <TabsContent value="search" className="mt-4">
          <UserSearch />
        </TabsContent>
      </Tabs>
    </div>
  )
}
