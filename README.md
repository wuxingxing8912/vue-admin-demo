# Vue3 + TS 后台管理 Demo（第 1 月 · 纯前端 mock 版）

Android 转全栈第 1 月练习工程：Vue3 + TypeScript + Vite + Ant Design Vue + Vue-Router4 + Pinia + Axios。
**第 1 月只做前端、全部 mock 假数据，不接后端。**

## 环境要求
- Node.js **22 LTS**（原帖写 20.x，已于 2026-04 EOL，已修正）
- 包管理器 pnpm：`npm i -g pnpm`

## 快速开始
```bash
pnpm install
pnpm dev        # 启动后自动打开 http://localhost:5173
```
构建产物：`pnpm build`（含 vue-tsc 类型检查）

## 目录结构
```
├── index.html
├── vite.config.ts          # @ 别名指向 src
├── tsconfig.json
└── src
    ├── main.ts             # 挂载 app，注册 pinia / router / antd
    ├── App.vue
    ├── api/mock.ts         # 内存 mock：登录 + 用户增删改查（第2月替换为真实接口）
    ├── router/index.ts     # 路由表 + 无 token 跳登录守卫
    ├── stores/user.ts      # Pinia：token / 用户信息，退出清空
    ├── utils/request.ts    # axios 封装（请求带 token、响应统一错误处理）—— 第2月接真实后端用
    ├── layouts/MainLayout.vue   # 侧边栏 + header + content 后台骨架
    └── views
        ├── Login.vue       # 登录页（a-form 校验 + mock 登录）
        ├── Home.vue        # 首页
        └── user/UserList.vue  # 用户管理：表格 / 分页 / 搜索 / 弹窗增改 / 删除确认
```

## 功能验证
1. 打开页面自动跳 `/login`，任意用户名/密码登录 → 进入后台。
2. 侧边栏「用户管理」：列表、分页、搜索、新增、编辑、删除（刷新页面数据重置，因为 mock 在内存）。
3. 点「退出」清空 token 与 store，回到登录页。

## 第 2 月要做的事（本 Demo 已铺好地基）
- 把 `src/api/mock.ts` 的函数替换为 `src/utils/request.ts` 的真实接口调用（改 `baseURL` 为后端地址）。
- 后端可选 NestJS / SpringBoot，登录 token 在真实项目里建议用 httpOnly Cookie 防 XSS（本 Demo 用 localStorage 仅为学习方便）。

## 参考链接
- Vue3 官方文档：https://cn.vuejs.org/
- Vue Router：https://router.vuejs.org/zh/
- Pinia：https://pinia.vuejs.org/zh/
- Ant Design Vue：https://www.antdv.com/components/overview-cn
- Vite：https://cn.vitejs.dev/
