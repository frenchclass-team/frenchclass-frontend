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
* 点击 **Create pull request**，并在右侧 **Reviewers** 处勾选june-sf，然后call我审核合并。

### 4.4 代码合并后同步到本地
* 在 GitHub Desktop 切换回 **Current Branch: main**。
* 点击 **Fetch origin**，然后点击 **Pull origin**。
* 此时本地的 `main` 就是包含最新功能的最全代码了。


