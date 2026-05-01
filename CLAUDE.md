# DrinkLog

每日饮品打卡、评分、社交推荐的 Web App。

## 技术栈

- **前端**: React 18 + TypeScript + Vite
- **UI**: TailwindCSS + shadcn/ui
- **路由**: React Router v6
- **后端**: Supabase (Auth / PostgreSQL / Storage / Realtime)
- **状态管理**: Zustand
- **部署**: Vercel (前端) + Supabase Cloud (后端)

## 目录结构

```
src/
├── components/        # 通用 UI 组件
│   ├── ui/            # shadcn/ui 组件（自动生成）
│   └── layout/        # 布局组件（Header, Sidebar 等）
├── pages/             # 页面组件，按路由组织
├── features/          # 业务模块
│   ├── auth/          # 登录注册
│   ├── calendar/      # 日历视图
│   ├── drink-log/     # 饮品记录 CRUD
│   ├── stats/         # 统计图表
│   ├── friends/       # 好友系统
│   └── explore/       # 推荐 feed
├── hooks/             # 自定义 hooks
├── lib/               # 工具函数、supabase client
├── stores/            # Zustand stores
├── types/             # TypeScript 类型定义
└── styles/            # 全局样式
```

## 命名规范

- 文件: kebab-case (`drink-log.tsx`)
- 组件: PascalCase (`DrinkLogCard`)
- 常量: UPPER_SNAKE_CASE
- 类型/接口: PascalCase，前缀 `I` 仅用于接口 (`IDrinkLog`)
- CSS: TailwindCSS utility-first，不用自定义 CSS 除非必要

## 数据库表（Supabase PostgreSQL）

- `profiles`: 用户资料，FK → auth.users
- `drink_logs`: 饮品记录，含评分/评论/照片/推荐标记
- `friendships`: 好友关系（pending/accepted/rejected）
- `drink_likes`: 点赞，UNIQUE(user_id, drink_log_id)

## 开发规则

- 所有 Supabase 操作通过 `src/lib/supabase.ts` 的 client 实例
- RLS (Row Level Security) 必须开启，不允许关闭
- 组件不直接调用 supabase，通过 features/ 下的 hooks 或 services
- 新增页面必须在 `src/pages/` 下有对应文件，并在 router 中注册
- 表单校验用 zod

## 常用命令

```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run lint         # ESLint 检查
npx supabase start  # 本地 Supabase（需要 Docker）
```

## 当前阶段

Phase 1: 项目搭建 + Auth + 饮品 CRUD + 日历视图
