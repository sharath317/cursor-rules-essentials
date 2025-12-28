# 📏 Cursor Rules Essentials

> Essential Cursor Rules for Code Quality, Accessibility, and Best Practices

[![npm version](https://badge.fury.io/js/cursor-rules-essentials.svg)](https://www.npmjs.com/package/cursor-rules-essentials)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Quick Install

```bash
npx cursor-rules-essentials
```

One command installs 15 essential `.mdc` rules for Cursor IDE.

## What are Cursor Rules?

Cursor Rules (`.mdc` files) are automatically enforced guidelines that help maintain code quality, accessibility, and best practices as you code. They work silently in the background, catching issues before they become problems.

## 📦 Rule Bundles

| Bundle | Rules | Use Case |
|--------|-------|----------|
| **Minimal** | 3 | Core quality only |
| **Standard** | 7 | + React patterns |
| **Complete** | 15 | All essential rules |

## 📋 Rules Reference

### 🎯 Code Quality

| Rule | Description |
|------|-------------|
| `web-standards` | Real-time code quality enforcement (component limits, hooks, styling) |
| `pr-quality` | PR validation - max files, lines, single responsibility |
| `plan-first` | Require implementation plan for complex multi-file changes |
| `yolo-mode-config` | Auto-run validation without manual intervention |

### ⚛️ React Patterns

| Rule | Description |
|------|-------------|
| `react-functional-patterns` | Functional component syntax, hooks organization, error handling |
| `form-patterns` | useWatch over watch(), memoize Yup schemas, OXForm wrapper |
| `async-effect-patterns` | AbortController for async useEffect, cleanup patterns |
| `client-boundary` | SSR/CSR boundary detection, prevent hydration mismatches |

### ♿ Accessibility

| Rule | Description |
|------|-------------|
| `a11y-standards` | ARIA labels, keyboard navigation, focus management |

### 🏗️ Architecture

| Rule | Description |
|------|-------------|
| `auto-adr` | Auto-generate Architecture Decision Records when patterns change |
| `refactoring-gravity` | Identify high-churn files with high coupling |
| `z-index-governance` | Enforce z-index token system to prevent z-index wars |

### 🤖 Automation

| Rule | Description |
|------|-------------|
| `auto-self-heal` | Auto-detect and fix common antipatterns while coding |
| `bundle-budget-guard` | Monitor bundle size impact when adding dependencies |
| `visual-regression-guard` | Auto-detect UI changes and require visual verification |

## 💡 How Rules Work

Rules are automatically applied by Cursor based on their configuration:

```yaml
# Example rule header
---
description: Real-time code quality enforcement
globs: ["**/*.tsx", "**/*.ts"]
alwaysApply: true
severity: warn
---
```

- **globs**: Which files the rule applies to
- **alwaysApply**: Whether the rule is always active
- **severity**: `block`, `warn`, or `info`

## 🛠️ CLI Commands

```bash
npx cursor-rules-essentials              # Interactive install
npx cursor-rules-essentials --bundle complete -y  # Non-interactive
npx cursor-rules-essentials status       # Check installed rules
npx cursor-rules-essentials list         # List all available rules
npx cursor-rules-essentials help         # Show help
```

## 📂 Installation Structure

After installation:

```
.cursor/
└── rules/
    ├── a11y-standards.mdc
    ├── async-effect-patterns.mdc
    ├── auto-adr.mdc
    ├── auto-self-heal.mdc
    ├── bundle-budget-guard.mdc
    ├── client-boundary.mdc
    ├── form-patterns.mdc
    ├── plan-first.mdc
    ├── pr-quality.mdc
    ├── react-functional-patterns.mdc
    ├── refactoring-gravity.mdc
    ├── visual-regression-guard.mdc
    ├── web-standards.mdc
    ├── yolo-mode-config.mdc
    └── z-index-governance.mdc
```

## 🔄 Rule Categories

### Prevention Rules (Block Bad Patterns)
- `web-standards` - Component size limits, hook patterns
- `pr-quality` - PR scope limits, single responsibility
- `a11y-standards` - Accessibility requirements

### Detection Rules (Warn About Issues)
- `refactoring-gravity` - High-churn files
- `bundle-budget-guard` - Bundle size growth
- `visual-regression-guard` - UI changes

### Automation Rules (Auto-Fix)
- `auto-self-heal` - Fix antipatterns automatically
- `yolo-mode-config` - Run validation without prompts

## 🤝 Works With

- [Buddy OS](https://github.com/sharath317/buddy-os) - Role-aware autonomous agent
- [Cursor Full-Flow](https://github.com/sharath317/cursor-full-flow) - Jira to PR automation
- [Cursor AI Toolkit](https://github.com/sharath317/cursor-ai-toolkit) - AI self-improvement

## 📄 License

MIT © Sharath Chandra

---

**Write better code, automatically.**

