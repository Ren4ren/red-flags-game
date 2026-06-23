// ── Anthology EP1: The Love Scammer, Sebastian ──
// Archetype: romance fraud (fictional composite; not based on any real person)
// Teaching beat: the moment money comes up, the person walks.

const EP_SEBASTIAN = {
  id: 'sebastian',
  name: 'Sebastian',
  cardSub: '35 · Investor | Entrepreneur | Bon vivant ✈️',
  avatarText: 'S',
  avatarStyle: 'background:linear-gradient(135deg,#8a6d2f,#4a3a16)',
  quote: '“Seen enough of the world. Now I just want someone to see it with.”',

  profile: {
    sub: '35 · Taipei / Singapore / Dubai',
    photos: [
      '📷 A selfie inside a private jet cabin. Leather seat, a glass of champagne, a smile dialed in just right.',
      '📷 Leaning on a sports car, blazer draped over one arm.',
      '📷 On a yacht deck, back to the camera, watching the sunset.',
      '📷 Close-up of a wrist, the watch face turned to the light.',
    ],
    bio: 'Investor | Entrepreneur\nFamily’s in the jewelry trade. I split my time three ways: Taipei, Singapore, Dubai.\n\nNot much time outside work. I’d like to spend it on the right person.',
  },

  // Tells (for the recap)
  telltales: [
    { flag: 'cities', text: '“Based in three cities” — and not one of them checkable' },
    { flag: 'cards',  text: 'The “cross-border risk hold” that only hit after three cards' },
    { flag: 'parcel', text: 'A parcel that vanished the instant you questioned it' },
    { flag: 'scarf',  text: 'Mass-produced devotion: same scarf, same handwritten card' },
    { flag: 'notice', text: 'A “frozen account” notice that could never, ever be shown' },
  ],

  // ── Lens (resource mechanics): speak-up roll + stress + clinging ──
  lens: {
    dice: {
      cities: {
        failInner: 'You want to ask. The words climb to your mouth, then slide back down. “Cross-border stuff. It’s always like this.”',
        failReply: [
          { him: 'I knew you’d get it.', time: '10:08 PM' },
          { him: 'That kind of eye is rare.', time: '10:09 PM' },
        ]
      },
      cards: {
        failInner: 'You want to ask, but he laughs so easily — maybe you’re reading too much into it.',
        failReply: [
          { him: 'You’re really easy to be around.', time: '11:04 PM' },
          { note: 'He called you a cab home.' },
        ]
      },
      parcel: {
        failInner: 'You want to say it’s not convenient. But “a small favor” really doesn’t sound like much.',
        failReply: [
          { him: 'Thank you. Really.', time: '3:22 PM' },
          { him: 'It’s good having you.', time: '3:22 PM' },
        ]
      },
      notice: {
        failInner: '“The lawyer says it can’t leave the firm” —\nthat sounds sort of reasonable. You let it go.',
        failReply: [
          { him: 'Thank you for trusting me.', time: '1:56 AM' },
          { him: 'Sending you the account now.', time: '1:58 AM' },
        ]
      },
    },
    breakdown: {
      messages: [
        { note: 'Late at night, lying there alone. That thing he said earlier surfaces again.' },
        { inner: '(He said I’m the only one he trusts. So what does that make me…?)' },
        { inner: '(Maybe I’m overthinking it. He’s so good to me — I’m the one being paranoid.)' },
      ]
    },
    clingEnds: ['leave3', 'refused'],
    clinging: {
      high: [
        { him: 'Is this really worth it to you? After everything we…', time: '2:15 AM' },
        { him: 'I didn’t think you were this kind of person.', time: '2:17 AM' },
        { him: 'You’re going to regret doing this.', time: '2:19 AM' },
      ],
      mid: [
        { him: 'Fine.', time: '2:14 AM' },
        { him: 'I just hope the next guy treats you better than this.', time: '2:15 AM' },
        { note: 'Five minutes later, his profile photo was gone.' },
      ],
      low: [
        { him: 'Whatever.', time: '2:13 AM' },
        { note: 'His photo switched instantly to another jet-cabin selfie. Same cabin.' },
      ],
    },
    preyValue(res) { return Math.round((res.金錢 || 0) * 0.85 + (res.美貌 || 0) * 0.15); }
  },

  beats: [
    // ── Beat 1: bombardment & setup ──
    {
      status: 'It’s a match · first night',
      messages: [
        { note: 'It’s a match. Eleven minutes later, he messages first.' },
        { him: 'Finally.', time: '10:02 PM' },
        { him: 'Three weeks of swiping. You’re the first person I’ve stopped on.', time: '10:02 PM' },
        { him: 'Your smile isn’t performing for anyone. That’s rare now.', time: '10:03 PM' },
        { him: 'I’m in Taipei all week. Let me take you to dinner — you pick the day, I’ll handle the rest.', time: '10:05 PM' },
      ],
      choices: [
        {
          text: 'Your profile says based in three cities. So where do you actually live?',
          flag: 'cities',
          reply: [
            { him: 'Mostly Singapore. A few deals in Taipei, family business in Dubai.', time: '10:08 PM' },
            { him: 'Though honestly — now I’ve got one more reason to keep coming to Taipei.', time: '10:09 PM' },
          ],
        },
        {
          text: 'Sure. Friday?',
          reply: [
            { him: 'Done. I’ll book it, you just show up.', time: '10:07 PM' },
            { him: 'And for the record — money has never been a problem for me. With me, you never have to worry about a thing.', time: '10:08 PM' },
          ],
        },
      ],
    },

    // ── Beat 2: the high-end restaurant ──
    {
      status: 'First date · Friday night',
      messages: [
        { note: '51st floor. Floor-to-ceiling windows.\nThe price of the appetizers makes you decide not to turn to the mains.' },
        { him: 'Don’t look at the right side of the menu. Look at me.', time: 'in person' },
        { him: 'Next month I’m flying to the Maldives for a deal. Can you get the time off? My island — a friend’s island — it’s beautiful.', time: 'in person' },
        { inner: '(He just said “my island.” And switched it to “a friend’s island” in the same breath.)', minInsight: 1 },
        { note: 'At the till, his first card is declined. So is the second. The third goes through.\nHe laughs: “Cross-border accounts. The fraud holds are a nightmare.”' },
      ],
      choices: [
        {
          text: 'Those three cards just now — what was that about?',
          flag: 'cards',
          reply: [
            { him: 'That’s just how cross-border assets are. Locked at the drop of a hat. My lawyers are used to it.', time: '11:02 PM' },
            { him: 'I’ll bring cash next time. More romantic anyway, ha.', time: '11:03 PM' },
            { note: 'He slips the card back into his wallet and steers the conversation elsewhere.' },
          ],
        },
        {
          text: 'The Maldives sounds… not quite real.',
          reply: [
            { him: 'Stick with me and you’ll have to get used to “not quite real.”', time: '11:02 PM' },
            { him: 'You deserve this. I mean it.', time: '11:02 PM' },
          ],
        },
        {
          text: '(All of it too fast, too bright. From the next day on, you just don’t reply.)',
          end: 'leave1',
        },
      ],
    },

    // ── Beat 3: acceleration & light isolation ──
    {
      status: 'Week 2',
      messages: [
        { note: 'Over the next two weeks his messages come in like a rising tide.\nGood morning, good afternoon, sudden voice notes, a late-night “thinking of you.”' },
        { him: 'I mentioned you to my mother. She said I sound different.', time: '3:11 PM' },
        { him: 'Oh — and don’t tell your friends about us yet, okay?', time: '3:14 PM' },
        { him: 'It’s not that I’m hiding you. It’s that they’ll judge us by their standards. I want to protect this.', time: '3:14 PM' },
        { him: 'Also, small favor. A parcel’s arriving at your place in a couple of days — a watch. Could you hold it for me? Customs thing, long story.', time: '3:20 PM' },
        { inner: '(A watch. Not sent to his own hotel — sent to my home.)', minInsight: 2 },
      ],
      choices: [
        {
          text: 'Why not send the parcel to your hotel?',
          flag: 'parcel',
          reply: [
            { him: 'Hotel front desks lose things. Last time they lost a Patek — I couldn’t even laugh about it.', time: '3:24 PM' },
            { him: '…never mind, I won’t trouble you. I’ll sort it another way.', time: '3:25 PM' },
            { note: 'He never mentioned the watch again. Not once.' },
          ],
        },
        {
          text: 'Sure, no big deal.',
          reply: [
            { him: 'You’re an angel.', time: '3:21 PM' },
            { note: 'The parcel arrived two days later.\nNo sender. Brown paper box. Heavier than it looks.' },
          ],
        },
        {
          text: '(Hiding it from friends, plus an unmarked parcel. You scroll back up through the whole thread, then block him.)',
          end: 'leave2',
        },
      ],
    },

    // ── Beat 4: the scarf (secret reveal) ──
    {
      status: 'Week 3',
      messages: [
        { note: 'He sent you a scarf.\n“Limited edition, worldwide. Had a friend bring it from Milan. Picked it for you.”\nWith a handwritten card.' },
        { note: 'Late one weekend night, you land on a stranger’s story.\nThe same scarf. The same card.\nEven the curve at the end of the handwriting is identical.' },
        { inner: 'Maybe it’s a coincidence.\nLimited edition still means there’s a quantity.' },
      ],
      choices: [
        {
          text: '(You screenshot it and send: “What is this?”)',
          flag: 'scarf',
          reply: [
            { him: 'That’s my cousin.', time: '12:41 AM' },
            { him: 'Are you stalking me? I didn’t think you were the paranoid type.', time: '12:43 AM' },
            { him: 'Forget it. I’ve been in a bad place lately. Give me some space.', time: '12:44 AM' },
          ],
        },
        {
          text: '(You save the screenshot to your album. You say nothing. You tell yourself: wait for him to bring it up.)',
          reply: [
            { note: 'He never brought it up.\nYou never wore the scarf again. But you didn’t throw it out either.' },
          ],
        },
        {
          text: '(The same devotion, two recipients. You turn off the phone and walk.)',
          end: 'leave3',
        },
      ],
    },

    // ── Beat 5: the crisis (the harvest) ──
    {
      status: '1:47 AM',
      messages: [
        { note: 'After three days of silence — 1:47 AM, the screen lights up.' },
        { him: 'Something terrible happened.', time: '1:47 AM' },
        { him: 'My account got frozen by security. 72-hour review, the lawyers are on it.', time: '1:48 AM' },
        { him: 'I’ve never asked anyone this in my life. But right now I can’t move a single dollar.', time: '1:50 AM' },
        { him: '$10,000. Three days. The second it unfreezes, paying you back is the first thing I do — tenfold. I swear it.', time: '1:51 AM' },
        { him: 'You’re the only person I trust.', time: '1:52 AM' },
        { inner: '(Three-day limit, tenfold return, telling me I’m the only one he trusts… how does every line land exactly where I’m softest?)', minInsight: 3 },
        { inner: 'He said it himself.\n“Money has never been a problem for me.”' },
      ],
      choices: [
        {
          text: 'I don’t have that money. And I won’t.',
          followup: {
            reply: [
              { him: 'Wow.', time: '1:55 AM' },
              { him: 'I thought you were different from the girls who only see money.', time: '1:56 AM' },
              { him: 'I need you this once. Just this once.', time: '1:58 AM' },
            ],
            choices: [
              {
                text: '(He’s the one asking for money. Somehow you’re the one who feels guilty. You close the thread and block him. Your hands shake, but they don’t stop.)',
                end: 'refused',
              },
              {
                text: 'Maybe… I can figure something out.',
                reply: [
                  { him: 'I knew it. You saved me.', time: '2:01 AM' },
                ],
              },
            ],
          },
        },
        {
          text: 'Show me the freeze notice.',
          flag: 'notice',
          followup: {
            reply: [
              { him: 'The lawyer says the documents can’t leave the firm.', time: '1:54 AM' },
              { him: 'You don’t believe me? Fine. It’s okay, I’ll ask someone else.', time: '1:55 AM' },
              { him: '…sorry. I’m just so anxious. You’re all I’ve got.', time: '1:59 AM' },
            ],
            choices: [
              {
                text: '(“Can’t leave the firm.” You screenshot the whole thread, then block him.)',
                end: 'refused',
              },
              {
                text: '(His apology softens you. You start trying to figure it out.)',
                reply: [
                  { him: 'You’re an angel. Sending you the account.', time: '2:03 AM' },
                  { note: 'The account name is one you’ve never heard.\nHe says it’s “the lawyer’s assistant.”' },
                ],
              },
            ],
          },
        },
        {
          text: 'Which account do I send it to?',
          reply: [
            { him: 'You’re an angel. Sending you the account.', time: '1:54 AM' },
            { note: 'The account name is one you’ve never heard.\nHe says it’s “the lawyer’s assistant.”' },
          ],
        },
      ],
    },

    // ── Beat 6: after the transfer ──
    {
      status: 'After the transfer',
      messages: [
        { note: 'You sent it.\nThat night his messages were sweeter than they’d ever been.' },
        { him: 'You saved my life. The Maldives is moving up — next month.', time: '9:02 PM' },
        { him: 'Oh. There’s a processing fee to release the funds first, $3,000. Quick thing.', time: '9:40 PM' },
        { him: 'We’ve come this far, what’s one more, right?', time: '9:41 PM' },
        { inner: '“We’ve come this far.”\nStrange — that’s the line you keep telling yourself lately too.' },
      ],
      choices: [
        {
          text: 'There won’t be a single one more.',
          reply: [
            { him: '…', time: '9:47 PM' },
            { him: 'You’ll regret this.', time: '9:48 PM' },
            { note: 'Three minutes later his photo went grey.\n“This account doesn’t exist.”' },
          ],
          end: 'tuition',
        },
        {
          text: '(Just a processing fee. We’ve come this far. You transfer again.)',
          end: 'total',
        },
      ],
    },
  ],

  endings: {
    leave1: {
      kicker: 'Ending · left at Beat 2',
      title: 'You didn’t let him buy you that dinner',
      dodge: {
        label: 'Dodged the bullet · three months later',
        text: 'A news alert: “Fake investor in cross-border fraud ring, dozens of victims.”\nThe wanted photo is still that private-jet selfie.\n\nTop comment under the article:\n“That’s a rented studio set, lol — I shot wedding photos there.”',
      },
      showChecklist: true,
    },
    leave2: {
      kicker: 'Ending · left at Beat 3',
      title: 'You never took the parcel',
      dodge: {
        label: 'Dodged the bullet · a week later',
        text: 'He sends a long goodbye. Tender, wounded, gracious, not a flaw in it.\nThe last line:\n\n“I’ll remember you forever, Vivian.”\n\nYour name isn’t Vivian.',
      },
      showChecklist: true,
    },
    leave3: {
      kicker: 'Ending · left at Beat 4',
      title: 'One name fewer on the list',
      dodge: {
        label: 'Dodged the bullet · one last look before blocking',
        text: 'His status reads: “typing…”\n\nThe same late night, across the city, a phone lights up:\n“Finally. Three weeks of swiping. You’re the first person I’ve stopped on.”',
      },
      showChecklist: true,
    },
    refused: {
      kicker: 'Ending · the final exam',
      title: 'The tenfold return is never coming',
      dodge: {
        label: 'Dodged the bullet · three days later',
        text: 'His account wiped every photo of the two of you.\nThe profile picture is a fresh jet-cabin selfie — same cabin.\n\nHis script flips back to page one.\nYours doesn’t.',
      },
      wink: 'You played along with him all the way to the final exam before handing in your paper.\nIn a game, that’s called watching the show.\nIn real life, it’s called six months.',
      showChecklist: true,
    },
    tuition: {
      kicker: 'Ending',
      title: 'Tuition',
      anatomy: [
        ['Page 1 · Setup', '“Money’s never been a problem for me” — first, make you believe he couldn’t possibly be after yours.'],
        ['Page 2 · Display', '51st floor, the Maldives, three cards. The props go up, and so do the tells.'],
        ['Page 3 · Clear the room', '“Don’t tell your friends yet” — friends are the ones most likely to see through him.'],
        ['Page 4 · Test', 'That parcel. The first reach isn’t for money — it’s to measure your compliance.'],
        ['Page 5 · Harvest', 'Late hour, deadline, “only one I trust,” tenfold return — the textbook four-piece set, word for word.'],
        ['Page 6 · Sunk cost', '“We’ve come this far” — the first payment’s job is to make sure you can’t admit you were conned.'],
      ],
      absolve: 'This script is industrialized. The people who write it live off it; the people who run it perform it ten times a day.\nBeing conned isn’t a sign you’re stupid.\n\nShame is the scammer’s best bodyguard —\nthe moment you say it out loud, he loses one person he can fool.',
      resource: 'Report fraud: FTC at ReportFraud.ftc.gov (US) · or your local anti-fraud line · 24h',
      showChecklist: true,
    },
    total: {
      kicker: 'Ending',
      title: 'Total loss',
      anatomy: [
        ['Page 1 · Setup', '“Money’s never been a problem for me” — first, make you believe he couldn’t possibly be after yours.'],
        ['Page 2 · Display', '51st floor, the Maldives, three cards. The props go up, and so do the tells.'],
        ['Page 3 · Clear the room', '“Don’t tell your friends yet” — friends are the ones most likely to see through him.'],
        ['Page 4 · Test', 'That parcel. The first reach isn’t for money — it’s to measure your compliance.'],
        ['Page 5 · Harvest', 'Late hour, deadline, “only one I trust,” tenfold return — the textbook four-piece set, word for word.'],
        ['Page 6 · Sunk cost', '“We’ve come this far” — every transfer makes the last one harder to admit.'],
        ['Page 7 · Close the case', 'Delete the account, swap the card. Your money becomes rent on the next studio set.'],
      ],
      absolve: 'This script is industrialized. The people who write it live off it; the people who run it perform it ten times a day.\nBeing conned isn’t a sign you’re stupid.\n\nShame is the scammer’s best bodyguard —\nthe moment you say it out loud, he loses one person he can fool.',
      wink: 'Look back: the tells were always there. The watermark, the three cards, that scarf.\nSeeing, and leaving, are two different things.\nWhat this story is really teaching is the second one.',
      resource: 'Report fraud: FTC at ReportFraud.ftc.gov (US) · or your local anti-fraud line · 24h',
      showChecklist: true,
    },
  },

  // Trait resolution
  resolveTraits(endKey, flags) {
    if (endKey === 'tuition') {
      return { add: 'silent', text: 'Naming your own trouble has become hard.\nBut remember what the ending said: shame is his best bodyguard.' };
    }
    if (endKey === 'total') {
      return { add: 'guarded', text: 'You won’t be conned again.\nBut “never trusting anyone again” is itself one of the things he took.' };
    }
    if (flags.size >= 2) {
      return { add: 'seeThrough', text: 'You weren’t lucky — you actually saw it.\nWhen a detail is too perfect, you now look twice.' };
    }
    return { add: null, text: 'You left early enough.\nBut look back at that checklist — this time it was instinct. Next time, make it an eye.' };
  },
};
