---
title: "Getting Started as a Contributor"
date: 2019-01-28T11:02:05+06:00
type: "post"
author: "Johan Ljunggren"
weight: 1
---

There are a lot of guides on the Internet that will show different
aspects of what is described here, but this article will focus on a
simple way to get started using the workflow we use for DSC modules and
DSC resources within the DSC Community.

After you read through this guide, then please continue with the guide
[Contributor](/guidelines/contributing), especially the section
[Understand the coding workflow](/guidelines/contributing#understand-the-coding-workflow).

### Table of Contents

- [Quick steps](#quick-steps)
- [Create free GitHub account](#create-free-github-account)
- [Install Visual Studio Code](#install-visual-studio-code)
- [Install Visual Studio Code PowerShell Extension](#install-visual-studio-code-powershell-extension)
- [Install Git](#install-git)
- [Configure Git](#configure-git)
- [Install PowerShell Module posh-git](#install-powershell-module-posh-git)
- [Install GitVersion](#install-gitversion)
- [Clone repository from GitHub](#clone-repository-from-github)
- [Forking a repository on GitHub](#forking-a-repository-on-github)
- [Adding the fork as a remote in the local repository](#adding-the-fork-as-a-remote-in-the-local-repository)
- [Making changes and pushing them to the fork](#making-changes-and-pushing-them-to-the-fork)
- [Make changes to an existing pull request of yours](#make-changes-to-an-existing-pull-request-of-yours)
- [Switch between local working branches](#switch-between-local-working-branches)
- [Delete a branch](#delete-a-branch)

### Quick steps

Here are some quick steps to get started building and testing a project.
The detailed steps in the rest of this guide are required for contributing.

#### Windows

This assumes a clean installation of _Windows_ 11 release 22H2 Feb 2023
or later with only _Windows PowerShell_ available.

1. Install _App Installer_ (by Microsoft) from the [Microsoft Store](https://www.microsoft.com/store/productId/9NBLGGH4NNS1)
   (to get `winget`).
   >**NOTE:** Newer versions of Windows have WinGet preinstalled, then this
   >step is not required.
1. Install Git
   ```powershell
   winget install Git.Git
   ```
1. Allow execution of scripts.
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
1. Make a local folder for cloning projects
   ```powershell
   mkdir c:/source
   cd c:/source
   ```
1. Clone the git repo (change URI as needed)
   ```powershell
   git clone https://github.com/dsccommunity/SqlServerDsc
   ```
1. Move into the local repository folder
   ```powershell
   cd ./SqlServerDsc
   ```
1. Get informative messaged (optional)
   ```
   $InformationPreference = 'Continue'
   ```
1. Resolve dependencies. This will install the required NuGet package provider,
   with all other dependencies being saved into the project's `output` folder.
   >NOTE: If the project is dependent on pre-releases and the error
   >`Find-Module: A parameter cannot be found that matches parameter name
   >'AllowPrereleaseVersions'` is thrown, restart the _Windows PowerShell_
   >session and run the command again. This is due to the old version of
   >module _PackageManagement_ is still available in the session (even when
   >we remove it) so _PowerShellGet_ calls the wrong version of the command
   >`Find-Package`.
   ```powershell
   .\build.ps1 -ResolveDependency -Tasks noop
   ```
1. Build the project.
   ```powershell
   .\build.ps1 -Tasks build
   ```
1. Test the project.
   ```powershell
   .\build.ps1 -Tasks test
   ```

### Create free GitHub account

Create a free GitHub account by browsing to [GitHub](https://github.com)
and clicking on the **Sign up** button.

<img src="../../images/getting_started_with_github/github_signup.png" alt="GitHub SignUp" style="width:725px;" />

Although enabling 2-factor authentication on your GitHub account is not
required to contribute, it is recommended.

### Install Visual Studio Code

Although there are many PowerShell editors available and everyone has their
own preference, most of the processes described here assume the use of
Visual Studio Code. Using Visual Studio Code when working on DSC Resource
modules has added benefits such as being able to detect and highlight some
style guideline violations.

To install Visual Studio code visit the official site [code.visualstudio.com](https://code.visualstudio.com).

#### Windows

To install using:

- [Official package](#official-package)
- [Chocolatey](#chocolatey)
- [WinGet](#winget)

##### Official package

The installation is straightforward using a wizard type of installation.
Normally all defaults values suggested by the wizard can be used.

##### Chocolatey

See [Chocolatey](https://chocolatey.org) for prerequisites to use `choco`.

```bash
choco install vscode
```

##### WinGet

Newer versions of Windows have WinGet preinstalled. If it is not installed
make sure to install _App Installer_ (by Microsoft) from the [Microsoft Store](https://www.microsoft.com/store/productId/9NBLGGH4NNS1)
to use `winget`.

>**NOTE:** To use `code` from command-line you might need to logout and login
>again after installation for environment variable `PATH` to be updated.

```bash
winget install vscode
```

### Install Visual Studio Code PowerShell Extension

To be able to write PowerShell code in Visual Studio Code the extension
need to be installed.

```bash
code --install-extension ms-vscode.PowerShell
```

>**NOTE:** This step is only relevant if Visual Studio Code was installed in the
>previous step.

### Install Git

#### Windows

To install using:

- [Official package](#official-package-1)
- [Chocolatey](#chocolatey-1)
- [WinGet](#winget-1)

##### Official package

Download and install **Git for Windows** from the official site
[git-scm.com](https://git-scm.com).

The installation is straightforward using a wizard type of installation.
Normally all defaults values suggested by the wizard can be used unless
your environment need something special.
There is one exception and that is that it might suit you better to use
Visual Studio Code as the default editor for Git instead of Vim.

<img src="../../images/getting_started_with_github/git_select_components.png" alt="Git select components" style="width:425px;" />

<img src="../../images/getting_started_with_github/git_default_editor.png" alt="Git default editor" style="width:425px;" />

<img src="../../images/getting_started_with_github/git_use_from_commandline.png" alt="Git use from Commandline" style="width:425px;" />

<img src="../../images/getting_started_with_github/git_use_transport.png" alt="Git use transport" style="width:425px;" />

<img src="../../images/getting_started_with_github/git_line_endings.png" alt="Git line endings" style="width:425px;" />

<img src="../../images/getting_started_with_github/git_terminal_emulator.png" alt="Git terminal emulator" style="width:425px;" />

<img src="../../images/getting_started_with_github/git_extra_options.png" alt="Git extra options" style="width:425px;" />

<img src="../../images/getting_started_with_github/git_experimental.png" alt="Git experimental" style="width:425px;" />

After the installation you can run this in PowerShell and it should return
the version of `git` if it was installed correctly.

```bash
PS> git --version
git version 2.24.1.windows.2
```

**Git for Windows** installed a credential manager that will help you
connect using your GitHub credentials. It will popup the first time
your credentials are needed, for example when pushing to a repository on
GitHub.

##### Chocolatey

See [Chocolatey](https://chocolatey.org) for prerequisites to use `choco`.

```bash
choco install git
```

##### WinGet

Newer versions of Windows have WinGet preinstalled. If it is not installed
make sure to install _App Installer_ (by Microsoft) from the [Microsoft Store](https://www.microsoft.com/store/productId/9NBLGGH4NNS1)
to use `winget`.

```bash
winget install Git.Git
```

### Configure Git

Now you need to setup your name and e-mail in the global settings. This
is used when you commit and push changes to a repository.

```bash
git config --global user.name "Your Name"
git config --global user.email "your@emailaddress.com"
```

We also need set how line endings should be treated.

```bash
git config --global core.autocrlf true
```

### Install PowerShell Module posh-git

This is optional but helps with tab completion and better visualization
of what branch you are working on when using PowerShell.

Run this in PowerShell.

```powershell
Install-Module posh-git -Scope CurrentUser -Force
Import-Module -Name posh-git
```

Then to make sure the module is loaded each time you start PowerShell,
add the import of the module to your PowerShell profile script.

```powershell
code $profile
```

In the file that opened up in Visual Studio Code, add the following and
save the file.

```powershell
Import-Module -Name posh-git
```

### Install GitVersion

The application [GitVersion](https://gitversion.net/docs/) is used to
automatically increase the version in the build pipeline. It is optional,
if it is not installed the build version will always show as `0.0.1` when
running the build locally, but it is still possible to contribute without
this installed.

#### Windows

To install using:

- [Chocolatey](#chocolatey-2)
- [DotNet](#dotnet)

##### Chocolatey

See [Chocolatey](https://chocolatey.org) for prerequisites to use `choco`.

Once you have Chocolatey installed you can install GitVersion using the following:

>**NOTE:** You must be an elevated administrator to run `choco install`.

```bash
choco install GitVersion.Portable
```

##### DotNet

To be able to install _GitVersion_ the command `dotnet` must first be installed
using WinGet.

>**NOTE**: Newer versions of Windows have WinGet preinstalled. If it is not installed
>make sure to install _App Installer_ (by Microsoft) from the [Microsoft Store](https://www.microsoft.com/store/>productId/9NBLGGH4NNS1)
>to use `winget`.

```bash
winget install dotnet-sdk-6
```

Make sure there is a Nuget source listed by running:

```bash
dotnet nuget list source
```

If it does not return any Nuget source, add the [Nuget.org source](https://api.nuget.org/v3/index.json)
by running the following:

```bash
dotnet nuget add source https://api.nuget.org/v3/index.json -n nuget.org
```

Then we install _GitVersion_ using `dotnet`.

>Note: To use `dotnet` from command-line you might need to logout and login
>again after installation for environment variable `PATH` to be updated.

```bash
dotnet tool install --global GitVersion.Tool
```

#### macOS

You install [GitVersion](https://gitversion.net/docs/) using the following:

```bash
brew install gitversion
```

>**NOTE:** You need install [Homebrew](https://brew.sh/) first if you do
>not have it installed already.

#### Linux (or Docker)

##### Using Homebrew

You install [GitVersion](https://gitversion.net/docs/) using the following:

```bash
brew install gitversion
```

>**NOTE:** You need install [Homebrew](https://brew.sh/) first, if you do
>not have it installed already.

##### Using release package

If you don't have or don't want to use Homebrew, it is possible to install
it from a release package directly.

1. See if there are any prerequisites for the distribution you are using
   in [Linux dependencies](https://github.com/GitTools/GitVersion/blob/main/src/Docker/prerequisites.md)
1. Get the package name and version to the correct release for the distribution
   you are using at [GitVersion releases](https://github.com/GitTools/GitVersion/releases)
1. Run the commands below and replace with the correct package name and
   version from previous step.

>**NOTE:** These steps have been verified in Ubuntu 16.04 and Ubuntu 20.04.
>In other distributions the folders and steps might vary.

```bash
#!/bin/bash

# Create a new folder under current user home folder
cd ~
mkdir gitversion
cd ~/gitversion

version="5.6.0"
release="gitversion-ubuntu.16.04-x64-5.6.0.tar.gz"

wget https://github.com/GitTools/GitVersion/releases/download/$version/$release

tar -xvf ./$release

# Make the gitversion file executable
chmod +x gitversion

# Create a soft link to be able to run it from anywhere
#  - Ubuntu 16.04:
sudo ln -sf $(pwd)/gitversion /usr/local/bin/gitversion
#  - Ubuntu 20.04 (might need to replace $(pwd) with full path):
sudo ln -s $(pwd)/gitversion /usr/local/bin/

# Now gitversion should work
cd /tmp
gitversion
```

If it returns `Cannot find the .git directory` then it has executed correctly.
The first time it executes it can take a while.

### Clone repository from GitHub

To clone a repository from GitHub you need the owner of the repository
and the repository name. The owner for DSC Community repositories are
`dsccommunity` and the repository name can be found in the [list of
modules](https://dsccommunity.org/resources/)

Once you have that information you can clone the repository by using

```bash
git clone https://github.com/{owner}/{repositoryName}
```

For example to clone the repository for the module ComputerManagementDsc
into the folder `c:\source`.

```bash
cd c:\source
git clone https://github.com/dsccommunity/ComputerManagementDsc
```

This will make `git` to create a new directory with corresponding name
to the repository name (e.g. `ComputerManagementDsc`). This new folder
is called the **local repository**.

To see that the repository was cloned correctly then run `git status` in
the local repository folder.

```bash
PS> cd c:\source\ComputerManagementDsc
PS> git status
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

### Forking a repository on GitHub

To send changes from your local repository you first fork the upstream
repository, because all changes must first be pushed to a working branch
in your fork before sending in a pull request. To learn more about forks
read the article [Forking Projects](https://guides.github.com/activities/forking/).

To fork an upstream repository, e.g. the DSC module *ComputerManagementDsc*,
browse to the same URL used when cloning, e.g.
https://github.com/dsccommunity/ComputerManagementDsc.

To the right of the page you will find a button named *Fork*. Click that
and GitHub will create a fork (repository) in your own GitHub account.

<img src="../../images/getting_started_with_github/github_fork_button.png" alt="GitHub Fork Button" style="width:275px;" />

### Adding the fork as a remote in the local repository

To be able to send changes (commit in a working branch) to a fork of an
upstream repository you need to add a [remote](http://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes)
to the local repository.

To add a remote we use [`git remote add`](https://git-scm.com/docs/git-remote),
a remote name, and the URL to the fork.

The remote name can be whatever we choose, but we assume you want to use
`my` as the remote name for a remote pointing to your fork.

When GitHub creates a fork of an upstream repo it creates a repository in
your GitHub account (means your are the owner of the fork). So the URL
to the fork would be `https://github.com/{yourGitHubAccountName}/{repositoryName}`

So for example to add remote pointing to your fork of *ComputerManagementDsc*
we run the following. *Replace `johlju` with your actual GItHUb account*
*name.*

```bash
cd c:\source\ComputerManagementDsc
git remote add my https://github.com/johlju/ComputerManagementDsc`.
```

To verify that the remote was added correctly you can run the following.

```bash
PS> git remote -v
my      https://github.com/johlju/ComputerManagementDsc (fetch)
my      https://github.com/johlju/ComputerManagementDsc (push)
origin  https://github.com/dsccommunity/ComputerManagementDsc (fetch)
origin  https://github.com/dsccommunity/ComputerManagementDsc (push)
```

Now you have two remote references:

- The remote name **origin** pointing to the **upstream repository**.
- The remote name **my** pointing to your **fork** of the **upstream repository**.

### Making changes and pushing them to the fork

To make changes you should always use another branch than `main` to add
those changes, let us call it the working branch. A working branch should
normally be based on the branch `main` so that you can easily work on
several other branches during the same period.

>Creating a working branch separate from the default `main` branch will
>allow you to create other working branches off of branch `main` later
>while your other working branches is still open for code reviews.
>
>Limiting your current working branch to a single issue will also both
>streamline the code review and reduce the possibility of merge conflicts.

You create a new working branch using the following command
`git checkout -b <working-branch-name> my/main`. You should also
track the branch `main` in your fork, e.g. `my/main` so that you
will better see if the branch is behind or ahead in commits.

This will create a new local working branch in the local repository of
*ComputerManagementDsc*, start tracking your fork's main branch and
then checkout (move) to the new branch.

```bash
cd c:\source\ComputerManagementDsc
git checkout main
git checkout -b my-working-branch my/main
```

You can now start making changes in your local branch. You can easily start
Visual Studio Code and get it to automatically load the folder by running

```bash
cd c:\source\ComputerManagementDsc
code .
```

When you have made changes you need to commit them to your local branch.
Below we show how to commit and push using the command line, but it might
be easier to commit (using `git`) from within Visual Studio Code. How to
do that can be seen in this video.

{{< youtube id="B8RSMBSzFuA" >}}

You can see the status of changes with `git status`. To **commit** all
current changes (all modified files) you use `git commit -a -m "<Commit message>"`.

>`-a` argument tells Git to include all modified files in commit.
>`-m` argument specifies the commit message.

To commit all changes with a commit message `Fix issue #123`, you run the
following.

```bash
git commit -a -m "Fix issue #123"
```

>**NOTE:** You may make as many commits as you like. For example you can make
>just one commit for all changes, make a commit for each file you change,
>or a make a commit for each bug or feature if there are more than one you
>want to resolve. It is entirely up to you how, what and when you commit
>changes.

To **push** one or more commits containing your changes we use
`git push <remote-name>`. So to push the local working branch in your local
repository to the fork we do the following.

```bash
git push my
```

This will create a new branch in the fork, or update the existing branch
if it was created in a previous push.

See the [contributing guidelines](/guidelines/contributor/#create-or-update-a-pull-request-pr)
for more information on how to send in a pull request from a branch in
your fork.

### Make changes to an existing pull request of yours

There might be a need to update the pull request, for example due to a
review comment, CI tests failed, or you realized that you missed something.

If you need to make more changes to a pull request you just push more commits
to your working branch as mentioned in [Making changes and pushing them to the fork](#making-changes-and-pushing-them-to-the-fork)

Pushing a new commit to your working branch in your fork will automatically
update any pull request that is based on that working branch.

### Switch between local working branches

To see all branches run `git branch -a`, and to see working branches
run `git branch -v`.

>Active branch is marked with an asterisk (`*`). The  argument `-a` tells
>Git to show both [**local**](http://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)
>and [**remote**](http://git-scm.com/book/en/v2/Git-Branching-Remote-Branches)
>branches.

To switch to another working branch you use `git checkout <branch-name>`.

For example to switch to the working branch `fix-issue-#123` we do the
following.

```bash
git checkout fix-issue-#123
```

### Delete a branch

Once a pull request with your changes have been successfully merged into
the upstream repository you can delete the working branch. It is no longer
needed at that point, any further work requires a new working branch.

To delete your branch follow these steps:

1. Run `git checkout main` in the command prompt. This ensures that you
   aren't in the branch to be deleted (which isn't allowed).
1. Next, type `git branch -d branch-name` in the command prompt. This will
   delete the branch on your local machine only if it has been successfully
   merged to the upstream repository.
   You can override this behavior with the `–D` flag, which always deletes
   the local branch.
1. Finally, type `git push my :branch-name` in the command prompt (a space
   before the colon and no space after it). This will delete the branch on
   your GitHub fork.
