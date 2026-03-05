# Contributing to Robby

Thank you for your interest in contributing to Robby! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/Robby.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes: `python test_robby.py`
6. Commit your changes: `git commit -m "Add your feature"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Setup

### Prerequisites

- Python 3.7 or higher
- pip package manager
- A microphone (for testing voice features)

### Installation

```bash
# Install dependencies
pip install -r requirements.txt

# For development, install in editable mode
pip install -e .
```

### Running Tests

```bash
# Run the test suite
python test_robby.py

# Run the demo (shows command processing without voice)
python demo.py

# Run the full application (requires microphone)
python robby.py
```

## Code Style

- Follow PEP 8 Python style guidelines
- Use type hints where appropriate
- Add docstrings to all functions and classes
- Keep functions focused and single-purpose

## Adding New Commands

To add a new voice command:

1. Open `robby.py`
2. Add a new condition in the `process_command` method
3. Implement the command logic
4. Update the help text
5. Add a test case in `test_robby.py`

Example:
```python
elif "weather" in command:
    self.speak("Weather feature coming soon.")
    # TODO: Implement weather checking
```

## Feature Requests

Have an idea for a new feature? Great! Please:

1. Check existing issues to see if it's already requested
2. Open a new issue with the `enhancement` label
3. Describe the feature and why it would be useful
4. Include example use cases

## Bug Reports

Found a bug? Please:

1. Check if the bug is already reported
2. Open a new issue with the `bug` label
3. Include steps to reproduce
4. Provide system information (OS, Python version)
5. Include any error messages or logs

## Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Update documentation as needed
- Add tests for new features
- Ensure all tests pass before submitting
- Write clear commit messages
- Reference related issues in the PR description

## Priority Features

Current priority features for contributors:

1. GPS integration for truck stop finding
2. Route navigation system
3. Fuel price API integration
4. Note persistence (save/load notes)
5. Email integration
6. Mobile app development (React Native/Flutter)

## Questions?

If you have questions about contributing, feel free to:

- Open a discussion on GitHub
- Check existing issues for similar questions
- Reach out to the maintainers

## Code of Conduct

Be respectful and professional in all interactions. We're building a tool to help truck drivers, and we want our community to be welcoming and helpful.

## License

By contributing to Robby, you agree that your contributions will be licensed under the same license as the project (MIT License).
