# Contributing to Robby Truck Assistant

Thank you for your interest in contributing to Robby! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Prioritize safety features for truck drivers

## How to Contribute

### Reporting Bugs

Before creating a bug report:
1. Check if the issue already exists
2. Test on the latest version
3. Provide detailed reproduction steps

Include in your bug report:
- Device and OS version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots or video if applicable
- Relevant logs

### Suggesting Features

Feature requests should:
- Align with the app's focus on truck driver safety
- Explain the use case and benefits
- Consider hands-free operation requirements
- Be specific about the desired behavior

### Pull Requests

1. **Fork the repository** and create a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Follow the existing code style
   - Add/update tests
   - Update documentation
   - Ensure all tests pass

3. **Commit your changes**:
   ```bash
   git commit -m "Add feature: description"
   ```

4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow the existing code structure
- Use functional components with hooks
- Write self-documenting code with clear variable names
- Add comments for complex logic

### Testing

- Write tests for new features
- Ensure existing tests pass: `npm test`
- Aim for good test coverage
- Test on both iOS and Android when possible

### Voice Features

When adding voice commands:
- Support natural language variations
- Provide clear voice feedback
- Test with different accents/speech patterns
- Consider background noise scenarios

### Safety First

For any feature that could be used while driving:
- Prioritize hands-free operation
- Minimize visual attention required
- Provide audio feedback
- Make buttons large and easy to tap
- Test in realistic driving scenarios

## Project Structure

```
src/
├── components/    # Reusable UI components
├── contexts/      # React Context providers
├── screens/       # Screen components
├── services/      # Business logic
├── types/         # TypeScript definitions
└── utils/         # Utility functions
```

## Commit Messages

Use clear, descriptive commit messages:

```
Add feature: Voice command for fuel stops
Fix: GPS permission request on Android
Update: Improve mileage calculation accuracy
Docs: Add API integration examples
```

## Review Process

Pull requests will be reviewed for:
- Code quality and style
- Test coverage
- Documentation
- Safety considerations
- Performance impact

## Questions?

- Open an issue for questions
- Tag with "question" label
- Be patient - maintainers are volunteers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for helping make Robby better for truck drivers!
