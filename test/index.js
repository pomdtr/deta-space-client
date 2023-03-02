const { DetaSpaceClient } = require("../dist/index.js");

const client = DetaSpaceClient();
client
  .get("/v0/collections")
  .then((res) => res.json())
  .then((payload) => {
    console.log(payload);
  })
  .catch((err) => {
    console.error(err);
  });
