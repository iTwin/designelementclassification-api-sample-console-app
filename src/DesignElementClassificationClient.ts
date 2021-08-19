/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { BentleyError } from "@bentley/bentleyjs-core";
import { AuthorizedClientRequestContext, IncludePrefix, request, RequestOptions, Response } from "@bentley/itwin-client"
import {
  DesignElementClassificationModelsResponse,
  DesignElementClassificationStatusResponse,
  DesignElementClassificationResultsResponse,
  DesignElementClassificationRunCreate,
  DesignElementClassificationRunResponse,
  DesignElementClassificationRunsResponse
} from "./DesignElementClassificationContracts";

export namespace DesignElementClassificationClient {
  let _config: { apiUri: string };

  export function initialize(apiUri: string) {
    _config = { apiUri };
  }

  export async function getModels(requestContext: AuthorizedClientRequestContext): Promise<DesignElementClassificationModelsResponse> {
    assertInitialized();

    const url = `${_config.apiUri}/designelementclassification/models`;
    const options: RequestOptions = {
      method: 'GET',
      headers: getDefaultHeaders(requestContext)
    };

    const response = await request(requestContext, url, options);
    return response.body as DesignElementClassificationModelsResponse;
  }

  export async function getRuns(requestContext: AuthorizedClientRequestContext, projectId: string): Promise<DesignElementClassificationRunsResponse> {
    assertInitialized();

    const url = `${_config.apiUri}/designelementclassification/runs?projectId=${projectId}`;
    const options: RequestOptions = {
      method: 'GET',
      headers: getDefaultHeaders(requestContext)
    };

    const response = await request(requestContext, url, options);
    return response.body as DesignElementClassificationRunsResponse;
  }

  export async function getRun(requestContext: AuthorizedClientRequestContext, runId: string): Promise<DesignElementClassificationRunResponse> {
    assertInitialized();

    const url = `${_config.apiUri}/designelementclassification/runs/${runId}`;
    const options: RequestOptions = {
      method: 'GET',
      headers: getDefaultHeaders(requestContext)
    };

    const response = await request(requestContext, url, options);
    return response.body as DesignElementClassificationRunResponse;
  }

  export async function getRunStatus(requestContext: AuthorizedClientRequestContext, runId: string): Promise<DesignElementClassificationStatusResponse> {
    assertInitialized();

    const url = `${_config.apiUri}/designelementclassification/runs/${runId}/status`;
    const options: RequestOptions = {
      method: 'GET',
      headers: getDefaultHeaders(requestContext)
    };

    const response = await request(requestContext, url, options);
    return response.body as DesignElementClassificationStatusResponse;
  }

  export async function getRunResults(requestContext: AuthorizedClientRequestContext, runId: string): Promise<DesignElementClassificationResultsResponse> {
    assertInitialized();

    const url = `${_config.apiUri}/designelementclassification/runs/${runId}/results`;
    const options: RequestOptions = {
      method: 'GET',
      headers: getDefaultHeaders(requestContext)
    };

    const response = await request(requestContext, url, options);
    return response.body as DesignElementClassificationResultsResponse;
  }

  export async function downloadRunResult(requestContext: AuthorizedClientRequestContext, runId: string, resultName: string): Promise<string | undefined> {
    assertInitialized();

    const url = `${_config.apiUri}/designelementclassification/runs/${runId}/results/${resultName}`;
    const options: RequestOptions = {
      method: 'GET',
      headers: getDefaultHeaders(requestContext)
    };

    const response = await request(requestContext, url, options);
    return response.text;
  }

  export async function createRun(requestContext: AuthorizedClientRequestContext, runConfig: DesignElementClassificationRunCreate): Promise<DesignElementClassificationRunResponse> {
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
    return response.body as DesignElementClassificationRunResponse;
  }

  export async function cancelRun(requestContext: AuthorizedClientRequestContext, runId: string): Promise<DesignElementClassificationRunResponse> {
    assertInitialized();

    const url = `${_config.apiUri}/designelementclassification/runs/${runId}/cancel`;
    const options: RequestOptions = {
      method: 'POST',
      headers: getDefaultHeaders(requestContext)
    };

    const response = await request(requestContext, url, options);
    return response.body as DesignElementClassificationRunResponse;
  }

  export async function deleteRun(requestContext: AuthorizedClientRequestContext, runId: string): Promise<void> {
    assertInitialized();

    const url = `${_config.apiUri}/designelementclassification/runs/${runId}`;
    const options: RequestOptions = {
      method: 'DELETE',
      headers: getDefaultHeaders(requestContext)
    };

    await request(requestContext, url, options);
  }

  function getDefaultHeaders(requestContext: AuthorizedClientRequestContext): { [header: string]: string } {
    return {
      Authorization: requestContext.accessToken.toTokenString(IncludePrefix.Yes),
      Accept: 'application/vnd.bentley.itwin-platform.v1+json'
    };
  }

  function assertInitialized() {
    if (!_config)
      throw new BentleyError(0, "Call initialize() before using DesignElementClassificationClient client");
  }
}
