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

// ================= CONFIG =================
const TOKEN = process.env.TOKEN;
const CLIENT_ID = "1485229970946002994";
const GUILD_ID = "1434221318005588061";
const CHANNEL_ID = "1475491309245435994";

const FLAG_INTERVAL = 40 * 60 * 1000;
const ROUND_TIME = 30 * 1000;

// ================= CLIENT =================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ================= SLASH COMMANDS =================
const commands = [
  new SlashCommandBuilder().setName("profile").setDescription("See your personality stats"),
  new SlashCommandBuilder()
    .setName("vibe")
    .setDescription("Check someone's vibe")
    .addUserOption(o => o.setName("user").setDescription("User").setRequired(false)),
  new SlashCommandBuilder().setName("leaderboard").setDescription("Top flag players"),
  new SlashCommandBuilder()
    .setName("mode")
    .setDescription("Set difficulty")
    .addStringOption(o =>
      o.setName("type")
        .setDescription("easy or hard")
        .setRequired(true)
        .addChoices(
          { name: "easy", value: "easy" },
          { name: "hard", value: "hard" }
        )
    ),
  new SlashCommandBuilder().setName("help").setDescription("How to use Mili")
].map(c => c.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);
(async () => {
  try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log("Slash commands ready");
  } catch (e) {
    console.error(e);
  }
})();

// ================= DATA =================
let scores = fs.existsSync("scores.json") ? JSON.parse(fs.readFileSync("scores.json")) : {};
let userStats = fs.existsSync("users.json") ? JSON.parse(fs.readFileSync("users.json")) : {};
let streaks = {};
let mode = "easy";

// ================= FLAGS =================
const flags = [
{ name:"afghanistan",aliases:[],url:"https://flagcdn.com/w320/af.png"},
{ name:"albania",aliases:[],url:"https://flagcdn.com/w320/al.png"},
{ name:"algeria",aliases:[],url:"https://flagcdn.com/w320/dz.png"},
{ name:"andorra",aliases:[],url:"https://flagcdn.com/w320/ad.png"},
{ name:"angola",aliases:[],url:"https://flagcdn.com/w320/ao.png"},
{ name:"argentina",aliases:[],url:"https://flagcdn.com/w320/ar.png"},
{ name:"armenia",aliases:[],url:"https://flagcdn.com/w320/am.png"},
{ name:"australia",aliases:[],url:"https://flagcdn.com/w320/au.png"},
{ name:"austria",aliases:[],url:"https://flagcdn.com/w320/at.png"},
{ name:"azerbaijan",aliases:[],url:"https://flagcdn.com/w320/az.png"},
{ name:"brazil",aliases:[],url:"https://flagcdn.com/w320/br.png"},
{ name:"canada",aliases:[],url:"https://flagcdn.com/w320/ca.png"},
{ name:"china",aliases:[],url:"https://flagcdn.com/w320/cn.png"},
{ name:"france",aliases:[],url:"https://flagcdn.com/w320/fr.png"},
{ name:"germany",aliases:[],url:"https://flagcdn.com/w320/de.png"},
{ name:"india",aliases:[],url:"https://flagcdn.com/w320/in.png"},
{ name:"italy",aliases:[],url:"https://flagcdn.com/w320/it.png"},
{ name:"japan",aliases:[],url:"https://flagcdn.com/w320/jp.png"},
{ name:"lebanon",aliases:[],url:"https://flagcdn.com/w320/lb.png"},
{ name:"mexico",aliases:[],url:"https://flagcdn.com/w320/mx.png"},
{ name:"russia",aliases:[],url:"https://flagcdn.com/w320/ru.png"},
{ name:"saudi arabia",aliases:[],url:"https://flagcdn.com/w320/sa.png"},
{ name:"south korea",aliases:["korea"],url:"https://flagcdn.com/w320/kr.png"},
{ name:"spain",aliases:[],url:"https://flagcdn.com/w320/es.png"},
{ name:"turkey",aliases:[],url:"https://flagcdn.com/w320/tr.png"},
{ name:"united kingdom",aliases:["uk","britain"],url:"https://flagcdn.com/w320/gb.png"},
{ name:"united states",aliases:["usa","us"],url:"https://flagcdn.com/w320/us.png"}
];

