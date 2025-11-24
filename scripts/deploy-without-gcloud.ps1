# Script alternativo de deploy SEM gcloud CLI
# Usa Cloud Code ou fornece instrucoes para deploy manual

Write-Host "Deploy Alternativo - Sem gcloud CLI" -ForegroundColor Cyan
Write-Host ""

Write-Host "Opcoes de Deploy:" -ForegroundColor Yellow
Write-Host ""

Write-Host "1. Cloud Code no VS Code (RECOMENDADO)" -ForegroundColor Green
Write-Host "   Nao requer gcloud CLI instalado" -ForegroundColor Gray
Write-Host "   Interface visual" -ForegroundColor Gray
Write-Host "   Facil de usar" -ForegroundColor Gray
Write-Host ""
Write-Host "   Passos:" -ForegroundColor Cyan
Write-Host "   1. Instale extensao Cloud Code no VS Code" -ForegroundColor White
Write-Host "      code --install-extension GoogleCloudTools.cloudcode" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Abra o projeto no VS Code" -ForegroundColor White
Write-Host "      code ." -ForegroundColor Gray
Write-Host ""
Write-Host "   3. Command Palette (Ctrl+Shift+P)" -ForegroundColor White
Write-Host "      -> Cloud Code: Sign in to Google Cloud" -ForegroundColor Gray
Write-Host ""
Write-Host "   4. Deploy" -ForegroundColor White
Write-Host "      -> Cloud Code: Deploy to Cloud Run" -ForegroundColor Gray
Write-Host "      -> Selecione service.yaml" -ForegroundColor Gray
Write-Host ""

Write-Host "2. Google Cloud Console (Web)" -ForegroundColor Green
Write-Host "   Interface web" -ForegroundColor Gray
Write-Host "   Nao requer instalacao" -ForegroundColor Gray
Write-Host ""
Write-Host "   Passos:" -ForegroundColor Cyan
Write-Host "   1. Acesse: https://console.cloud.google.com/run" -ForegroundColor White
Write-Host "   2. Clique em 'Create Service'" -ForegroundColor White
Write-Host "   3. Selecione 'Deploy from source'" -ForegroundColor White
Write-Host "   4. Conecte seu repositorio Git ou faca upload" -ForegroundColor White
Write-Host "   5. Configure o Dockerfile e service.yaml" -ForegroundColor White
Write-Host ""

Write-Host "3. GitHub Actions (CI/CD)" -ForegroundColor Green
Write-Host "   Deploy automatico" -ForegroundColor Gray
Write-Host "   Integracao com Git" -ForegroundColor Gray
Write-Host ""
Write-Host "   Passos:" -ForegroundColor Cyan
Write-Host "   1. Crie arquivo .github/workflows/deploy.yml" -ForegroundColor White
Write-Host "   2. Configure secrets no GitHub" -ForegroundColor White
Write-Host "   3. Push para main branch" -ForegroundColor White
Write-Host ""

Write-Host "4. Instalar gcloud CLI" -ForegroundColor Yellow
Write-Host "   Se preferir usar CLI:" -ForegroundColor Gray
Write-Host ""
Write-Host "   Execute:" -ForegroundColor Cyan
Write-Host "   .\scripts\install-gcloud.ps1" -ForegroundColor White
Write-Host ""
Write-Host "   (Requer privilegios de Administrador)" -ForegroundColor Gray
Write-Host ""

Write-Host "Recomendacao: Use Cloud Code no VS Code!" -ForegroundColor Magenta
Write-Host "   E a forma mais facil e nao requer gcloud CLI" -ForegroundColor Gray
