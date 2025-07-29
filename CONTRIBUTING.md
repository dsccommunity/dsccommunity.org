# Contributing to DSCCommunity.org

Thank you for your interest in contributing! This document explains how to
get the repository set up, work with submodules, build the site locally, and
submit changes.

## Prerequisites

- Git 2.0+
- Hugo CLI (for local development; installed via Homebrew or download)
- PowerShell (for resource JSON generation)

## Repository Setup

Clone the repository with all submodules in one step:

```bash
# See below section SSH vs HTTPS URLs for using SSH option
git clone --recurse-submodules https://github.com/dsccommunity/dsccommunity.org.git
cd dsccommunity.org
```

Or, if you already cloned without submodules:

```bash
git submodule update --init themes/hugo-admonitions
```

### SSH vs HTTPS URLs

Git records the URL you use when adding a submodule. To accommodate both
HTTPS and SSH users, you can add an `insteadOf` rule in your **local** `~/.gitconfig`:

- For SSH users working from an HTTPS URL in `.gitmodules`:

  ```ini
  [url "git@github.com:"]
    insteadOf = https://github.com/
  ```

- For HTTPS users if `.gitmodules` uses SSH:

  ```ini
  [url "https://github.com/"]
    insteadOf = git@github.com:
  ```

This lets everyone use their preferred protocol without changing the repo.


## Working with the `hugo-admonitions` Theme Submodule

The site uses [hugo-admonitions](https://github.com/gohugoio/hugo-admonitions)
as a Git submodule under `themes/hugo-admonitions`.

1. If you have manually cloned the folder, remove it first:

   ```bash
   git rm --cached -r themes/hugo-admonitions
   rm -rf themes/hugo-admonitions
   ```

2. Add the theme properly (using the URL from `.gitmodules`):

   ```bash
   git submodule add --depth 1 https://github.com/KKKZOZ/hugo-admonitions.git themes/hugo-admonitions
   git add .gitmodules themes/hugo-admonitions
   git commit -m "Convert hugo-admonitions to a submodule"
   ```

3. Initialize the submodule:

   ```bash
   git submodule update --init themes/hugo-admonitions
   ```

## Local Development Workflow

1. **Generate Resources JSON** (used by CI):

   ```bash
   pwsh ./Get-DscResourceKitInfo.ps1
   ```

1. **Install Hugo** (macOS):

   ```bash
   brew install hugo
   ```

1. **Run the site locally**:

   ```bash
   hugo server --buildDrafts --buildFuture --quiet
   ```

   Open `http://localhost:1313/` in your browser.

1. **Build for production**:

   ```bash
   hugo --minify
   ```

## New submodule

Azure Pipelines is configured to check out submodules automatically. If you
ever add a new submodule, commit the changes to `.gitmodules` and run:

```bash
git add .gitmodules <path/to/submodule>
git commit -m "Add new submodule"
```


## Code of Conduct & License

This project follows our [Code of Conduct](CODE_OF_CONDUCT.md). By contributing, you agree to abide by its terms.

All contributions are licensed under the MIT License. See [LICENSE](LICENSE) for details.

Thank you for contributing! If you have any questions, open an issue or reach out to the maintainers.
