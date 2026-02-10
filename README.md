# Tuxun-Play

GeoGuessr-like 图寻 Web 应用（Next.js 14 + TypeScript）。默认中文 UI，预留英文 i18n。

## 功能概览
- 经典 / 每日 / 国家连胜 / 限时模式
- 自定义地图包与排行榜
- 账号系统（NextAuth，游客可玩）
- 可插拔街景 Provider（Mapillary + Tencent + Mock）
- Battle Royale（Socket.IO 独立 realtime 服务）
- 安全策略：服务端计算分数、输入校验、基础限流、CSP

## 本地运行
1. `pnpm i`
2. 复制环境变量：`cp .env.example .env`
3. 准备数据库并迁移：
   - `pnpm prisma:generate`
   - `pnpm prisma:migrate`
   - `pnpm prisma:seed`
4. （可选）启动多人实时服务：`pnpm realtime:dev`
5. 启动前端：`pnpm dev`

## 测试与构建
- 单元测试：`pnpm test`
- E2E smoke：`pnpm test:e2e`
- 生产构建：`pnpm build`

## 部署
### Vercel + Postgres
- 在 Vercel 配置 `.env.example` 中变量。
- 绑定托管 Postgres（Neon/Supabase/RDS）。
- 部署后执行 Prisma migration。
- 如果使用腾讯/Mapillary，填入对应 key/token。

### Realtime 服务（Fly.io/Render）
- `realtime-server/` 为独立 Node 服务。
- 部署后设置 `NEXT_PUBLIC_REALTIME_URL` 指向该服务。

## Provider 扩展
1. 在 `lib/types.ts` 扩展 `ProviderId`。
2. 在 `lib/providers/` 新建实现 `StreetViewProvider` 的类。
3. 在 `lib/providers/index.ts` 注入选择逻辑。
4. 新增 viewer 组件并在 `components/game/GameShell.tsx` 按 `providerId` 渲染。

## 安全与合规说明
- 真值坐标只在提交猜测后由服务端返回。
- 腾讯密钥仅服务器端代理使用，不下发到浏览器。
- 每回合展示影像和地图 attribution；请遵守第三方 API/影像许可。
