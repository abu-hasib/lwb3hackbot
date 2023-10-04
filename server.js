require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const fcl = require("@onflow/fcl");
const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
const token = process.env.DISCORD_TOKEN;
const { createClient, SchemaFieldTypes } = require("redis");
const { redClient } = require("./redis");


const client = new Client({ intents: [GatewayIntentBits.Guilds] });

fcl.config({
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": `https://fcl-discovery.onflow.org/f8d6e0586b0a20c7/authn`,
});

client.cooldowns = new Collection();
client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(token);

module.exports = { client };

async function runFcl() {
  await redClient.connect();
  // await redClient.set("key", "value");
  // const value = await redClient.get("key");
  // console.log({ value });

  // try {
  //   await redClient.ft.create(
  //     "idx:files",
  //     {
  //       "$.username": {
  //         type: SchemaFieldTypes.TEXT,
  //         SORTABLE: true,
  //       },
  //       "$.id": {
  //         type: SchemaFieldTypes.NUMERIC,
  //         AS: "id",
  //       },
  //       "$.url": {
  //         type: SchemaFieldTypes.TEXT,
  //       },
  //     },
  //     {
  //       ON: "JSON",
  //       PREFIX: "file:",
  //     }
  //   );
  // } catch (e) {
  //   if (e.message === "Index already exists") {
  //     console.log("Index exists already, skipped creation.");
  //   } else {
  //     // Something went wrong, perhaps RediSearch isn't installed...
  //     console.error("error here");
  //     console.error(e);
  //     process.exit(1);
  //   }
  // }

//   await Promise.all([
//     redClient.json.set('file:1', '$', {
//         "username": "abuhasib",
//         "id": 90,
//         "url": "http://localhost:3000",
//         "bot": "bolda"
//     }),
//     redClient.json.set('file:2', '$', {
//         "username": "edenz",
//         "id": 90,
//         "url": "http://localhost:3000",
//         "bot": "bolda"
//     }),
//     redClient.json.set('file:3', '$', {
//       "username": "pozoo",
//       "id": 24,
//       "url": "http://localhost:3000",
//       "bot": "bolda"
//     }),
// ]);

let result = await redClient.ft.search(
  'idx:files',
  'abuhasib'
);
console.log(JSON.stringify(result, null, 2));

// result = await redClient.ft.search(
//   'idx:users',
//   'Paul @age:[30 40]',
//   {
//       RETURN: ['$.city']
//   }
// );
// console.log(JSON.stringify(result, null, 2));

  const res = await fcl.query({
    cadence: `
      import CryptoPoops from 0x2cd15cc7890127f9
  
      pub fun main(): UInt64 {
        return CryptoPoops.totalSupply
      }
  `,
  });
}

runFcl();
