@echo off
chcp 65001 >nul
echo ========================================
echo ShipLog GitHub Secrets 自动设置脚本
echo ========================================
echo.

REM 检查 gh CLI 是否安装
where gh >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 请先安装 GitHub CLI: https://cli.github.com/
    echo 安装后重新运行此脚本
    pause
    exit /b 1
)

echo 🔑 正在设置 GitHub Secrets...
echo 仓库: wsbjwjt/shiplog
echo.

echo [1/6] 设置 VERCEL_ORG_ID...
gh secret set VERCEL_ORG_ID --body "team_EcZgRLdzzZiK7k71z7GTGMw0" -R wsbjwjt/shiplog 2>nul
if %errorlevel% equ 0 (
    echo ✅ VERCEL_ORG_ID 设置成功
) else (
    echo ❌ VERCEL_ORG_ID 设置失败，请手动设置
)
echo.

echo [2/6] 设置 VERCEL_PROJECT_ID...
gh secret set VERCEL_PROJECT_ID --body "prj_D81VY5560gWKdJtuZp8IDxqRZZ9T" -R wsbjwjt/shiplog 2>nul
if %errorlevel% equ 0 (
    echo ✅ VERCEL_PROJECT_ID 设置成功
) else (
    echo ❌ VERCEL_PROJECT_ID 设置失败，请手动设置
)
echo.

echo [3/6] 设置 DATABASE_URL...
gh secret set DATABASE_URL --body "postgresql://postgres:jingze1%%403Abc@db.icwwbyqxkzaxpszxpswg.supabase.co:5432/postgres" -R wsbjwjt/shiplog 2>nul
if %errorlevel% equ 0 (
    echo ✅ DATABASE_URL 设置成功
) else (
    echo ❌ DATABASE_URL 设置失败，请手动设置
)
echo.

echo [4/6] 设置 NEXTAUTH_SECRET...
gh secret set NEXTAUTH_SECRET --body "OjZY/aiVdods9dO+DS50fMFfRCpSsQC0Az/Ek0wgVEk=" -R wsbjwjt/shiplog 2>nul
if %errorlevel% equ 0 (
    echo ✅ NEXTAUTH_SECRET 设置成功
) else (
    echo ❌ NEXTAUTH_SECRET 设置失败，请手动设置
)
echo.

echo [5/6] 设置 NEXTAUTH_URL...
gh secret set NEXTAUTH_URL --body "https://shiplog-pearl.vercel.app" -R wsbjwjt/shiplog 2>nul
if %errorlevel% equ 0 (
    echo ✅ NEXTAUTH_URL 设置成功
) else (
    echo ❌ NEXTAUTH_URL 设置失败，请手动设置
)
echo.

echo ========================================
echo ⚠️  还需要手动设置最后一个 Secret:
echo ========================================
echo.
echo [6/6] VERCEL_TOKEN - 需要您去 Vercel 网站创建
echo.
echo 获取步骤:
echo 1. 打开浏览器访问: https://vercel.com/account/tokens
echo 2. 点击 "Create Token"
echo 3. 名称填写: github-actions
echo 4. 点击 "Create" 生成 token (以 vc_ 开头)
echo 5. 复制生成的 token
echo.
echo 设置命令:
echo gh secret set VERCEL_TOKEN --body "vc_您的token" -R wsbjwjt/shiplog
echo.
echo 或者使用 GitHub Web 界面:
echo https://github.com/wsbjwjt/shiplog/settings/secrets/actions
echo.

choice /C YN /M "是否现在打开 Vercel tokens 页面"
if %errorlevel% equ 1 (
    start https://vercel.com/account/tokens
)

echo.
echo ========================================
echo 设置完成后，运行以下命令触发部署:
echo ========================================
echo git commit --allow-empty -m "chore: trigger deployment"
echo git push
echo.
pause
