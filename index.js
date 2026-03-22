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
const FLAG_INTERVAL = 15 * 60 * 1000;
const ROUND_TIME = 30 * 1000;

let mode = "easy";

// 🌍 FULL FLAGS LIST (yours + aliases added)
const flags = [
  { name: "afghanistan", aliases: [], url: "https://flagcdn.com/w320/af.png" },
  { name: "albania", aliases: [], url: "https://flagcdn.com/w320/al.png" },
  { name: "algeria", aliases: [], url: "https://flagcdn.com/w320/dz.png" },
  { name: "andorra", aliases: [], url: "https://flagcdn.com/w320/ad.png" },
  { name: "angola", aliases: [], url: "https://flagcdn.com/w320/ao.png" },
  { name: "argentina", aliases: [], url: "https://flagcdn.com/w320/ar.png" },
  { name: "armenia", aliases: [], url: "https://flagcdn.com/w320/am.png" },
  { name: "australia", aliases: [], url: "https://flagcdn.com/w320/au.png" },
  { name: "austria", aliases: [], url: "https://flagcdn.com/w320/at.png" },
  { name: "azerbaijan", aliases: [], url: "https://flagcdn.com/w320/az.png" },
  { name: "bahamas", aliases: [], url: "https://flagcdn.com/w320/bs.png" },
  { name: "bahrain", aliases: [], url: "https://flagcdn.com/w320/bh.png" },
  { name: "bangladesh", aliases: [], url: "https://flagcdn.com/w320/bd.png" },
  { name: "barbados", aliases: [], url: "https://flagcdn.com/w320/bb.png" },
  { name: "belarus", aliases: [], url: "https://flagcdn.com/w320/by.png" },
  { name: "belgium", aliases: [], url: "https://flagcdn.com/w320/be.png" },
  { name: "belize", aliases: [], url: "https://flagcdn.com/w320/bz.png" },
  { name: "benin", aliases: [], url: "https://flagcdn.com/w320/bj.png" },
  { name: "bhutan", aliases: [], url: "https://flagcdn.com/w320/bt.png" },
  { name: "bolivia", aliases: [], url: "https://flagcdn.com/w320/bo.png" },
  { name: "bosnia and herzegovina", aliases: [], url: "https://flagcdn.com/w320/ba.png" },
  { name: "botswana", aliases: [], url: "https://flagcdn.com/w320/bw.png" },
  { name: "brazil", aliases: [], url: "https://flagcdn.com/w320/br.png" },
  { name: "brunei", aliases: [], url: "https://flagcdn.com/w320/bn.png" },
  { name: "bulgaria", aliases: [], url: "https://flagcdn.com/w320/bg.png" },
  { name: "burkina faso", aliases: [], url: "https://flagcdn.com/w320/bf.png" },
  { name: "burundi", aliases: [], url: "https://flagcdn.com/w320/bi.png" },
  { name: "cambodia", aliases: [], url: "https://flagcdn.com/w320/kh.png" },
  { name: "cameroon", aliases: [], url: "https://flagcdn.com/w320/cm.png" },
  { name: "canada", aliases: [], url: "https://flagcdn.com/w320/ca.png" },
  { name: "chile", aliases: [], url: "https://flagcdn.com/w320/cl.png" },
  { name: "china", aliases: [], url: "https://flagcdn.com/w320/cn.png" },
  { name: "colombia", aliases: [], url: "https://flagcdn.com/w320/co.png" },
  { name: "costa rica", aliases: [], url: "https://flagcdn.com/w320/cr.png" },
  { name: "croatia", aliases: [], url: "https://flagcdn.com/w320/hr.png" },
  { name: "cuba", aliases: [], url: "https://flagcdn.com/w320/cu.png" },
  { name: "cyprus", aliases: [], url: "https://flagcdn.com/w320/cy.png" },
  { name: "czech republic", aliases: ["czechia"], url: "https://flagcdn.com/w320/cz.png" },
  { name: "denmark", aliases: [], url: "https://flagcdn.com/w320/dk.png" },
  { name: "dominican republic", aliases: [], url: "https://flagcdn.com/w320/do.png" },
  { name: "ecuador", aliases: [], url: "https://flagcdn.com/w320/ec.png" },
  { name: "egypt", aliases: [], url: "https://flagcdn.com/w320/eg.png" },
  { name: "estonia", aliases: [], url: "https://flagcdn.com/w320/ee.png" },
  { name: "ethiopia", aliases: [], url: "https://flagcdn.com/w320/et.png" },
  { name: "finland", aliases: [], url: "https://flagcdn.com/w320/fi.png" },
  { name: "france", aliases: [], url: "https://flagcdn.com/w320/fr.png" },
  { name: "georgia", aliases: [], url: "https://flagcdn.com/w320/ge.png" },
  { name: "germany", aliases: [], url: "https://flagcdn.com/w320/de.png" },
  { name: "ghana", aliases: [], url: "https://flagcdn.com/w320/gh.png" },
  { name: "greece", aliases: [], url: "https://flagcdn.com/w320/gr.png" },
  { name: "hungary", aliases: [], url: "https://flagcdn.com/w320/hu.png" },
  { name: "iceland", aliases: [], url: "https://flagcdn.com/w320/is.png" },
  { name: "india", aliases: [], url: "https://flagcdn.com/w320/in.png" },
  { name: "indonesia", aliases: [], url: "https://flagcdn.com/w320/id.png" },
  { name: "iran", aliases: [], url: "https://flagcdn.com/w320/ir.png" },
  { name: "iraq", aliases: [], url: "https://flagcdn.com/w320/iq.png" },
  { name: "ireland", aliases: [], url: "https://flagcdn.com/w320/ie.png" },
  { name: "israel", aliases: [], url: "https://flagcdn.com/w320/il.png" },
  { name: "italy", aliases: [], url: "https://flagcdn.com/w320/it.png" },
  { name: "jamaica", aliases: [], url: "https://flagcdn.com/w320/jm.png" },
  { name: "japan", aliases: [], url: "https://flagcdn.com/w320/jp.png" },
  { name: "jordan", aliases: [], url: "https://flagcdn.com/w320/jo.png" },
  { name: "kazakhstan", aliases: [], url: "https://flagcdn.com/w320/kz.png" },
  { name: "kenya", aliases: [], url: "https://flagcdn.com/w320/ke.png" },
  { name: "kuwait", aliases: [], url: "https://flagcdn.com/w320/kw.png" },
  { name: "lebanon", aliases: [], url: "https://flagcdn.com/w320/lb.png" },
  { name: "libya", aliases: [], url: "https://flagcdn.com/w320/ly.png" },
  { name: "lithuania", aliases: [], url: "https://flagcdn.com/w320/lt.png" },
  { name: "luxembourg", aliases: [], url: "https://flagcdn.com/w320/lu.png" },
  { name: "malaysia", aliases: [], url: "https://flagcdn.com/w320/my.png" },
  { name: "mexico", aliases: [], url: "https://flagcdn.com/w320/mx.png" },
  { name: "morocco", aliases: [], url: "https://flagcdn.com/w320/ma.png" },
  { name: "netherlands", aliases: [], url: "https://flagcdn.com/w320/nl.png" },
  { name: "new zealand", aliases: [], url: "https://flagcdn.com/w320/nz.png" },
  { name: "nigeria", aliases: [], url: "https://flagcdn.com/w320/ng.png" },
  { name: "north korea", aliases: ["dprk"], url: "https://flagcdn.com/w320/kp.png" },
  { name: "norway", aliases: [], url: "https://flagcdn.com/w320/no.png" },
  { name: "oman", aliases: [], url: "https://flagcdn.com/w320/om.png" },
  { name: "pakistan", aliases: [], url: "https://flagcdn.com/w320/pk.png" },
  { name: "peru", aliases: [], url: "https://flagcdn.com/w320/pe.png" },
  { name: "philippines", aliases: [], url: "https://flagcdn.com/w320/ph.png" },
  { name: "poland", aliases: [], url: "https://flagcdn.com/w320/pl.png" },
  { name: "portugal", aliases: [], url: "https://flagcdn.com/w320/pt.png" },
  { name: "qatar", aliases: [], url: "https://flagcdn.com/w320/qa.png" },
  { name: "romania", aliases: [], url: "https://flagcdn.com/w320/ro.png" },
  { name: "russia", aliases: [], url: "https://flagcdn.com/w320/ru.png" },
  { name: "saudi arabia", aliases: [], url: "https://flagcdn.com/w320/sa.png" },
  { name: "serbia", aliases: [], url: "https://flagcdn.com/w320/rs.png" },
  { name: "singapore", aliases: [], url: "https://flagcdn.com/w320/sg.png" },
  { name: "slovakia", aliases: [], url: "https://flagcdn.com/w320/sk.png" },
  { name: "slovenia", aliases: [], url: "https://flagcdn.com/w320/si.png" },
  { name: "south africa", aliases: [], url: "https://flagcdn.com/w320/za.png" },
  { name: "south korea", aliases: ["korea"], url: "https://flagcdn.com/w320/kr.png" },
  { name: "spain", aliases: [], url: "https://flagcdn.com/w320/es.png" },
  { name: "sweden", aliases: [], url: "https://flagcdn.com/w320/se.png" },
  { name: "switzerland", aliases: [], url: "https://flagcdn.com/w320/ch.png" },
  { name: "syria", aliases: [], url: "https://flagcdn.com/w320/sy.png" },
  { name: "thailand", aliases: [], url: "https://flagcdn.com/w320/th.png" },
  { name: "tunisia", aliases: [], url: "https://flagcdn.com/w320/tn.png" },
  { name: "turkey", aliases: [], url: "https://flagcdn.com/w320/tr.png" },
  { name: "ukraine", aliases: [], url: "https://flagcdn.com/w320/ua.png" },
  { name: "united arab emirates", aliases: ["uae"], url: "https://flagcdn.com/w320/ae.png" },
  { name: "united kingdom", aliases: ["uk", "britain"], url: "https://flagcdn.com/w320/gb.png" },
  { name: "united states", aliases: ["usa", "us"], url: "https://flagcdn.com/w320/us.png" },
  { name: "vietnam", aliases: [], url: "https://flagcdn.com/w320/vn.png" }
];

