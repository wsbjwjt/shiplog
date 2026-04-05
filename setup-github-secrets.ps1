# ShipLog GitHub Secrets 设置脚本
# 使用方法: ./setup-github-secrets.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ShipLog GitHub Secrets 自动设置脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 gh CLI
if (!(Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ 请先安装 GitHub CLI: https://cli.github.com/" -ForegroundColor Red
    exit 1
}

Write-Host "🔑 正在设置 GitHub Secrets..." -ForegroundColor Yellow
Write-Host ""

$secrets = @{
    "VERCEL_ORG_ID" = "team_EcZgRLdzzZiK7k71z7GTGMw0"
    "VERCEL_PROJECT_ID" = "prj_D81VY5560gWKdJtuZp8IDxqRZZ9T"
    "NEXTAUTH_SECRET" = "OjZY/aiVdods9dO+DS50fMFfRCpSsQC0Az/Ek0wgVEk="
    "NEXTAUTH_URL" = "https://shiplog-pearl.vercel.app"
}

$successCount = 0
$totalCount = $secrets.Count

foreach ($secret in $secrets.GetEnumerator()) {
    Write-Host "[$($successCount+1)/$totalCount] 设置 $($secret.Key)..." -ForegroundColor Yellow

    $process = Start-Process -FilePath "gh" -ArgumentList @(
        "secret", "set", $secret.Key,
        "--body", $secret.Value,
        "-R", "wsbjwjt/shiplog"
    ) -NoNewWindow -Wait -PassThru

    if ($process.ExitCode -eq 0) {
        Write-Host "✅ $($secret.Key) 设置成功" -ForegroundColor Green
        $successCount++
    } else {
        Write-Host "❌ $($secret.Key) 设置失败" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "设置完成: $successCount/$totalCount 成功" -ForegroundColor $(if ($successCount -eq $totalCount) { "Green" } else { "Yellow" })
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "⚠️  还需要手动设置以下 2 个 Secrets:" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "5. VERCEL_TOKEN" -ForegroundColor White
Write-Host "   获取方式: 在终端运行命令: vercel token create" -ForegroundColor Gray
Write-Host "   输入名称: github-actions" -ForegroundColor Gray
Write-Host "   复制生成的 vc_xxxxx 字符串" -ForegroundColor Gray
Write-Host "   设置命令: gh secret set VERCEL_TOKEN --body \"vc_...\" -R wsbjwjt/shiplog" -ForegroundColor Cyan
Write-Host ""
Write-Host "6. DATABASE_URL" -ForegroundColor White
Write-Host "   获取方式: 访问 https://vercel.com/dashboard > Storage > .env.local" -ForegroundColor Gray
Write-Host "   设置命令: gh secret set DATABASE_URL --body \"postgres://...\" -R wsbjwjt/shiplog" -ForegroundColor Cyan
Write-Host ""
Write-Host "或者使用 GitHub Web 界面:" -ForegroundColor Gray
Write-Host "https://github.com/wsbjwjt/shiplog/settings/secrets/actions" -ForegroundColor Cyan
Write-Host ""

Read-Host "按 Enter 键退出"
