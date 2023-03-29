## 基于 Midwayjs 一体化 的电影网站

基于 Midwayjs [一体化](https://midwayjs.org/docs/hooks/intro)方案实现 [koajs-movie](https://github.com/savoygu/koajs-movie) 电影网站，

### 技术栈

- [Midwayjs Hooks](https://github.com/midwayjs/midway)
- [Vue](https://github.com/vuejs/core)
- [Prisma](https://github.com/prisma/prisma)

### 项目构建

- `npm run dev`: 启动开发服务器
- `npm run build`: 构建用于生产的应用
- `npm run start`: 生产模式下运行项目

### 目录结构

- `src`: 源代码：包括后端和前端
  - `api`: 后端代码
  - `others`: 前端代码
- `public`: 静态文件
- `midway.config.ts`: 项目配置
- `index.html`: 入口文件
