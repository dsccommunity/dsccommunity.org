---
title: Initial
date: 2025-08-01
time: 07:05 UTC-0
attendees:
- '@kilasuit'
apologies:
- '@gaelcolas'
- '@johlju'
reviewers:
- '@gaelcolas'
- '@johlju'
outcome: Accepted
impactedAreas:
- Repo Layout
- Repo Scope
- Tech Used
---
<!-- markdownlint-disable MD025 -->
# 001 - Initial 2025-Aug-01

## Status

PartialDecision above 80%

See more in the Accepted , Declined & Deferred sections

## Context

As part of initial starting of a project we need to have a project structure along with a number of key decision points, like what technologies we are using and licensing to use.

We should also link to projects that have inspired this as to allow others to goforthwith and have a look at how they've done it.

We should also decide initial scope and what it means to be at a push publicly stage.

## Decision

### Decided by

@kilasuit - Ryan Yates

### Accepted

#### Use of ADR's

ADR's are useful to allow users, including maintainers, to comeback to a project and understand why decisions were made. These can be linked to in Issues, and in comments in  code, allowing reviews at a later date.

ADR's can be either made public or kept private.

In this instance it was decided to make them public as part of the project & this initial ADR layout will be used in future projects as well.

#### Project Layout

As this is a project that will have multiple similar releasable artifacts, it was decided to have them all together in this repo.

This allows me to publish not only the extension packs, but also any extension if I were to build one in the future.

#### Documentation

Ideally this will follow a Just Enough Documentation model.

#### Project Scope

This project is for the DSC Community website and uses best practices for repo layout alongside tooling that help you with getting involved in this site.

#### Used Technologies

- VScode
  - We use vscode as editor of choice for this repo

- GitHub
  - We use GitHub to host the public version of this repo
  - We use GitHub Issues, PR's and Projects
  - We may use GitHub Actions in future

- Site Platform
  - The Site Platform chosen is Hugo

- Virtual environments / devcontainers
  - we have a devcontainer that can be used with this repo
  - we also intend to publish a PowerShell DSC Configuration in this repo that can be used if you want this in a VM instead
  - we also intend to publish a WinGet Configuration that can be used for setting up this repo & tooling in Windows (which may be used by DSC)

- Azure DevOps
  - We may make use of Azure Repos for a secondary/private host of this repo
  - We use Azure Pipelines for build and release
  - We may synchronise Issues to Azure Boards...?

Public hosting
- This site is hosted at .....
- DNS for this site is managed by .....


- CoPilot/AI
  - We will were we have access and where appropriate may make use of CoPilot/AI to help with this project.
  - In any articles published that have been helped by AI, we will add the AI Used as a Co-Author


### Declined

None

### Deferred


### Notes

Awaiting input from @gaelcolas @johlju and others

### Historic Notes

This ADR is many years after the project started and whilst we could add an ADR starting `000-` this starts to serve as an initial starting place to help others understand this particular project.

### Updated
