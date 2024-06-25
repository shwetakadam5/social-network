const names = [
  "Aaran",
  "Aaren",
  "Aarez",
  "Aarman",
  "Aaron",
  "Aaron-James",
  "Aarron",
  "Aaryan",
  "Aaryn",
  "Aayan",
  "Aazaan",
  "Abaan",
  "Abbas",
  "Abdallah",
  "Abdalroof",
  "Abdihakim",
  "Abdirahman",
  "Abdisalam",
  "Abdul",
  "Abdul-Aziz",
  "Abdulbasir",
  "Abdulkadir",
  "Abdulkarem",
  "Smith",
  "Jones",
  "Coollastname",
  "enter_name_here",
  "Ze",
  "Zechariah",
  "Zeek",
  "Zeeshan",
  "Zeid",
  "Zein",
  "Zen",
  "Zendel",
  "Zenith",
  "Zennon",
  "Zeph",
  "Zerah",
  "Zhen",
  "Zhi",
  "Zhong",
  "Zhuo",
  "Zi",
  "Zidane",
  "Zijie",
  "Zinedine",
  "Zion",
  "Zishan",
  "Ziya",
  "Ziyaan",
  "Zohaib",
  "Zohair",
  "Zoubaeir",
  "Zubair",
  "Zubayr",
  "Zuriel",
  "Xander",
  "Jared",
  "Grace",
  "Alex",
  "Mark",
  "Tamar",
  "Farish",
  "Sarah",
  "Nathaniel",
  "Parker",
];

const domainnames = ["gmail.com", "hotmail.com", "abc.in", "abc.com", "fb.com"];

const thoughtTexts = [
  "Thoughts are words of our minds",
  "Believe you can, and you’re halfway there.",
  "We pass through this world but once.",
  "To do the useful thing, to say the courageous thing, to contemplate the beautiful thing: that is enough for one man’s life",
  "You cannot change what you are, only what you do.",
  "Before anything else, preparation is the key to success.",
  "The difference between stumbling blocks and stepping stones is how you use them.",
];

const thoughtReactions = [
  "I disagree!",
  "This was awesome",
  "Thank you for the great content",
  "Awesome",
  "perfect",
  "motivational",
];
// Get a random item given an array
const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Gets a random full name
const getRandomName = () =>
  `${getRandomArrItem(names)} ${getRandomArrItem(names)}`;

// Gets a random full name
const getRandomDomainName = () => `${getRandomArrItem(domainnames)}`;

// Function to generate random thoughts that we can add to the database. Includes reactions.
const getRandomThoughts = (int) => {
  let results = [];
  for (let i = 0; i < int; i++) {
    results.push({
      thoughtText: getRandomArrItem(thoughtTexts),
      reactions: [...getThoughtReactions(2)],
    });
  }
  return results;
};

// Create the reaction that will be added to each thought
const getThoughtReactions = (int) => {
  if (int === 1) {
    return getRandomArrItem(thoughtReactions);
  }
  let results = [];
  for (let i = 0; i < int; i++) {
    results.push({
      reactionBody: getRandomArrItem(thoughtReactions),
      username: getRandomName(),
    });
  }
  return results;
};

// Export the functions for use in seed.js
module.exports = { getRandomName, getRandomDomainName, getRandomThoughts };
