-- ============================================
-- DrinkLog 数据库 Schema
-- 在 Supabase SQL Editor 中执行
-- ============================================

-- 1. 用户资料表
CREATE TABLE IF NOT EXISTS profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    text UNIQUE NOT NULL,
  avatar_url  text,
  bio         text,
  created_at  timestamptz DEFAULT now()
);

-- 2. 饮品记录表
CREATE TABLE IF NOT EXISTS drink_logs (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  drink_name     text NOT NULL,
  category       text NOT NULL CHECK (category IN ('coffee', 'milk_tea', 'juice', 'soda', 'other')),
  brand          text,
  rating         smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment        text,
  photo_url      text,
  is_recommended boolean DEFAULT false,
  log_date       date NOT NULL DEFAULT CURRENT_DATE,
  created_at     timestamptz DEFAULT now()
);

-- 3. 好友关系表
CREATE TABLE IF NOT EXISTS friendships (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  addressee  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status     text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(requester, addressee)
);

-- 4. 点赞表
CREATE TABLE IF NOT EXISTS drink_likes (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  drink_log_id uuid NOT NULL REFERENCES drink_logs(id) ON DELETE CASCADE,
  created_at   timestamptz DEFAULT now(),
  UNIQUE(user_id, drink_log_id)
);

-- ============================================
-- 索引
-- ============================================
CREATE INDEX idx_drink_logs_user_date ON drink_logs(user_id, log_date DESC);
CREATE INDEX idx_friendships_requester ON friendships(requester);
CREATE INDEX idx_friendships_addressee ON friendships(addressee);
CREATE INDEX idx_drink_likes_log ON drink_likes(drink_log_id);

-- ============================================
-- RLS 策略
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drink_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE drink_likes ENABLE ROW LEVEL SECURITY;

-- profiles: 自己可读写，所有人可读（用于搜索好友）
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON profiles FOR DELETE USING (auth.uid() = id);

-- drink_logs: 自己的记录完全控制，好友的推荐记录可读
CREATE POLICY "drink_logs_select_own" ON drink_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "drink_logs_select_friends_recommended" ON drink_logs FOR SELECT USING (
  is_recommended = true
  AND EXISTS (
    SELECT 1 FROM friendships
    WHERE status = 'accepted'
      AND ((requester = auth.uid() AND addressee = drink_logs.user_id)
        OR (addressee = auth.uid() AND requester = drink_logs.user_id))
  )
);
CREATE POLICY "drink_logs_insert_own" ON drink_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "drink_logs_update_own" ON drink_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "drink_logs_delete_own" ON drink_logs FOR DELETE USING (auth.uid() = user_id);

-- friendships: 双方都可读，只有发起方可以创建/删除
CREATE POLICY "friendships_select_own" ON friendships FOR SELECT
  USING (auth.uid() = requester OR auth.uid() = addressee);
CREATE POLICY "friendships_insert_own" ON friendships FOR INSERT
  WITH CHECK (auth.uid() = requester);
CREATE POLICY "friendships_update_both" ON friendships FOR UPDATE
  USING (auth.uid() = requester OR auth.uid() = addressee);
CREATE POLICY "friendships_delete_own" ON friendships FOR DELETE
  USING (auth.uid() = requester);

-- drink_likes: 自己可读写，所有人可读点赞数
CREATE POLICY "drink_likes_select_all" ON drink_likes FOR SELECT USING (true);
CREATE POLICY "drink_likes_insert_own" ON drink_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "drink_likes_delete_own" ON drink_likes FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 自动创建 profile 的触发器
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
