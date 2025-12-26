#!/bin/bash
# Nossa Maternidade - 10 Day Launch Checklist
# Ultra-detailed execution guide for App Store + Google Play launch
#
# Usage:
#   ./scripts/launch-checklist.sh           # Show overview
#   ./scripts/launch-checklist.sh 1         # Show Day 1 checklist
#   ./scripts/launch-checklist.sh verify    # Verify environment

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Helper functions
print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_task() {
    echo -e "${BLUE}→${NC} $1"
}

# Verification function
verify_env() {
    print_header "ENVIRONMENT VERIFICATION"

    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v)
        print_success "Node.js: $NODE_VERSION"
    else
        print_error "Node.js not installed"
    fi

    # Check npm/bun
    if command -v bun &> /dev/null; then
        BUN_VERSION=$(bun -v)
        print_success "Bun: $BUN_VERSION"
    elif command -v npm &> /dev/null; then
        NPM_VERSION=$(npm -v)
        print_success "npm: $NPM_VERSION"
    else
        print_error "Neither npm nor bun installed"
    fi

    # Check EAS CLI
    if command -v eas &> /dev/null; then
        print_success "EAS CLI: installed"
        eas whoami
    else
        print_warning "EAS CLI not installed (npm install -g eas-cli)"
    fi

    # Check Supabase CLI
    if command -v supabase &> /dev/null; then
        print_success "Supabase CLI: installed"
    else
        print_warning "Supabase CLI not installed"
    fi

    # Check .env.local
    if [ -f .env.local ]; then
        print_success ".env.local exists"

        # Check critical variables
        if grep -q "EXPO_PUBLIC_REVENUECAT_IOS_KEY" .env.local; then
            print_success "RevenueCat iOS key configured"
        else
            print_warning "RevenueCat iOS key missing"
        fi

        if grep -q "EXPO_PUBLIC_REVENUECAT_ANDROID_KEY" .env.local; then
            print_success "RevenueCat Android key configured"
        else
            print_warning "RevenueCat Android key missing"
        fi
    else
        print_error ".env.local not found"
    fi

    # Check quality gate
    print_task "Running quality gate..."
    npm run quality-gate || print_error "Quality gate failed"

    echo -e "\n${GREEN}Verification complete!${NC}\n"
}

# Day overview
show_overview() {
    print_header "NOSSA MATERNIDADE - 10 DAY LAUNCH PLAN"

    echo "📋 TIMELINE OVERVIEW"
    echo ""
    echo "  Day 1-2:   Legal Docs + RevenueCat Dashboard Setup"
    echo "  Day 3-5:   App Store Connect + Google Play Console"
    echo "  Day 6-8:   Testing + Production Builds"
    echo "  Day 9-10:  Submission + Launch Prep"
    echo ""
    echo "🎯 CRITICAL BLOCKERS (P0):"
    echo "  ❌ Legal docs not published (Privacy, Terms, AI Disclaimer)"
    echo "  ❌ RevenueCat dashboard not configured"
    echo "  ❌ Store subscriptions not created"
    echo ""
    echo "📊 CODE STATUS:"
    echo "  ✅ TypeScript: 0 errors"
    echo "  ✅ SDK installed: react-native-purchases v9.6.10"
    echo "  ✅ Webhook deployed (not configured)"
    echo "  ✅ Quality gate: Ready"
    echo ""
    echo "🔑 HARDCODED VALUES (DO NOT CHANGE):"
    echo "  Bundle ID (iOS):     br.com.nossamaternidade.app"
    echo "  Package (Android):   com.nossamaternidade.app"
    echo "  Product Monthly:     com.nossamaternidade.subscription.monthly"
    echo "  Product Annual:      com.nossamaternidade.subscription.annual"
    echo "  Entitlement:         premium"
    echo "  Offering:            default"
    echo "  Webhook URL:         https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/webhook/revenuecat"
    echo ""
    echo "💰 PRICING:"
    echo "  Monthly: R\$ 19,90/mês"
    echo "  Annual:  R\$ 79,90/ano (67% savings)"
    echo "  Trial:   7 days"
    echo ""
    echo "📖 USAGE:"
    echo "  ./scripts/launch-checklist.sh 1        # Show Day 1 tasks"
    echo "  ./scripts/launch-checklist.sh verify   # Verify environment"
    echo "  cat docs/PLANO_LANCAMENTO_10_DIAS.md   # Full detailed plan"
    echo ""
}

