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
const GUILD_ID = "1434221318005588061"; // YOUR SERVER ONLY
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
  new SlashCommandBuilder()
    .setName("profile")
    .setDescription("See your personality stats"),

  new SlashCommandBuilder()
    .setName("vibe")
    .setDescription("Check someone's vibe")
    .addUserOption(option =>
      option.setName("user").setDescription("User").setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Top flag players"),

  new SlashCommandBuilder()
    .setName("mode")
    .setDescription("Set difficulty")
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
].map(c => c.toJSON());

// REGISTER COMMANDS (GUILD ONLY = FAST)
const rest = new REST({ version: "10" }).setToken(TOKEN);
(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
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

// ================= FLAGS (FULL) =================
const flags = [
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
{ name:"bahamas",aliases:[],url:"https://flagcdn.com/w320/bs.png"},
{ name:"bahrain",aliases:[],url:"https://flagcdn.com/w320/bh.png"},
{ name:"bangladesh",aliases:[],url:"https://flagcdn.com/w320/bd.png"},
{ name:"barbados",aliases:[],url:"https://flagcdn.com/w320/bb.png"},
{ name:"belarus",aliases:[],url:"https://flagcdn.com/w320/by.png"},
{ name:"belgium",aliases:[],url:"https://flagcdn.com/w320/be.png"},
{ name:"belize",aliases:[],url:"https://flagcdn.com/w320/bz.png"},
{ name:"benin",aliases:[],url:"https://flagcdn.com/w320/bj.png"},
{ name:"bhutan",aliases:[],url:"https://flagcdn.com/w320/bt.png"},
{ name:"bolivia",aliases:[],url:"https://flagcdn.com/w320/bo.png"},
{ name:"bosnia and herzegovina",aliases:[],url:"https://flagcdn.com/w320/ba.png"},
{ name:"botswana",aliases:[],url:"https://flagcdn.com/w320/bw.png"},
{ name:"brazil",aliases:[],url:"https://flagcdn.com/w320/br.png"},
{ name:"brunei",aliases:[],url:"https://flagcdn.com/w320/bn.png"},
{ name:"bulgaria",aliases:[],url:"https://flagcdn.com/w320/bg.png"},
{ name:"burkina faso",aliases:[],url:"https://flagcdn.com/w320/bf.png"},
{ name:"burundi",aliases:[],url:"https://flagcdn.com/w320/bi.png"},
{ name:"cambodia",aliases:[],url:"https://flagcdn.com/w320/kh.png"},
{ name:"cameroon",aliases:[],url:"https://flagcdn.com/w320/cm.png"},
{ name:"canada",aliases:[],url:"https://flagcdn.com/w320/ca.png"},
{ name:"chile",aliases:[],url:"https://flagcdn.com/w320/cl.png"},
{ name:"china",aliases:[],url:"https://flagcdn.com/w320/cn.png"},
{ name:"colombia",aliases:[],url:"https://flagcdn.com/w320/co.png"},
{ name:"costa rica",aliases:[],url:"https://flagcdn.com/w320/cr.png"},
{ name:"croatia",aliases:[],url:"https://flagcdn.com/w320/hr.png"},
{ name:"cuba",aliases:[],url:"https://flagcdn.com/w320/cu.png"},
{ name:"cyprus",aliases:[],url:"https://flagcdn.com/w320/cy.png"},
{ name:"czech republic",aliases:["czechia"],url:"https://flagcdn.com/w320/cz.png"},
{ name:"denmark",aliases:[],url:"https://flagcdn.com/w320/dk.png"},
{ name:"dominican republic",aliases:[],url:"https://flagcdn.com/w320/do.png"},
{ name:"ecuador",aliases:[],url:"https://flagcdn.com/w320/ec.png"},
{ name:"egypt",aliases:[],url:"https://flagcdn.com/w320/eg.png"},
{ name:"estonia",aliases:[],url:"https://flagcdn.com/w320/ee.png"},
{ name:"ethiopia",aliases:[],url:"https://flagcdn.com/w320/et.png"},
{ name:"finland",aliases:[],url:"https://flagcdn.com/w320/fi.png"},
{ name:"france",aliases:[],url:"https://flagcdn.com/w320/fr.png"},
{ name:"georgia",aliases:[],url:"https://flagcdn.com/w320/ge.png"},
{ name:"germany",aliases:[],url:"https://flagcdn.com/w320/de.png"},
{ name:"ghana",aliases:[],url:"https://flagcdn.com/w320/gh.png"},
{ name:"greece",aliases:[],url:"https://flagcdn.com/w320/gr.png"},
{ name:"hungary",aliases:[],url:"https://flagcdn.com/w320/hu.png"},
{ name:"iceland",aliases:[],url:"https://flagcdn.com/w320/is.png"},
{ name:"india",aliases:[],url:"https://flagcdn.com/w320/in.png"},
{ name:"indonesia",aliases:[],url:"https://flagcdn.com/w320/id.png"},
{ name:"iran",aliases:[],url:"https://flagcdn.com/w320/ir.png"},
{ name:"iraq",aliases:[],url:"https://flagcdn.com/w320/iq.png"},
{ name:"ireland",aliases:[],url:"https://flagcdn.com/w320/ie.png"},
{ name:"israel",aliases:[],url:"https://flagcdn.com/w320/il.png"},
{ name:"italy",aliases:[],url:"https://flagcdn.com/w320/it.png"},
{ name:"jamaica",aliases:[],url:"https://flagcdn.com/w320/jm.png"},
{ name:"japan",aliases:[],url:"https://flagcdn.com/w320/jp.png"},
{ name:"jordan",aliases:[],url:"https://flagcdn.com/w320/jo.png"},
{ name:"kazakhstan",aliases:[],url:"https://flagcdn.com/w320/kz.png"},
{ name:"kenya",aliases:[],url:"https://flagcdn.com/w320/ke.png"},
{ name:"kuwait",aliases:[],url:"https://flagcdn.com/w320/kw.png"},
{ name:"lebanon",aliases:[],url:"https://flagcdn.com/w320/lb.png"},
{ name:"libya",aliases:[],url:"https://flagcdn.com/w320/ly.png"},
{ name:"lithuania",aliases:[],url:"https://flagcdn.com/w320/lt.png"},
{ name:"luxembourg",aliases:[],url:"https://flagcdn.com/w320/lu.png"},
{ name:"malaysia",aliases:[],url:"https://flagcdn.com/w320/my.png"},
{ name:"mexico",aliases:[],url:"https://flagcdn.com/w320/mx.png"},
{ name:"morocco",aliases:[],url:"https://flagcdn.com/w320/ma.png"},
{ name:"netherlands",aliases:[],url:"https://flagcdn.com/w320/nl.png"},
{ name:"new zealand",aliases:[],url:"https://flagcdn.com/w320/nz.png"},
{ name:"nigeria",aliases:[],url:"https://flagcdn.com/w320/ng.png"},
{ name:"north korea",aliases:["dprk"],url:"https://flagcdn.com/w320/kp.png"},
{ name:"norway",aliases:[],url:"https://flagcdn.com/w320/no.png"},
{ name:"oman",aliases:[],url:"https://flagcdn.com/w320/om.png"},
{ name:"pakistan",aliases:[],url:"https://flagcdn.com/w320/pk.png"},
{ name:"peru",aliases:[],url:"https://flagcdn.com/w320/pe.png"},
{ name:"philippines",aliases:[],url:"https://flagcdn.com/w320/ph.png"},
{ name:"poland",aliases:[],url:"https://flagcdn.com/w320/pl.png"},
{ name:"portugal",aliases:[],url:"https://flagcdn.com/w320/pt.png"},
{ name:"qatar",aliases:[],url:"https://flagcdn.com/w320/qa.png"},
{ name:"romania",aliases:[],url:"https://flagcdn.com/w320/ro.png"},
{ name:"russia",aliases:[],url:"https://flagcdn.com/w320/ru.png"},
{ name:"saudi arabia",aliases:[],url:"https://flagcdn.com/w320/sa.png"},
{ name:"serbia",aliases:[],url:"https://flagcdn.com/w320/rs.png"},
{ name:"singapore",aliases:[],url:"https://flagcdn.com/w320/sg.png"},
{ name:"slovakia",aliases:[],url:"https://flagcdn.com/w320/sk.png"},
{ name:"slovenia",aliases:[],url:"https://flagcdn.com/w320/si.png"},
{ name:"south africa",aliases:[],url:"https://flagcdn.com/w320/za.png"},
{ name:"south korea",aliases:["korea"],url:"https://flagcdn.com/w320/kr.png"},
{ name:"spain",aliases:[],url:"https://flagcdn.com/w320/es.png"},
{ name:"sweden",aliases:[],url:"https://flagcdn.com/w320/se.png"},
{ name:"switzerland",aliases:[],url:"https://flagcdn.com/w320/ch.png"},
{ name:"syria",aliases:[],url:"https://flagcdn.com/w320/sy.png"},
{ name:"thailand",aliases:[],url:"https://flagcdn.com/w320/th.png"},
{ name:"tunisia",aliases:[],url:"https://flagcdn.com/w320/tn.png"},
{ name:"turkey",aliases:[],url:"https://flagcdn.com/w320/tr.png"},
{ name:"ukraine",aliases:[],url:"https://flagcdn.com/w320/ua.png"},
{ name:"united arab emirates",aliases:["uae"],url:"https://flagcdn.com/w320/ae.png"},
{ name:"united kingdom",aliases:["uk","britain"],url:"https://flagcdn.com/w320/gb.png"},
{ name:"united states",aliases:["usa","us"],url:"https://flagcdn.com/w320/us.png"},
{ name:"vietnam",aliases:[],url:"https://flagcdn.com/w320/vn.png"}
];

// ================= FLAG GAME =================
let currentFlag = null;
let roundActive = false;
let currentMessage = null;

function getHint(name) {
  return mode === "easy"
    ? `💡 Starts with ${name[0].toUpperCase()} (${name.length} letters)`
    : `💡 First letter: ${name[0].toUpperCase()}`;
}

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
}

