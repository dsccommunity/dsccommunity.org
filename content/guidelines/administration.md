---
title: "Administration"
date: 2019-01-28T11:02:05+06:00
type: "post"
author: "Johan Ljunggren"
weight: 6
---

### Security

To be administrator you must have 2FA enabled on accounts that give you
access to DSC Community resources, for example your GitHub account and
the account that access DSC Community Azure DevOps organization.

### GitHub

#### Create GitHub repository

To create a new GitHub repository in the DSC Community organization, browse
to https://github.com/dsccommunity and click on _New_.

All repositories should always be added with **MIT licensing**.

>**NOTE:** To be able create repositories you must be an owner of the
>GitHub DSC Community organization. See [GitHub DSC Community organizational owners](https://github.com/orgs/dsccommunity/people?query=role%3Aowner).

##### Create GitHub repository Team

Not written yet.

### Azure DevOps organization

DSC Community has its own Azure DevOps Organization; https://dev.azure.com/dsccommunity/.

#### Create Azure DevOps project

Always create an Azure DevOps project with the same name as the GitHub
repository.

>**NOTE:** To be able to do this you need to be a member of the
>Azure DevOps group _Project Collection Administrators_.

1. Create a new project at https://dev.azure.com/dsccommunity/ with the
   same name as the **GitHub repository name**, make sure to set visibility
   to **public**.

#### Add maintainer as a stakeholder

Stakeholders are always added in the Azure DevOps organization level,
**_not directly_** on the Azure DevOps project.

You will need either the users Azure Active
Directory-account, personal Microsoft-account, or GitHub account. Read
more in the article [Add users to your organization or project](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/add-organization-users).

The Azure DevOps project should be created before adding stakeholders
(maintainers) to the Azure DevOps organization (so that you can connect
the project to the maintainer directly).

1. Add (invite) a stakeholder by going to the [Azure DevOps Organization Users](https://dev.azure.com/dsccommunity/_settings/users),
   and click on _Add user_.
1. Add the maintainer as a stakeholder, add one or more projects, then
   add the maintainer as member of the Azure DevOps project group
   _Project Contributors_.
1. Make sure to have checked the _Send email invites_ so that the maintainer
   gets the invite and are able to join.

   <img src="../../images/administration/azure_devops_organization_add_user.png" alt="Azure DevOps Organization Add User" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);width:425px;" />

>**NOTE:** To be able to do this you need to have sufficient privileges
>in the Azure DevOps Organization. If not then contact @gaelcolas on the
>[Slack #DSC channel](https://dsccommunity.org/community/contact/)
>and provide him with the e-mail or account (see above) the maintainer
>has, and the Azure DevOps project the maintainer should have access too.

#### Create pipeline in Azure Pipelines

Prior to doing this, make sure that the working branch was pushed to the
upstream repository since you need to have access to the file
`azure-pipelines.yml` in the next step.

1. In the new project under Pipelines, create a new pipeline and choose
   GitHub as where the source resides
   1. Under *My repositories* in the drop-down choose *All repositories*.
   1. Choose the the upstream repository, e.g. dsccommunity/SqlServerDsc.
1. Choose *Existing Azure Pipelines YAML file* and then to choose the file
   `azure-pipelines.yml` by browsing the branch you just pushed above.
   Then on the box that says *Run*, instead just choose *Save* in the
   drop-down list.

##### Add access tokens to an Azure Pipeline

1. Browse to the pipeline, then click _Edit_.
1. When viewing the YAML file, click on *Variables*
1. Add these two variables.
   - `GitHubToken` - This should have the value of the GitHub repository
     Personal Access Token (PAT)
   - `GalleryApiToken` - This should have the value of the PowerShell
     Gallery API key

### Create the GitHub Personal Access Token (PAT)

The Personal Access Token (PAT) that is used by the pipeline is from the
@dscbot account (the DSC Community GitHub account).

Log in to the @dscbot account and from there take out a Personal Access Token.

Permissions for the pat:

- repo
- delete:packages
- read:packages
- write:packages

**_Personal Access Token (PAT) expire after 12 months from creation, so every_**
**_12 months the PAT must be renewed._**

>**NOTE:** There can only be one holder of the DSC Community GitHub account
>since it is (obviously) using 2FA. Currently the account holder is @johlju.

### Create the PowerShell Gallery API key

The DSC Community PowerShell Gallery API key used by the pipeline is
created per package so that each key can only publish new version of
that specific package.

>**NOTE:** There can only be one holder of the DSC Community PowerShell
>Gallery account since it is (obviously) using 2FA. Currently the account
>holder is @gaelcolas.

### Add a new DSC Community committee member

Not yet written.
