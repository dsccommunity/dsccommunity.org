---
title: "Create an Article"
date: 2019-03-08T12:41:48+08:00
type: "post"
weight: 1
draft: false
---

## How to Create an Article

Creating the md file is easy, but you might want to double check how it will
render on the website. To do so, we recommend you to install Hugo
(using Chocolatey it's just a `choco install hugo`) and test what you create.

But when you have installed hugo, forked the `dsccommunity.org`,
and cloned your fork locally, you can generate a post from the template,
from the source directory:
> `C:\src\dsccommunity.org > hugo new blog/your-title-in-lowercase.md`.

The command will use the template `archetypes\blog.md` to generate your draft
with correct metadata.

Before you commit, make sure you create a new branch with a distinctive name:
`git checkout -b my_branch_name`.

Then add your file, commit to this branch, and push to your fork:

```PowerShell
git add .\content\blog\your-title-in-lowercase.md
git commit -m "adding blog post draft"
git push -u origin my_branch_name
```
