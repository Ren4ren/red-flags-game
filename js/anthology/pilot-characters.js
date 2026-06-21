// ── 主線試點：三個玩家角色起始資源 ──
// 來源：《三個玩家角色 起始資源 v0.1》（strawman，數字可調）
// Slice 1 只接通「觀察力 → 看見（識人之眼）」；其餘四個 active 數值先顯示、暫不驅動。
// 設計命題：同一個 Julian，三個人玩起來完全不同 —— 因為「資源＝選擇權」。

const PILOT_CHARACTERS = {
  heiress: {
    id: 'heiress',
    archetype: '富家女',
    avatarText: '富',
    avatarStyle: 'background:linear-gradient(135deg,#7a6a3a,#3a2e1e)',
    tagline: '什麼都有，唯獨看不穿。',
    blurb: '她走得掉，問題是她不覺得需要走。最諷刺的紅旗，是她自己的天真。',
    resources: {
      觀察力: 35,  // ← 驅動「看見」（最低：最看不出紅旗）
      自信: 40,
      邊界感: 26,
      韌性: 60,
      壓力: 8,
      金錢: 90,   // → 獵物價值高 = 他最捨不得放手（肥羊）
      美貌: 55,
    },
    leaveCost: '低',
  },
  everywoman: {
    id: 'everywoman',
    archetype: '普通女性',
    avatarText: '普',
    avatarStyle: 'background:linear-gradient(135deg,#4a3f6b,#2d3a5a)',
    tagline: '沒有特別的優勢，也沒有特別的劣勢。',
    blurb: '真實的多數人。她的結局最靠你的判斷，不靠運氣。',
    resources: {
      觀察力: 55,
      自信: 28,
      邊界感: 31,
      韌性: 50,
      壓力: 10,
      金錢: 50,
      美貌: 50,
    },
    leaveCost: '中',
  },
  singlemom: {
    id: 'singlemom',
    archetype: '單親媽媽',
    avatarText: '媽',
    avatarStyle: 'background:linear-gradient(135deg,#6b3a3a,#2e1e1e)',
    tagline: '看得最清楚，卻最走不掉。',
    blurb: '她的悲劇不是看不見，是看見了也動不了。',
    resources: {
      觀察力: 72,  // ← 最高：最懂紅旗
      自信: 24,
      邊界感: 30,
      韌性: 35,
      壓力: 22,
      金錢: 15,   // → 獵物價值低 = 他用完即丟、惱羞成怒甩她
      美貌: 50,
    },
    leaveCost: '高',
  },
};

const PILOT_ORDER = ['heiress', 'everywoman', 'singlemom'];

// 觀察力(0–100) → 起始識人之眼點數（可調）
// 低觀察力幾乎全瞎，高觀察力一眼看穿。識人階門檻：1=留心、3=識人、6=老練。
function observationToInsight(obs) {
  if (obs >= 70) return 6; // 老練：戳破他的線索與選項幾乎全看得到
  if (obs >= 50) return 3; // 識人：看得到大部分
  if (obs >= 40) return 2; // 留心＋
  return 1;                // 留心：勉強比天真多看一眼，會錯過比較利的戳破選項
}

// 獵物價值：掠食者多想留住妳 = f(金錢, 美貌)。錢佔大頭、美貌加成（可調）。
// 設計鉤子：美貌沒配抵抗屬性 = 招來更兇的蒼蠅（未來玩家配點時，加爆美貌＝把自己變磁鐵）。
function preyValue(char) {
  const r = char.resources;
  return Math.round((r.金錢 || 0) * 0.7 + (r.美貌 || 0) * 0.3);
}
function preyTier(char) {
  const v = preyValue(char);
  if (v >= 60) return 'high'; // 死纏不放
  if (v >= 38) return 'mid';
  return 'low';               // 用完即丟
}
