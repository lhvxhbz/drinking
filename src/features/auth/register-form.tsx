import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { z } from 'zod'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const schema = z.object({
  username: z.string().min(2, '用户名至少 2 个字符').max(20, '用户名最多 20 个字符'),
  email: z.string().email('请输入有效的邮箱'),
  password: z.string().min(6, '密码至少 6 位'),
})

export function RegisterForm() {
  const navigate = useNavigate()
  const { signUp } = useAuthStore()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const result = schema.safeParse({ username, email, password })
    if (!result.success) {
      setError(result.error.issues[0].message)
      return
    }
    setLoading(true)
    const { error: signUpError } = await signUp(email, password, username)
    if (signUpError) {
      setError(signUpError)
      setLoading(false)
      return
    }
    navigate('/calendar')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>注册</CardTitle>
        <CardDescription>开始记录你的饮品之旅</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">用户名</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="你的昵称"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '注册中...' : '注册'}
          </Button>
          <p className="text-sm text-muted-foreground">
            已有账号？{' '}
            <Link to="/auth/login" className="text-primary hover:underline">
              登录
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
