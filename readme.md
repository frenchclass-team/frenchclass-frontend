## 1. 前端开发环境准备
在开始编写代码前，请确保你的电脑已安装以下工具：
* **微信开发者工具**：请下载并安装 [稳定版 (Stable Build)](https://servicewechat.com/wxa-dev-logic/download_redirect?type=win32_x64&from=mpwiki&download_version=2012510290&version_type=1)。


## 2. 快速上手

### 2.1 克隆代码
请通过 Git 克隆前端专属仓库（本仓库）（不要直接下载 ZIP，方便后续同步修改）：
```bash
git clone https://github.com/June-sf/frenchclass-frontend.git
cd frenchclass-frontend
```

### 2.2 导入项目
1.  打开 **微信开发者工具**。
2.  点击 **导入**，选择frontend文件夹（是pages、api等文件夹的上级目录）。
3.  **AppID**：	wxdc985ec793a197c7
4.由于目前后端运行在云服务器的 `http` 协议及 IP 地址上，微信可能会拦截请求。**请务必开启以下设置：** 在工具右上角点击 **“详情”** -> **“本地设置”**，勾选 **`不校验合法域名、web-view（业务域名）、TLS版本以及HTTPS证书`**。

### 2.3. 测试账号
为了方便联调登录后的逻辑（如发帖、收藏、题目校验等），请使用以下预设的学生账号：
* **账号**：`123`
* **密码**：`000`


## 4. Git协作规范

### 4.1 创建功能分支
* 在 GitHub Desktop 顶部中间点击 **Current Branch**。
* 点击 **New Branch**。
* 命名规范：`ui/xxx` 。（或`feature/xxx`）（`main` 分支受保护，只存放经过审核、可以运行的后端/前端代码。禁止任何人直接在`main` 分支修改。）
* 点击 **Create Branch**。

### 4.2 编写代码并提交
* 在本地写完代码后，回到 GitHub Desktop。
* 在左侧 **Changes** 栏勾选要提交的文件。
* 在左下角 Summary 填写：`feat: 完成登录页面布局`。
* 点击左下角 **Commit to ui/xxx**。

### 4.3 推送到云端并创建 PR
* 点击右侧出现的 **Push origin** 按钮。
* 点击右侧出现的 **Create Pull Request** 按钮。
* **注意**：这会自动打开浏览器，进入 GitHub 网页。
* 在网页上确认：`base: main` ← `compare: ui/xxx`。
* 点击 **Create pull request**，并在右侧 **Reviewers** 处勾选june-sf，然后call我等待审核合并。

### 4.4 代码合并后同步到本地
* 审核通过后，在 GitHub Desktop 切换回 **Current Branch: main**。
* 点击 **Fetch origin**，然后点击 **Pull origin**。
* 此时本地的 `main` 就是包含最新功能的最全代码了。


## 5. 项目简单介绍

### 5.1 项目核心结构
* **`api/`**: 封装了与后端交互的所有接口，按业务模块划分为 `article.js`、`auth.js`、`phonetic.js`、`question.js`、`user.js` 和 `word.js`。
* **`pages/`**: 包含所有功能页面，每个页面由 `.js`、`.wxml`、`.wxss` 和 `.json` 组成。
* **`utils/`**: 包含全局工具函数，特别是 `request.js` 封装了带有 Token 验证和错误拦截的请求逻辑。
* **根目录**: 包含全局配置 `app.json`（定义路由与 TabBar）、全局样式 `app.wxss` 及项目配置文件。

### 5.2 核心模块功能

#### 身份验证与权限管理
* **登录拦截**: 在 `app.js` 的 `onLaunch` 阶段检查本地 Token，未登录将强制重定向至登录页。
* **多角色支持**: 支持“学生”和“教师”两种角色选择登录。

#### 学习功能模块
* **单词速记 (`pages/word/`)**: 采用**渐进式显影**设计（控制 `step` 状态），支持点击空白处依次显示释义和例句，并可标记单词掌握状态。
* **口语跟读 (`pages/phonetic/`)**: 提供音标发音要领、解剖图示及读音规则。支持**调用原生录音管理器**进行跟读自测，并与标准音对比播放。
* **变位训练 (`pages/conjugation/`)**: 针对法语动词变位提供展示表和自测练习。自测功能通过 `verifyQuestion` 接口实现实时校验，并给出红/绿视觉反馈。
* **视频学习 (`pages/article/`)**: 深度集成视频播放器，结合双语原文、重点单词/语法提取及随堂测试。