# Day 1 checklist
show_day1() {
    print_header "DAY 1 - LEGAL DOCS + REVENUECAT SETUP (8 HOURS)"

    echo "🎯 OBJECTIVE: Publish legal docs + configure RevenueCat completely"
    echo ""
    echo "SUCCESS CRITERIA:"
    echo "  ✓ Legal docs accessible at public URLs"
    echo "  ✓ RevenueCat entitlement 'premium' created"
    echo "  ✓ RevenueCat offering 'default' configured"
    echo "  ✓ Webhook tested and functioning"
    echo ""

    print_task "HOUR 1-2: Legal Documentation (2h)"
    echo ""
    echo "Option A: Notion Pages (fastest - 30min)"
    echo "  1. Create notion.so account"
    echo "  2. Create 3 pages: Privacy Policy, Terms, AI Disclaimer"
    echo "  3. Publish to web → Copy public URLs"
    echo "  4. Test accessibility"
    echo ""
    echo "Option B: GitHub Pages (recommended - 1h)"
    echo "  1. Create repository: nossamaternidade-legal"
    echo "  2. Create HTML files: privacidade.html, termos.html, ai-disclaimer.html"
    echo "  3. Enable GitHub Pages: Settings → Pages → Source: main"
    echo "  4. URLs: https://USERNAME.github.io/nossamaternidade-legal/privacidade.html"
    echo ""
    echo "Required content:"
    echo "  • Privacy Policy: Data collection, AI providers, LGPD rights, contact"
    echo "  • Terms of Service: Medical disclaimer, subscription terms, Brazilian law"
    echo "  • AI Disclaimer: OpenAI/Gemini usage, health limitations"
    echo ""

    print_task "HOUR 3-4: RevenueCat Dashboard (2h)"
    echo ""
    echo "Step 1: Create account → https://app.revenuecat.com/signup"
    echo "  Email: nath@nossamaternidade.com.br"
    echo "  Project: Nossa Maternidade"
    echo ""
    echo "Step 2: Add iOS app"
    echo "  Bundle ID: br.com.nossamaternidade.app (EXACT MATCH)"
    echo "  Get Shared Secret from App Store Connect"
    echo ""
    echo "Step 3: Add Android app"
    echo "  Package: com.nossamaternidade.app (EXACT MATCH)"
    echo "  Upload Service Account JSON from Google Cloud"
    echo ""
    echo "Step 4: Create Entitlement"
    echo "  Identifier: premium (EXACT MATCH - case sensitive)"
    echo ""
    echo "Step 5: Create Offering"
    echo "  Identifier: default (EXACT MATCH - case sensitive)"
    echo "  Mark as Current: YES"
    echo ""
    echo "Step 6: Add Packages"
    echo "  Package 1: \$rc_monthly (link product later)"
    echo "  Package 2: \$rc_annual (link product later)"
    echo ""
    echo "Step 7: Get API Keys"
    echo "  iOS:     appl_XXXXXXXXXXXXX"
    echo "  Android: goog_XXXXXXXXXXXXX"
    echo "  Save to .env.local"
    echo ""

    print_task "HOUR 5-6: Webhook Configuration (2h)"
    echo ""
    echo "Step 1: Verify deployment"
    echo "  $ npx supabase functions list"
    echo "  Should show: webhook (deployed)"
    echo ""
    echo "Step 2: Configure in RevenueCat"
    echo "  Dashboard → Integrations → Webhooks → + Add"
    echo "  URL: https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/webhook/revenuecat"
    echo "  Auth: Bearer 925768eedee5c9fb740587618da37a816100f21f4ca4eb47df327d624fbc6525"
    echo "  Events: Check ALL"
    echo ""
    echo "Step 3: Test webhook"
    echo "  Terminal: npx supabase functions logs webhook --tail"
    echo "  Browser: Send Test Event"
    echo "  Verify: webhook_transactions table has new row"
    echo ""

    print_task "HOUR 7-8: Quality Gate (2h)"
    echo ""
    echo "Commands:"
    echo "  $ npm run quality-gate"
    echo "  Must pass: TypeScript (0 errors), ESLint (0 errors), Build check, No console.log"
    echo ""

    echo "STOP CHECKPOINTS:"
    echo "  ✓ Legal docs load in browser"
    echo "  ✓ RevenueCat entitlement shows 'Active'"
    echo "  ✓ Webhook test event received"
    echo "  ✓ Quality gate 100% green"
    echo ""
}

