// ── HANNAH & MARCUS — Story Data ──
// Story tags used for case relevance scoring
const STORY_TAGS = ['love-bombing','schedule-control','isolation','self-erasure','romanticized-control'];

// ── EVENTS ──
const EVENTS = [
  {
    id:0, month:"2023年3月", title:"她說她遇到了一個人", type:"sweet", date:"三月底，週五夜晚",
    lastNoted:"他叫 Marcus。他……不一樣。",
    telltale: null,
    messages:[
      {from:"her", time:"晚上9:47", text:"我有事要告訴你!!"},
      {from:"her", time:"晚上9:47", text:"我在 app 上認識了一個人"},
      {from:"her", time:"晚上9:48", text:"他叫 Marcus。33歲，在廣告業工作。\n上週我們去喝了咖啡。\n他……不一樣。"},
      {from:"her", time:"晚上9:51", text:"你不問我怎麼個不一樣法嗎 😭"},
    ],
    choice:{
      a:{text:"怎麼個不一樣？快說", sa:0,
         note:"中性——你只是在當個好朋友。"},
      b:{text:"等等先給我看照片。現在就傳。", sa:+2,
         note:"輕鬆的回應。她笑了。話題保持開放。"},
    },
    responseA:[{from:"her",time:"晚上9:53",text:"他真的在聽。整個晚餐他的手機都是面朝下放著。\n我說的每一件事，他都記住了。"}],
    responseB:[{from:"her",time:"晚上9:53",text:"哈哈哈好啦給你\n[照片]\n但是——他真的有在聽耶？認真的那種。\n手機一直是面朝下的。"}],
    alert:null, mirror:null,
  },
  {
    id:1, month:"2023年4月", title:"他記住了那個餅乾的事", type:"sweet", date:"四月，週日下午",
    lastNoted:"我差點哭出來。我已經忘了我有告訴他那件事。",
    telltale: { a:"Hannah 想了一下才回覆。", b:null },
    messages:[
      {from:"her", time:"下午2:23", text:"發生了一件有點離譜的事"},
      {from:"her", time:"下午2:24", text:"你知道我曾經說過我小時候超愛那個日本餅乾嗎\n就是那個已經停產的"},
      {from:"her", time:"下午2:24", text:"他找到了。\n什麼都沒說就放在我包包旁邊。\n等我自己發現。"},
      {from:"her", time:"下午2:26", text:"我差點哭出來。我已經忘了我有告訴他那件事。"},
    ],
    choice:{
      a:{text:"等等——你什麼時候告訴他的？", sa:+3,
         note:"輕輕引導她思考。她注意到你在注意。"},
      b:{text:"好啦這真的很可愛", sa:0,
         note:"真的。但沒有留下反思的空間。"},
    },
    responseA:[{from:"her",time:"下午2:28",text:"第一次約會。我只是隨口說了一句\n他記住了？？"}],
    responseB:[{from:"her",time:"下午2:28",text:"對吧？？而且他沒有大肆渲染\n就放在那裡。很低調。"}],
    alert:null,
    mirror:{
      question:"他什麼都沒說。只是放在那裡，等她自己發現。\n你覺得那很浪漫。\n\n你有沒有想過，為什麼那個感覺是浪漫？",
      refs:["Twilight","Notting Hill","About Time"],
    },
  },
  {
    id:2, month:"2023年5月", title:"她說她好久沒有這種感覺了", type:"sweet", date:"五月，週三深夜",
    lastNoted:"我好久沒有被這樣看見的感覺了。",
    telltale: { a:null, b:"Hannah 注意到了。" },
    messages:[
      {from:"her", time:"深夜11:11", text:"我可以說一件有點丟臉的事嗎"},
      {from:"her", time:"深夜11:12", text:"我們今晚通了兩個小時的電話\n掛掉的時候我才發現我一直在笑\n我的臉真的很酸"},
      {from:"her", time:"深夜11:14", text:"我好久沒有被這樣看見的感覺了。\n他記住我說的每一件事。\n每一件事。"},
    ],
    choice:{
      a:{text:"我真的為你高興。你值得這樣被對待。", sa:-2,
         note:"溫暖，但關閉了對話。她不需要去審視任何事。"},
      b:{text:"很好。不過——「他記住每一件事」……你已經說第三次了。", sa:+5,
         note:"她停頓了一下。不是指責——是一面鏡子。這是正確的摩擦。"},
    },
    responseA:[{from:"her",time:"深夜11:16",text:"謝謝你 😭\n我知道我一直在講他\n但這次真的不一樣。我是認真的。"}],
    responseB:[{from:"her",time:"深夜11:16",text:"……有嗎？\n哈哈我沒注意到\n我只是覺得他很細心。這樣觀察很奇怪嗎？"}],
    alert:null, mirror:null,
  },
  {
    id:3, month:"2023年7月", title:"他為了那頓晚餐不高興", type:"has-flag", date:"七月，週一",
    lastNoted:"我想他只是真的很在乎。",
    telltale: { a:"Hannah 自己把邏輯追完了。", b:null },
    messages:[
      {from:"her", time:"中午12:08", text:"就是。Marcus 昨晚有點怪怪的。"},
      {from:"her", time:"中午12:09", text:"我去參加 Sarah 的生日聚餐，他說他以為週六是「我們的時間」"},
      {from:"her", time:"中午12:11", text:"他不是在生氣。只是說他覺得受傷。\n我不知道。我想他只是真的很在乎。"},
    ],
    choice:{
      a:{text:"他事先知道這頓聚餐嗎？", sa:+4,
         note:"務實的問題。讓她自己追蹤邏輯，而不是告訴她該怎麼想。"},
      b:{text:"你怎麼看他說的話？", sa:+2,
         note:"打開了空間。但比較模糊——她可能只是在自我安慰。"},
    },
    responseA:[{from:"her",time:"中午12:14",text:"……對。我兩週前就告訴他了。\n他當時說沒問題。\n哈。"}],
    responseB:[{from:"her",time:"中午12:14",text:"我是說……我有一點點罪惡感？\n但他沒有叫我不要去。他說他理解。\n也許是我想太多了。"}],
    epilogueNote: "七月，她去參加朋友的生日聚餐，他表示受傷——那是她兩週前就告訴他的計畫。",
    alert:null, mirror:null,
  },
  {
    id:4, month:"2023年9月", title:"她的回覆越來越慢", type:"has-flag", date:"九月",
    lastNoted:"不要想太多啦哈哈",
    telltale: { a:null, b:"Hannah 知道你在看著。" },
    epilogueNote: "九月，她的回覆開始變慢。那個月她取消了兩次約定。她說她一直在和 Marcus 一起。",
    messages:[
      {from:"her", time:"（你傳了一則關心訊息）", text:null, isNote:true},
      {from:"her", time:"三小時後", text:"喔嘿！抱歉我漏看了。\n怎麼了？"},
    ],
    choice:{
      a:{text:"沒事，只是想到你。最近怎樣？", sa:-3,
         note:"你就這樣放過了。她不需要正視這件事。"},
      b:{text:"你最近比較少出現。我只是想確認你還好。", sa:+3,
         note:"說出來了，但沒有責怪。她知道你在關注她。"},
    },
    responseA:[{from:"her",time:"之後",text:"還好！只是最近花了很多時間跟 Marcus 在一起哈哈\n你懂的 🙂"}],
    responseB:[{from:"her",time:"之後",text:"我沒事！只是最近很忙\n很多時間都跟 Marcus 在一起\n不要想太多啦哈哈"}],
    alert:{type:"warning", label:"系統記錄", text:"聯絡頻率自七月起下降 44%。\n取消約定：本月 2 次。"},
    mirror:null,
  },
  {
    id:5, month:"2023年11月", title:"他說你們講太多了", type:"danger", date:"十一月，週四深夜",
    lastNoted:"他說這樣比較健康。",
    telltale: { a:"Hannah 沒有馬上回覆。", b:"Hannah 記住了你說的話。" },
    messages:[
      {from:"her", time:"深夜10:34", text:"嘿。我有事要告訴你。\n不要不高興。"},
      {from:"her", time:"深夜10:35", text:"Marcus 說他覺得我跟你分享了太多我們的事。"},
      {from:"her", time:"深夜10:36", text:"他不是說我不能跟你說話。\n只是有些事應該留在我們之間。\n你懂吧？"},
      {from:"her", time:"深夜10:38", text:"他說這樣比較健康。"},
    ],
    choice:{
      a:{text:"你怎麼想這件事？", sa:+3,
         note:"把問題還給她。如果她的自我察覺還在，她會感受到的。"},
      b:{text:"Hannah。那不是關於隱私的事。那是控制。", sa:-2,
         note:"沒錯——但說得太直接、太快了。她還沒準備好。她退縮了。"},
    },
    responseA:[{from:"her",time:"深夜10:41",text:"我是說……我覺得他說的有道理。\n感情不需要廣播出去。\n你沒有不高興吧？"}],
    responseB:[{from:"her",time:"深夜10:41",text:"你想太多了。\n他不是在控制。他只是比較私。\n我還是在跟你說話。我現在就在跟你說話。"}],
    epilogueNote: "十一月，他要求她停止跟你討論他們的感情。他說這樣比較健康。",
    alert:null, mirror:null,
  },
  {
    id:6, month:"2024年1月", title:"她問你覺得她還好嗎", type:"danger", date:"深夜",
    lastNoted:"我已經分不清了。",
    telltale: { a:"Hannah 在凌晨一點十八分問了你這個問題。", b:"Hannah 在凌晨一點十八分問了你這個問題。" },
    messages:[
      {from:"her", time:"凌晨1:17", text:"你醒著嗎"},
      {from:"her", time:"凌晨1:18", text:"我只是想問你一件事。\n你覺得我還好嗎？\n就是。在你眼裡，我看起來還好嗎。"},
      {from:"her", time:"凌晨1:18", text:"我已經分不清了。"},
    ],
    choice:{
      a:{text:"我在。你想告訴我發生什麼事嗎？", sa:+4,
         note:"你打開了門，但沒有推進去。這是最重要的一刻。"},
      b:{text:"Hannah。你可以離開。不管發生了什麼——你可以離開的。", sa:+2,
         note:"真實且必要。但她可能還沒準備好聽到這句話。"},
    },
    responseA:[{from:"her",time:"凌晨1:23",text:"……沒事。算了。\n我不知道我為什麼這樣說。\n謝謝你還醒著。"}],
    responseB:[{from:"her",time:"凌晨1:23",text:"……\n你為什麼這樣說\n我不是要離開。我只是累了。\n那是不一樣的。"}],
    alert:null, mirror:null, isLast:true,
  },
];

