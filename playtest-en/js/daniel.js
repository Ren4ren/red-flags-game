// ── Anthology EP2: The Normal Guy, Daniel ──
// He really is just a good person. No twist.
// The comedy engine of this episode is the player's own suspicion.
// Teaching beat: a quirk is not a tell; you identify danger by pattern, not single events.

const EP_DANIEL = {
  id: 'daniel',
  name: 'Daniel',
  cardSub: '33 · ER nurse',
  avatarText: 'D',
  avatarStyle: 'background:linear-gradient(135deg,#2f6d5a,#1e3a5a)',
  quote: '“I cook. Three cats. Shift work, so I’m slow to reply — but I always do.”',

  profile: {
    sub: '33 · ER nurse (rotating shifts)',
    photos: [
      '📷 An average-quality hiking photo. Backlit, squinting from the smile.',
      '📷 A photo in a suit. Half of someone else cropped out beside him.',
    ],
    bio: 'ER nurse.\nI cook. Three cats.\nShift work, so I’m slow to reply — but I always do.',
  },

  // False-tell checklist (recap: q = what it looked like, a = what it actually was)
  telltales: [
    { flag: 'crop', q: 'The half-cropped person beside the suit photo — an ex?', a: 'His sister’s wedding. It was the one shot he looked decent in all night.' },
    { flag: 'cats', q: 'Almost no social-media presence — does this guy even exist?', a: 'Two thousand photos on his phone. All cats.' },
    { q: 'Slow to reply, online at 3 AM — hot and cold?', a: 'Night shifts. And the first line of his profile already said so.' },
    { q: 'First date at a hole-in-the-wall noodle shop — no effort?', a: 'He watched you all night, not the décor.' },
    { flag: 'msf', q: 'An unexplained savings goal — a secret?', a: 'Six months with Doctors Without Borders. A better person than he lets on.' },
  ],

  // ── Lens (resource mechanics) ──
  // Daniel is good. Stress here is the player's pent-up anxiety; "speaking up" is fragile but necessary.
  // The clinging set becomes Daniel's kind goodbye — same mechanic, different humanity.
  lens: {
    dice: {
      boundary: {
        failInner: 'You typed out “I’m a little anxious,” stared at the four words, and deleted them.\nSaying it out loud feels so hard.',
        failReply: [
          { note: 'You didn’t say it. He kept sending short messages; you kept staring at them, guessing.' },
        ]
      },
    },
    breakdown: {
      messages: [
        { inner: '(Here it goes again. It all starts out fine, and then —)' },
        { inner: '(No. He isn’t that guy. But you don’t know how to make it stop.)' },
      ]
    },
    clingEnds: ['leave2', 'ghost'],
    clinging: {
      high: [
        { him: 'Okay.', time: 'next day' },
        { him: 'If you ever want to talk, I’m here.', time: 'next day' },
        { him: 'Take care of yourself.', time: 'next day' },
      ],
      mid: [
        { him: 'Okay.', time: 'next day' },
        { him: 'I hope the next person makes you more comfortable than I did.', time: 'next day' },
      ],
      low: [
        { him: 'Okay. Take care.', time: 'next day' },
      ],
    },
    preyValue(res) { return 40; } // Daniel isn't a predator; fixed mid goodbye regardless of resources
  },

  beats: [
    // ── Beat 1: opening (very slow) ──
    {
      status: 'It’s a match · day 3',
      messages: [
        { note: 'It’s a match.\nHis first message comes three days later.' },
        { him: 'Hi. We matched, I spent three days on an opener, and this is still all I’ve got.', time: '8:14 PM' },
        { him: 'You wrote that you like noodles. I know a place, down an alley, no sign out front.', time: '8:15 PM' },
        { inner: 'Sebastian sent forty-seven messages on day one.\nThis guy sent two in three days.\n…which one is the normal one?', trait: 'guarded' },
      ],
      choices: [
        {
          text: 'You’ve only got two photos. The cropped person next to the suit one — who’s that?',
          flag: 'crop',
          reply: [
            { him: 'My sister. Her wedding.', time: '8:19 PM' },
            { him: 'The suit was actually ironed that day, it was the one shot I looked decent in all night, couldn’t bring myself not to use it.', time: '8:20 PM' },
            { him: 'I’m a little more ordinary than the photo. Heads up.', time: '8:20 PM' },
          ],
        },
        {
          text: 'An unmarked noodle shop, sure. When?',
          reply: [
            { him: 'Thursday night? I start three night shifts Friday, so Thursday I’m at my best.', time: '8:18 PM' },
            { him: '…that sounds deeply unromantic. But it’s true.', time: '8:19 PM' },
          ],
        },
      ],
    },

    // ── Beat 2: the noodle shop ──
    {
      status: 'Noodle shop · Thursday night',
      messages: [
        { note: 'He’s four minutes late. Apologizes at the door, says the bus was delayed —\npulls out his phone and shows you the live arrival tracker.' },
        { note: 'Before the noodles come, he takes a photo of each bowl.\n“Sending these to my mom. She doesn’t believe I eat properly.”' },
        { him: 'That project you mentioned last time — did it go through in the end?', time: 'in person' },
        { note: 'He waits for you to finish before he speaks.\nThen insists the noodles have to be tossed before you eat them, and explains the physics of it for thirty seconds. Completely straight-faced.' },
        { inner: 'Remembers every little thing you said —\nSebastian did too.\nWhat if… this is a routine too.', trait: 'guarded' },
        { inner: 'The way he explains tossing noodles,\nlike he’s guarding something important.', skipIfTrait: 'guarded' },
      ],
      choices: [
        {
          text: 'What else is on your phone besides noodles?',
          flag: 'cats',
          reply: [
            { note: 'He unlocks it and hands you the album.\nCats. Three of them. Over two thousand photos. You can barely find a single selfie.' },
            { him: 'Brought them home from a shelter. Was only supposed to take one.', time: 'in person' },
          ],
        },
        {
          text: 'I’m picking the place next time.',
          reply: [
            { him: 'Sure.', time: 'in person' },
            { him: 'But I have criteria. …Kidding. I’ll eat wherever you pick.', time: 'in person' },
          ],
        },
        {
          text: '(He’s nice. But so flat. After you get home, you don’t ask him out again.)',
          end: 'leave1',
        },
      ],
    },

    // ── Beat 3: the night-shift week ──
    {
      status: 'Night-shift week',
      messages: [
        { note: 'Three night shifts in a row.\nHis messages get short: “Off work, wiped.” “Reply later.”\nHe’s online at 5 AM, 6 AM.' },
        { inner: 'He’s gone cold. Here it comes.\nThey all go cold.', trait: 'guarded' },
        { inner: 'The rhythm changed.\nYou stare at that two-word message for a long time.', skipIfTrait: 'guarded' },
        { inner: 'Say it.\nLast time you swallowed the unease —\nswallowed it until you’d memorized a transfer account.', trait: 'silent' },
      ],
      choices: [
        {
          text: 'Your messages got short and I’m a little anxious. Not blaming you, just wanting to say it.',
          flag: 'boundary',
          reply: [
            { him: 'I’m sorry, I genuinely didn’t realize.', time: '5:42 AM' },
            { him: 'Night-shift me is basically a zombie. How about this — I’ll text you before each shift, and again when I’m off.', time: '5:44 AM' },
            { note: 'You drew a line.' },
          ],
        },
        {
          text: '(You start leaving him on read too. See who panics first.)',
          reply: [
            { note: 'On his next day off, he just calls:' },
            { him: 'Did I do something that made you uncomfortable? I’m a bit slow — you have to tell me straight.', time: 'phone call' },
          ],
        },
        {
          text: '(Hot and cold. You’ve seen this opening before — you’re not waiting for the ending.)',
          end: 'leave2',
        },
      ],
    },

    // ── Beat 4: a slip of paper falls out ──
    {
      status: 'Second month',
      messages: [
        { note: 'A slip of paper falls out of his notebook.\nA not-small savings goal, and an abbreviation beside it.\nYou recognize the abbreviation — not a house, not a car.' },
      ],
      choices: [
        {
          text: 'Is this… Doctors Without Borders?',
          flag: 'msf',
          reply: [
            { him: 'Ah. Caught.', time: 'in person' },
            { him: 'Want to go for six months, year after next. Been saving four years.', time: 'in person' },
            { him: 'Was going to wait till things were more settled to tell you. Not hiding it — just scared it’d scare you off.', time: 'in person' },
            { him: '…did it?', time: 'in person' },
          ],
        },
        {
          text: '(You fold the paper and hand it back without asking. Some things, you wait for him to say.)',
          reply: [
            { note: 'He watches you fold the paper and pass it back.\nHis lips move once, but in the end he just says “thanks.”' },
          ],
        },
        {
          text: '(That paper is lovely. He’s lovely. But six months long-distance… you quietly fade out.)',
          end: 'fade',
        },
      ],
    },

    // ── Beat 5: “something happened” (the final exam) ──
    {
      status: 'Two hours before dinner',
      messages: [
        { note: 'Two hours before your dinner, the phone lights up:' },
        { him: 'I’m so sorry, something happened, can we do another day', time: '5:12 PM' },
        { note: 'No details. No follow-up.' },
        { inner: 'Something happened. 72 hours. Pay you back tenfold.\n— No. That was a different man.\nBut this picture, you’ve seen it.', trait: 'guarded' },
        { inner: '“Something happened.”\nThree words.', skipIfTrait: 'guarded' },
      ],
      choices: [
        {
          text: 'What happened? Tell me clearly, right now. I’m not getting jerked around again.',
          followup: {
            reply: [
              { note: 'A long time passes before a message comes.\nIt’s from an unknown number.' },
              { him: 'Sorry I’m only replying now. Mass casualties came into my department tonight, I got called back in, my phone broke — this is a coworker’s.', time: '11:47 PM' },
              { him: 'Getting jerked around “again”… has someone done this to you before?', time: '11:48 PM' },
            ],
            choices: [
              {
                text: 'I’m sorry. I went through some things before. That was unfair of me.',
                flag: 'repair',
                reply: [
                  { him: 'It’s okay.', time: '11:52 PM' },
                  { him: 'I can probably guess what kind of people you ran into.', time: '11:53 PM' },
                ],
              },
              {
                text: 'Who knows if anything you say is even true.',
                reply: [
                  { note: 'Two days later he asks you out.\nLays out that whole night, start to finish, even gives you his coworker’s name.\nThen he goes quiet for a moment, and says:' },
                  { him: 'It’s alright. I hope the next person you meet makes life less exhausting for you.', time: 'in person' },
                ],
                end: 'interrogation',
              },
            ],
          },
        },
        {
          text: 'Okay. Whatever it is — just let me know tomorrow that you’re alright.',
          flag: 'healthy',
          reply: [
            { note: 'He replied the next evening.\nNine hours in the trauma bay. Said flatly.' },
            { him: 'The worst-off kid stabilized.', time: '6:20 PM' },
            { him: 'I owe you a dinner. This weekend, on me.', time: '6:21 PM' },
          ],
        },
        {
          text: '(A vague cancellation. You’ve had enough of this script — you’re out.)',
          end: 'ghost',
        },
      ],
    },

    // ── Beat 6: as he is ──
    {
      status: 'The make-up dinner',
      messages: [
        { note: 'Same unmarked noodle shop.\nHe finishes telling you about that night.\n“The worst-off kid was discharged today.”' },
        { him: 'My sister’s birthday dinner is next month. Want to come?', time: 'in person' },
        { him: 'Ever since the “wedding photo incident,” she’s been dying to see who you are.', time: 'in person' },
        { inner: 'You waited a whole story for the mask to come off.\n\nThere was no mask.' },
      ],
      choices: [
        {
          text: 'Sure. I’ll come.',
          end: 'miracle',
        },
        {
          text: '(Nothing’s wrong. But you notice you’ve been waiting for something to go wrong. Maybe you’re not ready yet.)',
          end: 'notyet',
        },
      ],
    },
  ],

  endings: {
    leave1: {
      kicker: 'Ending · left at Beat 2',
      title: 'The “coldness” you imagined was the night shift',
      dodge: {
        label: 'Six months later',
        text: 'A friend’s story: her and a guy, sitting in that unmarked noodle shop.\nLaughing.\n\nThe guy is, very seriously, tossing her noodles for her.',
      },
      showChecklist: true,
    },
    leave2: {
      kicker: 'Ending · left at Beat 3',
      title: 'Left on read — but he really was at work',
      dodge: {
        label: 'Those three days · his side',
        text: 'The hallway lights of the trauma bay.\nBack in the break room, he fell asleep sitting up, phone still in his hand.\nFirst thing on waking: reply to you.\n\n“Off work, wiped.”\nThat’s all the words he had left. But he still sent them.',
      },
      showChecklist: true,
    },
    fade: {
      kicker: 'Ending · left at Beat 4',
      title: 'Some leaving has nothing to do with red flags',
      absolve: 'He isn’t the wrong person. Six months long-distance isn’t a wrong reason either.\nThis pool teaches you to spot danger —\nbut not every leaving needs a red flag for a reason.\n\nThe life you want to live can simply be the answer.',
      showChecklist: false,
    },
    ghost: {
      kicker: 'Ending · left at Beat 5',
      title: 'That night, he was in the trauma bay',
      dodge: {
        label: 'That night · his side',
        text: 'Mass casualties. Nine hours.\nIn the small hours he borrowed a coworker’s phone and typed a long explanation.\n\nFailed to send.\nReason: you have been blocked.',
      },
      showChecklist: true,
    },
    interrogation: {
      kicker: 'Ending · the final exam',
      title: 'Interrogation over, acquitted — but you left anyway',
      wink: 'He isn’t Sebastian.\nBut you interrogated him the way you’d interrogate Sebastian.\n\nGuardedness is armor against predators.\nAgainst good people, it’s a weapon.',
      showChecklist: true,
    },
    notyet: {
      kicker: 'Ending',
      title: 'You’re still waiting for something to go wrong',
      absolve: 'Vigilance has saved you.\nBut vigilance won’t tell you when it’s safe to put it down — that’s yours to decide.\n\nThe door isn’t closed.\nHis kind doesn’t slam it.',
      showChecklist: true,
    },
    miracle: {
      kicker: 'Ending',
      title: 'An ordinary miracle',
      absolve: 'Nothing dramatic happened.\nThat’s the whole point.',
      wink: 'Look back: where you almost let him go —\nbecause it was too flat, because the messages got short, because of one detail-free “something happened.”\n\nA quirk is not a tell. A tell points to a predator; a quirk only points to a human.\nIdentification is about pattern, not a single event.',
      showChecklist: true,
    },
  },

  resolveTraits(endKey, flags, hasTrait) {
    if (endKey === 'interrogation') {
      return { add: 'jumpy', text: 'Your vigilance truly hurt someone for the first time.\nIt was you.' };
    }
    if (endKey === 'miracle') {
      if (hasTrait('guarded')) {
        return { remove: 'guarded', add: 'trust', text: 'Wounds heal.\nIt takes time, and a good person.\n“Guarded” fades from your card.' };
      }
      if (hasTrait('silent') && flags.has('boundary')) {
        return { remove: 'silent', add: 'spoken', text: 'You spoke your unease, and the world didn’t end.\n“Can’t Speak Up” fades from your card.' };
      }
      return { add: null, text: 'Your card doesn’t need a new word.\nNot this time.' };
    }
    return { add: null, text: null };
  },
};
