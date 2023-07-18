# Deta Space Client

An fetch function for deta space

## Usage

See the [Authentication Doc](https://deta.space/docs/en/basics/cli/#authentication) for more information on how to get your access token.

```js
import { fetchFn } from "deta-space-client";

// Provide your access token
const fetchFromSpace = fetchFn(process.env.DETA_SPACE_TOKEN);

fetch("/instances").then((response) => {
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
