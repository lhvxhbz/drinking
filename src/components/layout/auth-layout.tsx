import { Outlet } from 'react-router-dom'
import { Coffee } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Coffee className="h-8 w-8 text-primary" />
          <span className="font-bold text-2xl">DrinkLog</span>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
