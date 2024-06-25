const connection = require("../config/connection");

const { User, Thought, Reaction } = require("../models");
const {
  getRandomName,
  getRandomDomainName,
  getRandomThoughts,
} = require("./data");

connection.on("error", (err) => err);
connection.once("open", async () => {
  console.log("connected");

  let thoughtCheck = await connection.db
    .listCollections({ name: "thoughts" })
    .toArray();

  if (thoughtCheck.length) {
    await connection.dropCollection("thoughts");
  }

  let userCheck = await connection.db
    .listCollections({ name: "users" })
    .toArray();
  if (userCheck.length) {
    await connection.dropCollection("users");
  }

  const users = [];

  const thoughts = getRandomThoughts(5);

  for (let i = 0; i < 20; i++) {
    const username = getRandomName();
    const first = username.split(" ")[0];
    const last = username.split(" ")[1];
    const email = (
      first +
      "." +
      last +
      Math.floor(Math.random() * (99 - 18 + 1) + 18) +
      "@" +
      getRandomDomainName()
    ).toLowerCase();

    console.log(email);

    users.push({
      username,
      email,
    });
  }

  await User.insertMany(users);
  await Thought.insertMany(thoughts);

  console.table(users);
  console.table(thoughts);

  console.info("Seeding complete! 🌱");
  process.exit(0);
});
