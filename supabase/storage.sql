-- ============================================
-- Supabase Storage 配置
-- 在 Supabase SQL Editor 中执行
-- 先在 Dashboard → Storage 中创建 bucket: drink-photos（设为 Public）
-- 然后执行此 SQL 设置策略
-- ============================================

-- 允许已登录用户上传到自己的文件夹
CREATE POLICY "Users can upload own photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'drink-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 所有人可读（公开 bucket）
CREATE POLICY "Anyone can view photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'drink-photos');

-- 用户可删除自己的照片
CREATE POLICY "Users can delete own photos"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'drink-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
