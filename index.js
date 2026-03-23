const fs = require("fs");
const { 
  Client, 
  GatewayIntentBits, 
  EmbedBuilder, 
  Colors 
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const CHANNEL_ID = "1475491309245435994";
const FLAG_INTERVAL = 40 * 60 * 1000;
const ROUND_TIME = 30 * 1000;

let mode = "easy";

// ================= Mili AI =================

let greetingCount = 0;
let laughCount = 0;

const swearWords = ["fuck", "shit", "wtf"];
const deathWords = ["death", "dead", "die"];
const boredWords = ["boring", "dead chat", "this is dead", "is it dead"];
const laughWords = ["lol", "lmao", "haha"];

const swearReplies = [
  "shut the fuck up",
  "who hurt you",
  "language.",
  "relax.",
  "you sound emotional"
];

const deathReplies = [
  "💀",
  "well that got dark",
  "bro…",
  "we will remember you.",
  "noted.",
  "that sounded final."
];

const boredReplies = [
  "then revive it",
  "be the content",
  "skill issue",
  "you are the problem",
  "entertain us then"
];

const laughReplies = [
  "was it that funny",
  "bro is laughing alone",
  "ok comedian"
];

const greetingReplies = [
  "hello human",
  "yo",
  "hey.",
  "hi.",
  "bye.",
  "not now."
];

const mentionReplies = [
  "what do you need",
  "I’m here",
  "what.",
  "you again",
  "make it quick",
  "this better be important",
  "this feels illegal",
  "you shouldn’t have.",
  "no",
  "ask someone else",
  "processing… nope"
];

const insultReplies = [
  "watch how you talk to me.",
  "you’re getting bold.",
  "say it again.",
  "you’re not in the position to talk like that.",
  "careful.",
  "keep going. this is interesting.",
  "you don’t talk like that twice."
];

const rareReplies = [
  "I’m always watching.",
  "interesting.",
  "you do this often.",
  "predictable.",
  "I’ve seen worse.",
  "not your best moment."
];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

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

// ================= REST SAME (UNCHANGED GAME LOGIC) =================

let currentFlag = null;
let roundActive = false;
let scores = {};

if (fs.existsSync("scores.json")) {
  scores = JSON.parse(fs.readFileSync("scores.json"));
}

let streaks = {};
let currentMessage = null;

function getHint(name) {
  return mode === "easy"
    ? `💡 Starts with ${name[0].toUpperCase()} (${name.length} letters)`
    : `💡 First letter: ${name[0].toUpperCase()}`;
}

async function startRound() {
  if (roundActive) return;
  const channel = await client.channels.fetch(CHANNEL_ID);
  const randomFlag = flags[Math.floor(Math.random() * flags.length)];
  currentFlag = randomFlag;
  roundActive = true;

  const embed = new EmbedBuilder()
    .setTitle(`🌍 Guess the flag! (${mode.toUpperCase()})`)
    .setImage(randomFlag.url)
    .setColor(Colors.Blue)
    .setFooter({ text: "⏳ 30s | !hint" });

  currentMessage = await channel.send({ embeds: [embed] });
  setTimeout(endRound, ROUND_TIME);
}

async function endRound() {
  if (!roundActive) return;
  roundActive = false;

  const embed = new EmbedBuilder()
    .setTitle("⏰ Time’s up!")
    .setDescription(`Answer: **${currentFlag.name}**`)
    .setColor(Colors.Grey)
    .setImage(currentMessage.embeds[0].image.url);

  await currentMessage.edit({ embeds: [embed] });
  currentFlag = null;
}

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  const content = message.content.toLowerCase();

  if (content.includes("mili") && (content.includes("fuck") || content.includes("die"))) {
    return message.channel.send(random(insultReplies));
  }

  if (content.includes("mili")) {
    return message.channel.send(random(mentionReplies));
  }

  if (swearWords.some(w => content.includes(w)) && Math.random() < 0.4) {
    return message.channel.send(random(swearReplies));
  }

  if (deathWords.some(w => content.includes(w)) && Math.random() < 0.4) {
    return message.channel.send(random(deathReplies));
  }

  if (boredWords.some(w => content.includes(w))) {
    return message.channel.send(random(boredReplies));
  }

  if (laughWords.some(w => content.includes(w))) {
    laughCount++;
    if (laughCount >= 3) {
      laughCount = 0;
      return message.channel.send(random(laughReplies));
    }
  }

  if (["hi","hello","hey"].includes(content)) {
    greetingCount++;
    if (greetingCount >= 5) {
      greetingCount = 0;
      return message.channel.send(random(greetingReplies));
    }
  }

  if (Math.random() < 0.02) {
    return message.channel.send(random(rareReplies));
  }

  if (content === "!leaderboard") {
    const sorted = Object.entries(scores).sort((a,b)=>b[1]-a[1]).slice(0,5);
    if (!sorted.length) return message.channel.send("No scores yet!");
    return message.channel.send(sorted.map(([id,s],i)=>`${i+1}. <@${id}> - ${s}`).join("\n"));
  }

  if (content.startsWith("!mode")) {
    mode = content.includes("hard") ? "hard" : "easy";
    return message.channel.send(`Mode set to ${mode}`);
  }

  if (content === "!hint" && roundActive) {
    return message.channel.send(getHint(currentFlag.name));
  }

  if (!roundActive) return;

  if (content === currentFlag.name || currentFlag.aliases.includes(content)) {
    roundActive = false;
    const userId = message.author.id;
    streaks[userId] = (streaks[userId] || 0) + 1;
    let points = streaks[userId] >= 3 ? 2 : 1;
    scores[userId] = (scores[userId] || 0) + points;
    fs.writeFileSync("scores.json", JSON.stringify(scores,null,2));

    await message.react("✅");

    const embed = new EmbedBuilder()
      .setTitle("🏆 Correct!")
      .setDescription(`${message.author} got it!\n\nAnswer: ${currentFlag.name}\n+${points} points\n🔥 Streak: ${streaks[userId]}\nTotal: ${scores[userId]}`)
      .setColor(Colors.Green)
      .setImage(currentMessage.embeds[0].image.url);

    await currentMessage.edit({ embeds:[embed] });
    currentFlag = null;
  } else {
    await message.react("❌");
  }
});

client.once("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.user.setPresence({
    activities:[{name:"Guess the flags 🌍"}],
    status:"online"
  });
  startRound();
  setInterval(startRound, FLAG_INTERVAL);
});
client.on("guildCreate", (guild) => {
  const allowedServer = "1434221318005588061";

  if (guild.id !== allowedServer) {
    console.log(`Left unauthorized server: ${guild.name}`);
    guild.leave();
  }
});

client.login(process.env.TOKEN);
