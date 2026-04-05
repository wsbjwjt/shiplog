# ShipLog GitHub Secrets 自动设置脚本
# 使用方法: 右键选择"使用 PowerShell 运行" 或 ./setup-github-secrets.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ShipLog GitHub Secrets 自动设置脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 gh CLI
if (!(Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ 请先安装 GitHub CLI: https://cli.github.com/" -ForegroundColor Red
    Write-Host "安装后重新运行此脚本" -ForegroundColor Yellow
    Read-Host "按 Enter 键退出"
    exit 1
}

Write-Host "🔑 正在设置 GitHub Secrets..." -ForegroundColor Yellow
Write-Host "仓库: wsbjwjt/shiplog" -ForegroundColor Gray
Write-Host ""

$secrets = @{
    "VERCEL_ORG_ID" = "team_EcZgRLdzzZiK7k71z7GTGMw0"
    "VERCEL_PROJECT_ID" = "prj_D81VY5560gWKdJtuZp8IDxqRZZ9T"
    "DATABASE_URL" = "postgresql://postgres:jingze1%403Abc@db.icwwbyqxkzaxpszxpswg.supabase.co:5432/postgres"
    "NEXTAUTH_SECRET" = "OjZY/aiVdods9dO+DS50fMFfRCpSsQC0Az/Ek0wgVEk="
    "NEXTAUTH_URL" = "https://shiplog-pearl.vercel.app"
}

$successCount = 0
$totalCount = $secrets.Count
$currentIndex = 0

foreach ($secret in $secrets.GetEnumerator()) {
    $currentIndex++
    Write-Host "[$currentIndex/6] 设置 $($secret.Key)..." -ForegroundColor Yellow

    $process = Start-Process -FilePath "gh" -ArgumentList @(
        "secret", "set", $secret.Key,
        "--body", $secret.Value,
        "-R", "wsbjwjt/shiplog"
    ) -NoNewWindow -Wait -PassThru -RedirectStandardError "$env:TEMP\gh-error.txt"

    if ($process.ExitCode -eq 0) {
        Write-Host "✅ $($secret.Key) 设置成功" -ForegroundColor Green
        $successCount++
    } else {
        Write-Host "❌ $($secret.Key) 设置失败，请手动设置" -ForegroundColor Red
        if (Test-Path "$env:TEMP\gh-error.txt") {
            $errorMsg = Get-Content "$env:TEMP\gh-error.txt" -Raw
            if ($errorMsg) {
                Write-Host "   错误: $errorMsg" -ForegroundColor DarkGray
            }
        }
    }
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Yellow
Write-Host "⚠️  还需要手动设置最后一个 Secret:" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "[6/6] VERCEL_TOKEN - 需要您去 Vercel 网站创建" -ForegroundColor White
Write-Host ""
Write-Host "获取步骤:" -ForegroundColor Cyan
Write-Host "1. 打开浏览器访问: https://vercel.com/account/tokens" -ForegroundColor White
Write-Host "2. 点击 'Create Token'" -ForegroundColor White
Write-Host "3. 名称填写: github-actions" -ForegroundColor White
Write-Host "4. 点击 'Create' 生成 token (以 vc_ 开头)" -ForegroundColor White
Write-Host "5. 复制生成的 token" -ForegroundColor White
Write-Host ""
Write-Host "设置命令:" -ForegroundColor Cyan
Write-Host "gh secret set VERCEL_TOKEN --body 'vc_您的token' -R wsbjwjt/shiplog" -ForegroundColor Yellow
Write-Host ""
Write-Host "或者使用 GitHub Web 界面:" -ForegroundColor Gray
Write-Host "https://github.com/wsbjwjt/shiplog/settings/secrets/actions" -ForegroundColor Cyan
Write-Host ""

$openBrowser = Read-Host "是否现在打开 Vercel tokens 页面? (Y/n)"
if ($openBrowser -eq '' -or $openBrowser -eq 'Y' -or $openBrowser -eq 'y') {
    Start-Process "https://vercel.com/account/tokens"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "📋 所有 Secrets 汇总:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

$allSecrets = @{
    "VERCEL_ORG_ID" = "team_EcZgRLdzzZiK7k71z7GTGMw0"
    "VERCEL_PROJECT_ID" = "prj_D81VY5560gWKdJtuZp8IDxqRZZ9T"
    "DATABASE_URL" = "postgresql://postgres:jingze1%403Abc@db.icwwbyqxkzaxpszxpswg.supabase.co:5432/postgres"
    "NEXTAUTH_SECRET" = "OjZY/aiVdods9dO+DS50fMFfRCpSsQC0Az/Ek0wgVEk="
    "NEXTAUTH_URL" = "https://shiplog-pearl.vercel.app"
    "VERCEL_TOKEN" = "(需手动获取: https://vercel.com/account/tokens)"
}

foreach ($secret in $allSecrets.GetEnumerator()) {
    if ($secret.Key -eq "VERCEL_TOKEN") {
        Write-Host "🔸 $($secret.Key): " -NoNewline -ForegroundColor Yellow
        Write-Host $secret.Value -ForegroundColor Gray
    } else {
        Write-Host "✅ $($secret.Key): " -NoNewline -ForegroundColor Green
        Write-Host $secret.Value -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 设置完成后，运行以下命令触发部署:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "git commit --allow-empty -m 'chore: trigger deployment'" -ForegroundColor Yellow
Write-Host "git push" -ForegroundColor Yellow
Write-Host ""

Read-Host "按 Enter 键退出"
