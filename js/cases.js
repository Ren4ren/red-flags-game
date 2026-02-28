// ── CASE REFERENCE DATABASE ──
// Each case: { type:'real'|'fiction', title, quote, tags[] }
const CASES = [
  {
    type:'real',
    title:'林奕含 ／ 房思琪的初戀樂園（2017）',
    quote:'她的老師說，這叫做愛。她相信了十年，直到她無法再相信任何事。',
    tags:['authority-abuse','gaslighting','self-erasure','romanticized-control'],
  },
  {
    type:'real',
    title:'伊藤詩織 ／ Black Box（2017）',
    quote:'她說出來了。整個社會卻問她：為什麼不早點說？為什麼要去那裡？',
    tags:['authority-abuse','victim-blaming','public-image'],
  },
  {
    type:'real',
    title:'台灣 #MeToo 浪潮（2023）',
    quote:'大家都說他是好人。所以她沉默了很多年。',
    tags:['authority-abuse','public-image','victim-blaming','isolation'],
  },
  {
    type:'real',
    title:'台灣《跟蹤騷擾防制法》立法背景（2022）',
    quote:'她說他讓她覺得窒息。周圍的人說，那是因為他太愛她了。',
    tags:['schedule-control','isolation','escalation','romanticized-control'],
  },
  {
    type:'real',
    title:'Chris Brown & Rihanna（2009）',
    quote:'很多人的第一反應是：她做了什麼才讓他這樣？',
    tags:['escalation','victim-blaming','public-image'],
  },
  {
    type:'real',
    title:'Natascha Kampusch ／ 斯德哥爾摩症候群（2006）',
    quote:'被囚禁八年後，她哭著為囚禁她的人哭泣。這不是軟弱。這是生存。',
    tags:['isolation','gaslighting','self-erasure','romanticized-control'],
  },
  {
    type:'fiction',
    title:'《暮光之城》Twilight — Edward & Bella',
    quote:'他在她睡覺時守在她房間裡。這被稱為愛。',
    tags:['romanticized-control','isolation','schedule-control','love-bombing'],
  },
  {
    type:'fiction',
    title:'《流星花園》— 道明寺 & 杉菜',
    quote:'他第一次出現是為了霸凌她。後來這被稱為他愛她的方式。',
    tags:['romanticized-control','public-image','escalation'],
  },
  {
    type:'fiction',
    title:'《後宮甄嬛傳》— 甄嬛 & 皇上',
    quote:'她學會了在笑容裡藏住所有不被允許說出口的事。',
    tags:['authority-abuse','isolation','self-erasure','gaslighting'],
  },
  {
    type:'fiction',
    title:'《坡道上的家》— 里沙子的婚姻',
    quote:'她不確定自己是不是快樂的。她也不確定自己是不是有權利不快樂。',
    tags:['gaslighting','self-erasure','isolation','schedule-control'],
  },
  {
    type:'fiction',
    title:'《Gone Girl》— Nick & Amy Dunne',
    quote:'她花了多年時間成為他想要的人。然後她決定讓他為此付出代價。',
    tags:['gaslighting','romanticized-control','public-image'],
  },
  {
    type:'fiction',
    title:'《玩偶之家》— Nora & Torvald',
    quote:'他以為他非常了解她。他甚至不知道她的名字叫什麼。',
    tags:['self-erasure','gaslighting','financial-control','isolation'],
  },
  {
    type:'fiction',
    title:'《82年生的金智英》',
    quote:'她說不出哪裡不對。這才是最難受的地方。',
    tags:['self-erasure','gaslighting','isolation','victim-blaming'],
  },
];

function selectCases(n) {
  const scored = CASES.map(c => ({
    ...c,
    score: c.tags.filter(t => STORY_TAGS.includes(t)).length,
  }));
  scored.sort((a, b) => b.score - a.score || seededRandom(SA + a.title.length) - 0.5);
  const real = scored.filter(c => c.type === 'real');
  const fiction = scored.filter(c => c.type === 'fiction');
  const result = [];
  let ri = 0, fi = 0;
  while (result.length < n) {
    if (ri < real.length && (result.length % 2 === 0 || fi >= fiction.length)) {
      result.push(real[ri++]);
    } else if (fi < fiction.length) {
      result.push(fiction[fi++]);
    } else break;
  }
  return result;
}
