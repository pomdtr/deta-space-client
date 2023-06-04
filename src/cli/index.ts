#!/usr/bin/env node

import yargs from "yargs";
import { SpaceClient } from "..";
import fs from "fs";
import path from "path";
import os from "os";

function findAccessToken() {
  if (process.env.DETA_SPACE_TOKEN) {
    return process.env.DETA_SPACE_TOKEN;
  }

  const cliTokenPath = path.join(os.homedir(), ".detaspace", "space_tokens");
  if (!fs.existsSync(cliTokenPath)) {
    return;
  }

  try {
    const tokens = JSON.parse(fs.readFileSync(cliTokenPath, "utf-8"));
    return tokens["access_token"];
  } catch (e) {
    return;
  }
}

yargs(process.argv.slice(2))
  .option("access-token", {
    type: "string",
    description: "The space access token",
  })
  .command(
    "get <endpoint>",
    "Do a GET request",
    (yargs) => {
      return yargs.positional("endpoint", {
        describe: "The endpoint to GET",
        type: "string",
        demandOption: true,
      });
    },
    async (argv) => {
      try {
        let accessToken = argv.accessToken;
        if (!accessToken) {
          accessToken = findAccessToken();
        }

        const spaceclient = SpaceClient(accessToken);
        const res = await spaceclient.get(argv.endpoint);
        try {
          console.log(JSON.stringify(await res.json(), null, 2));
        } catch (e) {
          console.log(res.text());
        }
      } catch (e) {
        console.error((e as Error).message);
        process.exit(1);
      }
    }
  )
  .command(
    "post <endpoint>",
    "Do a POST request",
    (yargs) => {
      return yargs
        .positional("endpoint", {
          describe: "The endpoint to POST",
          type: "string",
          demandOption: true,
        })
        .option("stdin", {
          type: "boolean",
          description: "Read the body from stdin",
        });
    },
    async (argv) => {
      try {
        let accessToken = argv.accessToken;
        if (!accessToken) {
          accessToken = findAccessToken();
        }

        const spaceclient = SpaceClient(accessToken);

        let res: Response;
        if (argv.stdin) {
          const body = await fs.readFileSync(process.stdin.fd, "utf-8");
          res = await spaceclient.post(argv.endpoint, body);
        } else {
          res = await spaceclient.post(argv.endpoint);
        }

        try {
          console.log(JSON.stringify(await res.json(), null, 2));
        } catch (e) {
          console.log(res.text());
        }
      } catch (e) {
        console.error((e as Error).message);
        process.exit(1);
      }
    }
  )
  .demandCommand()
  .help()
  .strict()
  .detectLocale(false)
  .parse();
