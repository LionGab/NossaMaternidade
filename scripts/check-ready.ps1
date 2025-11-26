# Script de Validação - Verifica se o projeto está pronto para build/deploy
# Uso: pwsh scripts/check-ready.ps1

Write-Host "🔍 Verificando prontidão para deploy..." -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

$REPO_PATH = Get-Location
Set-Location $REPO_PATH

$checks = 0
$total = 8
$errors = 0
$warnings = 0

# 1. app.json ou app.config.js (Expo suporta ambos)
Write-Host "📱 Verificando configuração Expo..." -ForegroundColor Yellow
$hasAppJson = Test-Path "app.json"
$hasAppConfig = Test-Path "app.config.js"

if ($hasAppJson -or $hasAppConfig) {
    if ($hasAppConfig) {
        Write-Host "  ✅ app.config.js encontrado (config dinâmica)" -ForegroundColor Green
        $checks++

        # Verificar bundle ID no app.config.js
        $appConfig = Get-Content "app.config.js" -Raw
        if ($appConfig -match "com\.nossamaternidade\.app") {
            Write-Host "  ✅ Bundle ID correto" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  Bundle ID precisa ser 'com.nossamaternidade.app'" -ForegroundColor Yellow
            $warnings++
        }
    } elseif ($hasAppJson) {
        Write-Host "  ✅ app.json encontrado" -ForegroundColor Green
        $checks++

        # Verificar bundle ID no app.json
        $appJson = Get-Content "app.json" -Raw
        if ($appJson -match "com\.nossamaternidade\.app") {
            Write-Host "  ✅ Bundle ID correto" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  Bundle ID precisa ser 'com.nossamaternidade.app'" -ForegroundColor Yellow
            $warnings++
        }
    }
} else {
    Write-Host "  ❌ app.json ou app.config.js NÃO encontrado" -ForegroundColor Red
    $errors++
}
Write-Host ""

# 2. eas.json
Write-Host "📦 Verificando eas.json..." -ForegroundColor Yellow
if (Test-Path "eas.json") {
    Write-Host "  ✅ eas.json encontrado" -ForegroundColor Green
    $checks++
    
    $easJson = Get-Content "eas.json" -Raw
    if ($easJson -match '"production"') {
        Write-Host "  ✅ Profile production existe" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Profile production não encontrado" -ForegroundColor Yellow
        $warnings++
    }
} else {
    Write-Host "  ❌ eas.json NÃO encontrado" -ForegroundColor Red
    $errors++
}
Write-Host ""

# 3. .env.example
Write-Host "📄 Verificando .env.example..." -ForegroundColor Yellow
if (Test-Path ".env.example") {
    Write-Host "  ✅ .env.example encontrado" -ForegroundColor Green
    $checks++
} else {
    Write-Host "  ❌ .env.example NÃO encontrado" -ForegroundColor Red
    $errors++
}
Write-Host ""

# 4. .env (deve existir mas não estar no Git)
Write-Host "🔐 Verificando .env..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "  ✅ .env configurado" -ForegroundColor Green
    $checks++
    
    # Verificar se está no Git
    $gitFiles = git ls-files .env 2>$null
    if ($gitFiles) {
        Write-Host "  ⚠️  ATENÇÃO: .env está no Git! Remova com: git rm --cached .env" -ForegroundColor Yellow
        $warnings++
    } else {
        Write-Host "  ✅ .env não está no Git (correto)" -ForegroundColor Green
    }
} else {
    Write-Host "  ⚠️  .env não encontrado (crie a partir do .env.example)" -ForegroundColor Yellow
    Write-Host "      Comando: Copy-Item .env.example .env" -ForegroundColor Gray
    $warnings++
}
Write-Host ""

# 5. Assets - Ícone
Write-Host "🖼️  Verificando assets/icon.png..." -ForegroundColor Yellow
if (Test-Path "assets/icon.png") {
    Write-Host "  ✅ Ícone encontrado" -ForegroundColor Green
    $checks++
    
    # Tentar verificar dimensões (requer ImageMagick ou similar)
    if (Get-Command "magick" -ErrorAction SilentlyContinue) {
        $size = & magick identify -format "%wx%h" assets/icon.png 2>$null
        if ($size -eq "1024x1024") {
            Write-Host "  ✅ Dimensões corretas (1024x1024)" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  Dimensões incorretas: $size (esperado: 1024x1024)" -ForegroundColor Yellow
            $warnings++
        }
    } else {
        # Fallback: apenas verificar se é imagem
        Write-Host "  ✅ Arquivo PNG encontrado (dimensões não verificadas - instale ImageMagick para verificar)" -ForegroundColor Green
    }
} else {
    Write-Host "  ❌ assets/icon.png NÃO encontrado" -ForegroundColor Red
    $errors++
}
Write-Host ""