# Day 2 checklist
show_day2() {
    print_header "DAY 2 - APP STORE CONNECT (IOS) (8 HOURS)"

    echo "🎯 OBJECTIVE: Create iOS app and subscriptions"
    echo ""
    echo "LOGIN: https://appstoreconnect.apple.com"
    echo ""

    print_task "HOUR 1-2: App Creation"
    echo "  My Apps → + → New App"
    echo "  Platform: iOS"
    echo "  Name: Nossa Maternidade"
    echo "  Bundle ID: br.com.nossamaternidade.app (EXACT MATCH)"
    echo "  SKU: nossamaternidade-ios-v1"
    echo ""

    print_task "HOUR 3-5: Subscriptions"
    echo "  Create Subscription Group: Nossa Maternidade Premium"
    echo ""
    echo "  Monthly Product:"
    echo "    ID: com.nossamaternidade.subscription.monthly (EXACT)"
    echo "    Price: R\$ 19,90"
    echo "    Duration: 1 Month"
    echo "    Free Trial: 7 Days"
    echo ""
    echo "  Annual Product:"
    echo "    ID: com.nossamaternidade.subscription.annual (EXACT)"
    echo "    Price: R\$ 79,90"
    echo "    Duration: 1 Year"
    echo "    Free Trial: 7 Days"
    echo ""

    print_task "HOUR 6-7: Sync to RevenueCat"
    echo "  1. Generate App Store Connect API Key (.p8 file)"
    echo "  2. Upload to RevenueCat"
    echo "  3. Fetch Products"
    echo "  4. Link to Offering 'default'"
    echo ""

    print_task "HOUR 8: Sandbox Account"
    echo "  Users → Sandbox → + Create Tester"
    echo "  Email: sandbox.test+nossamaternidade@gmail.com"
    echo ""
}

# Day 3 checklist
show_day3() {
    print_header "DAY 3 - GOOGLE PLAY CONSOLE (ANDROID) (8 HOURS)"

    echo "🎯 OBJECTIVE: Create Android app and subscriptions"
    echo ""
    echo "LOGIN: https://play.google.com/console"
    echo ""

    print_task "HOUR 1-2: App Creation"
    echo "  All apps → Create app"
    echo "  Name: Nossa Maternidade"
    echo "  Package: com.nossamaternidade.app (EXACT MATCH)"
    echo "  Category: Health & Fitness"
    echo ""

    print_task "HOUR 3-5: Subscriptions"
    echo "  Monetize → Subscriptions → Create"
    echo ""
    echo "  Monthly:"
    echo "    ID: com.nossamaternidade.subscription.monthly (EXACT)"
    echo "    Base Plan: monthly-base"
    echo "    Price: R\$ 19,90"
    echo "    Free Trial: 7 days"
    echo ""
    echo "  Annual:"
    echo "    ID: com.nossamaternidade.subscription.annual (EXACT)"
    echo "    Base Plan: annual-base"
    echo "    Price: R\$ 79,90"
    echo "    Free Trial: 7 days"
    echo ""

    print_task "HOUR 6-7: Sync to RevenueCat"
    echo "  RevenueCat → Apps → Android → Fetch Products"
    echo ""

    print_task "HOUR 8: Internal Testing"
    echo "  Testing → Internal testing → Add testers"
    echo ""
}

