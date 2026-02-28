// ── HANNAH & MARCUS — Story Data ──
// Story tags used for case relevance scoring
const STORY_TAGS = ['love-bombing','schedule-control','isolation','self-erasure','romanticized-control'];

// ── EVENTS ──
const EVENTS = [
  {
    id:0, month:"March 2023", title:"She says she met someone", type:"sweet", date:"Friday, late March",
    lastNoted:"His name is Marcus. He's… different.",
    telltale: { a:"Hannah will remember this.", b:"Hannah will remember this." },
    messages:[
      {from:"her", time:"9:47 pm", text:"ok I need to tell you something!!"},
      {from:"her", time:"9:47 pm", text:"I met someone on the app"},
      {from:"her", time:"9:48 pm", text:"His name is Marcus. 33, works in advertising.\nWe got coffee last week.\nHe's… different."},
      {from:"her", time:"9:51 pm", text:"aren't you going to ask me how 😭"},
    ],
    choice:{
      a:{text:"how?? tell me everything", sa:0,
         note:"Neutral — you're just being a good friend."},
      b:{text:"wait first I need a photo. sending me a photo right now.", sa:+2,
         note:"Light. She laughs. Keeps the door open."},
    },
    responseA:[{from:"her",time:"9:53 pm",text:"he actually listened. like the whole dinner his phone was face down.\nevery single thing I said, he remembered."}],
    responseB:[{from:"her",time:"9:53 pm",text:"lmaoo okay here\n[photo]\nbut also — he actually listened? like, really listened.\nphone face down the whole time."}],
    alert:null, mirror:null,
  },
  {
    id:1, month:"April 2023", title:"He remembered the cookies", type:"sweet", date:"Sunday afternoon, April",
    lastNoted:"I almost cried. I had forgotten I even told him that.",
    telltale: { a:"Hannah will remember this.", b:"Hannah will remember this." },
    messages:[
      {from:"her", time:"2:23 pm", text:"okay something kind of insane happened"},
      {from:"her", time:"2:24 pm", text:"you know how I mentioned once that I used to love these Japanese cookies as a kid\nthe ones they discontinued"},
      {from:"her", time:"2:24 pm", text:"he found them.\njust left them next to my bag without saying anything.\nwaited for me to notice."},
      {from:"her", time:"2:26 pm", text:"I almost cried. I had forgotten I even told him that."},
    ],
    choice:{
      a:{text:"wait — when did you tell him that?", sa:+3,
         note:"Gently prompts her to think. She notices you noticed."},
      b:{text:"okay that is genuinely really sweet", sa:0,
         note:"True. But doesn't open any space for reflection."},
    },
    responseA:[{from:"her",time:"2:28 pm",text:"first date. I just mentioned it in passing, like one sentence\nhe remembered that??"}],
    responseB:[{from:"her",time:"2:28 pm",text:"right?? and he didn't make a big thing of it\njust left it there. very quiet about it."}],
    alert:null,
    mirror:{
      question:"He said nothing. Just left it there and waited for her to find it.\nThat felt romantic to you.\n\nHave you ever thought about why it feels that way?",
      refs:["Twilight","Notting Hill","About Time"],
    },
  },
  {
    id:2, month:"May 2023", title:"She says she hasn't felt this way in a long time", type:"sweet", date:"Wednesday night, May",
    lastNoted:"I haven't felt seen like this in so long.",
    telltale: { a:"Hannah will remember this.", b:"Hannah noticed." },
    messages:[
      {from:"her", time:"11:11 pm", text:"can I tell you something embarrassing"},
      {from:"her", time:"11:12 pm", text:"we were on the phone for two hours tonight\nand when we hung up I realized I'd been smiling the whole time\nmy face actually hurt"},
      {from:"her", time:"11:14 pm", text:"I haven't felt seen like this in so long.\nhe remembers everything I say.\neverything."},
    ],
    choice:{
      a:{text:"I'm really happy for you. you deserve this.", sa:-2,
         note:"Warm but closes the conversation. She doesn't have to examine anything."},
      b:{text:"I'm glad. also — 'he remembers everything'… that's the third time you've said that.", sa:+5,
         note:"She pauses. Not an accusation — a mirror. This is the right kind of friction."},
    },
    responseA:[{from:"her",time:"11:16 pm",text:"thank you 😭\nI know I keep talking about him\nbut this one feels different. I mean it."}],
    responseB:[{from:"her",time:"11:16 pm",text:"…have I?\nhaha I didn't notice\nI just mean he's attentive. is that weird to notice?"}],
    alert:null, mirror:null,
  },
  {
    id:3, month:"July 2023", title:"He was upset about the dinner", type:"has-flag", date:"Monday, July",
    lastNoted:"I think he just really cares.",
    telltale: { a:"Hannah will remember this.", b:"Hannah will remember this." },
    messages:[
      {from:"her", time:"12:08 pm", text:"so. Marcus was kind of off last night."},
      {from:"her", time:"12:09 pm", text:"I went to Sarah's birthday dinner and he said he thought Saturdays were 'our time'"},
      {from:"her", time:"12:11 pm", text:"he wasn't mean about it. just said he felt hurt.\nI don't know. I think he just really cares."},
    ],
    choice:{
      a:{text:"did he know about the dinner in advance?", sa:+4,
         note:"Practical. Makes her trace the logic without telling her what to think."},
      b:{text:"what do you think about what he said?", sa:+2,
         note:"Opens space. But more diffuse — she might just reassure herself."},
    },
    responseA:[{from:"her",time:"12:14 pm",text:"…yeah. I told him two weeks ago.\nhe said okay at the time.\nhuh."}],
    responseB:[{from:"her",time:"12:14 pm",text:"I mean… I feel a little guilty?\nbut he didn't tell me not to go. he said he understands.\nmaybe I'm overthinking."}],
    epilogueNote: "In July, he expressed hurt that she attended a friend's birthday dinner — a plan she had told him about two weeks earlier.",
    alert:null, mirror:null,
  },
  {
    id:4, month:"September 2023", title:"She's taking longer to reply", type:"has-flag", date:"September",
    lastNoted:"don't read into it haha",
    telltale: { a:"Hannah will remember this.", b:"Hannah will remember this." },
    epilogueNote: "By September, her replies had slowed. She cancelled plans twice that month. She said she'd been spending a lot of time with Marcus.",
    messages:[
      {from:"her", time:"(you sent a check-in)", text:null, isNote:true},
      {from:"her", time:"three hours later", text:"oh hey! sorry I missed this.\nwhat's up?"},
    ],
    choice:{
      a:{text:"nothing, just thinking of you. how are things?", sa:-3,
         note:"You let it go. She doesn't have to look at it."},
      b:{text:"you've been quieter lately. I just wanted to make sure you're okay.", sa:+3,
         note:"Names it without blame. She knows you're paying attention."},
    },
    responseA:[{from:"her",time:"later",text:"good! just been spending a lot of time with Marcus lol\nyou know how it is 🙂"}],
    responseB:[{from:"her",time:"later",text:"I'm fine! just been really busy\na lot of time with Marcus lately\ndon't read into it haha"}],
    alert:{type:"warning", label:"System Log", text:"Contact frequency down 44% since July.\nCancelled plans: 2 this month."},
    mirror:null,
  },
  {
    id:5, month:"November 2023", title:"He said you two talk too much", type:"danger", date:"Thursday night, November",
    lastNoted:"he said it's healthier that way.",
    telltale: { a:"Hannah will remember this.", b:"Hannah will remember this." },
    messages:[
      {from:"her", time:"10:34 pm", text:"hey. I need to tell you something.\ndon't be upset."},
      {from:"her", time:"10:35 pm", text:"Marcus said he feels like I share too much about us with you."},
      {from:"her", time:"10:36 pm", text:"he's not saying I can't talk to you.\njust that some things should stay between us.\nyou know?"},
      {from:"her", time:"10:38 pm", text:"he said it's healthier that way."},
    ],
    choice:{
      a:{text:"what do you think about that?", sa:+3,
         note:"Gives her the question. If her self-awareness is still intact, she'll feel it."},
      b:{text:"Hannah. that's not about privacy. that's about control.", sa:-2,
         note:"True — but said too directly, too fast. She's not ready. She pulls away."},
    },
    responseA:[{from:"her",time:"10:41 pm",text:"I mean… he has a point I think.\nrelationships don't need to be broadcast.\nyou're not upset, right?"}],
    responseB:[{from:"her",time:"10:41 pm",text:"you're overthinking it.\nhe's not controlling. he's private.\nI still talk to you. I'm talking to you right now."}],
    epilogueNote: "In November, he asked her to stop discussing their relationship with you. He said it would be healthier that way.",
    alert:null, mirror:null,
  },
  {
    id:6, month:"January 2024", title:"She asks if you think she's okay", type:"danger", date:"Late night",
    lastNoted:"I can't tell anymore.",
    telltale: { a:"Hannah asked you this at 1:18 in the morning.", b:"Hannah asked you this at 1:18 in the morning." },
    messages:[
      {from:"her", time:"1:17 am", text:"are you awake"},
      {from:"her", time:"1:18 am", text:"I just wanted to ask you something.\ndo you think I'm okay?\nlike. do I seem okay to you."},
      {from:"her", time:"1:18 am", text:"I can't tell anymore."},
    ],
    choice:{
      a:{text:"I'm here. do you want to tell me what's going on?", sa:+4,
         note:"You open the door without pushing. This is the most important moment."},
      b:{text:"Hannah. you can leave. whatever is happening — you can leave.", sa:+2,
         note:"True and necessary. But she might not be ready to hear it yet."},
    },
    responseA:[{from:"her",time:"1:23 am",text:"…nothing. never mind.\nI don't know why I said that.\nthanks for being up."}],
    responseB:[{from:"her",time:"1:23 am",text:"…\nwhat makes you say that\nI'm not trying to leave. I'm just tired.\nthat's different."}],
    alert:null, mirror:null, isLast:true,
  },
];

