import { DesignElementClassificationClient } from "./DesignElementClassificationClient";
import { ElectronAuthorizationBackend } from "@bentley/electron-manager/lib/ElectronBackend";
import { AuthorizedClientRequestContext } from "@bentley/itwin-client";
import { BentleyError } from "@bentley/bentleyjs-core"
import { DesignElementClassificationRunStatus } from "./DesignElementClassificationContracts";
import yargs from "yargs";
import { hideBin } from "yargs/helpers"
import { NativeAppAuthorizationConfiguration } from "@bentley/imodeljs-common";
import { IModelHost } from "@bentley/imodeljs-backend";

const args: any = yargs(hideBin(process.argv))
    .help()
    .options({
        "clientId": {
            describe: "Authentication client id",
            demandOption: true
        },
        "issuerUri": {
            describe: "Issue url",
            default: "https://ims.bentley.com"
        },
        "redirectUri": {
            describe: "Redirect url for client",
            default: "http://localhost:3000/signin-callback"
        },
        "apiUri": {
            describe: "Bentley's API Uri",
            default: "https://api.bentley.com/"
        },
        "scopes": {
            describe: "Scopes",
            default: "designelementclassification:read designelementclassification:modify openid"
        },
        "projectId": {
            alias: "p",
            describe: "Project ID",
            demandOption: true
        },
        "iModelId": {
            alias: "i",
            describe: "iModel ID",
            demandOption: true
        },
        "changeSetId": {
            alias: "c",
            describe: "Change Set Id",
            demandOption: true
        },
        "displayHistoryRuns": {
            alias: "hist",
            describe: "Will display only historical runs in project and exit program",
            boolean: true,
            default: false
        },
        "deleteRunOnExit": {
            alias: "del",
            describe: "Delete run on program exit if run was successful",
            boolean: true,
            default: true
        },
        "waitFor": {
            alias: "w",
            describe: "Wait for run to complete in miliseconds",
            number: true,
            default: 60 * 60 * 1000
        }
    }).argv;

const authConfig: NativeAppAuthorizationConfiguration = {
    issuerUrl: args["issuerUri"],
    clientId: args["clientId"],
    redirectUri: args["redirectUri"],
    scope: args["scopes"],
};

const authClient = new ElectronAuthorizationBackend();

const signIn = async (): Promise<void> => {
    await authClient.initialize(authConfig);
    await authClient.signInComplete();
}

const getClientContext = async (): Promise<AuthorizedClientRequestContext> => {
    const token = await authClient.getAccessToken();

    return AuthorizedClientRequestContext.fromJSON({
        ...AuthorizedClientRequestContext.current,
        accessToken: token.toJSON()
    });
}

const handleDesignElementClassificationResult = async (results: string): Promise<void> => {
    /// logic to handle DesignElementClassification results
    console.log("Started handling DesignElementClassification results.");
    await new Promise(res => setTimeout(res, 60 * 1000));
    const _ = results;
    console.log("Finished handling DesignElementClassification results.")
}

const main = async (): Promise<void> => {
    const projectId = args["projectId"] as string;
    const iModelId = args["iModelId"] as string;
    const changeSetId = args["changeSetId"] as string;
    const waitForMs = args["waitFor"] as number;
    const waitUntilDate = new Date();
    waitUntilDate.setTime(waitUntilDate.getTime() + waitForMs);

    DesignElementClassificationClient.initialize(args["apiUri"]);

    if (args["displayHistoryRuns"]) {
        const runResponse = await DesignElementClassificationClient.getRuns(await getClientContext(), projectId);

        for (const { id, status } of runResponse.runs) {
            console.log(`Found run in project. Run id - '${id}'. Status - '${status}'`);
        }
        return;
    }

    const modelsResponse = await DesignElementClassificationClient.getModels(await getClientContext());
    const models = modelsResponse.models.sort((a, b) => (a > b ? 1 : -1));

    console.log(`Selecting '${models[0].version}' model version to run DesignElementClassification on.`);

    const createResponse = await DesignElementClassificationClient.createRun(await getClientContext(), {
        changeSetId,
        iModelId,
        modelVersion: models[0].version
    });

    let run = createResponse.run;
    let runStatus = run.status;

    console.log(`Run created. Run id - '${run.id}'.`)

    while (runStatus === DesignElementClassificationRunStatus.InProgress || runStatus === DesignElementClassificationRunStatus.NotStarted) {
        await new Promise(res => setTimeout(res, 5 * 1000))

        const statusResponse = await DesignElementClassificationClient.getRunStatus(await getClientContext(), run.id);
        runStatus = statusResponse.status;

        console.log(`Current run status - '${runStatus}'.`)

        if (new Date() > waitUntilDate)
            break;
    };

    if (runStatus !== DesignElementClassificationRunStatus.Finished) {
        console.log("Run did not finish in time. Cancelling and deleting run.");

        await DesignElementClassificationClient.cancelRun(await getClientContext(), run.id);
        console.log("Run canceled.");

        await DesignElementClassificationClient.deleteRun(await getClientContext(), run.id);
        console.log("Run deleted.");

        return;
    }

    const resultFilesResponse = await DesignElementClassificationClient.getRunResults(await getClientContext(), run.id);
    for (const result of resultFilesResponse.results) {
        console.log(`Found result! Name: '${result.name}'`)
    }

    const resultText = await DesignElementClassificationClient.downloadRunResult(await getClientContext(), run.id, "DesignElementClassifications.json");
    await handleDesignElementClassificationResult(resultText!);

    await DesignElementClassificationClient.deleteRun(await getClientContext(), run.id);
    console.log("Run deleted.");
}

if (require.main === module) {
    (async () => {
        try {
            await IModelHost.startup();
            await signIn();

            await main();
        }
        catch (err) {
            if (err instanceof BentleyError)
                process.stderr.write(`Error: ${err.name}: ${err.message}`);
            else
                process.stderr.write(`Unknown error: ${err.message}`);

            process.exit(err.errorNumber ?? -1);
        }
        finally {
            await IModelHost.shutdown();
        }
    })();
}