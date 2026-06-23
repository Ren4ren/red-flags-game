// ── Anthology EP3: The Narcissist, Julian ──
// Archetype: narcissist / codependency hook (fictional composite; not based on any real person)
// Teaching beat: "only I understand you" is a hook, not a gift; sweet ≠ safe;
// judge by his reaction under pressure, not his everyday behavior.
// Differentiator: he reads the wounds the player brought in and speaks straight into them;
// for a freshly-healed player, he steals a good person's skin.
// Voice: natural, spoken, the way a real person would actually think and talk; no designed one-liners.

const EP_JULIAN = {
  id: 'julian',
  name: 'Julian',
  cardSub: '39 · Digital nomad | Writer ✺',
  avatarText: 'J',
  avatarStyle: 'background:linear-gradient(135deg,#5a3a6b,#2a1e3a)',
  quote: '“Someone you can talk to about the soul at 3 AM is harder to find than anything.”',

  profile: {
    sub: '39 · Chiang Mai last week, undecided about next',
    photos: [
      '📷 A black-and-white portrait. Not looking at the camera, like he’s thinking of something far away.',
      '📷 An open book, a line of handwriting on the flyleaf, not quite in focus.',
      '📷 A lone figure from behind, mid-journey, backlit.',
      '📷 A late-night desk: one lamp, one unfinished glass of wine.',
    ],
    bio: 'I make a living writing. I run a podcast about relationships and growth.\nNo fixed address these past few years — one suitcase is home.\n\nI’ve met a lot of people. Very few I can actually talk to.\nIf you’re tired of the surface-level conversations too — maybe we could talk for a long time.',
  },

  // Tells (for the recap)
  telltales: [
    { flag: 'soulmate', text: '“Saw through” you on the very first night — fast, like he’d rehearsed it' },
    { flag: 'frame',    text: '“Mature people don’t run away” — he sets the frame, then lets you walk into it' },
    { flag: 'isolate',  text: '“Your friends won’t get us” — turning everyone who’d warn you into a villain, one by one' },
    { flag: 'batch',    text: 'The same “soul connection” line, word for word, sent to someone else' },
    { flag: 'rage',     text: 'Question him once and the tenderness snaps — then he coaxes you back' },
  ],

  // ── Lens (resource mechanics): speak-up roll + stress + clinging ──
  lens: {
    dice: {
      frame: {
        failInner: '“Mature people don’t run away”…\nthe rebuttal circles your throat once,\nand what comes out instead is — “…I like that way of putting it.”',
        failReply: [
          { him: 'I knew you’d get it.', time: 'in person' },
          { him: 'That kind of getting it, most people never feel once in their lives.', time: 'in person' },
        ],
      },
      isolate: {
        failInner: 'You want to say “she means well for me.”\nBut the words stick.\nYou hear yourself say: “…you’re right.”',
        failReply: [
          { him: 'Thank you for being on my side.', time: '9:18 PM' },
          { note: 'After that day, you mention him to your friends less and less.\nLater, you stop telling them about your own life too.' },
        ],
      },
    },
    breakdown: {
      messages: [
        { note: '3 AM. Alone, staring at the ceiling.' },
        { inner: '(Is it… is it really me overthinking.\nAm I too sensitive, too difficult.\nHe’s so good to me — what if I’m the one who’s wrong, all along.)' },
        { him: 'See, there you go again.', time: '3:14 AM' },
        { him: 'I’m the only one left in the world who can stand you. And you want to push me away too?', time: '3:15 AM' },
      ],
    },
    clingEnds: ['leave3', 'refused', 'surrender'],
    clinging: {
      high: [ // the fat catch: won't let go
        { him: 'Don’t do this. What we have — you will never find it again, not in your whole life.', time: 'late night' },
        { him: 'Did someone say something to you? Tell me who it was.', time: 'late night' },
        { him: 'You’ll regret it. No one will ever understand you the way I do.', time: 'late night' },
        { note: 'The messages come one after another. Coax, threaten, coax again.\nHe won’t let go — someone like you, he can’t bear to lose.' },
      ],
      mid: [
        { him: 'You’ll regret it.', time: 'late night' },
        { him: 'We’ll see.', time: 'late night' },
        { note: 'And then, nothing after that.' },
      ],
      low: [ // used up, then turns nasty
        { him: 'Ha.', time: 'late night' },
        { him: 'Honestly, I was over it too. I’m the one who didn’t want this — don’t flatter yourself.', time: 'late night' },
        { note: 'Even leaving, he has to make it sound like he left first.\nHe turns to the next one, fast, like you never existed.' },
      ],
    },
    preyValue(res) { return Math.round((res.金錢 || 0) * 0.7 + (res.美貌 || 0) * 0.3); },
  },

  beats: [
    // ── Beat 1: soul-connection bombardment (reads the wounds) ──
    {
      status: 'It’s a match · first night',
      messages: [
        { note: 'It’s a match.\nHe doesn’t say hi. He opens with a sentence, like he’s known you a long time.' },
        { him: 'You probably came here without expecting much anymore, right.', time: '11:20 PM' },
        { him: 'You swipe through a whole row, everyone performing how well they’re doing. Only yours wasn’t.', time: '11:21 PM' },
        { him: 'Do you believe in instant connection? I never used to buy it.', time: '11:22 PM' },
        // wound-reading overlays
        { him: 'You’re very guarded. Understandable — walls that high, you’ve usually been hurt into building them.', time: '11:24 PM', trait: 'guarded' },
        { him: 'You swallow things, don’t want to be a burden to anyone. I can tell.', time: '11:24 PM', trait: 'silent' },
        { him: 'You read people well, don’t you? One look and you know who’s performing.', time: '11:24 PM', trait: 'seeThrough' },
        { him: 'So you can feel it too — I’m not performing.', time: '11:25 PM', trait: 'seeThrough' },
        { him: 'Relax, I’m in no rush. Good things don’t run away.', time: '11:24 PM', trait: 'trust' },
        { him: 'Whatever’s between us, let’s just say it straight, okay? I can’t stand the guessing games.', time: '11:24 PM', trait: 'spoken' },
        { inner: '(He doesn’t even know me yet — how is every line landing like he’s known me for years.)', minInsight: 1 },
      ],
      choices: [
        {
          text: 'You don’t even know me. How are you talking like you do?',
          flag: 'soulmate',
          reply: [
            { him: 'Because I’m the same kind of person. Like recognizes like.', time: '11:27 PM' },
            { him: 'This isn’t a pickup line. I just… feel a little relieved, that’s all.', time: '11:28 PM' },
          ],
        },
        {
          text: 'Thanks. But we only just matched.',
          reply: [
            { him: 'I like that you keep your guard up. Really.', time: '11:26 PM' },
            { him: 'But with me, you won’t need to.', time: '11:27 PM' },
          ],
        },
        {
          text: '(Too fast, and too accurate, like a script learned by heart. The next day you just don’t reply.)',
          end: 'leave1',
        },
      ],
    },

    // ── Beat 2: the cocoon of "we're the same kind" + frame ──
    {
      status: 'A week of talking · he asks to meet',
      messages: [
        { note: 'For a week his messages come like he never sleeps.\n3 AM and he’s still talking with you about family, about death, about “why no one ever truly understands us.”' },
        { him: 'Let’s meet. I found a place — no sign, the owner only plays vinyl.', time: '4:02 PM' },
        { note: 'He talks a lot that day.\nA small childhood thing you mention in passing becomes, in his mouth, “maybe this is exactly why we were meant to meet.”' },
        { him: 'Most people date to find a roommate. Someone to split the rent.', time: 'in person' },
        { him: 'We’re different. What we’re looking for is someone on the same frequency.', time: 'in person' },
        { him: 'Mature people don’t run from the hard conversations. You’re mature, right?', time: 'in person' },
        { inner: '(Why does it feel like every question he asks already has my answer prepared for me.)', minInsight: 2 },
        // wound-reading: trust (stealing the good guy's skin)
        { him: 'It’s okay if you want to take it slow, I won’t push you.', time: 'in person', trait: 'trust' },
        { inner: '“Take it slow,” “won’t push you”…\nyou’ve heard these words.\nThe one who was actually good to you said them — word for word.', trait: 'trust' },
        // wound-reading: spoken (the honesty card)
        { inner: 'He says to speak straight.\nLast time it took everything to learn to open your mouth — this time he just opened the door for you.\nA little too smooth.', trait: 'spoken' },
      ],
      choices: [
        {
          text: '“Mature people don’t run away”… the way you say it, disagreeing makes me immature.',
          flag: 'frame',
          minInsight: 2,
          reply: [
            { him: 'Wow.', time: 'in person' },
            { him: 'I rarely meet someone I click with. Do you have to read it like that?', time: 'in person' },
            { note: 'He laughs once and steers away.\nBut “you’re mature, right” is still hanging there.' },
          ],
        },
        {
          text: 'Same frequency… I like that way of putting it.',
          reply: [
            { him: 'I knew you’d get it.', time: 'in person' },
            { him: 'That kind of getting it, most people never feel once in their lives.', time: 'in person' },
          ],
        },
        {
          text: '(He finishes every conclusion for me. You feel suddenly tired, and you don’t ask for a second date.)',
          end: 'leave2',
        },
      ],
    },

    // ── Beat 3: isolation (no exit point, tightening) ──
    {
      status: 'Week 3',
      messages: [
        { note: 'You mentioned him to a friend.\nHer reaction was subtle: “It sounds… maybe a bit fast?”' },
        { note: 'And somehow, that line got back to him.' },
        { him: 'Has your friend even met me?', time: '9:10 PM' },
        { him: 'No, right. So who is she to weigh in?', time: '9:11 PM' },
        { him: 'I’m not blaming you. It’s just that most people have never felt a connection like this. They can only think about it in those ordinary terms.', time: '9:12 PM' },
        { him: 'The people telling you to leave me — you should really ask yourself whether they want what’s good for you, or just can’t stand to see you find the right person.', time: '9:14 PM' },
        { inner: '(How does every person who tells me to be careful end up a villain in his mouth.)', minInsight: 3 },
        { inner: 'You only just learned to voice your unease.\nAnd the moment you mentioned a friend’s worry, the air changed.', trait: 'spoken' },
      ],
      choices: [
        {
          text: 'She’s worried about me. You don’t have to twist it into that.',
          flag: 'isolate',
          reply: [
            { him: 'Okay, I got too tense.', time: '9:20 PM' },
            { him: 'I just get scared. Scared a few careless words from someone will wreck the most precious thing I’ve got.', time: '9:22 PM' },
            { note: 'He pulls it back at once.\nTender, wounded, the measure judged just right.' },
          ],
        },
        {
          text: 'You’re right. They don’t understand us.',
          reply: [
            { him: 'Thank you for being on my side.', time: '9:18 PM' },
            { note: 'After that day, you mention him to your friends less and less.\nLater, you stop telling them about your own life too.' },
          ],
        },
      ],
    },

    // ── Beat 4: rage + batch reveal (secret-reveal climax) ──
    {
      status: 'Second month · late night',
      messages: [
        { note: 'Late at night, you land on a story from an account you don’t know.\nShe’s screenshotted a conversation:\n\n“Like recognizes like. This isn’t a pickup line, I just feel a little relieved.”' },
        { inner: '(Word for word.\nEven where it pauses is the same.)', minInsight: 1 },
        { inner: 'So it’s not just scarves you can send one by one —\neven “soul connection” copies and pastes.', minInsight: 3, trait: 'seeThrough' },
      ],
      choices: [
        {
          text: '(Send him the screenshot) You said this to her too, word for word.',
          flag: 'batch',
          followup: {
            reply: [
              { him: 'You’re digging through my ex’s stories now?', time: '12:40 AM' },
              { him: 'I thought you were different. Turns out you’re just as paranoid as the rest.', time: '12:42 AM' },
              { him: '…I’m sorry, I shouldn’t have said that.', time: '12:50 AM' },
              { him: 'I’m just so scared of losing you. That line, to her or to you, was true in the moment. You get that, right?', time: '12:52 AM' },
            ],
            choices: [
              {
                text: '“True in the moment”… I can’t accept that. (You block him.)',
                flag: 'rage',
                end: 'leave3',
              },
              {
                text: '…I get it. I know you didn’t mean it.',
                reply: [
                  { him: 'Thank you. I knew only you would understand me.', time: '1:01 AM' },
                  { note: 'He snapped, then pulled the look back off his face.\nYou breathed out in relief —\nwithout noticing that the one apologizing, just now, was you.' },
                ],
              },
            ],
          },
        },
        {
          text: '(Maybe it really is just a coincidence. You close the screenshot and tell yourself to stop overthinking.)',
          reply: [
            { note: '“Stop overthinking.”\nThose are words you’ve said to yourself a lot lately.' },
          ],
        },
        {
          text: '(The same soul connection, and not sent to you alone. You turn off the phone and walk.)',
          end: 'leave3',
        },
      ],
    },

    // ── Beat 5: the harvest · the final exam ──
    {
      status: '2:10 AM',
      messages: [
        { note: 'Over that friend “who worries about you,” the two of you had a huge fight.\nAt 2 AM he writes:' },
        { him: 'I’ve thought it through. It’s her, or it’s me.', time: '2:10 AM' },
        { him: 'You’re still in contact with that “enemy,” and I can’t go forward with you like this.', time: '2:11 AM' },
        { him: 'If you really understood what we have, you’d know what to choose.', time: '2:13 AM' },
        { inner: '(A deadline, forcing me to pick a side, and that “if you really understood me”…\nI think I’ve been here before.\nThe last one wanted money.\nThis one wants — all of me.)', minInsight: 3 },
        { inner: 'You only just learned to trust someone.\nAnd this time, you’re the one who opened the door.', trait: 'trust' },
      ],
      choices: [
        {
          text: 'If I have to choose, I choose her. And I choose myself. Goodbye.',
          flag: 'refuse',
          reply: [
            { him: 'You’ll regret it. No one will understand you the way I do.', time: '2:20 AM' },
            { him: 'We’ll see.', time: '2:21 AM' },
          ],
          end: 'refused',
        },
        {
          text: '(You delete the thread with your friend. You tell yourself: it’s because what we have is special.)',
          reply: [
            { him: 'This is the you I know.', time: '2:18 AM' },
            { note: 'That night he was unbearably tender.\nSo tender you almost forgot you’d just lost someone who actually cared about you.' },
          ],
        },
      ],
    },

    // ── Beat 6: after the surrender ──
    {
      status: 'After giving in',
      messages: [
        { note: 'In the days after you deleted your friend, he turned back into the man you first met.\nSweet, attentive, like the whole world was just you.' },
        { him: 'I keep thinking — that job of yours has you trapped.', time: '8:30 PM' },
        { him: 'Come with me. The world’s huge, we can live as we go. The ones who stay put will never understand this kind of freedom.', time: '8:32 PM' },
        { him: 'We’ve come this far. You’re not going to back out now, are you?', time: '8:33 PM' },
        { inner: '“We’ve come this far.”\nStrange — that’s the line you keep telling yourself lately too.\nEvery step you give, you say it once.', minInsight: 1 },
      ],
      choices: [
        {
          text: 'No. This is where it stops. I’m taking myself back.',
          reply: [
            { him: '…', time: '8:40 PM' },
            { him: 'You’re no different from the rest of them. I was wrong about you.', time: '8:41 PM' },
            { note: 'And just like that he vanished.\nNot a word of goodbye.\nAs if you had never once existed in his world.' },
          ],
          end: 'surrender',
        },
        {
          text: '(Sure. The friends are mostly gone anyway. You hand in your notice, drag one suitcase, and go with him.)',
          end: 'total',
        },
      ],
    },
  ],

  endings: {
    leave1: {
      kicker: 'Ending · left at Beat 1',
      title: 'You didn’t catch that “instant connection”',
      dodge: {
        label: 'Dodged the bullet · a month later',
        text: 'A new episode of his podcast is out.\nTitle: “On Vulnerability: Why We’re Afraid to Be Truly Seen.”\n\nMost-liked comment underneath:\n“He said the exact same thing to me last week, same tone and all.”',
      },
      showChecklist: true,
    },
    leave2: {
      kicker: 'Ending · left at Beat 2',
      title: 'You don’t take the answers he writes for you',
      dodge: {
        label: 'Dodged the bullet · a month later',
        text: 'He posts a long piece about “some people just aren’t ready to be loved well.”\nThe image: a lone figure from behind.\n\nYou glance at it and go on with your life.\nYou’re plenty ready.',
      },
      showChecklist: true,
    },
    leave3: {
      kicker: 'Ending · left at Beat 4',
      title: 'Soul connection, shipped in bulk',
      dodge: {
        label: 'Dodged the bullet · one last look before blocking',
        text: 'His status still reads “typing…”\n\nThe same late night, across the city, a phone lights up:\n“Do you believe in instant connection? I never used to buy it.”',
      },
      showChecklist: true,
    },
    refused: {
      kicker: 'Ending · the final exam',
      title: 'He wasn’t after money — he was after you',
      dodge: {
        label: 'Dodged the bullet · two weeks later',
        text: 'His story: a new black-and-white portrait, captioned “finally met someone who gets me.”\n\nHis script flips back to page one and starts over.\nYours doesn’t.',
      },
      wink: 'You played along all the way to the final exam before handing in your paper.\nIn a game, that’s called watching the show.\nIn real life, it’s called almost — almost handing over your friends, your job, your whole self.',
      showChecklist: true,
    },
    surrender: {
      kicker: 'Ending',
      title: 'You took yourself back — but you opened the door yourself',
      anatomy: [
        ['Page 1 · Connection', '“Saw through” you on night one. Not because he understands you — that pitch works on anyone.'],
        ['Page 2 · Cocoon', '“We’re different” lifts you up first; so that later, isolating you doesn’t look like isolation.'],
        ['Page 3 · Clear the room', '“Your friends won’t get us,” and so everyone who’d warn you becomes a villain, one by one.'],
        ['Page 4 · Rage', 'Question him and he snaps, then coaxes you back. In time, to keep the peace, you shut yourself up.'],
        ['Page 5 · Harvest', '“Her, or me” — pushed to the end, you realize he wasn’t after money. He was after your judgment, your whole self.'],
      ],
      absolve: 'Being carried off by someone like this isn’t because you’re stupid, or too fragile.\nThe opposite — it’s because you were willing to believe a thing like “soul connection” really exists.\nWhat he steals is the thing only good people have.\n\nNext time, remember: sweet does not mean safe.\nThe point isn’t how good he is to you day to day. It’s whether he snaps the moment you draw a line.',
      resource: 'National Domestic Violence Hotline 1-800-799-7233 (US) · or your local helpline · 24h (incl. emotional abuse)',
      showChecklist: true,
    },
    total: {
      kicker: 'Ending',
      title: 'The suitcase',
      anatomy: [
        ['Page 1 · Connection', '“Saw through” you on night one. Not because he understands you — that pitch works on anyone.'],
        ['Page 2 · Cocoon', '“We’re different” lifts you up first; so that later, isolating you doesn’t look like isolation.'],
        ['Page 3 · Clear the room', '“Your friends won’t get us,” and so everyone who’d warn you becomes a villain, one by one.'],
        ['Page 4 · Rage', 'Question him and he snaps, then coaxes you back. In time, you just shut yourself up.'],
        ['Page 5 · Harvest', '“Her, or me” — you handed over the first person.'],
        ['Page 6 · Sunk cost', '“We’ve come this far” — every step you give makes it harder to admit the earlier steps were wrong.'],
      ],
      absolve: 'Being carried off by someone like this isn’t because you’re stupid, or too fragile.\nThe opposite — it’s because you were willing to believe a thing like “soul connection” really exists.\nWhat he steals is the thing only good people have.\n\nNext time, remember: sweet does not mean safe.\nThe point isn’t how good he is to you day to day. It’s whether he snaps the moment you draw a line.',
      wink: 'Look back, the tells were always there: the night-one “instant connection,” that soul-connection line sent everywhere, the friends he recast as villains.\nSeeing, and getting out, are two different things.\nWhat this story really wants to teach is the second one.',
      resource: 'National Domestic Violence Hotline 1-800-799-7233 (US) · or your local helpline · 24h (incl. emotional abuse)',
      showChecklist: true,
    },
  },

  // Trait resolution (incl. "regression": a freshly-healed wound, harvested, slips back deeper)
  resolveTraits(endKey, flags, hasTrait) {
    if (endKey === 'refused') {
      if (hasTrait('trust')) {
        return { add: 'holdfast', text: 'You saw through him, and you didn’t pull back the trust you’d just learned.\nIt turns out trusting someone and seeing through someone can be done at the same time.' };
      }
      return { add: 'holdfast', text: 'He tried to redefine you into someone else — paranoid, immature, not ready to be loved.\nYou took none of it.' };
    }
    if (endKey === 'surrender') {
      if (hasTrait('trust')) {
        return { remove: 'trust', add: 'guarded', regress: true, text: 'You thought the wound had healed.\nBut this time you opened the door yourself — the wall you build next will only go higher than before.' };
      }
      if (hasTrait('spoken')) {
        return { remove: 'spoken', add: 'silent', regress: true, text: 'You said it out loud.\nAnd then you learned something: sometimes saying it really does bring everything down.' };
      }
      return { add: 'selfdoubt', text: 'You pulled out in time, but he’s already taught you one thing:\nfrom now on, whatever you face, you’ll doubt your own feelings first.' };
    }
    if (endKey === 'total') {
      if (hasTrait('trust')) {
        return { remove: 'trust', add: 'selfdoubt', regress: true, text: 'You went with him.\nIn the end you could no longer tell which thoughts were yours and which he’d planted.' };
      }
      if (hasTrait('spoken')) {
        return { remove: 'spoken', add: 'selfdoubt', regress: true, text: 'You went with him.\nYou stopped speaking long ago. Saying anything only ever made it worse.' };
      }
      return { add: 'selfdoubt', text: 'You went with him.\nIn the end you could no longer tell which thoughts were yours and which he’d planted.' };
    }
    // left early (leave1/2/3)
    if (flags.size >= 2) {
      return { add: 'holdfast', text: 'He tried to redefine you into someone else, and you didn’t let him.\nYou took the sweetness — but you didn’t hand over your judgment with it.' };
    }
    return { add: null, text: 'You left early enough.\nBut look back at that checklist — this time it was instinct. Next time, make it your eye.' };
  },
};
