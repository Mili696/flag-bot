const fs = require("fs");
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  Colors,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const CHANNEL_ID = "1475491309245435994";
const CLIENT_ID = "1485229970946002994"; // CHANGE THIS

// ================= SLASH COMMANDS =================
const commands = [
  new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Show your personality profile"),

  new SlashCommandBuilder()
    .setName("vibe")
    .setDescription("Check someone's vibe")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("User to check")
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Show flag leaderboard"),

  new SlashCommandBuilder()
    .setName("mode")
    .setDescription("Change difficulty mode")
    .addStringOption(option =>
      option.setName("type")
        .setDescription("easy or hard")
        .setRequired(true)
        .addChoices(
          { name: "easy", value: "easy" },
          { name: "hard", value: "hard" }
        )
    ),

  new SlashCommandBuilder()
    .setName("help")
    .setDescription("How to use Mili")
].map(cmd => cmd.toJSON());

// deploy commands
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
(async () => {
  try {
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log("Slash commands registered");
  } catch (err) {
    console.error(err);
  }
})();

// ================= AI SYSTEM =================
let greetingCount = 0;
let laughCount = 0;

const swearWords = ["fuck","shit","wtf"];
const laughWords = ["lol","lmao","haha"];

const mentionReplies = [
  "what do you need","I’m here","what.","you again",
  "make it quick","this better be important",
  "this feels illegal","no","ask someone else","processing… nope"
];

const insultReplies = [
  "watch how you talk to me.","you’re getting bold.",
  "say it again.","careful.","you don’t talk like that twice."
];

const greetingReplies = ["hello human","yo","hey.","hi.","bye.","not now."];
const laughReplies = ["was it that funny","bro is laughing alone","ok comedian"];

const random = arr => arr[Math.floor(Math.random()*arr.length)];

// ================= PERSONALITY =================
let userStats = {};

if (fs.existsSync("users.json")) {
  userStats = JSON.parse(fs.readFileSync("users.json"));
}

function updateUser(id, content) {
  if (!userStats[id]) {
    userStats[id] = { msgs: 0, swears: 0, laughs: 0 };
  }

  userStats[id].msgs++;

  if (swearWords.some(w => content.includes(w))) userStats[id].swears++;
  if (laughWords.some(w => content.includes(w))) userStats[id].laughs++;

  fs.writeFileSync("users.json", JSON.stringify(userStats, null, 2));
}

// ================= FLAGS =================
const flags = [
{ name:"lebanon",aliases:[],url:"https://flagcdn.com/w320/lb.png"},
{ name:"france",aliases:[],url:"https://flagcdn.com/w320/fr.png"},
{ name:"germany",aliases:[],url:"https://flagcdn.com/w320/de.png"},
{ name:"brazil",aliases:[],url:"https://flagcdn.com/w320/br.png"},
{ name:"japan",aliases:[],url:"https://flagcdn.com/w320/jp.png"},
{ name:"usa",aliases:["united states"],url:"https://flagcdn.com/w320/us.png"}
];

let currentFlag=null;
let roundActive=false;
let scores={};

if (fs.existsSync("scores.json")) {
  scores = JSON.parse(fs.readFileSync("scores.json"));
}

// ================= MESSAGE =================
client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  const content = msg.content.toLowerCase();
  updateUser(msg.author.id, content);

  // insult mili
  if (content.includes("mili") && swearWords.some(w => content.includes(w))) {
    return msg.channel.send(random(insultReplies));
  }

  // mention mili
  if (content.includes("mili")) {
    return msg.channel.send(random(mentionReplies));
  }

  // greeting
  if (["hi","hello","hey"].includes(content)) {
    greetingCount++;
    if (greetingCount >= 5) {
      greetingCount = 0;
      return msg.channel.send(random(greetingReplies));
    }
  }

  // laugh
  if (laughWords.some(w => content.includes(w))) {
    laughCount++;
    if (laughCount >= 3) {
      laughCount = 0;
      return msg.channel.send(random(laughReplies));
    }
  }
});

// ================= SLASH HANDLER =================
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const userId = interaction.user.id;

  if (interaction.commandName === "profile") {
    const u = userStats[userId] || { msgs:0, swears:0, laughs:0 };

    return interaction.reply(
      `🧠 Profile:\nMessages: ${u.msgs}\nSwears: ${u.swears}\nLaughs: ${u.laughs}`
    );
  }

  if (interaction.commandName === "vibe") {
    const user = interaction.options.getUser("user") || interaction.user;
    return interaction.reply(`${user} is chaotic energy.`);
  }

  if (interaction.commandName === "leaderboard") {
    const sorted = Object.entries(scores).sort((a,b)=>b[1]-a[1]).slice(0,5);
    if (!sorted.length) return interaction.reply("No scores yet.");

    return interaction.reply(
      sorted.map(([id,s],i)=>`${i+1}. <@${id}> - ${s}`).join("\n")
    );
  }

  if (interaction.commandName === "mode") {
    const type = interaction.options.getString("type");
    return interaction.reply(`Mode set to ${type}`);
  }

  if (interaction.commandName === "help") {
    return interaction.reply(
`🤖 Mili Guide:
- Say "mili" to talk
- Swear at mili = risky
- /profile → your stats
- /vibe → user vibe
- /leaderboard → scores
- /mode → difficulty`
    );
  }
});

// ================= READY =================
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.user.setPresence({
    activities: [{ name: "Guess flags 🌍" }],
    status: "online"
  });
});

// ================= PROTECTION =================
client.on("guildCreate", (guild) => {
  const allowed = "1434221318005588061";
  if (guild.id !== allowed) guild.leave();
});

client.login(process.env.TOKEN);
