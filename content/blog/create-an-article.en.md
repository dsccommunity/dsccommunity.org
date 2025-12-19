---
title: "Create an Article"
date: 2019-03-08T12:41:48+08:00
type: "post"
weight: 1
draft: false
---

Want to contribute a blog post to the DSC Community website? This guide shows you how to create and submit articles using Hugo and the archetypes template system.

We recommend installing Hugo (using Chocolatey it's just `choco install hugo`) to preview how your content will
render on the website before submitting.

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
