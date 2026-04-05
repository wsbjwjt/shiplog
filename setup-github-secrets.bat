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
    exit /b 1
)

echo 🔑 正在设置 GitHub Secrets...
echo.

echo [1/4] 设置 VERCEL_ORG_ID...
gh secret set VERCEL_ORG_ID --body "team_EcZgRLdzzZiK7k71z7GTGMw0" -R wsbjwjt/shiplog
if %errorlevel% equ 0 (
    echo ✅ VERCEL_ORG_ID 设置成功
) else (
    echo ❌ VERCEL_ORG_ID 设置失败
)
echo.

echo [2/4] 设置 VERCEL_PROJECT_ID...
gh secret set VERCEL_PROJECT_ID --body "prj_D81VY5560gWKdJtuZp8IDxqRZZ9T" -R wsbjwjt/shiplog
if %errorlevel% equ 0 (
    echo ✅ VERCEL_PROJECT_ID 设置成功
) else (
    echo ❌ VERCEL_PROJECT_ID 设置失败
)
echo.

echo [3/4] 设置 NEXTAUTH_SECRET...
gh secret set NEXTAUTH_SECRET --body "OjZY/aiVdods9dO+DS50fMFfRCpSsQC0Az/Ek0wgVEk=" -R wsbjwjt/shiplog
if %errorlevel% equ 0 (
    echo ✅ NEXTAUTH_SECRET 设置成功
) else (
    echo ❌ NEXTAUTH_SECRET 设置失败
)
echo.

echo [4/4] 设置 NEXTAUTH_URL...
gh secret set NEXTAUTH_URL --body "https://shiplog-pearl.vercel.app" -R wsbjwjt/shiplog
if %errorlevel% equ 0 (
    echo ✅ NEXTAUTH_URL 设置成功
) else (
    echo ❌ NEXTAUTH_URL 设置失败
)
echo.

echo ========================================
echo ⚠️  还需要手动设置以下 2 个 Secrets:
echo ========================================
echo.
echo 5. VERCEL_TOKEN
echo    获取方式: 在终端运行命令: vercel token create
echo    输入名称: github-actions
echo    复制生成的 vc_xxxxx 字符串
echo    设置命令: gh secret set VERCEL_TOKEN --body "vc_..." -R wsbjwjt/shiplog
echo.
echo 6. DATABASE_URL
echo    获取方式: 访问 https://vercel.com/dashboard ^> Storage ^> .env.local
echo    设置命令: gh secret set DATABASE_URL --body "postgres://..." -R wsbjwjt/shiplog
echo.
echo 或者使用 GitHub Web 界面:
echo https://github.com/wsbjwjt/shiplog/settings/secrets/actions
echo.
pause
