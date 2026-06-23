// ── English playtest build: three player-character starting resources ──
// NOTE: the resource KEYS below (觀察力, 自信, etc.) are also internal code keys
// read all over the engine. They are NEVER shown to the player, so we leave them
// in Chinese on purpose — only the visible display strings are translated.

const PILOT_CHARACTERS = {
  heiress: {
    id: 'heiress',
    archetype: 'The Heiress',
    avatarText: 'H',
    avatarStyle: 'background:linear-gradient(135deg,#7a6a3a,#3a2e1e)',
    tagline: 'Has everything — except the eye to see through people.',
    blurb: 'She can walk away anytime; she just never thinks she needs to. Her most ironic red flag is her own innocence.',
    resources: {
      觀察力: 35,  // ← drives "seeing" (lowest: worst at spotting red flags)
      自信: 40,
      邊界感: 26,
      韌性: 60,
      警戒: 20,   // guardedness toward strangers (display only for now)
      壓力: 8,
      金錢: 90,   // → high prey value = he least wants to let go (the fat catch)
      美貌: 55,
    },
    leaveCost: 'Low',
  },
  everywoman: {
    id: 'everywoman',
    archetype: 'The Everywoman',
    avatarText: 'E',
    avatarStyle: 'background:linear-gradient(135deg,#4a3f6b,#2d3a5a)',
    tagline: 'No special advantages. No special weaknesses.',
    blurb: 'Most real people. Her ending rests on your judgment, not on luck.',
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
    leaveCost: 'Medium',
  },
  singlemom: {
    id: 'singlemom',
    archetype: 'The Single Mother',
    avatarText: 'M',
    avatarStyle: 'background:linear-gradient(135deg,#6b3a3a,#2e1e1e)',
    tagline: 'Sees it most clearly — and can leave it least.',
    blurb: 'Her tragedy is not that she cannot see. It is that seeing changes nothing.',
    resources: {
      觀察力: 72,  // ← highest: reads red flags best
      自信: 24,
      邊界感: 30,
      韌性: 35,
      警戒: 70,
      壓力: 22,
      金錢: 15,   // → low prey value = he uses her up and tosses her, turning nasty
      美貌: 50,
    },
    leaveCost: 'High',
  },
};

const PILOT_ORDER = ['heiress', 'everywoman', 'singlemom'];

// 觀察力(0–100) → starting "eye for people" points (tunable)
// Low observation = nearly blind; high observation = sees through at a glance.
// Tier thresholds: 1 = Watchful, 3 = Perceptive, 6 = Seasoned.
function observationToInsight(obs) {
  if (obs >= 70) return 6; // Seasoned: sees almost every tell and probe option
  if (obs >= 50) return 3; // Perceptive: sees most
  if (obs >= 40) return 2; // Watchful+
  return 1;                // Watchful: barely a notch above naive; misses the sharper probes
}

// Prey value: how badly the predator wants to keep you = f(money, looks).
// Money dominates, looks add a bonus (tunable).
function preyValue(char) {
  const r = char.resources;
  return Math.round((r.金錢 || 0) * 0.7 + (r.美貌 || 0) * 0.3);
}
function preyTier(char) {
  const v = preyValue(char);
  if (v >= 60) return 'high'; // won't let go
  if (v >= 38) return 'mid';
  return 'low';               // used up and discarded
}
