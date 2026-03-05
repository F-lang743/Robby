# Copilot Instructions for Robby

## Repository Overview
This is the Robby repository owned by F-lang743. It is a minimal repository currently containing a README and a basic GitHub Actions CI workflow.

## Repository Structure
- `.github/workflows/blank.yml` — Basic CI workflow that runs on push/PR to `main` and prints a greeting.
- `README.md` — Repository readme.

## CI/Build
- The CI workflow (`.github/workflows/blank.yml`) runs on `ubuntu-latest` and executes simple shell commands.
- There is no build system, package manager, or test framework currently configured.
- When making changes, ensure workflow YAML syntax is valid and steps are correctly indented.

## Conventions
- Default branch is `main`.
- Keep changes minimal and focused on the task at hand.
- Follow standard GitHub Actions YAML conventions when modifying or adding workflows.
