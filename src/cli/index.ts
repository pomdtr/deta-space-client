import yargs from "yargs";
import { SpaceClient } from "..";
import fs from "fs";

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
        const spaceclient = SpaceClient(argv.accessToken);
        const res = await spaceclient.get(argv.endpoint);
        console.log(res);
      } catch (e) {
        console.error((e as Error).message);
        process.exit(1);
      }
    }
  )
  .command(
    "post <endpoint> <body>",
    "Do a POST request",
    (yargs) => {
      return yargs
        .positional("endpoint", {
          describe: "The endpoint to POST",
          type: "string",
          demandOption: true,
        })
        .positional("body", {
          describe: "The body to POST. Use - to read from stdin",
          type: "string",
          demandOption: true,
        });
    },
    async (argv) => {
      try {
        const spaceclient = SpaceClient(argv.accessToken);
        const body =
          argv.body === "-"
            ? await fs.readFileSync(process.stdin.fd, "utf-8")
            : argv.body;

        const res = await spaceclient.post(argv.endpoint, body);
        console.log(res);
      } catch (e) {
        console.error((e as Error).message);
        process.exit(1);
      }
    }
  )
  .demandCommand()
  .help()
  .strict()
  .parse();
