# Deta Space Client

An unofficial client for the Deta Space API.

## Usage

See the [Authentication Doc](https://deta.space/docs/en/basics/cli/#authentication) for more information on how to get your access token.

```js
import DetaSpaceClient from "deta-space-client";

// Provide your access token
const spaceClient = DetaSpaceClient("my-access-token");

// Alternatively, you can provide your access token using the DETA_SPACE_TOKEN environment variable
const spaceClientFromEnv = DetaSpaceClient(); // will throw an error if DETA_SPACE_TOKEN is not set

spaceClient.get("/endpoint").then((response) => {
  console.log(response);
});
```

## CLI

```txt
space-client <command>

Commands:
  index.js get <endpoint>   Do a GET request
  index.js post <endpoint>  Do a POST request

Options:
  --version       Show version number                                  [boolean]
  --access-token  The space access token                                [string]
  --help          Show help                                            [boolean]
```
