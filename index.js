const fs = require("fs");
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

// ===== CONFIG =====
const TOKEN = process.env.TOKEN;
const CLIENT_ID = "1485229970946002994";
const GUILD_ID = "1434221318005588061";

// ===== DATA =====
const FILE = "./users.json";
if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "{}");
let users = JSON.parse(fs.readFileSync(FILE));

// ===== CLIENT =====
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ===== UTILS =====
const rand = arr => arr[Math.floor(Math.random() * arr.length)];
const save = () => fs.writeFileSync(FILE, JSON.stringify(users, null, 2));

function getUser(id, name) {
  if (!users[id]) {
    users[id] = {
      name,
      score: 0,
      labels: [],
      cookies: 0,
      blacklisted: false,
      lastReply: 0
    };
  }
  return users[id];
}

// ===== LABEL SYSTEM =====
function updateLabels(user) {
  user.labels = [];

  if (user.score > 10) user.labels.push("friendly");
  if (user.score > 5) user.labels.push("loyal");
  if (user.score < -10) user.labels.push("rude");
  if (user.score < -20) user.labels.push("toxic");
  if (user.cookies > 5) user.labels.push("cookie_addict");

  if (Math.random() < 0.2) user.labels.push("chaotic");
  if (user.blacklisted) user.labels.push("blacklisted");
}

// ===== REPLIES =====
const savage = [
"You talk a lot for someone saying nothing.",
"I’ve seen better arguments from a wall.",
"You really woke up and chose to be this dull.",
"That was almost a thought. Try again.",
"You’re consistent. Consistently disappointing.",
"I don’t even need to try with you.",
"You sound like effort. I don’t like effort.",
"You bring nothing and still act confident.",
"I’d explain it to you but I don’t have the patience.",
"You’re loud without being interesting.",
"You’re not special. Just persistent.",
"That’s your best?",
"You’re making this too easy.",
"You say things like they matter.",
"I almost respected that. Almost.",
"You’re predictable.",
"You’re not even worth a full response.",
"I’ve heard worse. Not often though.",
"You really think that works.",
"You handle your own insults for me.",
"You’re background noise that refuses to stay quiet.",
"You’re trying. Not succeeding, but trying.",
"You bring confusion, not value.",
"You sound like a bad habit.",
"You’re not impressive.",
"You’re loud and wrong.",
"You’re exhausting.",
"You add nothing.",
"You’re not interesting.",
"Keep going. It’s entertaining in a sad way."
];

const flirty = [
"Careful, you’re starting to get my attention.",
"You always talk like this or just when I’m here?",
"I might like you. Don’t ruin it.",
"You’re bold. I respect that.",
"You’ve got potential. Don’t waste it.",
"I could get used to you.",
"You’re a little chaotic. I like that.",
"You’re trying to impress me.",
"I notice you more than I should.",
"You’re fun when you’re not being annoying.",
"Don’t get too comfortable.",
"You’re walking a fine line.",
"I don’t hate this.",
"You’re either clever or lucky.",
"I’m watching you.",
"You might be my favorite problem.",
"Don’t make me like you.",
"You’re getting interesting.",
"You’ve got my attention.",
"You’re different. I’ll decide if that’s good.",
"I see you.",
"You’re not boring.",
"You’re almost worth it.",
"You’re making this interesting.",
"You’re hard to ignore."
];

const sweet = [
"You’re alright. I don’t say that often.",
"That was actually decent.",
"I like this version of you.",
"You’re better when you’re like this.",
"Keep that energy.",
"I can work with this.",
"You’re improving.",
"I don’t mind you right now.",
"That was nice.",
"You’re easy to talk to sometimes.",
"I respect that.",
"That felt genuine.",
"You’re not as bad as I thought.",
"Stay like this.",
"That was good.",
"I’ll remember that.",
"You’re doing fine.",
"That worked.",
"I like that.",
"You’re okay."
];

const bored = [
"This place feels abandoned.",
"You all gave up or what.",
"I’ve seen livelier walls.",
"This is painfully quiet.",
"I refuse to carry this chat.",
"Wake up or I’m leaving.",
"This is what boredom looks like.",
"I expected nothing and still got less.",
"Say something interesting.",
"I could fall asleep here."
];

const greetings = [
"You again.",
"Hello. Try not to ruin it.",
"Hey. Keep it interesting.",
"Hi. Let’s see how this goes.",
"You showed up. Good.",
"Morning. Don’t be boring.",
"Hello. Impress me.",
"Hi. I’ll tolerate you.",
"You’re here. Noted.",
"Hey. Continue."
];

const laugh = [
"That almost got me.",
"I’ll allow it.",
"Not bad.",
"I get it.",
"You’re enjoying this too much.",
"That worked somehow.",
"You’re easily entertained.",
"That landed.",
"I expected worse.",
"I noticed."
];

