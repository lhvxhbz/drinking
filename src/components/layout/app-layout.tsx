import { Outlet, Link, useLocation } from 'react-router-dom'
import { Calendar, BarChart3, Users, Compass, LogOut, Coffee } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const navItems = [
  { to: '/calendar', label: '日历', icon: Calendar },
  { to: '/stats', label: '统计', icon: BarChart3 },
  { to: '/friends', label: '好友', icon: Users },
  { to: '/explore', label: '探索', icon: Compass },
]

export function AppLayout() {
  const location = useLocation()
  const { profile, signOut } = useAuthStore()

  return (
    <div className="flex min-h-screen">
      {/* 侧边栏 */}
      <aside className="w-56 border-r border-border bg-sidebar flex flex-col">
        <div className="p-4 flex items-center gap-2">
          <Coffee className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">DrinkLog</span>
        </div>
        <Separator />

        <nav className="flex-1 p-2 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname.startsWith(to)
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            )
          })}
        </nav>

        <Separator />
        <div className="p-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground truncate">
            {profile?.username ?? '未登录'}
          </span>
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
