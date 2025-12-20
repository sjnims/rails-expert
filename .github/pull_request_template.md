## Description

<!-- Provide a clear and concise description of your changes -->
<!-- Reference: https://guides.rubyonrails.org -->
<!-- Contributing guide: See CONTRIBUTING.md -->

## Type of Change

<!-- Mark the relevant option with an "x" -->

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update (improvements to README or skill docs)
- [ ] Refactoring (code change that neither fixes a bug nor adds a feature)
- [ ] Test (adding or updating tests)
- [ ] Configuration change (changes to .markdownlint.json, plugin.json, etc.)

## Component(s) Affected

<!-- Mark all that apply -->

- [ ] Skills (`plugins/rails-expert/skills/rails-*`)
- [ ] Agent (DHH coordinator, specialists)
- [ ] Commands (`/rails-team`, `/rails-db`, etc.)
- [ ] Examples (Ruby/ERB/JS/HTML/CSS/YAML/Shell samples in `examples/` folders)
- [ ] References (skill reference documents in `references/` folders)
- [ ] Documentation (README.md, CONTRIBUTING.md, SECURITY.md)
- [ ] Configuration (plugin.json, .markdownlint.json, .yamllint.yml)
- [ ] Issue/PR templates
- [ ] Other (please specify):

## Motivation and Context

<!-- Why is this change required? What problem does it solve? -->
<!-- If it fixes an open issue, please link to the issue here using one of these formats: -->
<!-- Fixes #123 - closes issue when PR merges -->
<!-- Closes #123 - same as Fixes -->
<!-- Resolves #123 - same as Fixes -->
<!-- Related to #123 - links without closing -->

Fixes # (issue)

## How Has This Been Tested?

<!-- Describe the tests you ran to verify your changes -->

**Test Configuration**:

- Claude Code version:
- OS:
- Rails version: <!-- if testing Rails code generation -->
- Ruby version: <!-- if testing Rails code generation -->

**Test Steps**:

1. <!-- e.g., Load plugin with `claude --plugin-dir .` -->
2. <!-- e.g., Run command `/rails-team` or `/rails-db migrations` -->
3. <!-- e.g., Verify generated code follows Rails conventions -->
4. <!-- etc. -->

## Checklist

### General

- [ ] My code follows the style guidelines of this project
- [ ] I have commented my code, particularly in hard-to-understand areas (if applicable)
- [ ] My changes generate no new warnings or errors

### Documentation

- [ ] I have updated relevant documentation (README.md or skill docs)
- [ ] I have updated YAML frontmatter where applicable
- [ ] I have verified all links work correctly

### Linting

- [ ] I have run `markdownlint` and fixed all issues
- [ ] I have run `uvx yamllint` on any YAML configuration files
- [ ] I have verified special HTML elements are properly closed (`<p>`, `<img>`, `<example>`, `<commentary>`)

### Rails Compatibility

- [ ] Changes align with Rails 8 conventions and "The Rails Way"
- [ ] ActiveRecord patterns follow Rails best practices
- [ ] Hotwire/Turbo/Stimulus code follows conventions (if applicable)
- [ ] Generated code follows Ruby style guidelines (RuboCop compatible)

### Accessibility

- [ ] Generated components include proper ARIA attributes where needed
- [ ] Color contrast considerations documented where relevant
- [ ] Keyboard navigation supported where applicable

### Component-Specific Checks

<!-- Only relevant if you modified commands, skills, or the agent -->

<details>
<summary><strong>Commands</strong> (click to expand)</summary>

- [ ] Command uses imperative form ("Do X", not "You should do X")
- [ ] Error handling is included for common failure modes
- [ ] YAML frontmatter is valid and complete
- [ ] Success/failure messages are clear and helpful

</details>

<details>
<summary><strong>Skills</strong> (click to expand)</summary>

- [ ] Description uses third-person with specific trigger phrases
- [ ] SKILL.md is 1,000-2,200 words (progressive disclosure)
- [ ] Detailed content is in `references/` subdirectory
- [ ] Examples in `examples/` folder are valid Ruby/ERB/JS
- [ ] Content aligns with official Rails Guides
- [ ] Skill demonstrates Rails best practices

</details>

<details>
<summary><strong>Agent</strong> (click to expand)</summary>

- [ ] Agent includes 3-4 `<example>` blocks
- [ ] Examples demonstrate triggering conditions clearly
- [ ] System prompt is clear and focused on Rails Expertise
- [ ] Tool list is minimal and appropriate
- [ ] YAML frontmatter includes required fields (name, description, model, color)

</details>

### Testing

- [ ] I have tested the plugin locally with `claude --plugin-dir .`
- [ ] I have tested the full workflow (if applicable)
- [ ] I have verified generated Rails code follows conventions
- [ ] I have tested in a clean repository (not my development repo)

### Version Management (if applicable)

- [ ] I have updated version in `plugins/rails-expert/.claude-plugin/plugin.json`
- [ ] I have updated CHANGELOG.md with relevant changes

## Screenshots (if applicable)

<!-- Add screenshots to help explain your changes -->

## Additional Notes

<!-- Add any other context about the pull request here -->

## Reviewer Notes

<!-- Information specifically for the reviewer -->

**Areas that need special attention**:
<!-- List any specific areas you'd like reviewers to focus on -->

**Known limitations or trade-offs**:
<!-- Describe any known issues or compromises made -->

---

## Pre-Merge Checklist (for maintainers)

- [ ] All CI checks pass
- [ ] Documentation is accurate and complete
- [ ] Changes align with Rails 8 best practices
- [ ] No security vulnerabilities introduced
- [ ] Breaking changes are clearly documented
- [ ] Labels are appropriate for the change type
- [ ] Version number updated in plugin.json (if applicable)
- [ ] CHANGELOG.md is updated (if applicable)
