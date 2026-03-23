const fs = require("fs");
const { 
  Client, 
  GatewayIntentBits, 
  EmbedBuilder, 
  Colors,
  REST,
  Routes,
  SlashCommandBuilder
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const CHANNEL_ID = "1475491309245435994";
const CLIENT_ID = "1485229970946002994";
const FLAG_INTERVAL = 40 * 60 * 1000;
const ROUND_TIME = 30 * 1000;

let mode = "easy";

// ================= CONVO =================
const activeConvos = {};
const convoCooldown = {};

const convoStarters = ["what do you need","you again","say it","go on"];
const convoReplies = ["that’s it?","you talk a lot","and?","keep going","interesting"];
const convoEnders = ["boring","I’m done with you","you ran out of ideas","as expected"];

const loveReplies = ["you say that to everyone?","or am I special","that’s suspicious","noted"];
const hateReplies = ["noted","still here though","you’ll survive","I don’t care"];

function startConvo(userId) {
  activeConvos[userId] = { step: 0, max: Math.floor(Math.random()*3)+2 };
}

// ================= AI =================
let greetingCount = 0;
let laughCount = 0;

const swearWords = ["fuck","shit","wtf"];
const deathWords = ["death","dead","die"];
const boredWords = ["boring","dead chat","this is dead","is it dead"];
const laughWords = ["lol","lmao","haha"];

const swearReplies = ["shut the fuck up","who hurt you","language.","relax.","you sound emotional"];
const deathReplies = ["💀","well that got dark","bro…","we will remember you.","noted.","that sounded final."];
const boredReplies = ["then revive it","be the content","skill issue","you are the problem","entertain us then"];
const laughReplies = ["was it that funny","bro is laughing alone","ok comedian"];

const greetingReplies = ["hello human","yo","hey.","hi.","bye.","not now."];

const mentionReplies = [
  "what do you need","I’m here","what.","you again",
  "make it quick","this better be important","this feels illegal",
  "no","ask someone else","processing… nope"
];

const insultReplies = [
  "watch how you talk to me.","you’re getting bold.","say it again.",
  "you’re not in the position to talk like that.","careful.",
  "keep going. this is interesting.","you don’t talk like that twice."
];

const rareReplies = [
  "I’m always watching.","interesting.","you do this often.",
  "predictable.","I’ve seen worse.","not your best moment."
];

function random(arr){return arr[Math.floor(Math.random()*arr.length)];}

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

// ================= SLASH =================
const commands = [
  new SlashCommandBuilder().setName("leaderboard").setDescription("Show leaderboard"),
  new SlashCommandBuilder().setName("hint").setDescription("Get hint"),
  new SlashCommandBuilder()
    .setName("mode")
    .setDescription("Set mode")
    .addStringOption(o=>o.setName("type").setRequired(true)
      .addChoices({name:"easy",value:"easy"},{name:"hard",value:"hard"}))
].map(c=>c.toJSON());

const rest = new REST({version:"10"}).setToken(process.env.TOKEN);
(async()=>{await rest.put(Routes.applicationCommands(CLIENT_ID),{body:commands});})();

// ================= GAME =================
let currentFlag=null,roundActive=false,scores={},streaks={},currentMessage=null;
if(fs.existsSync("scores.json"))scores=JSON.parse(fs.readFileSync("scores.json"));

function getHint(n){return mode==="easy"?`💡 Starts with ${n[0].toUpperCase()} (${n.length})`:`💡 First: ${n[0].toUpperCase()}`;}

async function startRound(){
  if(roundActive)return;
  const ch=await client.channels.fetch(CHANNEL_ID);
  const f=flags[Math.floor(Math.random()*flags.length)];
  currentFlag=f;roundActive=true;
  const e=new EmbedBuilder().setTitle(`🌍 Guess (${mode})`).setImage(f.url).setColor(Colors.Blue);
  currentMessage=await ch.send({embeds:[e]});
  setTimeout(endRound,ROUND_TIME);
}

async function endRound(){
  if(!roundActive)return;
  roundActive=false;
  await currentMessage.edit({embeds:[new EmbedBuilder().setTitle("Time up").setDescription(currentFlag.name).setColor(Colors.Grey)]});
  currentFlag=null;
}

// ================= EVENTS =================
client.on("interactionCreate",async i=>{
  if(!i.isChatInputCommand())return;
  if(i.commandName==="leaderboard"){
    const s=Object.entries(scores).sort((a,b)=>b[1]-a[1]).slice(0,5);
    return i.reply(s.map(([id,v],k)=>`${k+1}. <@${id}> - ${v}`).join("\n")||"No scores");
  }
  if(i.commandName==="mode"){mode=i.options.getString("type");return i.reply(`Mode: ${mode}`);}
  if(i.commandName==="hint"){if(!roundActive)return i.reply("No round");return i.reply(getHint(currentFlag.name));}
});

client.on("messageCreate",async m=>{
  if(m.author.bot)return;
  const c=m.content.toLowerCase(),id=m.author.id;

  if(convoCooldown[id]&&Date.now()-convoCooldown[id]<15000)return;

  if(c.includes("mili")&&(c.includes("love")||c.includes("ily"))){
    startConvo(id);convoCooldown[id]=Date.now();
    return m.channel.send(random(loveReplies));
  }

  if(c.includes("mili")&&c.includes("hate")){
    startConvo(id);convoCooldown[id]=Date.now();
    return m.channel.send(random(hateReplies));
  }

  if(c.includes("mili")&&(c.includes("fuck")||c.includes("die")))
    return m.channel.send(random(insultReplies));

  if(c.includes("mili")&&!activeConvos[id]){
    startConvo(id);convoCooldown[id]=Date.now();
    return m.channel.send(random(convoStarters));
  }

  if(activeConvos[id]){
    const cv=activeConvos[id];cv.step++;
    if(Math.random()>0.7){delete activeConvos[id];return;}
    if(cv.step>=cv.max){delete activeConvos[id];return m.channel.send(random(convoEnders));}
    return m.channel.send(random(convoReplies));
  }

  if(swearWords.some(w=>c.includes(w))&&Math.random()<0.4) return m.channel.send(random(swearReplies));
  if(deathWords.some(w=>c.includes(w))&&Math.random()<0.4) return m.channel.send(random(deathReplies));
  if(boredWords.some(w=>c.includes(w))) return m.channel.send(random(boredReplies));

  if(laughWords.some(w=>c.includes(w))){
    laughCount++; if(laughCount>=3){laughCount=0;return m.channel.send(random(laughReplies));}
  }

  if(["hi","hello","hey"].includes(c)){
    greetingCount++; if(greetingCount>=5){greetingCount=0;return m.channel.send(random(greetingReplies));}
  }

  if(Math.random()<0.02) return m.channel.send(random(rareReplies));

  if(!roundActive)return;

  if(c===currentFlag.name||currentFlag.aliases.includes(c)){
    roundActive=false;
    streaks[id]=(streaks[id]||0)+1;
    let p=streaks[id]>=3?2:1;
    scores[id]=(scores[id]||0)+p;
    fs.writeFileSync("scores.json",JSON.stringify(scores,null,2));
    await m.react("✅"); currentFlag=null;
  } else await m.react("❌");
});

client.once("clientReady",()=>{
  console.log(`Logged as ${client.user.tag}`);
  client.user.setPresence({activities:[{name:"Guess flags 🌍"}],status:"online"});
  startRound(); setInterval(startRound,FLAG_INTERVAL);
});

client.on("guildCreate",g=>{
  const allowed="1434221318005588061";
  if(g.id!==allowed)g.leave();
});

client.login(process.env.TOKEN);
