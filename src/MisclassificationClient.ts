/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { BentleyError } from "@bentley/bentleyjs-core";
import { AuthorizedClientRequestContext, IncludePrefix, request, RequestOptions, Response, ResponseError } from "@bentley/itwin-client"
import {
  MisclassificationModelsResponse,
  MisclassificationStatusResponse,
  MisclassificationResultResponse,
  MisclassificationResultsResponse,
  MisclassificationRunCreate,
  MisclassificationRunResponse,
  MisclassificationRunsResponse
} from "./MisclassificationContracts";

export namespace MisclassificationClient {
  let _config: { apiUri: string };

  export function initialize(apiUri: string) {
    _config = { apiUri };
  }

  export async function getModels(requestContext: AuthorizedClientRequestContext): Promise<MisclassificationModelsResponse> {
    assertInitialized();

    const url = `${_config.apiUri}/designelementclassification/models`;
    const options: RequestOptions = {
      method: 'GET',
      headers: getDefaultHeaders(requestContext)
    };

    const response = await request(requestContext, url, options);
    if (isResponseSuccess(response))
      return response.body as MisclassificationModelsResponse;
    else
      throw new BentleyError(response.status, response.text);
  }

  export async function getRuns(requestContext: AuthorizedClientRequestContext, projectId: string): Promise<MisclassificationRunsResponse> {
    assertInitialized();

    const url = `${_config.apiUri}/designelementclassification/runs?projectId=${projectId}`;
    const options: RequestOptions = {
      method: 'GET',
      headers: getDefaultHeaders(requestContext)
    };

    const response = await request(requestContext, url, options);
    if (isResponseSuccess(response))
      return response.body as MisclassificationRunsResponse;
    else
      throw new BentleyError(response.status, response.text);
  }

  export async function getRun(requestContext: AuthorizedClientRequestContext, runId: string): Promise<MisclassificationRunResponse> {
    assertInitialized();

    const url = `${_config.apiUri}/designelementclassification/runs/${runId}`;
    const options: RequestOptions = {
      method: 'GET',
      headers: getDefaultHeaders(requestContext)
    };

    const response = await request(requestContext, url, options);
    if (isResponseSuccess(response))
      return response.body as MisclassificationRunResponse;
    else
      throw new BentleyError(response.status, response.text);
  }

  export async function getRunStatus(requestContext: AuthorizedClientRequestContext, runId: string): Promise<MisclassificationStatusResponse> {
    assertInitialized();

    const url = `${_config.apiUri}/designelementclassification/runs/${runId}/status`;
    const options: RequestOptions = {
      method: 'GET',
      headers: getDefaultHeaders(requestContext)
    };

    const response = await request(requestContext, url, options);
    if (isResponseSuccess(response))
      return response.body as MisclassificationStatusResponse;
    else
      throw new BentleyError(response.status, response.text);
  }

  export async function getRunResults(requestContext: AuthorizedClientRequestContext, runId: string): Promise<MisclassificationResultsResponse> {
    assertInitialized();

    const url = `${_config.apiUri}/designelementclassification/runs/${runId}/results`;
    const options: RequestOptions = {
      method: 'GET',
      headers: getDefaultHeaders(requestContext)
    };

    const response = await request(requestContext, url, options);
    if (isResponseSuccess(response))
      return response.body as MisclassificationResultsResponse;
    else
      throw new BentleyError(response.status, response.text);
  }

  export async function downloadRunResult(requestContext: AuthorizedClientRequestContext, runId: string, resultName: string): Promise<string | undefined> {
    assertInitialized();

    const url = `${_config.apiUri}/designelementclassification/runs/${runId}/results/${resultName}`;
    const options: RequestOptions = {
      method: 'GET',
      headers: getDefaultHeaders(requestContext)
    };

    const response = await request(requestContext, url, options);
    if (isResponseSuccess(response))
      return response.text;
    else
      throw new BentleyError(response.status, response.text);
  }

  export async function createRun(requestContext: AuthorizedClientRequestContext, runConfig: MisclassificationRunCreate): Promise<MisclassificationRunResponse> {
    assertInitialized();

    const url = `${_config.apiUri}/designelementclassification/runs/`;
    const options: RequestOptions = {
      method: 'POST',
      body: JSON.stringify(runConfig),
      headers: {
        ...getDefaultHeaders(requestContext),
        "Content-Type": "application/json"
      }
    };

    const response = await request(requestContext, url, options);
    if (isResponseSuccess(response))
      return response.body as MisclassificationRunResponse;
    else
      throw new BentleyError(response.status, response.text);
  }

  export async function cancelRun(requestContext: AuthorizedClientRequestContext, runId: string): Promise<MisclassificationRunResponse> {
    assertInitialized();

    const url = `${_config.apiUri}/designelementclassification/runs/${runId}/cancel`;
    const options: RequestOptions = {
      method: 'POST',
      headers: getDefaultHeaders(requestContext)
    };

    const response = await request(requestContext, url, options);
    if (isResponseSuccess(response))
      return response.body as MisclassificationRunResponse;
    else
      throw new BentleyError(response.status, response.text);
  }

  export async function deleteRun(requestContext: AuthorizedClientRequestContext, runId: string): Promise<void> {
    assertInitialized();

    const url = `${_config.apiUri}/designelementclassification/runs/${runId}`;
    const options: RequestOptions = {
      method: 'DELETE',
      headers: getDefaultHeaders(requestContext)
    };

    const response = await request(requestContext, url, options);
    if (isResponseSuccess(response))
      return;
    else
      throw new BentleyError(response.status, response.text);
  }

  function getDefaultHeaders(requestContext: AuthorizedClientRequestContext): { [header: string]: string } {
    return {
      Authorization: requestContext.accessToken.toTokenString(IncludePrefix.Yes),
      Accept: 'application/vnd.bentley.itwin-platform.v1+json'
    };
  }

  function assertInitialized() {
    if (!_config)
      throw new BentleyError(0, "Call initialize() before using MisclassificationClient client");
  }

  function isResponseSuccess(response: Response): Boolean {
    return response.status >= 200 && response.status < 300;
  }
}
