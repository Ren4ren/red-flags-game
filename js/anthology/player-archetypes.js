// ── 主線選集：玩家起始人生 / 資源 ──
// 來源：《三個玩家角色 起始資源 v0.1》（strawman，數字可調）
// 主線目前用這份資料決定選角、起始識人之眼、持久化資源與獵物價值。

const PLAYER_ARCHETYPES = {
  heiress: {
    id: 'heiress',
    archetype: 'Mia',
    avatarText: 'M',
    avatarStyle: 'background:linear-gradient(135deg,#7a6a3a,#3a2e1e)',
    tagline: '她身邊從來不缺人介紹。',
    blurb: '但她想自己遇見一個會讓她想多聊一下的人。',
    resources: {
      觀察力: 35,
      自信: 40,
      邊界感: 26,
      韌性: 60,
      警戒: 20,
      壓力: 8,
      金錢: 90,
      美貌: 55,
    },
    leaveCost: '低',
  },
  everywoman: {
    id: 'everywoman',
    archetype: 'Nora',
    avatarText: 'N',
    avatarStyle: 'background:linear-gradient(135deg,#4a3f6b,#2d3a5a)',
    tagline: '她想遇到一個連廢話都聊得很開心的人。',
    blurb: '不是每天都要很特別。有人能一起笑就很好。',
    resources: {
      觀察力: 55,
      自信: 28,
      邊界感: 31,
      韌性: 50,
      警戒: 45,
      壓力: 10,
      金錢: 50,
      美貌: 50,
    },
    leaveCost: '中',
  },
  singlemom: {
    id: 'singlemom',
    archetype: 'Kai',
    avatarText: 'K',
    avatarStyle: 'background:linear-gradient(135deg,#6b3a3a,#2e1e1e)',
    tagline: '她很久沒有只為自己出門了。',
    blurb: '今晚想把一點時間留給會讓她笑的人。',
    resources: {
      觀察力: 72,
      自信: 24,
      邊界感: 30,
      韌性: 35,
      警戒: 70,
      壓力: 22,
      金錢: 15,
      美貌: 50,
    },
    leaveCost: '高',
  },
};

const PLAYER_ARCHETYPE_ORDER = ['heiress', 'everywoman', 'singlemom'];

function observationToInsight(obs) {
  if (obs >= 70) return 6;
  if (obs >= 50) return 3;
  if (obs >= 40) return 2;
  return 1;
}

function preyValue(char) {
  const r = char.resources;
  return Math.round((r.金錢 || 0) * 0.7 + (r.美貌 || 0) * 0.3);
}

function preyTier(char) {
  const v = preyValue(char);
  if (v >= 60) return 'high';
  if (v >= 38) return 'mid';
  return 'low';
}