# Day 6 checklist
show_day6() {
    print_header "DAY 6 - PRE-PRODUCTION CHECKLIST (8 HOURS)"

    echo "🎯 OBJECTIVE: Final validation before production builds"
    echo ""

    print_task "Commands to run:"
    echo "  $ npm run quality-gate       # Must pass 100%"
    echo "  $ npm test -- --coverage     # Run tests"
    echo "  $ npm audit --production     # Check vulnerabilities"
    echo "  $ curl -I [privacy URL]      # Verify legal docs"
    echo "  $ curl -I [terms URL]"
    echo "  $ curl -I [AI disclaimer URL]"
    echo ""

    print_task "RevenueCat verification:"
    echo "  Dashboard → Production mode: ON"
    echo "  Offering 'default': CURRENT"
    echo "  Webhook: Active"
    echo "  Send test event → Check logs"
    echo ""
}

# Day 7-8 checklist
show_day7() {
    print_header "DAY 7-8 - PRODUCTION BUILDS (2 DAYS)"

    echo "🎯 OBJECTIVE: Build production binaries"
    echo ""

    print_task "Day 7 - iOS Build"
    echo "  $ npm run clean:all && npm install"
    echo "  $ git tag -a v1.0.0 -m 'Production v1.0.0'"
    echo "  $ git push origin v1.0.0"
    echo "  $ eas build --profile production --platform ios --auto-submit"
    echo ""
    echo "  Monitor: https://expo.dev → Builds (20-30 min)"
    echo "  TestFlight: App Store Connect → Add External Testers"
    echo ""

    print_task "Day 8 - Android Build"
    echo "  $ eas build --profile production --platform android --auto-submit"
    echo ""
    echo "  Monitor: Play Console → Internal testing"
    echo ""
}

# Day 9 checklist
show_day9() {
    print_header "DAY 9 - STORE SUBMISSION (8 HOURS)"

    echo "🎯 OBJECTIVE: Submit for review"
    echo ""

    print_task "iOS Submission"
    echo "  App Store Connect → My Apps → Nossa Maternidade"
    echo "  Add metadata: Name, Subtitle, Description, Screenshots"
    echo "  Privacy URL: [your legal docs URL]"
    echo "  Demo account: reviewer@nossamaternidade.com.br"
    echo "  Age Rating: 12+"
    echo "  Submit for Review"
    echo ""

    print_task "Android Submission"
    echo "  Play Console → Production → Create release"
    echo "  Release notes (Portuguese)"
    echo "  Rollout: 20% (staged)"
    echo "  Confirm"
    echo ""
}

# Day 10 checklist
show_day10() {
    print_header "DAY 10 - LAUNCH PREP + MONITORING (8 HOURS)"

    echo "🎯 OBJECTIVE: Final preparations and rollback plan"
    echo ""

    print_task "GO/NO-GO Decision"
    echo "  ✓ App Review: In Review or Approved"
    echo "  ✓ No critical bugs"
    echo "  ✓ Webhook tested in last 24h"
    echo "  ✓ Legal docs accessible"
    echo "  ✓ Support email operational"
    echo ""

    print_task "Rollback Plan"
    echo "  Option 1: Feature flag in Supabase"
    echo "  Option 2: Emergency build (git revert)"
    echo "  Option 3: Halt rollout (Android only)"
    echo ""
}

# Main script logic
case "${1:-overview}" in
    overview)
        show_overview
        ;;
    verify)
        verify_env
        ;;
    1)
        show_day1
        ;;
    2)
        show_day2
        ;;
    3)
        show_day3
        ;;
    6)
        show_day6
        ;;
    7|8)
        show_day7
        ;;
    9)
        show_day9
        ;;
    10)
        show_day10
        ;;
    *)
        echo "Usage: $0 [overview|verify|1|2|3|6|7|8|9|10]"
        echo ""
        echo "  overview - Show 10-day plan overview (default)"
        echo "  verify   - Verify development environment"
        echo "  1-10     - Show specific day checklist"
        echo ""
        echo "For full details: cat docs/PLANO_LANCAMENTO_10_DIAS.md"
        exit 1
        ;;
esac