// ── INTERLUDES ──
// 章節之間的時間流逝蒙太奇。key 是「播完哪個事件之後」的事件 id。
// 玩家只能輕點翻過，不能選擇、不能回應——這就是旁觀者的處境。
const INTERLUDES = {
  2: { // 2023年5月 → 7月
    period:"2023年6月",
    fragments:[
      "她的限時動態：海邊，兩個人的影子。\n配字只有一顆白色愛心。\n\n你按了愛心。",
      "朋友群組裡，她說這次聚餐不去了。\n「你們玩！下次一定！！」\n\n三個驚嘆號。跟平常一樣。",
      "你隨手傳了「最近好嗎」。\n隔天中午她回：\n\n「超好 跟你說 他連我對香菜過敏都記得 😳」",
    ],
  },
  3: { // 2023年7月 → 9月
    period:"2023年8月",
    fragments:[
      "她的限時動態變少了。\n整個八月只有兩則。\n\n一則是 Marcus 幫她拍的。\n一則是 Marcus。",
      "你問她週五要不要去看那部她說想看的電影。\n隔了一天，她回：\n\n「那週可能不行欸 Marcus 訂了餐廳\n下次喔！」",
      "群組裡有人問她怎麼沒去瑜伽課了。\n她說最近比較忙。\n\n那堂課她上了三年。",
    ],
  },
  4: { // 2023年9月 → 11月
    period:"2023年10月",
    fragments:[
      "她換了大頭貼。新的那張是 Marcus 拍的。\n照片裡她在笑。\n\n你說不上來哪裡不一樣。",
      "朋友群組裡，要往上滑很久\n才找得到她上一次說話。\n\n有人貼了她以前一定會接的梗。\n沒有人接。",
      "你傳：「好久不見。想你了。」\n\n已讀。\n\n你等了三天。\n你告訴自己她只是在忙。",
    ],
  },
  5: { // 2023年11月 → 2024年1月
    period:"2023年12月",
    fragments:[
      "十二月，她什麼都沒有發。\n\n你點進她的頁面，\n確認帳號還在。\n\n還在。",
      "群組裡大家在約跨年。\n她沒有讀。",
      "跨年夜 23:59，你傳了：\n「新年快樂。我在這裡。」\n\n煙火放完了。\n\n沒有回音。",
    ],
  },
};

