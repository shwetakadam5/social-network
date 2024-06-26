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

  const userData = await User.insertMany(users);
  const updatedThoughts = [];
  for (let index = 0; index < thoughts.length; index++) {
    const element = thoughts[index];
    element.username = userData[Math.floor(Math.random() * 20)]._id;
    for (let i = 0; i < element.reactions.length; i++) {
      element.reactions[i].username =
        userData[Math.floor(Math.random() * 20)]._id;
    }
    updatedThoughts.push(element);
  }

  const thoughtData = await Thought.insertMany(updatedThoughts);

  for (let jindex = 0; jindex < thoughtData.length; jindex++) {
    for (let index = 0; index < userData.length; index++) {
      if (
        thoughtData[jindex].username.toString() ===
        userData[index]._id.toString()
      ) {
        await User.findByIdAndUpdate(userData[index]._id, {
          $push: {
            thoughts: thoughtData[jindex],
          },
        });
        break;
      }
    }
  }
  console.table(users);
  console.table(thoughts);
  console.info("Seeding complete! 🌱");
  process.exit(0);
});
