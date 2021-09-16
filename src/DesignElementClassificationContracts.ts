  
/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

export enum DesignElementClassificationRunStatus {
  None = "None",
  NotStarted = "NotStarted",
  InProgress = "InProgress",
  Failed = "Failed",
  Finished = "Finished",
  Canceled = "Canceled"
}

type DesignElementClassificationRunMetadata = {
  countOfIssues: number,
  countOfProcessed: number,
  countOfElements: number
}

type DesignElementClassificationRun = {
  id: string,
  modelVersion: string,
  metadata: DesignElementClassificationRunMetadata,
  status: DesignElementClassificationRunStatus,
  lastModifiedDateTime: string,
  _links: {
    imodel: { href: string },
    changeSet: { href: string },
    project: { href: string }
  }
}

type DesignElementClassificationModel = {
  version: string,
  lastModifiedDateTime: string
}

type DesignElementClassificationResult = {
  name: string
}

export type DesignElementClassificationRunCreate = {
  iModelId: string,
  changeSetId: string,
  modelVersion: string
}

export type DesignElementClassificationModelsResponse = {
  models: DesignElementClassificationModel[]
}

export type DesignElementClassificationRunsResponse = {
  runs: DesignElementClassificationRun[]
}

export type DesignElementClassificationRunResponse = {
  run: DesignElementClassificationRun
}

export type DesignElementClassificationStatusResponse = {
  status: DesignElementClassificationRunStatus
}

export type DesignElementClassificationResultsResponse = {
  results: DesignElementClassificationResult[]
}
