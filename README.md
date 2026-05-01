# DrinkLog

每日饮品打卡、评分、社交推荐的 Web App。

## 功能

- **日历打卡**：月历视图，标记每天的饮品记录
- **饮品记录**：记录名称、类型、品牌、评分（支持半星）、评论、照片
- **统计图表**：品类分布、评分分布、月度趋势、每日饮品数
- **好友系统**：搜索用户、好友请求、查看好友推荐饮品
- **推荐清单**：标记推荐的饮品对好友可见

## 技术栈

- React + TypeScript + Vite
- TailwindCSS + shadcn/ui
- Supabase（Auth / PostgreSQL / Storage）
- Zustand + React Router
- Recharts

## 本地开发

```bash
# 安装依赖
npm install

# 创建 .env（从 Supabase 项目获取）
cp .env.example .env

# 启动
npm run dev
```

## Supabase 配置

1. 创建 Supabase 项目
2. 在 SQL Editor 执行 `supabase/schema.sql`（建表 + RLS）
3. 创建 Storage bucket `drink-photos`（Public）
4. 执行 `supabase/storage.sql`（Storage 权限）
5. 关闭 Email Confirm（Authentication → Providers → Email）
6. 将 URL 和 anon key 填入 `.env`

## 项目结构

```
src/
├── components/layout/   # 布局组件
├── components/ui/       # shadcn/ui 组件
├── features/auth/       # 登录注册
├── features/calendar/   # 日历视图
├── features/drink-log/  # 饮品记录 CRUD
├── features/stats/      # 统计图表
├── features/friends/    # 好友系统
├── hooks/               # 自定义 hooks
├── lib/                 # Supabase client
├── stores/              # Zustand 状态管理
├── types/               # TypeScript 类型
└── pages/               # 页面组件
```
