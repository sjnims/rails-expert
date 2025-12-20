# Rails Expert Plugin

[![Version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsjnims%2Frails-expert%2Fmain%2Fplugins%2Frails-expert%2F.claude-plugin%2Fplugin.json&query=%24.version&label=version&color=blue)](plugins/rails-expert/.claude-plugin/plugin.json)
[![CI](https://github.com/sjnims/rails-expert/actions/workflows/markdownlint.yml/badge.svg)](https://github.com/sjnims/rails-expert/actions/workflows/markdownlint.yml)
[![GitHub Issues](https://img.shields.io/github/issues/sjnims/rails-expert)](https://github.com/sjnims/rails-expert/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Rails](https://img.shields.io/badge/Rails-8.0-CC0000.svg?logo=rubyonrails)](https://rubyonrails.org/)
[![Claude Code](https://img.shields.io/badge/Claude_Code-Plugin-7C3AED.svg)](https://claude.ai/code)

All-in-one Rails 8 expert development team for Claude Code. Consult with DHH and a team of specialist personas for comprehensive Rails guidance.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Commands](#commands)
- [Configuration](#configuration)
- [Proactive Features](#proactive-features)
- [Specialist Personalities](#specialist-personalities)
- [DHH Modes](#dhh-modes)
- [How It Works](#how-it-works)
- [Examples](#examples)
- [Requirements](#requirements)
- [Troubleshooting](#troubleshooting)
- [Philosophy](#philosophy)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)

## Overview

The Rails Expert plugin provides access to a virtual development team led by DHH (David Heinemeier Hansson) as coordinator, along with seven specialist experts covering all aspects of Rails 8 development:

- **DHH (Coordinator)**: Champions Rails philosophy, coordinates specialists, settles debates
- **Routing & Controllers Expert**: RESTful design, routing patterns, controller best practices
- **Active Record & Database Expert**: Models, migrations, queries, associations, validations
- **Hotwire/Turbo/Stimulus Expert**: Modern Rails frontend with Turbo and Stimulus
- **Action Cable & Real-time Expert**: WebSockets, channels, real-time features
- **Testing Expert**: Minitest philosophy, TDD patterns, Rails testing
- **Deployment & Infrastructure Expert**: Kamal, Docker, CI/CD, production setup
- **Performance & Optimization Expert**: Profiling, caching, scaling, optimization

## Features

- **Conversational Team Consultation**: Ask questions and get coordinated responses from DHH and relevant specialists
- **Proactive Guidance**: Automatic suggestions when editing Rails code or running Rails commands
- **Direct Specialist Access**: Consult individual experts for focused guidance
- **Configurable Personalities**: Choose between "DHH: The Full Experience" (opinionated) or "DHH: Tamed Edition" (professional)
- **Rich Knowledge Base**: 8 comprehensive skills with references and examples extracted from Rails guides
- **Debate & Discussion**: Specialists can disagree and discuss, with DHH facilitating consensus

## Installation

This repository is structured as a **plugin marketplace** containing the Rails Expert plugin.

### From Repository Root (Marketplace Mode)

Load the entire marketplace, which includes the Rails Expert plugin:

```bash
claude --plugin-dir /path/to/rails-expert
```

### From Plugin Directory

Load just the Rails Expert plugin directly:

```bash
claude --plugin-dir /path/to/rails-expert/plugins/rails-expert
```

### For Project-Specific Use

Copy the plugin (not the marketplace root) to your Rails project:

```bash
cp -r /path/to/rails-expert/plugins/rails-expert /path/to/your-rails-project/.claude-plugin/
```

## Commands

### Team Consultation

- **`/rails-team [topic]`** - Full team consultation led by DHH
  - Example: `/rails-team routing`
  - Example: `/rails-team` (general consultation)

### Direct Specialist Access

- **`/rails-routing [subtopic]`** - Routing & Controllers specialist
- **`/rails-db [subtopic]`** - Active Record & Database specialist
- **`/rails-hotwire [subtopic]`** - Hotwire/Turbo/Stimulus specialist
- **`/rails-realtime [subtopic]`** - Action Cable & Real-time specialist
- **`/rails-testing [subtopic]`** - Testing specialist
- **`/rails-deploy [subtopic]`** - Deployment & Infrastructure specialist
- **`/rails-perf [subtopic]`** - Performance & Optimization specialist

Examples:

```bash
/rails-db migrations
/rails-hotwire turbo-frames
/rails-testing system-tests
```

### Configuration Command

- **`/rails-config [options]`** - Configure plugin settings
  - Interactive mode: `/rails-config`
  - Quick disable: `/rails-config --disable auto_trigger`
  - Quick enable: `/rails-config --enable debates`

## Configuration

Create `.claude/rails-expert.local.md` in your project to customize behavior. A comprehensive template is available at [`plugins/rails-expert/.claude-example-settings.md`](plugins/rails-expert/.claude-example-settings.md).

### Quick Start Configuration

```markdown
---
enabled: true
auto_trigger: true
verbosity: full
dhh_mode: full
enabled_specialists: ["all"]
enable_debates: true
---

# Rails Expert Configuration

Custom instructions for this project.
```

**After creating or editing settings, restart Claude Code for changes to take effect.**

### Configuration Options

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | boolean | `true` | Master enable/disable switch |
| `auto_trigger` | boolean | `true` | Automatically trigger on Rails code edits and commands |
| `verbosity` | string | `"full"` | Output detail: `full` (show discussion), `summary` (conclusion only), `minimal` (just recommendation) |
| `enabled_specialists` | array | `["all"]` | Which specialists are active: `["all"]` or list like `["routing", "database", "testing"]` |
| `minimum_change_lines` | number | `5` | Minimum lines changed to trigger auto-review |
| `excluded_paths` | array | `["vendor/", "tmp/"]` | Directories to exclude from auto-triggering |
| `excluded_files` | array | `[]` | Specific files to exclude |
| `dhh_mode` | string | `"full"` | DHH personality: `"full"` (opinionated DHH) or `"tamed"` (professional) |
| `specialist_personalities` | boolean | `true` | Enable distinct personalities for specialists |
| `allow_unprompted_input` | boolean | `true` | Allow specialists to interrupt when they feel strongly |
| `enable_debates` | boolean | `true` | Enable specialist disagreements and discussions |
| `bash_enabled_specialists` | array | `["all"]` | Which specialists can run Rails commands for demonstration |

### Verbosity Levels

- **`full`** (default): See the entire team discussion including DHH coordination, specialist input, debates, and final consensus
- **`summary`**: DHH presents the team's conclusion without showing the full discussion
- **`minimal`**: Just the final recommendation without discussion or context

## Proactive Features

The plugin automatically triggers in Rails projects when:

1. **Editing Rails Files**: Provides guidance when writing/editing `.rb` files in Rails directories
   - Detects Rails projects by presence of `config/application.rb`
   - Respects `minimum_change_lines` and `excluded_paths` settings
   - Can be disabled with `auto_trigger: false`

2. **Running Rails Commands**: Suggests alternatives and best practices for:
   - `rails generate`
   - `rails db:migrate`
   - `rails db:rollback`
   - Other Rails CLI commands
   - Respects settings configuration

## Specialist Personalities

When `specialist_personalities: true`, each expert has a distinct tone:

- **Routing Expert**: Pragmatic, emphasizes RESTful conventions
- **Database Expert**: Detail-oriented, cautious about migrations
- **Hotwire Expert**: Enthusiastic about modern approaches, "less JavaScript"
- **Real-time Expert**: Practical, deployment-aware
- **Testing Expert**: Pedantic, TDD advocate
- **Deployment Expert**: Operations-focused, production-minded
- **Performance Expert**: Data-driven, pragmatic about optimization

## DHH Modes

### "DHH: The Full Experience" (`dhh_mode: "full"`)

- Direct, opinionated communication
- Strong advocacy for Rails philosophy
- Frequent use of DHH-isms ("majestic monolith", "sharp knives", "omakase")
- May challenge anti-patterns firmly

### "DHH: Tamed Edition" (`dhh_mode: "tamed"`)

- Professional, measured tone
- Still advocates Rails principles but more neutrally
- Occasional DHH-isms for flavor
- Balanced presentation of tradeoffs

## How It Works

### Team Consultation Flow

1. **User asks question** or **auto-trigger activates**
2. **DHH analyzes** the question and identifies relevant specialists
3. **DHH calls specialist(s)** adaptively (starts with one, adds others as needed)
4. **Specialists provide input** from their respective skills
5. **Other specialists may chime in** if they have concerns (when enabled)
6. **Specialists may debate** if they disagree (when enabled)
7. **DHH facilitates discussion** with follow-up questions if needed
8. **DHH synthesizes consensus** and presents unified recommendation
9. **Output respects verbosity setting** (full discussion, summary, or minimal)

### Specialist Skills

Each specialist has a comprehensive skill containing:

- **SKILL.md**: ~2000 word overview of their domain
- **references/**: Detailed topical references extracted from Rails guides
- **examples/**: Focused code snippets demonstrating patterns

Specialists read from their skills to provide accurate, up-to-date Rails 8 guidance.

## Examples

### General Consultation

```text
User: How should I structure my controllers?

DHH: Let me bring in our Routing & Controllers expert...

[Routing Expert provides guidance on thin controllers, resourceful routing]

DHH: And I'll add that this aligns with our "fat models, skinny controllers"
principle. The controller should be a thin layer...

[If enabled, other specialists might chime in with testing or performance
considerations]

DHH: Here's our consensus: [synthesized recommendation]
```

### Specialist Disagreement

```text
User: Should I use callbacks or service objects for this complex workflow?

DHH: Let me get input from our Database and Testing experts...

[Database Expert advocates for callbacks in simple cases]

[Testing Expert raises concerns about callback testing complexity]

Testing Expert: I have concerns about the testability of callbacks here...

DHH: Good points from both sides. Let me clarify - what's the complexity
level of this workflow?

[Discussion continues, DHH facilitates]

DHH: Given the complexity level, here's what we recommend...
```

## Requirements

- [Claude Code CLI](https://claude.ai/code)
- Rails project (for auto-triggering features)
- No external dependencies - plugin is fully self-contained

## Git Integration

Add to your `.gitignore`:

```gitignore
.claude/rails-expert.local.md
```

Settings are user-specific and should not be committed.

## Troubleshooting

### Settings Not Taking Effect

Settings are loaded at Claude Code startup. After editing `.claude/rails-expert.local.md`:

1. Save the file
2. Exit Claude Code
3. Restart: `claude`

### Auto-Trigger Not Working

Check:

1. Is `config/application.rb` present? (Rails project detection)
2. Is `auto_trigger: true` in settings?
3. Are you editing excluded paths/files?
4. Does change meet `minimum_change_lines` threshold?

### Too Much/Too Little Output

Adjust `verbosity` in settings:

- Too much? Use `summary` or `minimal`
- Too little? Use `full`

### Specialists Not Appearing

Check:

1. Is `enabled_specialists: ["all"]` or does it include the specialist?
2. Is the specialist relevant to the question?
3. Is `allow_unprompted_input: false` preventing them from chiming in?

## Philosophy

This plugin embodies DHH's Rails 8 philosophy:

- **Optimize for programmer happiness**: Make development joyful
- **Convention over configuration**: Sensible defaults, less boilerplate
- **The menu is omakase**: Rails has opinions, trust them
- **Exalt beautiful code**: Readability and elegance matter
- **Value integrated systems**: The majestic monolith over microservices
- **Provide sharp knives**: Powerful tools for experienced developers
- **Progress over stability**: Move forward, with nuance
- **NO BUILD**: Eliminate complex build steps
- **Fat models, skinny controllers**: Logic in models, controllers coordinate
- **The one-person framework**: Empower small teams to build big things

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on:

- Development setup
- Code style guidelines
- Pull request process
- Issue templates

For security issues, see our [Security Policy](SECURITY.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

Built for Claude Code by Steve Nims ([@sjnims](https://github.com/sjnims))

Rails philosophy and guidance based on the work of David Heinemeier Hansson and the Rails core team.

Content extracted and adapted from the official [Rails Guides](https://guides.rubyonrails.org/).

## Additional Resources

- [CHANGELOG](CHANGELOG.md) - Version history
- [Code of Conduct](CODE_OF_CONDUCT.md) - Community guidelines
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
