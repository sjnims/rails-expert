# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Claude Code plugin marketplace** called "Rails Expert" - an all-in-one Rails 8 expert development team with DHH as coordinator and 7 specialist personas covering routing, Active Record, Hotwire, Action Cable, testing, deployment, and performance.

## Repository Structure

```
rails-expert/                    # Marketplace root
├── .claude-plugin/
│   └── marketplace.json        # Marketplace manifest (registers plugins)
├── plugins/
│   └── rails-expert/           # The actual plugin
│       ├── .claude-plugin/
│       │   └── plugin.json     # Plugin manifest
│       ├── agents/             # 8 subagent definitions
│       ├── commands/           # 9 slash commands
│       ├── hooks/
│       │   └── hooks.json      # PreToolUse hooks for auto-triggering
│       └── skills/             # 8 knowledge domains with SKILL.md + references/ + examples/
└── .github/workflows/          # CI checks
```

## Development Commands

### Run Plugin Locally

```bash
# From repository root (marketplace mode)
claude --plugin-dir .

# Or load just the plugin
claude --plugin-dir ./plugins/rails-expert
```

### Linting

```bash
# Markdown - must pass before commit
markdownlint '**/*.md' --ignore node_modules
markdownlint '**/*.md' --ignore node_modules --fix  # Auto-fix

# Ruby - example files in skills/*/examples/
rubocop --config .rubocop.yml
rubocop --config .rubocop.yml -a  # Auto-fix (safe corrections only)

# YAML configuration files
uvx yamllint -c .yamllint.yml .github/ .claude-plugin/ plugins/*/.claude-plugin/

# GitHub Actions validation
actionlint

# Broken link detection (uses .lycheeignore for exclusions)
lychee --exclude-path node_modules .
```

### Testing Workflow

```bash
# Create isolated test environment
mkdir /tmp/test-rails-plugin && cd /tmp/test-rails-plugin && git init

# Load plugin
claude --plugin-dir /path/to/rails-expert

# Test commands
/rails-team
/rails-db migrations
/rails-config

# Clean up
rm -rf /tmp/test-rails-plugin
```

## Plugin Architecture

### Component Flow

1. **User triggers**: Via command (`/rails-team`) or auto-trigger (editing Rails files)
2. **DHH coordinator** (`agents/dhh-coordinator.md`) analyzes request, calls specialists
3. **Specialists** provide domain expertise from their skills
4. **DHH synthesizes** consensus and presents based on verbosity setting

### Key Files

| File | Purpose |
|------|---------|
| `.claude-plugin/marketplace.json` | Registers plugin with marketplace metadata |
| `plugins/rails-expert/.claude-plugin/plugin.json` | Plugin name, version, keywords |
| `plugins/rails-expert/hooks/hooks.json` | PreToolUse hooks for auto-triggering on Rails file edits and Rails CLI commands |
| `plugins/rails-expert/.claude-example-settings.md` | Template users copy to `.claude/rails-expert.local.md` |

### User Configuration

Users configure via `.claude/rails-expert.local.md` in their project (not this repo). Key settings: `dhh_mode`, `verbosity`, `auto_trigger`, `enable_debates`.

## YAML Frontmatter Patterns

### Agents

```yaml
---
name: agent-name
description: When to trigger (include <example> blocks)
model: inherit  # or sonnet, opus, haiku
color: magenta
tools: Read, Grep, Glob, Task
---
```

### Commands

```yaml
---
description: Short help text
argument-hint: [optional-arg]
allowed-tools: Task, Read
---
```

### Skills

```yaml
---
name: skill-name
description: Trigger phrases with <example> blocks
---
```

Skills follow progressive disclosure: `SKILL.md` (core ~2000 words) → `references/` (detailed docs) → `examples/` (code patterns).

## CI Checks

All PRs run these workflows (see `.github/workflows/`):

- `markdownlint.yml`, `ruby-lint.yml`, `yaml-lint.yml` - Linting
- `links.yml` - Broken link detection (uses `.lycheeignore`)
- `component-validation.yml` - Plugin structure validation
- `version-check.yml` - Version consistency across manifests
- `claude-pr-review.yml` - AI-powered review
- `semantic-labeler.yml` - Auto-labeling based on paths

## Important Notes

- **Shell Pattern Escaping**: Use `[BANG]` instead of `!` in skill files to prevent shell execution during loading (see SECURITY.md). Audit with: `rg '!\`' plugins/ --glob '*.md' | rg -v '\[BANG\]'`
- **GitHub Actions Pinning**: Pin actions by full SHA, not version tags: `actions/checkout@SHA # vX.Y.Z`
- **Restart Required**: Users must restart Claude Code after editing `.claude/rails-expert.local.md`
- **Version Sync**: Versions in `marketplace.json` and `plugin.json` must match (CI validates via `version-check.yml`)
