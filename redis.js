const { createClient } = require("redis");


const redClient = createClient({
  password: "QasiFDCDmdIDEh2fERpi06tqkNfFxVPP",
  socket: {
    host: "redis-11023.c11.us-east-1-2.ec2.cloud.redislabs.com",
    port: 11023,
  },
});

redClient.on("error", (err) => console.log("Redis Client Error", err));

module.exports = {
    redClient
}