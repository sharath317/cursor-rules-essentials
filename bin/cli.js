#!/usr/bin/env node

/**
 * cursor-rules-essentials CLI
 * Essential Cursor Rules for Code Quality, Accessibility, and Best Practices
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const VERSION = '1.0.0';
const CURSOR_DIR = '.cursor';
const RULES_DIR = 'rules';

const colors = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};

const log = {
    info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
    success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
    warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
    step: (msg) => console.log(`  ${colors.dim}→${colors.reset} ${msg}`),
    header: (msg) => console.log(`\n${colors.bold}${colors.cyan}${msg}${colors.reset}\n`),
};

const BUNDLES = {
    minimal: {
        name: 'Minimal (Core Quality)',
        description: 'Essential code quality rules',
        rules: [
            'web-standards.mdc',
            'pr-quality.mdc',
            'a11y-standards.mdc',
        ],
        count: 3,
    },
    standard: {
        name: 'Standard (Quality + Patterns)',
        description: 'Quality rules with React patterns',
        rules: [
            'web-standards.mdc',
            'pr-quality.mdc',
            'a11y-standards.mdc',
            'react-functional-patterns.mdc',
            'form-patterns.mdc',
            'async-effect-patterns.mdc',
            'client-boundary.mdc',
        ],
        count: 7,
    },
    complete: {
        name: 'Complete (All Rules)',
        description: 'Full suite of essential rules',
        rules: [
            'a11y-standards.mdc',
            'async-effect-patterns.mdc',
            'auto-adr.mdc',
            'auto-self-heal.mdc',
            'bundle-budget-guard.mdc',
            'client-boundary.mdc',
            'form-patterns.mdc',
            'plan-first.mdc',
            'pr-quality.mdc',
            'react-functional-patterns.mdc',
            'refactoring-gravity.mdc',
            'visual-regression-guard.mdc',
            'web-standards.mdc',
            'yolo-mode-config.mdc',
            'z-index-governance.mdc',
        ],
        count: 15,
    },
};

const RULE_DESCRIPTIONS = {
    'a11y-standards.mdc': 'Accessibility enforcement (ARIA, keyboard nav, focus)',
    'async-effect-patterns.mdc': 'AbortController for async useEffect',
    'auto-adr.mdc': 'Auto-generate Architecture Decision Records',
    'auto-self-heal.mdc': 'Auto-detect and fix common antipatterns',
    'bundle-budget-guard.mdc': 'Monitor bundle size impact',
    'client-boundary.mdc': 'SSR/CSR boundary detection',
    'form-patterns.mdc': 'React Hook Form best practices',
    'plan-first.mdc': 'Require planning for complex changes',
    'pr-quality.mdc': 'PR validation before submission',
    'react-functional-patterns.mdc': 'React functional component patterns',
    'refactoring-gravity.mdc': 'Identify high-churn files with coupling',
    'visual-regression-guard.mdc': 'Auto-detect UI changes',
    'web-standards.mdc': 'Real-time code quality enforcement',
    'yolo-mode-config.mdc': 'Auto-run validation configuration',
    'z-index-governance.mdc': 'Z-index token system enforcement',
};

function prompt(question, defaultValue = '') {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const defaultText = defaultValue ? ` (${defaultValue})` : '';

    return new Promise((resolve) => {
        rl.question(`${question}${defaultText}: `, (answer) => {
            rl.close();
            resolve(answer || defaultValue);
        });
    });
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function copyRules(sourceDir, targetDir, rulesList) {
    let copiedCount = 0;
    let skippedCount = 0;

    rulesList.forEach((rule) => {
        const srcFile = path.join(sourceDir, rule);
        const tgtFile = path.join(targetDir, rule);

        if (fs.existsSync(srcFile)) {
            if (!fs.existsSync(tgtFile)) {
                fs.copyFileSync(srcFile, tgtFile);
                log.step(`Installed: ${rule}`);
                copiedCount++;
            } else {
                log.step(`Exists: ${rule} (skipped)`);
                skippedCount++;
            }
        }
    });

    return { copiedCount, skippedCount };
}

async function init(flags = {}) {
    console.log(`
${colors.bold}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📏 CURSOR RULES ESSENTIALS v${VERSION}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}
Essential Rules: Code Quality, Accessibility, and Best Practices

`);

    const projectDir = process.cwd();
    const cursorDir = path.join(projectDir, CURSOR_DIR);
    const rulesDir = path.join(cursorDir, RULES_DIR);

    log.header('📦 Select Rules Bundle');

    Object.entries(BUNDLES).forEach(([key, bundle], idx) => {
        console.log(`  ${idx + 1}. ${colors.bold}${bundle.name}${colors.reset}`);
        console.log(`     ${bundle.description} (${bundle.count} rules)\n`);
    });

    let selectedBundle = 'complete';
    if (!flags.bundle && !flags.yes) {
        const bundleAnswer = await prompt('Select bundle (1-3)', '3');
        selectedBundle = Object.keys(BUNDLES)[parseInt(bundleAnswer, 10) - 1] || 'complete';
    } else if (flags.bundle) {
        selectedBundle = flags.bundle;
    }

    const bundle = BUNDLES[selectedBundle];
    log.success(`Selected: ${bundle.name}`);

    log.header('📥 Installing Rules');

    ensureDir(rulesDir);

    const packageDir = path.dirname(__dirname);
    const packageRulesDir = path.join(packageDir, 'rules');

    const { copiedCount, skippedCount } = copyRules(packageRulesDir, rulesDir, bundle.rules);

    console.log(`
${colors.bold}${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ INSTALLATION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}

${colors.cyan}Rules installed:${colors.reset} ${copiedCount} new, ${skippedCount} existing
${colors.cyan}Location:${colors.reset}        ${rulesDir}

${colors.bold}Installed Rules:${colors.reset}
`);

    bundle.rules.forEach((rule) => {
        const desc = RULE_DESCRIPTIONS[rule] || '';
        console.log(`  ${colors.green}✓${colors.reset} ${rule.replace('.mdc', '')}`);
        console.log(`    ${colors.dim}${desc}${colors.reset}`);
    });

    console.log(`
${colors.bold}How Rules Work:${colors.reset}
  Rules are automatically applied by Cursor based on their globs.
  No manual activation needed - they enforce patterns as you code.

${colors.dim}Documentation: https://github.com/sharath317/cursor-rules-essentials${colors.reset}
`);
}

async function status() {
    const projectDir = process.cwd();
    const rulesDir = path.join(projectDir, CURSOR_DIR, RULES_DIR);

    if (!fs.existsSync(rulesDir)) {
        log.warn('No rules directory found. Run: npx cursor-rules-essentials');
        process.exit(0);
    }

    const rules = fs.readdirSync(rulesDir).filter((f) => f.endsWith('.mdc'));
    const essentialRules = BUNDLES.complete.rules;
    const installedEssentials = rules.filter((r) => essentialRules.includes(r));

    console.log(`
${colors.bold}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 RULES ESSENTIALS STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}

${colors.cyan}Version:${colors.reset}           ${VERSION}
${colors.cyan}Essential Rules:${colors.reset}   ${installedEssentials.length}/${essentialRules.length} installed
${colors.cyan}Total Rules:${colors.reset}       ${rules.length} in project
${colors.cyan}Location:${colors.reset}          ${rulesDir}

${colors.bold}Essential Rules Status:${colors.reset}`);

    essentialRules.forEach((rule) => {
        const installed = rules.includes(rule);
        const icon = installed ? `${colors.green}✓${colors.reset}` : `${colors.red}✗${colors.reset}`;
        const desc = RULE_DESCRIPTIONS[rule] || '';
        console.log(`  ${icon} ${rule.replace('.mdc', '')}`);
    });

    console.log('');
}

async function listRules() {
    console.log(`
${colors.bold}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 AVAILABLE RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}
`);

    const categories = {
        'Code Quality': ['web-standards.mdc', 'pr-quality.mdc', 'plan-first.mdc', 'yolo-mode-config.mdc'],
        'React Patterns': ['react-functional-patterns.mdc', 'form-patterns.mdc', 'async-effect-patterns.mdc', 'client-boundary.mdc'],
        'Accessibility': ['a11y-standards.mdc'],
        'Architecture': ['auto-adr.mdc', 'refactoring-gravity.mdc', 'z-index-governance.mdc'],
        'Automation': ['auto-self-heal.mdc', 'bundle-budget-guard.mdc', 'visual-regression-guard.mdc'],
    };

    Object.entries(categories).forEach(([category, rules]) => {
        console.log(`\n${colors.bold}${category}${colors.reset}`);
        rules.forEach((rule) => {
            const desc = RULE_DESCRIPTIONS[rule] || '';
            console.log(`  ${colors.cyan}•${colors.reset} ${rule.replace('.mdc', '')}`);
            console.log(`    ${colors.dim}${desc}${colors.reset}`);
        });
    });

    console.log('');
}

function showHelp() {
    console.log(`
${colors.bold}cursor-rules-essentials v${VERSION}${colors.reset}

Essential Cursor Rules for Code Quality, Accessibility, and Best Practices

${colors.bold}Usage:${colors.reset}
  npx cursor-rules-essentials [command] [options]

${colors.bold}Commands:${colors.reset}
  init          Install rules (default)
  status        Show installed rules
  list          List all available rules
  help          Show this help

${colors.bold}Options:${colors.reset}
  --bundle      Select bundle (minimal, standard, complete)
  -y, --yes     Non-interactive mode

${colors.bold}Examples:${colors.reset}
  npx cursor-rules-essentials                   Interactive install
  npx cursor-rules-essentials --bundle complete Install all rules
  npx cursor-rules-essentials status            Check installation

${colors.bold}Bundles:${colors.reset}
  minimal   (3 rules)  - Core quality: web-standards, pr-quality, a11y
  standard  (7 rules)  - + React patterns, form patterns, async effects
  complete  (15 rules) - All essential rules

${colors.dim}https://github.com/sharath317/cursor-rules-essentials${colors.reset}
`);
}

// Parse CLI arguments
const args = process.argv.slice(2);
const flags = {};
let command = null;
const skipNextArg = new Set();

args.forEach((arg, idx) => {
    if (arg === '--bundle' && args[idx + 1]) {
        skipNextArg.add(idx + 1);
    }
});

args.forEach((arg, idx) => {
    if (skipNextArg.has(idx)) {
        return;
    } else if (arg === '-y' || arg === '--yes') {
        flags.yes = true;
    } else if (arg === '--bundle' && args[idx + 1]) {
        flags.bundle = args[idx + 1];
    } else if (!arg.startsWith('-') && command === null) {
        command = arg;
    }
});

switch (command) {
    case 'init':
    case null:
        init(flags);
        break;
    case 'status':
        status();
        break;
    case 'list':
        listRules();
        break;
    case 'help':
    case '-h':
    case '--help':
        showHelp();
        break;
    default:
        log.error(`Unknown command: ${command}`);
        console.log('Run "npx cursor-rules-essentials help" for usage');
        process.exit(1);
}

