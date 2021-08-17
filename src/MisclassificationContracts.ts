export enum MisclassificationRunStatus {
  None = "None",
  NotStarted = "NotStarted",
  InProgress = "InProgress",
  Failed = "Failed",
  Finished = "Finished",
  Canceled = "Canceled"
}

type MisclassificationRunMetadata = {
  countOfIssues: number,
  countOfProcessed: number,
  countOfElements: number
}

type MisclassificationRun = {
  id: string,
  modelVersion: string,
  metadata: MisclassificationRunMetadata,
  status: MisclassificationRunStatus,
  lastModifiedDateTime: string,
  _links: {
    imodel: { href: string },
    changeSet: { href: string },
    project: { href: string }
  }
}

type MisclassificationModel = {
  version: string,
  lastModifiedDateTime: string
}

type MisclassificationResult = {
  name: string
}

export type MisclassificationRunCreate = {
  iModelId: string,
  changeSetId: string,
  modelVersion: string
}

export type MisclassificationModelsResponse = {
  models: MisclassificationModel[]
}

export type MisclassificationRunsResponse = {
  runs: MisclassificationRun[]
}

export type MisclassificationRunResponse = {
  run: MisclassificationRun
}

export type MisclassificationStatusResponse = {
  status: MisclassificationRunStatus
}

export type MisclassificationResultsResponse = {
  results: MisclassificationResult[]
}

export type MisclassificationResultResponse = {
  result: MisclassificationResult
}