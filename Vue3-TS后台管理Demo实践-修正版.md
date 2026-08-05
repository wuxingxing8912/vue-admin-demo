# Vue3 + TS 后台管理 Demo 实践（修正完整版）

> 适配：移动端（Android）转全栈 ｜ 每天 1.5–2.5h ｜ 4 周完成  
> 产物：可运行后台 Demo + GitHub 仓库
>
> **技术栈**：Vue3 + TypeScript + Vite + Ant Design Vue 4 + Vue-Router4 + Pinia + Axios  
> **原则**：只做前端，全部 mock 假数据，不对接后端；类型优先，少写 any

> ⚠️ **修正说明（相对原帖）**
>
> 1. 补全了原帖所有空壳章节（创建项目 / 安装依赖 / 初始化 git / 目录结构 / AI 提示词模板）。
> 2. Node 版本由 `20.x` 改为 **`22 LTS`**（Node 20 已于 2026-04-30 EOL）。
> 3. 补齐了原帖「承诺但未给出」的 3 个核心文件：`router/index.ts`、`stores/user.ts`、`utils/request.ts`（见文末附件）。
> 4. antd 明确为 **v4 自动按需引入**方案；token 存储补充了真实项目安全提示。

---

## 前置准备（第 0 天）

### 1、环境

- **Node.js 22 LTS**（推荐 22，24 LTS 亦可；不要用已 EOL 的 20/18）
- 包管理器：**pnpm**（`npm i -g pnpm`）
- IDE：VSCode / Cursor，安装 **Volar**（禁用旧版 Vetur）、ESLint、Prettier

### 2、创建项目（原帖空壳，已补全）

```bash
# 选择 Vue + TypeScript 模板
pnpm create vite vue-admin-demo --template vue-ts
cd vue-admin-demo
pnpm install
pnpm dev   # 本地预览，默认 http://localhost:5173
```

### 3、安装依赖（原帖空壳，已补全）

```bash
# 路由 / 状态 / UI / 请求
pnpm add vue-router@4 pinia ant-design-vue@4 axios
# 自动按需引入（antd 组件与 API 自动导入，省 bundle）
pnpm add -D unplugin-vue-components unplugin-auto-import
```

### 4、初始化 git + GitHub（原帖空壳，已补全）

```bash
git init
git add .
git commit -m "chore: init vue3+ts admin demo"
# 在 GitHub 新建空仓库后：
git remote add origin git@github.com:<你的用户名>/vue-admin-demo.git
git branch -M main
git push -u origin main
```

> 约定：**每完成一个模块就提交一次**，commit 信息用 `feat/fix/docs` 前缀，历史要清晰。

### 5、配置 `@` 路径别名（让代码里的 `@/` 生效）

`vite.config.ts`：

```ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    vue(),
    Components({ resolvers: [AntDesignVueResolver()] }), // antd 自动按需
    AutoImport({ imports: ['vue', 'vue-router', 'pinia'], dts: 'src/auto-imports.d.ts' }),
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
})
```

`tsconfig.json` 的 `compilerOptions.paths` 同步加 `"@/*": ["src/*"]`（Vite 模板通常已配好）。

### 6、main.ts 挂上路由与 Pinia

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

