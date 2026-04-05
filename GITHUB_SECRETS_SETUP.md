# GitHub Secrets 设置指南

## 快速设置命令

在 PowerShell 中运行以下命令（需要安装 gh CLI）：

```powershell
# 设置 GitHub Secrets
gh secret set VERCEL_ORG_ID --body "team_EcZgRLdzzZiK7k71z7GTGMw0"
gh secret set VERCEL_PROJECT_ID --body "prj_D81VY5560gWKdJtuZp8IDxqRZZ9T"
gh secret set NEXTAUTH_SECRET --body "OjZY/aiVdods9dO+DS50fMFfRCpSsQC0Az/Ek0wgVEk="
gh secret set NEXTAUTH_URL --body "https://shiplog-pearl.vercel.app"

# 以下两个需要您手动获取后设置
# gh secret set VERCEL_TOKEN --body "您的vc_开头的token"
# gh secret set DATABASE_URL --body "您的数据库连接字符串"
```

## 或者使用 GitHub Web 界面

1. 打开 https://github.com/wsbjwjt/shiplog/settings/secrets/actions
2. 点击 **New repository secret**
3. 逐个添加以下值：

| Name | Value |
|------|-------|
| VERCEL_ORG_ID | team_EcZgRLdzzZiK7k71z7GTGMw0 |
| VERCEL_PROJECT_ID | prj_D81VY5560gWKdJtuZp8IDxqRZZ9T |
| NEXTAUTH_SECRET | OjZY/aiVdods9dO+DS50fMFfRCpSsQC0Az/Ek0wgVEk= |
| NEXTAUTH_URL | https://shiplog-pearl.vercel.app |
| VERCEL_TOKEN | （从 vercel token create 获取）|
| DATABASE_URL | （从 Vercel Dashboard 获取）|

## 获取 VERCEL_TOKEN 的步骤

```bash
# 在终端运行
vercel token create
# 输入名称：github-actions
# 复制生成的 vc_xxxxx 字符串
```

## 获取 DATABASE_URL 的步骤

1. 访问 https://vercel.com/dashboard
2. 点击 shiplog 项目
3. 点击 Storage 标签
4. 选择您的 Postgres 数据库
5. 点击 .env.local 标签
6. 复制 DATABASE_URL 的值

## 验证设置

设置完成后，运行：
```bash
git commit --allow-empty -m "chore: trigger deployment"
git push
```

然后查看 GitHub Actions 是否成功：
```bash
gh run list
```