# 6. Assets - Splash
Write-Host "🖼️  Verificando assets/splash.png..." -ForegroundColor Yellow
if (Test-Path "assets/splash.png") {
    Write-Host "  ✅ Splash screen encontrado" -ForegroundColor Green
    $checks++
} else {
    Write-Host "  ❌ assets/splash.png NÃO encontrado" -ForegroundColor Red
    $errors++
}
Write-Host ""

# 7. Screenshots (para lojas)
Write-Host "📸 Verificando screenshots..." -ForegroundColor Yellow
if (Test-Path "assets/screenshots") {
    $screenshots = Get-ChildItem "assets/screenshots" -Include *.png,*.jpg -Recurse -ErrorAction SilentlyContinue
    $count = $screenshots.Count
    
    if ($count -gt 0) {
        Write-Host "  ✅ Screenshots encontrados ($count arquivos)" -ForegroundColor Green
        $checks++
        
        if ($count -lt 3) {
            Write-Host "  ⚠️  Recomendado: pelo menos 3 screenshots para as lojas" -ForegroundColor Yellow
            $warnings++
        }
    } else {
        Write-Host "  ⚠️  Pasta screenshots existe mas está vazia" -ForegroundColor Yellow
        Write-Host "      Recomendado: adicione screenshots para as lojas" -ForegroundColor Gray
        $warnings++
    }
} else {
    Write-Host "  ⚠️  assets/screenshots/ não existe (criando pasta...)" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "assets/screenshots" -Force | Out-Null
    Write-Host "  ✅ Pasta criada (adicione screenshots depois)" -ForegroundColor Green
    $warnings++
}
Write-Host ""

# 8. README.md
Write-Host "📚 Verificando README.md..." -ForegroundColor Yellow
if (Test-Path "README.md") {
    Write-Host "  ✅ README.md encontrado" -ForegroundColor Green
    $checks++
    
    $readme = Get-Content "README.md" -Raw
    if ($readme -match "(?i)oficial|official") {
        Write-Host "  ✅ README marca repositório como oficial" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  README não menciona que é repositório oficial" -ForegroundColor Yellow
        $warnings++
    }
} else {
    Write-Host "  ❌ README.md NÃO encontrado" -ForegroundColor Red
    $errors++
}
Write-Host ""

# Resultado
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "📊 Score: $checks/$total checks aprovados" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

if ($errors -gt 0) {
    Write-Host "❌ ERROS CRÍTICOS: $errors" -ForegroundColor Red
    Write-Host "   Corrija os itens marcados como ❌ antes de fazer build" -ForegroundColor Red
    Write-Host ""
}

if ($warnings -gt 0) {
    Write-Host "⚠️  AVISOS: $warnings" -ForegroundColor Yellow
    Write-Host "   Revise os itens marcados como ⚠️" -ForegroundColor Yellow
    Write-Host ""
}

if ($errors -eq 0 -and $checks -eq $total) {
    Write-Host "🎉🎉🎉 PRONTO PARA DEPLOY! 🎉🎉🎉" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximo passo:" -ForegroundColor Cyan
    Write-Host "  eas build --profile preview --platform android" -ForegroundColor Cyan
    Write-Host ""
    exit 0
} elseif ($errors -eq 0 -and $checks -ge 6) {
    Write-Host "✅ QUASE PRONTO" -ForegroundColor Green
    Write-Host "Corrija os $warnings avisos para melhorar a qualidade do deploy" -ForegroundColor Yellow
    Write-Host ""
    exit 0
} else {
    Write-Host "❌ NÃO PRONTO PARA DEPLOY" -ForegroundColor Red
    Write-Host "Faltam $errors itens críticos e $warnings avisos" -ForegroundColor Red
    Write-Host ""
    exit 2
}

