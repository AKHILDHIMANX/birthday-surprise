/* =========================================================================
   Happy Birthday, Pardeep Poswal (Billu) - 21 November 2000
   Text: the letter written for him.

   PHOTOS: drop real files into assets/media/images/ (any name), then run
            python3 sync-photos.py   -> captions attach automatically

   Each scene is a PINNED, SCROLL-SCRUBBED scene.
   mood = winter | rain | mist | summer | storm | dusk | night | dawn
   ========================================================================= */

var BIRTHDAY = {

  meta: { firstName: "Pardeep", lastName: "Poswal", fullName: "Pardeep Poswal", nickname: "Billu",
    age: 25, birthDate: "2000-11-21", birthdayDate: "2026-11-21",
    fromWhom: "— Akhil", occasion: "Happy Birthday", dedication: "For someone who once meant the world" },

  countdown: { enabled: true, date: "2026-11-21", title: "Bas itne din", sub: "21 November 2000 se chal raha hai.",
    pastTitle: "Aaj hi to hai", pastSub: "Tumhara din hai." },

  gate: { eyebrow: "A letter for you", headline: "Pardeep 💫", note: "Poora padhne mein waqt lagega. Bas scroll karte jao.", sealText: "★", openButton: "Kholo", skipButton: "Seedha andar" },

  hero: { kicker: "🎂 Happy Birthday, Pardeep 💫", line1: "Happy", line2: "Birthday", name: "Pardeep",
    sub: "For someone who once meant the world…", scrollCue: "Scroll karo",
    highlights: [{ value: "25", label: "Saal tumhare" }, { value: "21.11", label: "Tumhara din" }, { value: "∞", label: "Wish hai" }] },

  /* PINNED SCROLL-SCRUBBED SCENES */
  scenes: [
    { number: "01", label: "Shuruat", kicker: "Prologue",
      title: "Some people become memories. Some become a part of you.",
      body: "Aaj tumhara birthday hai, aur shayad duniya ke liye ye bas ek aur birthday hoga — cake, candles, wishes, calls, pictures, friends, celebrations, aur woh sab jo ek khaas din ke saath aata hai. Lekin kuch logon ke birthdays calendar par sirf ek date nahi hote. Woh ek reminder hote hain.",
      quote: "For someone who once meant the world…<br>Happy Birthday.",
      image: "assets/media/images/02-rose-portrait.svg", mood: "dawn", accent: "gold", scroll: 2.6 },
    { number: "02", label: "A little note", kicker: "Chapter one",
      title: "A Little Note For You",
      body: "There was a time when I thought loving someone meant holding them close. Then life taught me something different. Sometimes love means knowing when to hold on. Sometimes it means knowing when to let go. And sometimes… it means letting someone walk toward the life they chose, while quietly wishing that life treats them kindly.",
      quote: "I don't miss the past.<br>I just respect what it meant to me.",
      image: "assets/media/images/17-terminus-day.svg", mood: "mist", accent: "mint", scroll: 2.6 },
    { number: "03", label: "Then & now", kicker: "Chapter two",
      title: "Somewhere Between Then & Now",
      body: "If I look back, I don't remember only the difficult parts. I remember the little things — the random conversations, the stupid jokes, the way we could talk about absolutely nothing and somehow make it feel important. I remember caring, waiting, wondering, laughing, and being stupidly happy over the smallest things.",
      quote: "Some moments end.<br>The feeling of having lived them doesn't.",
      image: "assets/media/images/08-valley-portrait.svg", mood: "summer", accent: "mint", scroll: 2.6 },
    { number: "04", label: "Some stars fall", kicker: "Chapter three",
      title: "Some Stars Have To Fall…",
      body: "Maybe that's what this whole chapter taught me. Sometimes you love someone enough to want their happiness even when their happiness doesn't include you. That's probably one of the hardest forms of love. Not possession. Not expectation. Just acceptance.",
      quote: "Not the ending.<br>The journey.",
      image: "assets/media/images/18-terminus-night.svg", mood: "night", accent: "violet", scroll: 2.6 },
    { number: "05", label: "Best things", kicker: "Chapter four",
      title: "You're My Luxury 💫",
      body: "You're my luxury. Because my things are always the best. And I know… my things are always the best. Best the, best hain, aur best rahengi. 💫",
      quote: "Best the, best hain,<br>aur best rahengi.",
      image: "assets/media/images/01-selfie-nike-jacket.svg", mood: "summer", accent: "rose", scroll: 2.4 },
    { number: "06", label: "The person you are", kicker: "Chapter five",
      title: "For The Person You Are Today",
      body: "I hope you become everything you once dreamed of becoming. I hope your confidence grows, your heart becomes lighter, and you find peace in places you never expected. And most importantly… I hope you learn to be happy even on the ordinary days. Because birthdays are easy to celebrate. Real life is harder.",
      quote: "Birthdays are easy to celebrate.<br>Real life is harder.",
      image: "assets/media/images/07-valley-blazer.svg", mood: "winter", accent: "rose", scroll: 2.6 },
    { number: "07", label: "What I won't say", kicker: "Chapter six",
      title: "What I Don't Want To Say Today",
      body: "I don't want to say “Come back.” I don't want to say “Choose me.” I don't want anything from you. Because this birthday wish isn't a request. It's simply a wish — a genuine one. There is a difference between loving someone and needing them, and maybe that's why today I can say: I hope you're happy. And actually mean it.",
      quote: "No anger. No revenge.<br>Just acceptance.",
      image: "assets/media/images/04-turban-coat.svg", mood: "dusk", accent: "violet", scroll: 2.6 },
    { number: "08", label: "A wish, no condition", kicker: "Chapter seven",
      title: "A Wish That Has No Condition",
      body: "No condition. No expectation. No hidden meaning. Just this: may you be happy. May you have people around you who genuinely care. May your career take you somewhere amazing. May your parents always have reasons to be proud of you. And when life gets confusing… I hope you always find your way back to yourself.",
      quote: "Today isn't about us.<br>Today is about you.",
      image: "assets/media/images/09-valley-wide.svg", mood: "dawn", accent: "gold", scroll: 2.6 },
  ],

  elevenTitle: { kicker: "Ek waqt jo specially tumhara tha", title: "11:11", sub: "Jab wish maana jaata tha. Aur aaj bhi." },
  eleven: { note: "11:11 - raat ka waqt",
    lines: ["Maybe if I ever see 11:11 again…", "I won't ask for you to come back.", "I'll just wish that you're happy.", "That's enough.", "Because at some point, love has to become peaceful.", "It can't always be waiting.", "It can't always be hoping.", "It can't always be asking.", "Sometimes it has to become:", "“I hope you're okay.”", "And then quietly move forward."],
    wish: "You are someone’s 11:11", wishSub: "This and every 11:11 will remind you of me<br>Har woh 11:11 jo sath dekha hai, hamesha yaad rakhna<br><em>11:11 — always in your heart</em>", makeWish: "11:11 baje - wish karo", after: "Wish ho gaya. ✦" },

  journeyTitle: { kicker: "🥂 Here's to you", title: "Scroll to travel", sub: "Ek toast - sab chal raha hai, tum bhi chalo." },
  cards: [
    { era: "01", span: "Toast", title: "Thank you for the memories. 😸", body: "" },
    { era: "02", span: "Toast", title: "You are the best, and you will remain best. 🥂", body: "" },
    { era: "03", span: "Toast", title: "The mole on shoulder hits hard, make me hard 😻", body: "" },
    { era: "04", span: "Toast", title: "Mustache — Billu 😸💫", body: "" },
    { era: "05", span: "Toast", title: "To the people who genuinely love you.", body: "" },
    { era: "06", span: "Toast", title: "Remember the place you’ve visited with me", body: "" },
    { era: "07", span: "Toast", title: "Woh baarish aur NSC mein bed ke neeche soke, dher saari baatein", body: "" },
    { era: "08", span: "Toast", title: "To the person you’re still becoming.", body: "" }
  ],

  messagesTitle: { kicker: "Likh kar rakha hai", title: "Jo kehna tha", sub: "Card par tap karo, poori baat padho." },
  messages: [
    { from: "A Little Note", relation: "For you, quietly", text: "There was a time when I thought loving someone meant holding them close. Then life taught me something different. Sometimes love means knowing when to let go — and quietly wishing that life treats them kindly." },
    { from: "Between Then & Now", relation: "The small things", text: "I don't remember only the difficult parts. I remember the random conversations, the stupid jokes, and the way we could talk about absolutely nothing and somehow make it feel important." },
    { from: "The Smallest Things", relation: "Stupidly happy", text: "There were laughs that still randomly come back to me. There were silences that said more than words. And there were days when simply knowing that you were okay was enough to make my own day better." },
    { from: "Thank You", relation: "Genuinely", text: "Thank you for the memories. Thank you for the laughs. Thank you for every little moment that once made ordinary days feel special. Even the difficult parts taught me something." },
    { from: "One Thing I Learned", relation: "The hardest one", text: "You taught me that I can love someone deeply and still choose myself. That caring doesn't mean losing myself. And that's the one I'm most grateful for." },
    { from: "No More What-Ifs", relation: "Rest, finally", text: "Life doesn't give us alternate timelines. It gives us the one we're standing in. So no more counting what could have been. Today… just gratitude." }
  ],

  timelineTitle: { kicker: "Waqt", title: "Kab kya hua", sub: "Bas yaad rakhne layak." },
  timeline: [
    { date: "Aaj", title: "NCC best gift", body: "Tum thake nahi — tum badle ho, achhe se." },
    { date: "Aage", title: "Do what makes you happy", body: "Wahi jo tumhe andar se bulata hai." },
    { date: "Aage", title: "Munch chocolate ke har hisse mein aaj bhi tera hissa hai", body: "Jahan tum poore ho." },
    { date: "Kabhi", title: "Har woh saans jo tumhare ears mein di maine", body: "Thake hue, mastre hue, wapas." },
    { date: "Hamesha", title: "This day for you, mah billu 😸", body: "Jo sach mein rahein." },
    { date: "Hamesha", title: "Loved diaries", body: "Woh insaan jo tum ho." }
  ],

  galleryTitle: { kicker: "Tasveerein", title: "Tumhari photos", sub: "Kisi photo par tap karo - poori size mein." },
  /* placeholder list - real photos come from photos.js (sync-photos.py) */
  gallery: [
    { src: "assets/media/images/01-selfie-nike-jacket.svg", caption: "Jacket & grin" },
    { src: "assets/media/images/02-rose-portrait.svg", caption: "One rose" },
    { src: "assets/media/images/03-cap-chair.svg", caption: "Cap off" },
    { src: "assets/media/images/04-turban-coat.svg", caption: "Grey coat" },
    { src: "assets/media/images/05-butterfly.svg", caption: "Two butterflies" },
    { src: "assets/media/images/06-naval-428.svg", caption: "White uniform" },
    { src: "assets/media/images/07-valley-blazer.svg", caption: "Rain and hills" },
    { src: "assets/media/images/08-valley-portrait.svg", caption: "Closer still" },
    { src: "assets/media/images/09-valley-wide.svg", caption: "Hands in pockets" },
    { src: "assets/media/images/10-cartoons.svg", caption: "Drawn you" },
    { src: "assets/media/images/11-cartoon-hoodie.svg", caption: "Hoodie era" },
    { src: "assets/media/images/12-cartoon-train.svg", caption: "Train talks" },
    { src: "assets/media/images/13-cartoon-nike.svg", caption: "Jacket again" },
    { src: "assets/media/images/14-cartoon-naval.svg", caption: "Cartoon salute" },
    { src: "assets/media/images/15-cartoon-night.svg", caption: "Lamp light" },
    { src: "assets/media/images/16-cartoon-headshot.svg", caption: "The portrait" },
    { src: "assets/media/images/17-terminus-day.svg", caption: "Daylight station" },
    { src: "assets/media/images/18-terminus-night.svg", caption: "Neon nights" }
  ],

  videosTitle: { kicker: "Watch", title: "Moving pictures", sub: "Play dabao." },
  videos: [
    { title: "Happy Birthday", subtitle: "Sab ki taraf se", src: "assets/media/video/01.mp4", poster: "assets/media/images/07-valley-blazer.svg", caption: "Golden hour" },
    { title: "Thode lafz", subtitle: "Log kya kehte hain", src: "assets/media/video/02.mp4", poster: "assets/media/images/06-naval-428.svg", caption: "Salute, always" },
    { title: "Woh safar", subtitle: "Favourite yaadein", src: "assets/media/video/03.mp4", poster: "assets/media/images/17-terminus-day.svg", caption: "Station lights" },
    { title: "Saath gaao", subtitle: "Khoobsurat zulm", src: "assets/media/video/04.mp4", poster: "assets/media/images/18-terminus-night.svg", caption: "Midnight magic" }
  ],

  backgroundTrack: { enabled: true, title: "Baaton Ko Teri", src: "assets/media/audio/00-baaton-ko-teri.mp3" },
  audio: [
    { title: "Maa ka message", subtitle: "Teen baar record kiya", src: "assets/media/audio/01-from-mum.mp3" },
    { title: "Sabse kareeb", subtitle: "Raat 2 baje, of course", src: "assets/media/audio/02-from-friend.mp3" },
    { title: "Office se", subtitle: "Team normality maangi hi nahi", src: "assets/media/audio/03-from-work.mp3" },
    { title: "Aakhri baat", subtitle: "Sab ka ek surprise", src: "assets/media/audio/04-surprise.mp3" }
  ],

  letter: { kicker: "A letter, properly written", title: "A letter for you", salutation: "Pardeep,",
    paragraphs: ["Bas itna kehna hai—apne future ke liye hamesha best dena. Jo bhi dream hai, uske liye mehnat karte rehna aur kabhi khud par doubt mat karna.", "Life mein ups and downs aate rahenge, bas rukna mat.", "I hope your future is brighter, happier and more successful than you ever imagined.", "Khush rehna, grow karna aur apne dreams ko reality banana.", "All the best for everything ahead. 💫"],
    signoff: "All the best,", signature: "— Akhil", unfoldButton: "Kholo" },

  finale: { wishTitle: "Ek aakhri wish", wishBody: "Aankhein band karo. Teen second.", candleButton: "Moomh se bujhao",
    afterWish: { title: "Happy Birthday, Pardeep", body: "Kya pata main iske baad wish kar paun", signoff: "Always blessed, mah billu 😻" } },

  closing: { quoteHi: "“The chapter ended.\nThe respect remained.\nThe memories stayed.\nAnd somewhere along the way,\nI learned to let love exist\nwithout asking it to return.”", sign: "— Akhil", signSub: "Happy Birthday, Pardeep 💫" },

  theme: { accent: "#c98a2e", accent2: "#d94f76", accent3: "#6f52c9", accent4: "#1f9c7d" }
};
