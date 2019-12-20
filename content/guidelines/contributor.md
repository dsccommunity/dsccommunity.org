---
title: "Contributor"
date: 2019-01-28T11:02:05+06:00
type: "post"
author: "Johan Ljunggren"
weight: 1
---

Thank you for your interest of contributing to the DSC Community.
Just by reading this you are already part of the DSC Community!

There are several ways you can contribute. You can submit an issue to
report a bug or to request an improvement. You can take part in an
discussions around an issue or pull request. You may review
pull requests, or send in a pull request yourself to improve the DSC
modules by adding more DSC resource, fixing issues in existing DSC
resources, improve the CI pipeline, or updating documentation around
the DSC modules.

You may also [join the conversation](/community/contact/) and ask for
help or share your knowledge in direct communication with others.

If you need any help along the way, don't be afraid to ask. We are here
for each other.

Her you can read more around the different contributions you can make:

- [Submit an issue](#submit-an-issue)
- [Discuss an issue or pull request (PR)](#discuss-an-issue-or-pull-request-pr)
- [Create or update a pull request (PR)](#create-or-update-a-pull-request-pr)
- [Review a pull request (PR)](#review-a-pull-request-pr)
- [Resolve an issue](#resolve-an-issue)
- [Write documentation](#write-documentation)
- [Understand the coding workflow](#understand-the-coding-workflow)
- [Resolve merge conflicts](#resolve-merge-conflicts)
- [How to continue working on a pull request (PR) when an author (contributor) is unable to complete it](#how-to-continue-working-on-a-pull-request-pr-when-an-author-contributor-is-unable-to-complete-it)

### Submit an issue

### Discuss an issue or pull request (PR)

### Create or update a pull request (PR)

Now you should be able to see your branch in your fork on GitHub

![GitHub-Select-Branch.png](Images/GitHub-Select-Branch.png)

You can create a new pull request on the same page

![GitHub-Create-PR.png](Images/GitHub-Create-PR.png)

Follow instructions from
[Submit a Pull Request](CONTRIBUTING.md#submit-a-pull-request)
to finish Pull request creating.

To update Pull Request, simply push more commits to the same branch in your
GitHub fork, that you use to create the pull request.

```plaintext
git commit -a -m "Update my awesome feature with code review feedback"
git push my awesome_feature
```

GitHub would automatically update the pull request.

### Review a pull request (PR)

### Resolve an issue

### Write documentation

### Understand the coding workflow

### Resolve merge conflicts

If another pull request is merged while yours is in review, you will need to add
those new changes into your working branch before your pull request is allowed
to merge. To do this we will 'rebase' the branch.
This means that the changes you made in your working branch for your pull request
will be 'replayed' on top of the changes that were recently merged into dev, as
though you originally created your branch/fork from the current point that the
dev branch is at.

_Note: Since it's replayed you might get conflicts several times during the
rebase process (for the first `rebase` command, and for each following
`rebase --continue`)._

Here are the steps to rebase your branch:

**_Note: These steps assumes that you have added the remote as described above.
Run `git remote -v` to verify that you have the remote name `my` pointing to your
fork repository, and remote name `origin` pointing to the original (upstream)
repository. If your remote names are pointing differently, then change the remote
names below accordingly._**

1. Rebase the local dev branch from the base dev branch.
1. Resolve merge conflicts.
1. Rebase your working branch.
1. Resolve merge conflicts.
1. Update your pull request.

#### 1. Rebase the local dev branch from the base dev branch

- In a PowerShell prompt, you need to do the following.

```plaintext
cd <path to cloned repository>      # This is the path to your cloned repository. I.e. cd C:\Source\xActiveDirectory
git checkout dev                    # Checkout (move) to your local dev branch.
git fetch origin dev                # Get all changes from origin/dev (and branch information).
git rebase origin/dev               # Rebase changes from origin/dev into your local dev branch.
```

>**Note:** If you used the **dev branch as your working branch**, then at this point
>you will probably get merge conflicts that need to be resolved. Search for the
>word 'CONFLICT' in the output. If you used dev as your working branch, you can
>skip to step 3 to learn how to resolve the merge conflicts.

Force push to your fork's dev branch to your forked repository.
_Make sure there were no conflicts before running this command._

```plaintext
git push my dev --force
```

#### 2. Rebase your working branch

- In a PowerShell prompt, you need to do the following.

```plaintext
cd <path to cloned repository>      # This is the path to your cloned repository. I.e. cd C:\Source\xActiveDirectory.
git checkout <your PR branch>       # Checkout (move) to your working branch, i.e git checkout awesome_feature.
git rebase my/dev                   # This will rebase your working branch from your forks dev branch.
```

**NOTE! At this point you will most likely get merge conflicts that need to be
resolved before you continue with the next step. Search for the word 'CONFLICT'
in the output. See step 3 to learn how to resolve the merge conflicts.**

#### 3. Resolve merge conflicts

If you get a message saying something like below, then you have merge conflicts
that must be manually resolved.
Below there is a conflict between the dev branch and your pull request branch
for the file `README.md`.
You can read more about how to resolve a merge conflict on the
[GitHub help page](https://help.github.com/articles/resolving-a-merge-conflict-from-the-command-line/).

```plaintext
Auto-merging README.md
CONFLICT (content): Merge conflict in README.md
error: Failed to merge in the changes.
```

To fix this you need to manually open the file in an editor of your choosing and
find the conflict. You find the conflict by searching for seven equals
sign: `=======`. Below is an example of how it could look like.

```plaintext
...
### Unreleased
<<<<<<< HEAD
* Added tests for resources
  - xSQLServerPermission
* Fixes in xSQLServerAvailabilityGroupListener
  - In one case the Get-method did not report that DHCP was configured.
=======
* Added resources
  - xSQLServerReplication
>>>>>>> my/dev

### 1.8.0.0
...
```

- Above the equal characters `========` is what is currently in the `README.md`.
- Below the equal characters `========` is the incoming change from the current
  commit being replayed.

To resolve this we have to manually change this section. The file can be changed
in any way you need to solve the conflict.
_Note: You must remove the lines `<<<<<<< HEAD`, `========` and `>>>>>>> origin/dev`._

After resolving the conflict, `README.md` could look like this:

```plaintext
...
### Unreleased
* Added resources
  - xSQLServerReplication
* Added tests for resources
  - xSQLServerPermission
* Fixes in xSQLServerAvailabilityGroupListener
  - In one case the Get-method did not report that DHCP was configured.

### 1.8.0.0
...
```

When you are happy with the file, save it and continue with the next file, if
there was more merge conflicts.
**Only when all the merge conflicts are resolved can you continue with the rebase.**

- To continue with the rebase. In the same PowerShell prompt as you started the
  rebase, you need to do the following.
  _Note: If not using the same PowerShell prompt, make sure you are in the local
  repository folder._

```plaintext
git status          # (optional) If you unsure of the name, you can use this to see the files that was in conflict.
git add <file>      # Do this for each file that you fixed merged conflicts in. I.e 'git add README.md'. This stages the file for commit. You could also use 'git add *' to stage all files at once.
git rebase --continue
```

**You can now get more merge conflicts.** If so, then you have to resolve those
again. Do the same procedure as before for these new conflicts.
**You might need to do this step several times.**

Continue to step 4 only when you no longer have any merge conflicts you need to
resolve (and no longer need to run the command `rebase --continue`).

#### 4. Update your pull request

Force push to your branch in your forked repository. The pull request will then
be updated automatically by GitHub.
*Force push "overwrites" the branch in the fork, and is always needed after rebase.*

```plaintext
git push my <pull request branch> --force     # I.e git push my awesome_feature --force
```

### How to continue working on a pull request (PR) when an author (contributor) is unable to complete it

Anyone in the community is allowed to continue the work on pull requests (PR's)
if either of these are true.

- If the original contributor is unable to continue the work on a pull request
  _and_ the original author signed the CLA.
- If the pull request have been labeled with the *abandoned* label (which also
  implies that the CLA was signed - otherwise the abandoned label should not have
  been set).

It is polite to tell the original author of the PR that you will be continuing
the work, by commenting on the original PR.

You can continue the work by getting the changes from the original contributors
branch to a new working branch in your fork. Once you have create a new working
branch with the original contributors changes,
then you can create a new pull request into the original repository.
It's important that when you create a new pull request from someone elses work,
that you mention the original pull request, and also acknowledge the original
author and mention the work it is based on.
For example mention the original author in the descriptive field when you create
the new pull request.

So, to continue working on a pull request, first you should rebase the changes
in the original pull request branch onto your new working branch. This is pretty
much the same as when you have to resolve merge conflicts.

In a PowerShell prompt, you need to do the following.

1. Create a new working branch in your fork.

   ```plaintext
   cd <path to cloned repository>
   git checkout -b changes-from-PR#<number>  # Change to the PR number, i.e. git checkout -b changes-from-PR#34
   ```

1. Add a remote to the original contributors fork. _In this example we use the users name as the remotes name._

   ```plaintext
   git remote add <username> <url>           # I.e git remote add johlju https://github.com/johlju/xSQLServer.git
   ```

1. Rebase your working branch using the fork and branch from the original contributor.

   ```plaintext
   git fetch <username>
   git rebase <username>/<branch>
   ```

1. Fix conflicts and when all conflicts are resolved stage all files and continue
   with the rebase.
   _This step might have to be done several times until all conflicts are resolved_

   ```plaintext
   git add <file>                            # i.e git add README.md
   git rebase --continue
   ```

1. Push changes to your forked repository

   ```plaintext
   git push my changes-from-PR#<number> --force  # Change to the PR number, i.e. git push my changes-from-PR#34 --force
   ```

1. Now we rebase again, this time against my/dev (which should already be rebased
   against origin/dev, see section Resolving merge conflicts on how to do that).

   ```plaintext
   git rebase my/dev
   ```

1. Again, fix conflicts and when all conflicts are resolved stage all files and
   continue with the rebase.
   _This step might have to be done several times until all conflicts are resolved_

   ```plaintext
   git add <file>                            # i.e git add README.md
   git rebase --continue
   ```

1. Push to your forked repository again

   ```plaintext
   git push my changes-from-PR#<number> --force  # Change to the PR number, i.e. git push my changes-from-PR#34 --force
   ```

1. Now, go to you forked repository on GitHub and create the pull request the
  normal way.
