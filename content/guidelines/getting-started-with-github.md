---
title: "Getting Started with GitHub"
date: 2019-01-28T11:02:05+06:00
type: "post"
author: "Johan Ljunggren"
weight: 2
---

There are a lot of guides on the Internet that will should different
aspects of what is described here, but this article will focus on a
simple way to get started for the workflow we use for DSC modules and
DSC resources within the DSC Community.

### Table of Contents

- [Create free GitHub fccount](#create-free-github-account)
- [Install Visual Studio Code](#install-visual-studio-code)
- [Install Git](#install-git)
- [Configure Git](#configure-git)
- [Install PowerShell Module posh-git](#install-powershell-module-posh-git)
- [Setup SSH key](#setup-ssh-key)
- [Clone repository from GitHub](#clone-repository-from-github)
- [Securely storing Git credentials](#securely-storing-git-credentials)
- [Forking a repository on GitHub](#forking-a-repository-on-github)
- [Adding the fork as a remote in the local repository](#adding-the-fork-as-a-remote-in-the-local-repository)
- [Making changes and pushing them to the fork](#making-changes-and-pushing-them-to-the-fork)
- [Switch between local working branches](#switch-between-local-working-branches)
- [Creating a new pull request](#creating-a-new-pull-request)
- [Updating your pull request](#updating-your-pull-request)
- [Delete a branch](#delete-a-branch)

### Create free GitHub account

Create a free GitHub account by browsing to [GitHub](https://github.com)
and clicking on the **Sign up** button.

<img src="../../images/getting_started_with_github/github_signup.png" alt="GitHub SignUp" style="width:725px;" />

We recommend that you also configure 2FA on the GitHub account. It is
optional and is not needed to contribute.

### Install Visual Studio Code

It is optional but recommended to use Visual Studio Code for contributing
to the DSC resource in DSC Community, mainly because we try to incorporate
the Visual Studio Code in the workflow. For example it is easier to get
visual indications when code do not conform to the style guideline.

To install Visual Studio code visit the official site [code.visualstudio.com](https://code.visualstudio.com).

#### Windows

The installation is straightforward using a wizard type of installation.
Normally all defaults values suggested by the wizard can be used.

### Install Git

#### Windows

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
On branch master
Your branch is up to date with 'origin/master'.

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

To make changes you should always use another branch than `master` to add
those changes, let us call it the working branch. A working branch should
normally be based on the branch `master` so that you can easily work on
several other branches during the same period.

You create a new working branch using the following command
`git checkout -b <working-branch-name> my/master`. You should also
track the branch `master` in your fork, e.g. `my/master` so that you
will better see if the branch is behind or ahead in commits.

This will create a new local working branch in the local repository of
*ComputerManagementDsc*, start tracking your fork's master branch and
then checkout (move) to the new branch.

```bash
cd c:\source\ComputerManagementDsc
git checkout master
git checkout -b my-working-branch my/master
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

To **push** the commits containing your changes we use `git push <remote-name>`.
So to push the local working branch in your local repository to the fork
we do the following.

```bash
git push my
```

This will create a new branch in the fork, or update the existing branch
if it was created in a previous push.

See the [contributing guidelines](/guidelines/contributor/#create-or-update-a-pull-request-pr)
for more information on how to send in a pull request from a branch in
your fork.

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

1. Run `git checkout master` in the command prompt. This ensures that you
   aren't in the branch to be deleted (which isn't allowed).
1. Next, type `git branch -d branch-name` in the command prompt. This will
   delete the branch on your local machine only if it has been successfully
   merged to the upstream repository.
   You can override this behavior with the `–D` flag, which always deletes
   the local branch.
1. Finally, type `git push my :branch-name` in the command prompt (a space
   before the colon and no space after it). This will delete the branch on
   your GitHub fork.