// ================= FLAG GAME =================
let currentFlag = null;
let roundActive = false;
let currentMessage = null;

async function startRound() {
  if (roundActive) return;

  const channel = await client.channels.fetch(CHANNEL_ID);
  const flag = flags[Math.floor(Math.random() * flags.length)];

  currentFlag = flag;
  roundActive = true;

  const embed = new EmbedBuilder()
    .setTitle(`🌍 Guess the flag (${mode})`)
    .setImage(flag.url)
    .setColor(Colors.Blue);

  currentMessage = await channel.send({ embeds: [embed] });

  setTimeout(endRound, ROUND_TIME);
}

async function endRound() {
  if (!roundActive) return;

  roundActive = false;

  const embed = new EmbedBuilder()
    .setTitle("⏰ Time's up")
    .setDescription(`Answer: ${currentFlag.name}`)
    .setImage(currentMessage.embeds[0].image.url);

  await currentMessage.edit({ embeds: [embed] });
  currentFlag = null;
}

// ================= AI =================
const swearWords = ["fuck","shit","wtf"];
const mentionReplies = ["what do you need","I’m here","what.","you again","make it quick"];
const insultReplies = ["watch how you talk to me.","you’re getting bold.","say it again."];
const loveReplies = ["noted.","that’s unfortunate.","you’ll survive."];

const random = arr => arr[Math.floor(Math.random()*arr.length)];

// ================= MESSAGE =================
client.on("messageCreate", async msg => {
  if (msg.author.bot) return;

  const content = msg.content.toLowerCase().trim();

  // ===== FLAG SYSTEM FIRST =====
  if (roundActive && currentFlag) {
    if (
      content === currentFlag.name ||
      currentFlag.aliases.includes(content)
    ) {
      roundActive = false;

      const id = msg.author.id;
      streaks[id] = (streaks[id] || 0) + 1;

      const points = streaks[id] >= 3 ? 2 : 1;
      scores[id] = (scores[id] || 0) + points;

      fs.writeFileSync("scores.json", JSON.stringify(scores, null, 2));

      await msg.react("✅");

      const embed = new EmbedBuilder()
        .setTitle("🏆 Correct!")
        .setDescription(`${msg.author} got it!\n+${points} points`)
        .setColor(Colors.Green)
        .setImage(currentMessage.embeds[0].image.url);

      await currentMessage.edit({ embeds: [embed] });

      currentFlag = null;
      return;
    } else {
      await msg.react("❌");
    }
  }

  // ===== AI AFTER =====
  if (content.includes("mili") && swearWords.some(w => content.includes(w))) {
    return msg.channel.send(random(insultReplies));
  }

  if (content.includes("i love you mili") || content.includes("ily mili")) {
    return msg.channel.send(random(loveReplies));
  }

  if (content.includes("mili")) {
    return msg.channel.send(random(mentionReplies));
  }
});

// ================= SLASH =================
client.on("interactionCreate", async i => {
  if (!i.isChatInputCommand()) return;

  if (i.commandName === "profile") {
    const u = userStats[i.user.id] || {msgs:0,swears:0,laughs:0};
    return i.reply(`Messages: ${u.msgs}\nSwears: ${u.swears}\nLaughs: ${u.laughs}`);
  }

  if (i.commandName === "leaderboard") {
    const sorted = Object.entries(scores).sort((a,b)=>b[1]-a[1]).slice(0,5);
    return i.reply(sorted.map(([id,s],i)=>`${i+1}. <@${id}> - ${s}`).join("\n") || "No scores");
  }

  if (i.commandName === "mode") {
    mode = i.options.getString("type");
    return i.reply(`Mode set to ${mode}`);
  }

  if (i.commandName === "help") {
    return i.reply("Say mili to interact. Guess flags to win.");
  }
});

// ================= READY =================
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  startRound();
  setInterval(startRound, FLAG_INTERVAL);
});

// ================= PROTECTION =================
client.on("guildCreate", guild => {
  if (guild.id !== GUILD_ID) guild.leave();
});

client.login(TOKEN);
