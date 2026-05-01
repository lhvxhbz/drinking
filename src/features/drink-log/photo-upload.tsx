import { useRef, useState } from 'react'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

interface PhotoUploadProps {
  userId: string
  value: string | null
  onChange: (url: string | null) => void
}

export function PhotoUpload({ userId, value, onChange }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 限制 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('图片不能超过 5MB')
      return
    }

    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${userId}/${Date.now()}.${ext}`

    const { error } = await supabase.storage
      .from('drink-photos')
      .upload(path, file, { upsert: false })

    if (error) {
      alert('上传失败: ' + error.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('drink-photos').getPublicUrl(path)
    onChange(data.publicUrl)
    setUploading(false)
  }

  const handleRemove = () => {
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  if (value) {
    return (
      <div className="relative w-full max-w-xs">
        <img
          src={value}
          alt="饮品照片"
          className="w-full h-48 object-cover rounded-md border border-border"
        />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7"
          onClick={handleRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />
      <Button
        type="button"
        variant="outline"
        className="w-full h-24 border-dashed"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <ImagePlus className="h-5 w-5" />
            <span className="text-xs">添加照片</span>
          </div>
        )}
      </Button>
    </div>
  )
}