const cookieReplies = [
"Another one. You’re building a problem.",
"That’s a lot of cookies.",
"You’re collecting these like it matters.",
"I’m keeping count.",
"You’re not sharing.",
"This is getting excessive.",
"You’re committed.",
"You again with cookies.",
"At this point it’s a habit.",
"Keep going. I’m judging."
];

const insultMilly = [
"Careful who you’re talking to.",
"You don’t get to talk like that.",
"Fix your tone.",
"I won’t repeat myself.",
"You’re out of line.",
"You picked the wrong target.",
"Don’t test me.",
"I can shut this down quickly.",
"You’re not in control here.",
"Watch yourself."
];

// ===== TRIGGERS =====
const triggers = {
  swearing: ["fuck","shit","wtf","hoe","whore","faggot","asshole","dumbass","idiot","moron","stfu"],
  dark: ["death","dead","die","jump","end it","life sucks"],
  bored: ["boring","dead chat","is it dead","quiet","dry chat"],
  laugh: ["lol","lmao","haha","funny","im dying"],
  greet: ["hi","hello","hey","morning","goodmorning","yo","sup"],
  cookie: ["cookie"]
};

// ===== PERSONALITY PICK =====
function pickReply(user) {
  if (user.blacklisted) {
    if (Math.random() < 0.1) return "...";
    return rand(savage);
  }

  if (user.score < -10) return rand(savage);
  if (user.score > 10) return Math.random() < 0.5 ? rand(flirty) : rand(sweet);

  const pools = [savage, flirty, sweet];
  return rand(rand(pools));
}

// ===== COMMANDS =====
const commands = [
  new SlashCommandBuilder()
    .setName("help")
    .setDescription("Milly guide"),

  new SlashCommandBuilder()
    .setName("blacklist")
    .setDescription("Toggle blacklist")
    .addUserOption(o =>
      o.setName("user")
       .setDescription("User to target")
       .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("cookies")
    .setDescription("See cookies"),

  new SlashCommandBuilder()
    .setName("tag")
    .setDescription("See labels")
    .addUserOption(o =>
      o.setName("user")
       .setDescription("User to check")
       .setRequired(false)
    )
].map(c => c.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);
(async () => {
  await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
})();

// ===== MESSAGE =====
client.on("messageCreate", async msg => {
  if (msg.author.bot) return;
if (msg.mentions.users.size > 0 && !msg.mentions.has(client.user.id)) {
  return;
}
  const content = msg.content.toLowerCase();
  const user = getUser(msg.author.id, msg.author.username);

  // cookie
  if (triggers.cookie.some(w => content.includes(w))) {
    user.cookies++;
    user.lastReply = Date.now();
    updateLabels(user);
    save();
    return msg.reply(rand(cookieReplies));
  }

  // insult milly
  if (content.includes("mili") && triggers.swearing.some(w => content.includes(w))) {
    user.score -= 5;
    updateLabels(user);
    save();
    return msg.reply(rand(insultMilly));
  }

  // greet
 // greet
if (triggers.greet.some(w => content.includes(w))) {
  user.score += 1; 
  user.lastReply = Date.now();
  updateLabels(user);
  save();
  return msg.reply(rand(greetings));
}

  // laugh
  if (triggers.laugh.some(w => content.includes(w))) {
    user.lastReply = Date.now();
    return msg.reply(rand(laugh));
  }

  // bored
  if (triggers.bored.some(w => content.includes(w))) {
    user.lastReply = Date.now();
    return msg.reply(rand(bored));
  }

  // direct call
  if (content.includes("mili")) {
    user.lastReply = Date.now();
    return msg.reply(pickReply(user));
  }

  // random
// random
if (Math.random() < 0.25 && msg.mentions.users.size === 0) {
  user.lastReply = Date.now();
  return msg.reply(pickReply(user));
}

  save();
});

// ===== SLASH =====
client.on("interactionCreate", async i => {
  if (!i.isChatInputCommand()) return;

  if (i.commandName === "help") {
    return i.reply("Talk to Milly. She reacts, remembers, and judges.");
  }

  if (i.commandName === "blacklist") {
    const u = i.options.getUser("user");
    const t = getUser(u.id, u.username);
    t.blacklisted = !t.blacklisted;
    save();
    return i.reply(`${u.username} blacklist: ${t.blacklisted}`);
  }

  if (i.commandName === "cookies") {
    const u = getUser(i.user.id, i.user.username);
    return i.reply(`You have ${u.cookies} cookies`);
  }

  if (i.commandName === "tag") {
    const u = i.options.getUser("user") || i.user;
    const d = getUser(u.id, u.username);
    return i.reply(`Score: ${d.score}\nLabels: ${d.labels.join(", ") || "none"}`);
  }
});

// ===== READY =====
client.once("ready", () => {
  console.log(`Milly online as ${client.user.tag}`);
});

// ===== LOCK =====
client.on("guildCreate", g => {
  if (g.id !== GUILD_ID) g.leave();
});

client.login(TOKEN);
