# Skills Directory

This directory contains Claude AI skills for the Nossa Maternidade project. Each skill is a specialized capability that Claude can use to help with specific tasks.

## 📁 Available Skills

### 1. Design Tokens Auto-Fixer
**Location:** `.claude/skills/design-tokens-fixer/`

Automatically fixes hardcoded colors, spacing, and typography violations by replacing them with proper design tokens.

**Usage:**
```
Claude: "Fix design tokens in Checkbox.tsx"
Claude: "Apply design tokens to all components"
```

**Documentation:** See `design-tokens-fixer/README.md`

---

### 2. WCAG Accessibility Validator
**Location:** `.claude/skills/wcag-validator/`

Validates and fixes accessibility issues to meet WCAG 2.1 Level AAA standards.

**Usage:**
```
Claude: "Check WCAG compliance in HomeScreen.tsx"
Claude: "Fix accessibility issues in SymptomForm.tsx"
```

**Documentation:** See `wcag-validator/README.md`

---

### 3. Maternal AI Prompt Tester
**Location:** `.claude/skills/prompt-tester/`

Validates and tests AI prompts for crisis detection, safety, and medical accuracy.

**Usage:**
```
Claude: "Test crisis detection in nathia.system.md"
Claude: "Validate prompt safety for maternal health"
```

**Documentation:** See `prompt-tester/README.md`

---

### 4. React Native Optimizer
**Location:** `.claude/skills/react-native-optimizer/`

Ensures React Native best practices for performance, memory efficiency, and optimal UX.

**Usage:**
```
Claude: "Optimize FlatList performance in ListScreen.tsx"
Claude: "Fix React Native performance issues"
```

**Documentation:** See `react-native-optimizer/README.md`

---

## 🔧 How Skills Work

Each skill consists of:

1. **README.md** - Complete documentation with examples, rules, and usage
2. **scripts/** - Executable scripts (if needed)
3. **examples/** - Example files showing before/after
4. **resources/** - Additional resources and references

## 🚀 Using Skills with Claude

When you ask Claude to perform a task, it will automatically:
1. Detect which skill(s) are relevant
2. Read the skill documentation
3. Apply the skill's rules and patterns
4. Validate the results

## 📚 Integration with MCPs

All skills integrate with our MCP (Model Context Protocol) servers:

- **@design-tokens** - Validates token usage
- **@code-quality** - Checks code standards  
- **@accessibility** - Validates WCAG compliance
- **@mobile-optimization** - Validates React Native optimizations
- **@prompt-testing** - Validates AI prompts

## 🎯 Best Practices

1. **Always review changes** - Skills make automated fixes, but you should review them
2. **Test after fixes** - Run `npm run type-check` and test components
3. **Use dry-run first** - Many skills support `--dry-run` to preview changes
4. **Check documentation** - Each skill has detailed README with examples

---

*Last Updated: 2025-11-27*  
*Maintained by: Lion (@LionGab)*

