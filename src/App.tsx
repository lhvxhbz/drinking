import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuthInit } from '@/hooks/use-auth'
import { useAuthStore } from '@/stores/auth'
import { AppLayout } from '@/components/layout/app-layout'
import { AuthLayout } from '@/components/layout/auth-layout'
import { Toaster } from '@/components/ui/sonner'

import LoginPage from '@/pages/auth-page'
import RegisterPage from '@/pages/register-page'
import CalendarPage from '@/pages/calendar-page'
import DateDetailPage from '@/pages/date-detail-page'
import NewLogPage from '@/pages/new-log-page'
import StatsPage from '@/pages/stats-page'
import FriendsPage from '@/pages/friends-page'
import ExplorePage from '@/pages/explore-page'

function ProtectedRoute() {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/auth/login" replace />
  return <Outlet />
}

function App() {
  useAuthInit()
  const { loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">加载中...</div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/calendar/:date" element={<DateDetailPage />} />
            <Route path="/log/new" element={<NewLogPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/explore" element={<ExplorePage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/calendar" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
