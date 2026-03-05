# GitHub Copilot Instructions for Robby

## Project Overview
Robby is a repository for development projects. This file provides guidelines for GitHub Copilot coding agent to follow when working with this codebase.

## General Coding Standards

### Code Style
- Write clean, readable, and maintainable code
- Follow language-specific best practices and conventions
- Use meaningful variable and function names that clearly describe their purpose
- Keep functions small and focused on a single responsibility
- Add comments only when necessary to explain complex logic or non-obvious decisions

### Documentation
- Keep README.md up to date with project changes
- Document all public APIs and interfaces
- Include usage examples in documentation
- Update documentation when making changes to functionality

## Git and Version Control

### Commit Messages
- Use clear, descriptive commit messages
- Start with a verb in imperative mood (e.g., "Add", "Fix", "Update", "Remove")
- Keep the first line under 72 characters
- Add detailed description in the body if needed

### Branch Strategy
- Use descriptive branch names
- Follow the pattern: `type/description` (e.g., `feature/add-authentication`, `fix/resolve-bug`)
- Keep branches focused on a single feature or fix

## Pull Request Conventions

### PR Guidelines
- Reference the issue number in PR titles and descriptions
- Provide a clear description of changes and their purpose
- Ensure all tests pass before requesting review
- Keep PRs focused and reasonably sized for easier review
- Respond to review comments promptly

### PR Description Format
```
## Description
[Clear description of what this PR does]

## Changes
- [List of specific changes made]

## Testing
- [How the changes were tested]

## Related Issues
Fixes #[issue-number]
```

## CI/CD and Workflows

### GitHub Actions
- Ensure all workflow files are properly configured
- Test workflow changes locally when possible
- Ensure workflows run successfully on push and pull request events
- Keep workflow files well-documented with comments

### Building and Testing
- Ensure any new code includes appropriate tests
- Run all tests locally before pushing changes
- Fix failing tests before submitting PRs
- Maintain or improve code coverage

## Security Best Practices
- Never commit secrets, API keys, or sensitive information
- Use environment variables for configuration
- Validate and sanitize all user inputs
- Follow security best practices for the specific language/framework being used
- Keep dependencies up to date to avoid security vulnerabilities

## Code Review Guidelines
- Review all generated code before committing
- Verify that changes meet the requirements specified in issues
- Test changes thoroughly in relevant environments
- Check for potential edge cases and error conditions
- Ensure backward compatibility unless explicitly breaking changes

## File Organization
- Keep related files organized in appropriate directories
- Use consistent naming conventions across the project
- Avoid deeply nested directory structures when possible
- Group files by feature or functionality when appropriate

## Dependencies
- Add dependencies judiciously; prefer standard library when possible
- Document why each major dependency is needed
- Keep dependencies up to date
- Remove unused dependencies

## Error Handling
- Implement proper error handling for all operations that can fail
- Provide meaningful error messages
- Log errors appropriately for debugging
- Handle edge cases gracefully

## Performance Considerations
- Write efficient code that scales well
- Avoid unnecessary computations or iterations
- Use appropriate data structures for the task
- Consider memory usage for large-scale operations

## Accessibility and Usability
- Ensure any user-facing features are accessible
- Follow accessibility guidelines (WCAG) for web content
- Design intuitive interfaces and APIs
- Provide helpful error messages and feedback

## Collaboration
- Communicate clearly about design decisions
- Be open to feedback and alternative approaches
- Document decisions and rationale in PR comments
- Help maintain a positive and inclusive environment
