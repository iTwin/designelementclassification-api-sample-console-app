# Introduction

Copyright © Bentley Systems, Incorporated. All rights reserved. See [LICENSE.md](./LICENSE.md) for license terms and full copyright notice.

The Design Element Classification sample is a simple command line app that illustrates the workflow of checking available model versions deployed and running a new run for an iModel.

## Table of contents

- [Pre-requisites](#pre-requisites)
  - [Resources](#resources)
  - [Permissions](#permissions)
  - [Client registration](#client-registration)
- [Getting started](#getting-started)
  - [Project structure](#project-structure)

## Pre-requisites

To build and run this app locally you will need a few things:

- Install [Git](https://git-scm.com/)
- Install [Node.js](https://nodejs.org/en/) v12 (must be greater than 12.10.x)
- Install [VS Code](https://code.visualstudio.com/)

### Resources

To successfully run this tool you will need to have an accessible iModel. If you don't
have one already, contact one of your Organization Administrators for access to an
iModel or take some time to go through the following tutorials:

- Create a [Project](https://developer.bentley.com/tutorials/create-and-query-projects-guide).
- Crate an [empty iModel](https://developer.bentley.com/tutorials/create-empty-imodel/).
- [Populate](https://developer.bentley.com/tutorials/synchronization-tutorial/) the iModel.

### Permissions

Use of the Design Element Classification APIs requires Project level Permissions. For
these Permissions, you must be an Organization Administrator for the Organization that
owns a given Project or have `administration_manage_roles` Permission assigned at the
Project level. If you do not have admin access to the Project or iModel you would like
to use, contact somebody who is a Project Administrator. As a Project Administrator,
you can use APIs described in the [Manage Project Team Members](/tutorials/manage-project-team-members-guide/)
tutorial to create a Role and update it with `"permissions": ["MLRunInference"]`.
Once this is done and the Role is assigned to you, you can use any iModel inside your
Project to finish this tutorial.

### Client registration

You need to register an Application to be able to access your data using this sample. If you don't have one already, follow next steps to create an application.

1.  Go to [Developer Portal](https://developer.bentley.com).
2.  Click the Sign In button and sign-in using your Bentley account credentials.
    If you have not already registered, click Register now and complete the registration process.
3.  Click on your user icon and navigate to the My Apps page.
4.  Click the Register New button.
5.  Give your application a Name.
6.  Select Visualization API association and deselect all other scopes except openid.
7.  Select the Reporting & Insights API association.
8.  Select application type SPA (Single Page Web Application).
9.  Enter Redirect URL.
    For this tutorial use `http://localhost:3000/signin-callback`.
10. Leave post logout redirect URIs empty.
11. Click the Save button.

You will receive a client id for the app, save that somewhere to be used later.

> **Note!** Make sure you selected designelementclassification:read and designelementclassification:modify scopes while creating the app.

## Getting started

- Clone the repository

  ```sh
  git clone https://github.com/iTwin/designelementclassification-api-sample-console-app.git
  ```

- Install dependencies

  ```sh
  cd designelementclassification-api-sample-console-app
  npm install
  ```

- Build the project

  ```sh
  npm run build
  ```

- Run the project
  ```sh
  npm start -- --clientId {CLIENT_ID} --projectId {PROJECT_ID} --iModelId {IMODEL_ID} --changeSetId {CHANGE_SET_ID}
  ```

- Show help to see all available console app arguments
  ```sh
  npm start -- --help
  ```
> **Tip.** To pass arguments to npm script use `--` to separate npm script target and arguments you wish to pass.

### Project structure

The full folder structure of this app is explained below:

> **Note!** Make sure you have already built the app using `npm run build`

| Name                     | Description                                                                                  |
| ------------------------ | ---------------------------------------------------------------------------------------------|
| **.vscode**              | Contains VS Code specific settings                                                           |
| **.github**              | Contains Github related files                                                                |
| **lib**                  | Contains the distributable (or output) from your TypeScript build. This is the code you ship |
| **src**                  | Contains source code that will be compiled to the dist dir                                   |
| **src/index.ts**         | Main entry point for executing API requests to create Design Element Classification run      |
| package.json             | File that contains npm dependencies as well as build scripts                                 |
| tsconfig.json            | Config settings for compiling server code written in TypeScript                              |
