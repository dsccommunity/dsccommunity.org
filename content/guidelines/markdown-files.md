---
title: "Markdown Files"
date: 2019-01-28T11:02:05+06:00
type: "post"
author: "PlagueHO"
weight: 1
---

### Line length not longer than 80 characters

Rows longer than 80 characters should be split into multiple lines where appropriate.
This helps make it easier for reviewers to make review comments and for the
contributors to see where the requested changes are (without scrolling).
It is also easier to see the lines in split view mode when the lines don't wrap
on the screen. It will also improve the readability when using `git diff`.

#### Tools

To help with this it is suggested to add tools to help see when I line is starting
to get to long.

##### Visual Studio Code

In the Visual Studio Code it is possible to install the extension
[*markdownlint*](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)
and then add a markdownlint settings file *.markdownlint.json* file to the root
of the repository.

```json
{
    "MD013": {
        "line_length": 80,
        "headers": false,
        "code_blocks":false,
        "tables": false
    }
}
```

In addition to this, or instead of, it is possible to add rulers in Visual Studio
Code that will help guide where the line should best be split. This is could be
added to the workspace *settings.json* file.

```json
{
    "[markdown]": {
        "editor.rulers": [
            80
        ]
    }
}
```