createApp(App).use(createPinia()).use(router).mount('#app')
```

---

## 第 1 周：ES6+ + TypeScript（7 天）

> 和 React 路线知识点完全一致，TS 是通用能力

**Day1–2 ES6 高频语法**

- `let / const`、箭头函数、解构、展开运算符 `...`
- `Promise`、`async/await`（对标 Kotlin 协程）
- 数组：`map / filter / find / reduce`
- 模块 `import / export`
- 练习：写简单 ts 脚本，重点练异步 `async/await`

**Day3–7 TypeScript 核心（必敲代码）**

1. 基础类型、数组、对象
2. `interface` / `type`（对标 Kotlin interface、data class）
3. 函数类型、返回值、参数类型
4. **泛型（重点）**
5. 联合、交叉类型；常用工具类型 `Partial / Pick / Required`

✅ 本周验收：能写泛型、接口，尽量不写 `any`，看得懂 TS 类型报错。

---

## 第 2 周：Vue3 + TS 基础（7 天）

> 只学 `<script setup lang="ts">` 组合式 API，不学 Vue2 选项式 API

**Day8–10 基础语法**

1. template 模板语法
2. `<script setup lang="ts">` 基础
3. `ref / reactive` 响应式（对标 Android UI 状态）
4. Props 类型定义、组件父子传值
5. 组件拆分：父组件、子组件

- 练习：写 `UserCard.vue` 接收 `User` 类型 props 渲染用户信息；写计数器组件。

**Day11–14 核心组合式 API**  
逐个手写 demo：`ref`、`reactive`、`computed`、`watch / watchEffect`、`defineProps`、`defineEmits` 的 TS 类型约束。

✅ 本周小产出：本地 mock 数组，写一个简单的用户列表页，实现增加/删除用户，**无路由、无 UI 库**。

> 类比记忆
>
> - ref/reactive ≈ 可观察 UI 状态
> - watch ≈ 监听数据变化做副作用，类似 LiveData

✅ 验收：会拆分组件；props 完整 TS 类型；理解响应式原理。

---

## 第 3 周：路由 + Ant Design Vue + 后台业务（7 天）

> 目标：搭后台骨架，实现登录、表格、分页、搜索、弹窗表单（全部 mock）

**Day15–17 路由 + 全局注册 antdv**

1. 配置 `vue-router`，路由表：
   - `/login` 登录页（公开）
   - `/` → 布局页，子路由 `/home` 主页、`/user/list` 用户管理
2. 路由守卫：无 token 跳回登录页（见 `router/index.ts`）
3. antdv 用 **v4 自动按需引入**（见前置准备第 5 步，无需手动全局注册）

**Day18–21 后台核心业务（全部 mock）**

1. 登录页：`a-form` + 校验；成功把 token 写入 Pinia + `localStorage`
2. 布局：`a-layout` 经典后台（侧边栏 + header + 内容区）
3. 用户列表页：`a-table` + `a-pagination` + 搜索框 + `a-modal` 增改 + 删除确认

> 全部用 mock 内存数组模拟，不调用真实后端。封装模拟异步请求，模拟网络延迟。

✅ 本周产出：登录跳转后台，用户管理完成增删改查，**刷新页面数据丢失（内存 mock，属预期）**。

> 本周不写复杂全局状态；token 先用 Pinia + localStorage，登录拦截在守卫里读 store。

---

## 第 4 周：Pinia + axios 封装 + 打包上传（7 天）

**Day22–24 Pinia 全局状态（≈ Android ViewModel）**

1. 创建 `src/stores/user.ts`
2. 存登录用户信息、token
3. 登录成功写入 store；退出清空 store + `localStorage`，跳回登录页
4. 路由守卫读 store 做权限拦截

**Day25–26 axios 封装（移动端网络拦截经验直接复用）**  
新建 `src/utils/request.ts`：

- 请求拦截器：自动带 token 请求头
- 响应拦截器：统一处理错误码、消息提示

> 当前对接 mock 函数；第 2 月写 NestJS/SpringBoot 时把 `baseURL` 换成真实地址即可。

**Day27–28 打包 + 整理 + 提交 GitHub**

```bash
pnpm run build          # 打包产物到 dist/
# 可选：Vercel 免费部署预览
```

写 `README.md`：项目介绍、技术栈、启动方式、截图。git 完整提交，历史清晰。

✅ **整月最终交付物**

1. Vue3+TS 后台管理 Demo（可运行）
2. 登录页 + token 本地持久化
3. 侧边栏后台布局
4. 用户管理：列表 / 分页 / 搜索 / 新增 / 编辑 / 删除弹窗
5. Pinia 全局状态 + axios 拦截器 + 路由权限守卫
6. 完整代码上传 GitHub，含文档与截图

---

## 📂 完整推荐目录结构（原帖空壳，已补全）

```
vue-admin-demo/
├─ index.html
├─ package.json
├─ vite.config.ts
├─ tsconfig.json
└─ src/
   ├─ main.ts
   ├─ App.vue
   ├─ api/
   │  └─ mock.ts            # 内存 mock 数据 + 模拟延迟
   ├─ router/
   │  └─ index.ts           # 路由表 + 守卫
   ├─ stores/
   │  └─ user.ts            # Pinia 用户/token
   ├─ utils/
   │  └─ request.ts         # axios 封装
   ├─ layouts/
   │  └─ MainLayout.vue     # 侧边栏+header+内容区
   ├─ views/
   │  ├─ Login.vue
   │  ├─ Home.vue
   │  └─ user/
   │     └─ UserList.vue
   └─ components/
      └─ UserCard.vue
```

---

## 移动端开发者避坑清单

1. CSS 别死磕，布局交给 antdv 组件，复杂样式交给 AI；只搞懂 Flex、Grid 基础。
2. 全程尽量不写 `any`，TS 类型是你转型最大收益。
3. **第 1 月绝不写后端**，全部 mock，前端链路跑通；真实接口是第 2 月任务。
4. 不写选项式 API，坚持 `<script setup lang="ts">`。
5. 不背 API，组件用法查文档 + AI；重点理解：**响应式、数据流、组件拆分、类型定义**。
6. 🆕 token 仅 mock 阶段可用 `localStorage`；**真实项目务必改用 httpOnly Cookie**（防 XSS 窃取），这是原帖遗漏的安全点。

---

## 高频 AI 提示词（原帖空壳，已补全）

针对「Android 开发者转 Vue3」人设，复制即用：

**A. 初始化项目**

> 你是有 10 年经验的 Vue3 + TypeScript 前端架构师。我在从 Android 转全栈，请帮我用 `pnpm create vite` 的 vue-ts 模板初始化一个后台管理 Demo，并列出需要安装的依赖及作用。解释每个概念时都用 Android（Kotlin/ViewModel/LiveData）做类比。

**B. 写某个 Vue 组件**

> 你是 Vue3 专家。请用 `<script setup lang="ts">` 写一个 `<UserCard :user="User">` 组件，User 用 interface 定义。把 `ref/reactive` 类比成 Android 的可观察 UI 状态，给出完整可运行代码和关键注释。

**C. 调试 TS 报错**

> 我遇到这个 TS 报错（贴报错 + 代码）。我是 Android 背景，请用 Kotlin 类比解释原因，并给出最小修改方案，不要让我盲目加 `any`。

**D. 生成核心文件**

> 基于 Vue3 + TS + Vue-Router4 + Pinia + Axios + Ant Design Vue 4，帮我生成 `router/index.ts`（含无 token 跳登录的守卫）、`stores/user.ts`（存 token+用户信息，退出清空）、`utils/request.ts`（请求带 token、响应统一错误处理）。用 `@/` 路径别名。

---

## 附：已补齐全的 3 个核心文件

见同目录：`src/router/index.ts`、`src/stores/user.ts`、`src/utils/request.ts`