// ── FATE POOL ──
const FATES = [
  {
    id:"escaped",
    pool:"high",
    weight:60,
    title:"She left",
    avatarFade:false,
    entries:[
      {date:"Autumn 2024", title:"Event", text:"Hannah ended the relationship.\nShe told you later she packed a bag on a Sunday morning\nand just walked out while he was still asleep.\nShe said she doesn't know how she finally did it."},
      {date:"Winter 2024", title:"After", text:"She texted you that she was okay.\nHer voice was flat, like she was reporting the weather.\nYou think she meant it."},
    ],
    lastOnline:null,
    friendship:"Your friendship is intact. She thanked you for not giving up on her.",
    innerVoice:"You exhaled.\nThen you sat there not knowing what to say.\nIn the end you didn't say anything.\nYou think that was okay.",
  },
  {
    id:"escaped_late",
    pool:"high",
    weight:40,
    title:"She left. Eventually.",
    avatarFade:false,
    entries:[
      {date:"Autumn 2024", title:"Event", text:"During a fight, Marcus threw a glass.\nIt didn't hit her.\nShe stood in the kitchen for a long time after he left the room."},
      {date:"Early 2025", title:"After", text:"Hannah left the relationship after nearly two years.\nShe said it took her a long time to accept what the glass meant."},
    ],
    lastOnline:null,
    friendship:"Your friendship strained for a while. She came back. She said sorry.",
    innerVoice:"She got out.\nJust later than you hoped.\nYou don't know exactly what happened in between.\nShe didn't tell you.\nYou didn't ask.",
  },
  {
    id:"pregnant",
    pool:"mid",
    weight:30,
    title:"She found out she was pregnant",
    avatarFade:false,
    entries:[
      {date:"Summer 2024", title:"Event", text:"Hannah Chen. 31. Positive test.\nShe sent you four words:\n\"I don't know what.\""},
      {date:"Autumn 2024", title:"After", text:"She stayed.\nShe said she needed time to figure things out.\nShe never came back to this conversation."},
    ],
    lastOnline:null,
    friendship:"She replies sometimes. One or two words. You keep texting anyway.",
    innerVoice:"You don't know what she decided.\nYou've asked a few times, carefully.\nShe says she's fine.\nYou keep the conversation open.\nYou're still waiting.",
  },
  {
    id:"breakdown",
    pool:"mid",
    weight:25,
    title:"She took medical leave",
    avatarFade:false,
    entries:[
      {date:"Spring 2024", title:"Event", text:"Hannah Chen filed for three weeks of medical leave.\nDiagnosis: Adjustment Disorder.\nHer mother said she wasn't doing well."},
      {date:"Summer 2024", title:"After", text:"She stayed with her aunt for two months.\nYou called her one evening.\nShe picked up.\nShe said: \"I didn't think I was going to be okay.\""},
    ],
    lastOnline:null,
    friendship:"She called you when she got back. She said she was glad you called that one time.",
    innerVoice:"You're glad you made that call.\nYou remember hesitating before you dialed,\nafraid of intruding.\nYou don't know what would have happened if you hadn't.",
  },
  {
    id:"sti",
    pool:"mid",
    weight:15,
    rare:true,
    title:"She went to a clinic",
    avatarFade:false,
    entries:[
      {date:"Autumn 2024", title:"Event", text:"Hannah Chen. 31. OB/GYN visit.\nShe texted you that it was over.\nThen: \"You don't have to ask why.\""},
      {date:"Winter 2024", title:"After", text:"She said she was handling some things.\nShe said she'd tell you when she was ready.\nShe hasn't been ready yet."},
    ],
    lastOnline:null,
    friendship:"You didn't ask. She didn't say. You're still friends. Something sits between you, unspoken.",
    innerVoice:"There are things she hasn't said out loud.\nYou've decided to wait.\nYou're still waiting.",
  },
  {
    id:"disappeared",
    pool:"low",
    weight:55,
    title:"She stopped responding",
    avatarFade:true,
    entries:[
      {date:"March 2024", title:"Last message", text:"Hannah sent one final message:\n\"I'm fine. Don't look for me.\"\nNo further record."},
      {date:"April 2024", title:"——", text:null, void:true},
    ],
    lastOnline:"Hannah Chen   Last seen: March 14, 2024",
    friendship:"You called many times. No one answered.",
    innerVoice:"You don't know where she is.\nYou don't know if she's okay.\nYou still send a message every few weeks.\nIt just says: I'm here.",
  },
  {
    id:"dead",
    pool:"low",
    weight:45,
    rare:true,
    title:"——",
    avatarFade:true,
    entries:[
      {date:"April 2024", title:"Event", text:"Hannah Chen. 31.\nDate of death: April 3, 2024.\nManner: undetermined.\n\nHer mother found your conversation\nwhen she went through Hannah's phone."},
      {date:"April 2024", title:"——", text:null, void:true},
    ],
    lastOnline:"Hannah Chen   Last seen: April 2, 2024   11:51 pm",
    friendship:"You went to the funeral. You didn't cry. You haven't quite believed it yet.",
    innerVoice:"You keep thinking about the message she sent you.\nThe one at 1:18 in the morning.\n\"I can't tell anymore.\"\n\nYou remember what you wrote back.\nDo you remember what you wrote back.",
  },
];

// ── MIRROR ──
// Only shown in High pool endings
const MIRROR = {
  text: `他找到了她小時候最愛的餅乾。\n沒有說什麼，只是放在那裡等她發現。\n\n你記得當時覺得這很浪漫。\n\n現在你知道結局了——\n你還是覺得浪漫嗎？\n還是你只是從來沒有人教過你，\n那兩件事可以同時是真的？`,
  sourcesLabel: `你學到「愛」這個樣子，是從這裡來的`,
  sources: ['Twilight', 'Notting Hill', 'About Time'],
};
