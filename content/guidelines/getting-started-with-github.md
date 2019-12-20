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
- [Setup SSH key](#setup-ssh-key)
- [Clone repository from GitHub](#clone-repository-from-github)
- [Securely storing Git credentials](#securely-storing-git-credentials)
- [Forking a repository on GitHub](#forking-a-repository-on-github)
- [Adding the fork as a remote on the local machine](#adding-the-fork-as-a-remote-on-the-local-machine)
- [Making changes and pushing them to the fork](#making-changes-and-pushing-them-to-the-fork)
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

After the installation you can open a PowerShell console and type the
following and it should return the version of `git` if it was installed
correctly.

```bash
PS> git --version
git version 2.24.1.windows.2
```

**Git for Windows** installed a credential manager that will help you
connect using your GitHub credentials. It will popup the first time
your credentials are needed for example when pushing to a repository on
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
repository, because all changes mist first be pushed to a working branch
in your fork before sending in a pull request. To learn more about forks
read the article [Forking Projects](https://guides.github.com/activities/forking/).

To fork an upstream repository, e.g. the DSC module *ComputerManagementDsc*,
browse to the same URL used when cloning, e.g.
https://github.com/dsccommunity/ComputerManagementDsc.

To the right of the page you will find a button named *Fork*. Click that
and GitHub will create a fork (repository) in your own GitHub account.

<img src="../../images/getting_started_with_github/github_fork_button.png" alt="GitHub Fork Button" style="width:275px;" />

### Adding the fork as a remote on the local machine

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
git remote add my https://github.com/johlju/ComputerManagementDsc`.
```

To verify that the remote was added correctly you can run the following.

```bash
PS> git remote -v
my      https://github.com/johlju/ComputerManagementDsc (fetch)
my      https://github.com/johlju/ComputerManagementDsc (push)
origin  https://github.com/PowerShell/ComputerManagementDsc (fetch)
origin  https://github.com/PowerShell/ComputerManagementDsc (push)
```

Now you have two remote references:

- The remote name **origin** pointing to the **upstream repository**.
- The remote name **my** pointing to your **fork** of the **upstream repository**.

### Making changes and pushing them to the fork

- To make changes, create a new local branch: `git checkout -b <branch> my/dev`,
  i.e. `git checkout -b awesome_feature my/dev`.

This will create a new local branch, connect to your fork's dev branch as the
tracking branch (upstream branch) and then checkout (move) to the new branch.

- To see all branches, run `git branch -a`.
- To see status of all branches (if they are ahead or behind the tracking
  branch), run `git branch -v`.

```plaintext
> git branch -a
* master
  remotes/origin/HEAD -> origin/master
  remotes/origin/master
```

Active branch is marked with `*`. the `-a` argument tells Git to show both
[**local**](http://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)
and
[**remote**](http://git-scm.com/book/en/v2/Git-Branching-Remote-Branches)
branches.

- Make your changes and **commit** them with `git commit -a -m "<Commit message>"`.
  `-a` argument tells Git to include all modified files in commit.
  `-m` argument specifies the commit message.

- To get the big picture of the current state of your repository, use `gitk --all`
  command. It opens a UI with a lot of useful information. You can read more
  about **gitk** in the blog post
  [Use gitk to understand git](https://lostechies.com/joshuaflanagan/2010/09/03/use-gitk-to-understand-git/).
  ![Gitk.png](Images/Gitk.png)

- After that can **push** changes to your fork with `git push my <branch>`
  command, i.e. `git push my awesome_feature`.

### Delete a branch

Once your pull request changes have been successfully merged into the origin (upstream)
repository you can delete the branch you used, as you will no longer need it.
Any further work requires a new branch.
To delete your branch follow these steps:

See the [contributing guidelines](/guidelines/contributor/#create-or-update-a-pull-request-pr)
for more information on how to send in a pull request

1. Run `git checkout master` in the command prompt. This ensures that you
   aren't in the branch to be deleted (which isn't allowed).
1. Next, type `git branch -d <branch name>` in the command prompt. This will
   delete the branch on your local machine only if it has been successfully
   merged to the upstream repository.
   You can override this behavior with the `–D` flag, which always deletes the
   local branch.
1. Finally, type `git push my :<branch name>` in the command prompt (a space
   before the colon and no space after it).
   This will delete the branch on your GitHub fork.
