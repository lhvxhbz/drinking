import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { format } from 'date-fns'
import { useAuthStore } from '@/stores/auth'
import { useDrinkLogStore } from '@/stores/drink-log'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DRINK_CATEGORY_LABELS, type DrinkCategory } from '@/types'
import { StarRating } from './star-rating'
import { PhotoUpload } from './photo-upload'

const schema = z.object({
  drink_name: z.string().min(1, '请输入饮品名称'),
  category: z.enum(['coffee', 'milk_tea', 'juice', 'soda', 'other']),
  brand: z.string().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  log_date: z.string(),
})

export function DrinkLogForm({ defaultDate }: { defaultDate?: string }) {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { addLog } = useDrinkLogStore()

  const [drinkName, setDrinkName] = useState('')
  const [category, setCategory] = useState<DrinkCategory>('coffee')
  const [brand, setBrand] = useState('')
  const [rating, setRating] = useState(3)
  const [comment, setComment] = useState('')
  const [logDate, setLogDate] = useState(defaultDate ?? format(new Date(), 'yyyy-MM-dd'))
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [isRecommended, setIsRecommended] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setError('')

    const result = schema.safeParse({ drink_name: drinkName, category, brand, rating, comment, log_date: logDate })
    if (!result.success) {
      setError(result.error.issues[0].message)
      return
    }

    setLoading(true)
    const { error: addError } = await addLog({
      user_id: user.id,
      drink_name: drinkName,
      category,
      brand: brand || null,
      rating,
      comment: comment || null,
      photo_url: photoUrl,
      is_recommended: isRecommended,
      log_date: logDate,
    })

    if (addError) {
      setError(addError)
      setLoading(false)
      return
    }
    navigate(`/calendar/${logDate}`)
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>记录饮品</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="drink_name">饮品名称 *</Label>
            <Input
              id="drink_name"
              value={drinkName}
              onChange={(e) => setDrinkName(e.target.value)}
              placeholder="拿铁、杨枝甘露..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>类型 *</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as DrinkCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DRINK_CATEGORY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">品牌/店铺</Label>
              <Input
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="瑞幸、喜茶..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>评分 *</Label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">评论</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="口感、甜度、推荐理由..."
              rows={3}
            />
          </div>

          {user && (
            <div className="space-y-2">
              <Label>照片</Label>
              <PhotoUpload userId={user.id} value={photoUrl} onChange={setPhotoUrl} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="log_date">日期</Label>
              <Input
                id="log_date"
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
              />
            </div>
            <div className="space-y-2 flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRecommended}
                  onChange={(e) => setIsRecommended(e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                <span className="text-sm">推荐给好友</span>
              </label>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
              取消
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? '保存中...' : '保存'}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  )
}
