const { SpaceClient } = require("../dist/index.js");

const client = SpaceClient();
client
  .get("/collections")
  .then((res) => res.json())
  .then((payload) => {
    console.log(payload);
  })
  .catch((err) => {
    console.error(err);
  });