let currentFlag = null;
let roundActive = false;
let scores = {};

if (fs.existsSync("scores.json")) {
  scores = JSON.parse(fs.readFileSync("scores.json"));
}
let streaks = {};
let currentMessage = null;

function getHint(name) {
  if (mode === "easy") {
    return `💡 Starts with ${name[0].toUpperCase()} (${name.length} letters)`;
  } else {
    return `💡 First letter: ${name[0].toUpperCase()}`;
  }
}

async function startRound() {
  if (roundActive) return;

  const channel = await client.channels.fetch(CHANNEL_ID);
  const random = flags[Math.floor(Math.random() * flags.length)];

  currentFlag = random;
  roundActive = true;

  const embed = new EmbedBuilder()
    .setTitle(`🌍 Guess the flag! (${mode.toUpperCase()})`)
    .setImage(random.url)
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

  const guess = message.content.toLowerCase();

  if (guess === "!leaderboard") {
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 5);
    if (!sorted.length) return message.channel.send("No scores yet!");

    const text = sorted.map(([id, score], i) => `${i + 1}. <@${id}> - ${score}`).join("\n");
    return message.channel.send(`🏆 Leaderboard:\n${text}`);
  }

  if (guess.startsWith("!mode")) {
    mode = guess.includes("hard") ? "hard" : "easy";
    return message.channel.send(`Mode set to ${mode}`);
  }

  if (guess === "!hint" && roundActive) {
    return message.channel.send(getHint(currentFlag.name));
  }

  if (!roundActive) return;

  const correct =
    guess === currentFlag.name ||
    currentFlag.aliases.includes(guess);

  if (correct) {
    roundActive = false;

    const userId = message.author.id;
    streaks[userId] = (streaks[userId] || 0) + 1;

    let points = 1;
    if (streaks[userId] >= 3) points = 2;

    scores[userId] = (scores[userId] || 0) + points;
    fs.writeFileSync("scores.json", JSON.stringify(scores, null, 2));

    await message.react("✅");

    const embed = new EmbedBuilder()
      .setTitle("🏆 Correct!")
      .setDescription(
        `${message.author} got it!\n\n` +
        `Answer: ${currentFlag.name}\n` +
        `+${points} points\n` +
        `🔥 Streak: ${streaks[userId]}\n` +
        `Total: ${scores[userId]}`
      )
      .setColor(Colors.Green)
      .setImage(currentMessage.embeds[0].image.url);

    await currentMessage.edit({ embeds: [embed] });

    currentFlag = null;
  } else {
    await message.react("❌");
  }
});

client.once("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.user.setPresence({
  activities: [{ name: "Guess the flags 🌍" }],
  status: "online",
});
  startRound();
  setInterval(startRound, FLAG_INTERVAL);
});

client.login(process.env.TOKEN);
