# Contributing to Rails Expert

Thank you for your interest in contributing to the Rails Expert plugin for Claude Code! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Development Guidelines](#development-guidelines)
- [Component-Specific Guidelines](#component-specific-guidelines)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Style Guide](#style-guide)
- [Community](#community)

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to <sjnims@gmail.com>.

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Claude Code**: Install from [claude.ai/code](https://claude.ai/code)
- **Git**: For version control
- **Node.js**: For markdownlint (optional but recommended)

  ```bash
  npm install -g markdownlint-cli
  ```

- **Python/uv**: For yamllint (optional, see [uv docs](https://docs.astral.sh/uv/))

### Understanding the Project

1. **Read the documentation**:
   - [README.md](README.md) - User-facing documentation
   - [CLAUDE.md](CLAUDE.md) - Development documentation
   - [SECURITY.md](SECURITY.md) - Security policy

2. **Explore the architecture**:

   ```text
   rails-expert/
   ├── .claude-plugin/
   │   └── marketplace.json    # Marketplace manifest
   └── plugins/
       └── rails-expert/
           ├── .claude-plugin/
           │   └── plugin.json # Plugin manifest
           ├── agents/         # 8 agents (DHH coordinator + 7 specialists)
           │   ├── dhh-coordinator.md
           │   ├── routing-controllers-specialist.md
           │   ├── active-record-specialist.md
           │   ├── hotwire-specialist.md
           │   ├── action-cable-specialist.md
           │   ├── testing-specialist.md
           │   ├── deployment-specialist.md
           │   └── performance-specialist.md
           ├── commands/       # 9 slash commands
           │   ├── rails-team.md
           │   ├── rails-routing.md
           │   ├── rails-db.md
           │   ├── rails-hotwire.md
           │   ├── rails-realtime.md
           │   ├── rails-testing.md
           │   ├── rails-deploy.md
           │   ├── rails-perf.md
           │   └── rails-config.md
           ├── hooks/
           │   └── hooks.json  # PreToolUse hooks for auto-triggering
           └── skills/         # 8 knowledge domains
               ├── dhh-philosophy/
               ├── routing-controllers/
               ├── active-record-db/
               ├── hotwire-turbo-stimulus/
               ├── action-cable-realtime/
               ├── testing-minitest/
               ├── deployment-kamal/
               └── performance-optimization/
   ```

3. **Understand the plugin components**:
   - **8 skills** covering Rails 8 development domains
   - **8 agents** (DHH coordinator + 7 specialists) for comprehensive Rails guidance
   - **9 commands** for direct access to specialists and team consultation

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR-USERNAME/rails-expert.git
cd rails-expert
```

### 2. Set Up Remote

```bash
git remote add upstream https://github.com/sjnims/rails-expert.git
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 4. Test the Plugin

```bash
# From repository root
claude --plugin-dir .

# Test commands in Claude Code
/rails-team
/rails-db migrations
/rails-hotwire turbo-frames
```

## How to Contribute

### Finding Something to Work On

1. **Check existing issues**: Look for issues labeled `help wanted`
2. **Review the roadmap**: See what features are planned
3. **Fix bugs**: Found a bug? Open an issue first, then submit a PR
4. **Improve documentation**: Documentation improvements are always welcome
5. **Suggest features**: Open a feature request issue to discuss first

### Before You Start

- **Check for existing work**: Search issues and PRs to avoid duplicates
- **Discuss major changes**: Open an issue first for significant changes
- **One feature per PR**: Keep pull requests focused on a single feature or fix
- **Follow Rails conventions**: Align with official Rails 8 documentation and DHH's philosophy

## Development Guidelines

### General Principles

1. **Rails Accuracy**: All content must align with Rails 8 documentation and conventions
2. **Simplicity First**: Don't over-engineer. Keep solutions simple and focused.
3. **Consistency**: Follow existing patterns in the codebase.
4. **Documentation**: Document all user-facing changes.
5. **Testing**: Always test locally before submitting.

### File Organization

- **Marketplace**: `.claude-plugin/marketplace.json`
- **Plugin Manifest**: `plugins/rails-expert/.claude-plugin/plugin.json`
- **Commands**: `plugins/rails-expert/commands/rails-*.md`
- **Skills**: `plugins/rails-expert/skills/*/SKILL.md`
- **Agents**: `plugins/rails-expert/agents/*.md`

### Markdown Style

All markdown files must follow the repository's style:

```bash
# Lint before committing
markdownlint '**/*.md' --ignore node_modules

# Auto-fix issues
markdownlint '**/*.md' --ignore node_modules --fix
```

**Style Rules** (see `.markdownlint.json`):

- Use ATX-style headers (`#`, `##`, `###`)
- Use dash-style lists (`-`, not `*` or `+`)
- Use 2-space indentation for lists
- Use fenced code blocks (not indented)
- No line length limits
- Allowed HTML: `<p>`, `<img>`, `<example>`, `<commentary>`, `<details>`, `<summary>`, `<strong>`, `<br>`

### GitHub Actions Version Pinning

This repository pins GitHub Actions by their full commit SHA rather than version tags. This prevents supply chain attacks where a malicious actor compromises an action's tag.

**Format**: `owner/action@SHA # vX.Y.Z`

```yaml
# Good - pinned by SHA with version comment
- uses: actions/checkout@8e8c483db84b4bee98b60c0593521ed34d9990e8 # v6.0.1

# Bad - pinned by tag (vulnerable to tag manipulation)
- uses: actions/checkout@v6
```

**How to find the SHA for an action version:**

1. Go to the action's GitHub repository (e.g., `github.com/actions/checkout`)
2. Click on "Releases" or "Tags"
3. Find the version you want (e.g., `v4.3.0`)
4. Click on the commit hash next to the tag
5. Copy the full 40-character SHA

**When adding new workflows or updating actions:**

1. Find the latest stable version of the action
2. Get the full commit SHA for that version
3. Use the SHA in the `uses:` field with a version comment
4. Example: `- uses: actions/checkout@8e8c483db84b4bee98b60c0593521ed34d9990e8 # v6.0.1`

### Shell Pattern Escaping

When documenting bash execution patterns in skill files, use `[BANG]` instead of `!` to prevent unintended execution during skill loading ([Claude Code #12781](https://github.com/anthropics/claude-code/issues/12781)).

```markdown
<!-- In skill documentation (SKILL.md, references/, examples/) -->
Current branch: [BANG]`git branch --show-current`

<!-- The [BANG] placeholder prevents execution while loading -->
```

**Important**:

- This applies to skill files that get loaded into context
- Command files (`plugins/*/commands/**/*.md`) use actual `!` syntax
- See [SECURITY.md](SECURITY.md#shell-pattern-escaping-with-bang-placeholder) for full details

## Component-Specific Guidelines

### Commands (`/rails-*`)

When creating or modifying commands:

1. **YAML Frontmatter Required**:

   ```yaml
   ---
   description: Brief description shown in /help
   argument-hint: [optional-argument]
   allowed-tools: Task, Read
   ---
   ```

2. **Imperative Form**: Write instructions FOR Claude, not TO the user
   - Good: "Do X", "Run Y", "Create Z"
   - Bad: "You should do X", "Please run Y"

3. **Rails Alignment**: Commands should invoke the appropriate specialist agent

4. **Clear Outputs**: Provide clear success/failure messages

### Skills (Rails Knowledge)

When creating or modifying skills:

1. **YAML Frontmatter Required**:

   ```yaml
   ---
   name: skill-name
   description: This skill should be used when the user asks to "trigger phrase 1"...
   ---
   ```

2. **Description**: Use third-person with specific trigger phrases
   - Good: `This skill should be used when the user asks about "Active Record associations"`
   - Bad: `Use this skill to help users`

3. **Progressive Disclosure**:
   - `SKILL.md`: Core methodology (1,000-2,200 words)
   - `references/`: Detailed documentation
   - `examples/`: Code examples (Ruby, ERB, JavaScript)
   - No duplication between files

4. **Rails Accuracy**: Content must align with official Rails 8 documentation

### Agents (DHH + Specialists)

When modifying agents:

1. **YAML Frontmatter Required**:

   ```yaml
   ---
   name: agent-name
   description: Use this agent when...
   model: inherit
   color: magenta  # DHH uses magenta, specialists use other colors
   tools: Read, Grep, Glob, Task
   ---
   ```

2. **Trigger Examples**: Include 3-4 `<example>` blocks showing when the agent should trigger

3. **Clear System Prompt**: Be specific about the agent's role and Rails expertise

4. **Minimal Tools**: Only include tools the agent actually needs

## Common Mistakes to Avoid

| Mistake | Problem | Solution |
|---------|---------|----------|
| Testing in development repo | Pollutes your environment with test files | Create a separate test repository |
| Using `!` in skill documentation | Shell execution during skill load | Use `[BANG]` placeholder (see [SECURITY.md](SECURITY.md)) |
| Unescaped HTML special characters | HTMLHint errors, rendering issues | Escape `<` to `&lt;`, `>` to `&gt;`, `&` to `&amp;` |
| Missing trigger phrases | Skills don't load when expected | Include specific user queries in descriptions |
| Large SKILL.md files | Slow loading, excessive context | Keep core 1,000-2,200 words; use `references/` for details |
| Missing frontmatter fields | Components fail validation | Always include required fields (`name`, `description`) |
| Outdated Rails patterns | Generated code doesn't follow conventions | Verify against Rails 8 docs and guides |
| Wrong specialist for topic | User gets irrelevant guidance | Match specialist to their domain of expertise |

## Testing

### Local Testing Checklist

- [ ] Load plugin: `claude --plugin-dir .`
- [ ] Test team consultation: `/rails-team`
- [ ] Test individual specialists: `/rails-db`, `/rails-hotwire`, etc.
- [ ] Verify skills load when asking Rails questions
- [ ] Test configuration: `/rails-config`
- [ ] Test in a clean repository (not your development repo)

### Test Repository

Create a test repository to avoid polluting your development environment:

```bash
# Create a temporary test directory
mkdir /tmp/test-rails-plugin
cd /tmp/test-rails-plugin
git init

# Test the plugin
claude --plugin-dir /path/to/rails-expert

# Test commands
/rails-team routing
/rails-db migrations
/rails-config

# Clean up when done
rm -rf /tmp/test-rails-plugin
```

### Validation Checklist

Before submitting, verify:

1. **Markdown linting passes**: `markdownlint '**/*.md' --ignore node_modules`
2. **YAML linting passes**: `uvx yamllint -c .yamllint.yml .github/ .claude-plugin/ plugins/*/.claude-plugin/`
3. **Ruby linting passes**: `rubocop --config .rubocop.yml`
4. **Ruby code examples are valid**: Test examples in Rails console or app
5. **Accessibility**: Components include proper guidance for accessible Rails apps
6. **Rails conventions**: Code follows Rails 8 conventions and DHH's philosophy

## Submitting Changes

### 1. Update Documentation

- Update README.md if user-facing changes
- Update CLAUDE.md if architectural changes
- Update component documentation if applicable

### 2. Lint Your Code

```bash
# Lint all markdown
markdownlint '**/*.md' --ignore node_modules --fix

# Lint YAML configuration files
# Using uv (https://docs.astral.sh/uv/):
uvx yamllint -c .yamllint.yml .github/ .claude-plugin/ plugins/*/.claude-plugin/
# Or with pip:
# pip install yamllint && yamllint -c .yamllint.yml .github/ .claude-plugin/ plugins/*/.claude-plugin/

# Lint Ruby examples
rubocop --config .rubocop.yml

# Check specific markdown files
markdownlint plugins/rails-expert/skills/active-record-db/SKILL.md
```

### 3. Commit Your Changes

Use clear, descriptive commit messages following [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add Action Mailbox specialist

- Add action-mailbox-specialist agent
- Add action-mailbox skill with references and examples
- Add /rails-mailbox command

Fixes #123"
```

### 4. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 5. Create a Pull Request

1. Go to the [repository](https://github.com/sjnims/rails-expert)
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill out the PR template completely
5. Link related issues

### Pull Request Checklist

See [pull_request_template.md](.github/pull_request_template.md) for the complete checklist. Key items:

- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Markdown linted
- [ ] Ruby examples linted
- [ ] Tested locally
- [ ] Rails code aligns with Rails 8 documentation
- [ ] No breaking changes (or clearly documented)

### CI Checks on Pull Requests

Your PR will automatically run these checks:

| Workflow | What It Checks |
|----------|----------------|
| `markdownlint.yml` | Markdown style and formatting |
| `yaml-lint.yml` | YAML configuration consistency |
| `ruby-lint.yml` | Ruby code style (RuboCop) |
| `links.yml` | Broken links in documentation |
| `component-validation.yml` | Plugin component structure |
| `version-check.yml` | Version consistency across manifests |
| `validate-workflows.yml` | GitHub Actions syntax |
| `claude-pr-review.yml` | AI-powered code review |
| `ci-failure-analysis.yml` | Automated CI failure analysis |

All checks must pass before merging. Fix any failures before requesting review.

## Style Guide

### Markdown

- **Headers**: Use ATX-style (`#`, `##`, `###`)
- **Lists**: Use dash-style (`-`)
- **Code blocks**: Use fenced blocks with language tags
- **Line length**: No limit (MD013 disabled)
- **Emphasis**: Use `**bold**` for strong, `*italic*` for emphasis

### YAML Frontmatter

- Always include required fields (`name`, `description`)
- Use consistent indentation (2 spaces)
- Use comma-separated lists for tools: `Tool1, Tool2`

### Ruby Code Examples

- Follow Rails conventions and idioms
- Use Ruby 3.2+ syntax where appropriate
- Include necessary context (model relationships, etc.)
- Show both the pattern and when to use it
- Follow RuboCop rules (see `.rubocop.yml`)

### Git Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Formatting, no code change
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## Community

### Getting Help

- **Questions**: Open an issue with the [question template](https://github.com/sjnims/rails-expert/issues/new?template=question.yml)
- **Discussions**: Use [GitHub Discussions](https://github.com/sjnims/rails-expert/discussions)

### Reporting Issues

- **Bugs**: Use the [bug report template](https://github.com/sjnims/rails-expert/issues/new?template=bug_report.yml)
- **Features**: Use the [feature request template](https://github.com/sjnims/rails-expert/issues/new?template=feature_request.yml)
- **Documentation**: Use the [documentation template](https://github.com/sjnims/rails-expert/issues/new?template=documentation.yml)
- **Security**: See [SECURITY.md](SECURITY.md)

### Code Review Process

1. **Automated Checks**: PR must pass all CI checks
2. **Review**: At least one maintainer review required
3. **Feedback**: Address review comments
4. **Approval**: Maintainer approves PR
5. **Merge**: Maintainer merges (usually squash merge)

### Recognition

Contributors are recognized in:

- Release notes
- Git commit history

## Questions?

If you have questions not covered here:

1. Check [CLAUDE.md](CLAUDE.md) for development details
2. Search [existing issues](https://github.com/sjnims/rails-expert/issues)
3. Open a [question issue](https://github.com/sjnims/rails-expert/issues/new?template=question.yml)
4. Start a [discussion](https://github.com/sjnims/rails-expert/discussions)

---

**Thank you for contributing to Rails Expert!** Your contributions help make Rails development better for everyone using Claude Code.