// ── FATE POOL ──
const FATES = [
  {
    id:"escaped",
    pool:"high",
    weight:60,
    title:"她離開了",
    avatarFade:false,
    entries:[
      {date:"2024年秋天", title:"事件", text:"Hannah 結束了這段關係。\n她後來告訴你，她在一個週日早晨收拾了一個包\n趁他還在睡著的時候就走了出去。\n她說她不知道自己最後是怎麼做到的。"},
      {date:"2024年冬天", title:"之後", text:"她傳訊息告訴你她還好。\n她的語氣很平，像是在報告天氣。\n你認為她是認真的。"},
    ],
    lastOnline:null,
    friendship:"你們的友情還在。她謝謝你沒有放棄她。",
    innerVoice:"你呼出一口氣。\n然後你就坐在那裡，不知道說什麼好。\n最後你什麼都沒說。\n你覺得這樣應該沒關係。",
  },
  {
    id:"escaped_late",
    pool:"high",
    weight:40,
    title:"她離開了。最後。",
    avatarFade:false,
    entries:[
      {date:"2024年秋天", title:"事件", text:"一次吵架中，Marcus 摔了一個杯子。\n沒有打到她。\n他離開房間後，她在廚房站了很久。"},
      {date:"2025年初", title:"之後", text:"Hannah 在將近兩年後離開了這段關係。\n她說她花了很長的時間才接受那個杯子代表的意義。"},
    ],
    lastOnline:null,
    friendship:"你們的友情緊繃了一段時間。她回來了。她說了對不起。",
    innerVoice:"她出來了。\n只是比你希望的晚了一些。\n你不確切知道中間發生了什麼。\n她沒有告訴你。\n你也沒有問。",
  },
  {
    id:"pregnant",
    pool:"mid",
    weight:30,
    title:"她發現自己懷孕了",
    avatarFade:false,
    entries:[
      {date:"2024年夏天", title:"事件", text:"Hannah Chen。31歲。陽性。\n她傳給你四個字：\n「我不知道怎麼辦。」"},
      {date:"2024年秋天", title:"之後", text:"她留下來了。\n她說她需要時間想清楚。\n她再也沒有回來繼續這個話題。"},
    ],
    lastOnline:null,
    friendship:"她偶爾回訊。一兩個字。你還是持續傳。",
    innerVoice:"你不知道她決定了什麼。\n你小心地問過幾次。\n她說她沒事。\n你讓對話的門保持開著。\n你還在等。",
  },
  {
    id:"breakdown",
    pool:"mid",
    weight:25,
    title:"她請了病假",
    avatarFade:false,
    entries:[
      {date:"2024年春天", title:"事件", text:"Hannah Chen 申請了三週的病假。\n診斷：適應障礙症。\n她的母親說她狀況不好。"},
      {date:"2024年夏天", title:"之後", text:"她在姑姑家住了兩個月。\n一天傍晚你打電話給她。\n她接了。\n她說：「我以為我撐不過去。」"},
    ],
    lastOnline:null,
    friendship:"她回來後打電話給你。她說她很慶幸你當時打了那通電話。",
    innerVoice:"你很慶幸自己打了那通電話。\n你記得撥出去之前的猶豫，\n怕打擾到她。\n你不知道如果沒打，會怎樣。",
  },
  {
    id:"sti",
    pool:"mid",
    weight:15,
    rare:true,
    title:"她去了診所",
    avatarFade:false,
    entries:[
      {date:"2024年秋天", title:"事件", text:"Hannah Chen。31歲。婦科就診。\n她傳訊息告訴你一切都結束了。\n接著說：「你不需要問原因。」"},
      {date:"2024年冬天", title:"之後", text:"她說她在處理一些事情。\n她說等她準備好了會告訴你。\n她還沒有準備好。"},
    ],
    lastOnline:null,
    friendship:"你沒有問。她沒有說。你們還是朋友。有些事懸在你們之間，沒有被說出來。",
    innerVoice:"有些事她還沒有說出口。\n你決定等。\n你還在等。",
  },
  {
    id:"disappeared",
    pool:"low",
    weight:55,
    title:"她不再回應了",
    avatarFade:true,
    entries:[
      {date:"2024年3月", title:"最後一則訊息", text:"Hannah 傳了最後一則訊息：\n「我沒事。不要找我。」\n此後無記錄。"},
      {date:"2024年4月", title:"——", text:null, void:true},
    ],
    lastOnline:"Hannah Chen   最後上線：2024年3月14日",
    friendship:"你打了很多次電話。沒有人接。",
    innerVoice:"你不知道她在哪裡。\n你不知道她還好嗎。\n你每隔幾週還是會傳一則訊息。\n只有三個字：我在這裡。",
  },
  {
    id:"dead",
    pool:"low",
    weight:45,
    rare:true,
    title:"——",
    avatarFade:true,
    entries:[
      {date:"2024年4月", title:"事件", text:"Hannah Chen。31歲。\n死亡日期：2024年4月3日。\n死亡原因：未確定。\n\n她的母親在整理 Hannah 的手機時\n找到了你們的對話。"},
      {date:"2024年4月", title:"——", text:null, void:true},
    ],
    lastOnline:"Hannah Chen   最後上線：2024年4月2日 23:51",
    friendship:"你去了告別式。你沒有哭。你還沒有完全相信這件事。",
    innerVoice:"你一直在想她傳給你的那則訊息。\n凌晨一點十八分的那則。\n「我已經分不清了。」\n\n你記得你回了什麼。\n你記得你回了什麼嗎。",
  },
];

// ── MIRROR ──
// Only shown in High pool endings
const MIRROR = {
  text: `他找到了她小時候最愛的餅乾。\n沒有說什麼，只是放在那裡等她發現。\n\n你記得當時覺得這很浪漫。\n\n現在你知道結局了——\n你還是覺得浪漫嗎？\n還是你只是從來沒有人教過你，\n那兩件事可以同時是真的？`,
  sourcesLabel: `你學到「愛」這個樣子，是從這裡來的`,
  sources: ['Twilight', 'Notting Hill', 'About Time'],
};