// ================= AI =================
const swearWords = ["fuck","shit","wtf"];
const laughWords = ["lol","lmao","haha"];

const mentionReplies = ["what do you need","I’m here","what.","you again","make it quick"];
const insultReplies = ["watch how you talk to me.","you’re getting bold.","say it again."];
const loveReplies = ["noted.","that’s unfortunate.","you’ll survive."];

const random = arr => arr[Math.floor(Math.random()*arr.length)];

// ================= MESSAGE =================
client.on("messageCreate", async msg => {
  if (msg.author.bot) return;

  const content = msg.content.toLowerCase();

  // stats
  if (!userStats[msg.author.id]) userStats[msg.author.id] = {msgs:0,swears:0,laughs:0};
  userStats[msg.author.id].msgs++;
  if (swearWords.some(w=>content.includes(w))) userStats[msg.author.id].swears++;
  if (laughWords.some(w=>content.includes(w))) userStats[msg.author.id].laughs++;
  fs.writeFileSync("users.json", JSON.stringify(userStats,null,2));

  // mili logic
  if (content.includes("mili") && swearWords.some(w=>content.includes(w))) {
    return msg.channel.send(random(insultReplies));
  }

  if (content.includes("i love you mili") || content.includes("ily mili")) {
    return msg.channel.send(random(loveReplies));
  }

  if (content.includes("mili")) {
    return msg.channel.send(random(mentionReplies));
  }

  // FLAG GUESS
  if (roundActive && (content === currentFlag.name || currentFlag.aliases.includes(content))) {
    roundActive = false;

    const id = msg.author.id;
    streaks[id] = (streaks[id] || 0) + 1;
    const points = streaks[id] >= 3 ? 2 : 1;

    scores[id] = (scores[id] || 0) + points;
    fs.writeFileSync("scores.json", JSON.stringify(scores,null,2));

    msg.channel.send(`🏆 ${msg.author} got it! (+${points})`);
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
    return i.reply(`Say mili to talk. Play flags automatically.`);
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
