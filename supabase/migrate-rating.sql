-- 将 rating 从 smallint 改为 numeric(2,1) 以支持半星评分
ALTER TABLE drink_logs
  ALTER COLUMN rating TYPE numeric(2,1)
  USING rating::numeric(2,1);

-- 更新 CHECK 约束
ALTER TABLE drink_logs DROP CONSTRAINT IF EXISTS drink_logs_rating_check;
ALTER TABLE drink_logs ADD CONSTRAINT drink_logs_rating_check
  CHECK (rating >= 0.5 AND rating <= 5);
