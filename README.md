# ✦ Happy Birthday

**Pardeep Poswal (Billu) · 21 November 2000**

Ek chhota sa birthday page — wishes, mausam, 11:11, photos, virtual hug, aur ek countdown.
Lambi kahani nahi. Bas dil se. ✦
Pure HTML + CSS + JavaScript. **Koi build nahi, koi install nahi, koi internet nahi chahiye.**

---

## ▶️ Chalane ka tareeqa

**Sabse aasan** — `index.html` par double-click.

**Recommended** (audio/video theek chale) — is folder mein Terminal kholo:

```bash
python3 -m http.server 8000
```

Phir <http://localhost:8000> kholo.

---

## 📸 STEP 1 — Photos kaise dikhayein (yeh sabse zaroori hai)

Abhi jo photos dikh rahi hain woh **placeholder** hain — golden gradient plates
(ismein koi text nahi hai, isliye veils ke neeche se kuch chhapta nahi).
Asli photos tabhi dikhenge jab tum unhe **folder mein copy** karoge.

### Sirf 2 kaam (2 minute)

**1.** `assets/media/images/` folder kholo.
Apni 18 photos wahan paste kar do — **naam koi bhi rakho, order koi bhi.**

**2.** Terminal mein (is folder mein) yeh chalako:

```bash
python3 sync-photos.py
```

Bas. Ho gaya. ✦

> Script folder scan karke `assets/js/photos.js` bana deta hai aur har photo par
> caption laga deta hai. Nayi photo add karni ho to: paste → dobara `python3 sync-photos.py`.

### Preview

```bash
python3 -m http.server 8000
```

→ <http://localhost:8000>  (ya bas `index.html` double-click)

### File size

Bade photos (4 MB+) site slow karte hain, khaas kar phone par. Chhote karne ke liye:

```bash
# sab photos 1600px par resize
sips -Z 1600 *.jpg
```

### Video posters

Video cards ke posters bhi `assets/media/images/` mein hain — wahi SVG abhi use ho rahe hain.

## 🎵 Step 2 — Music (already lagaya hua hai)

**"Baaton Ko Teri"** already add hai: `assets/media/audio/00-baaton-ko-teri.mp3`
(compress kiya hua — 11 MB se ghata kar **5.3 MB**, 4:40).

Order kuch aisa hai:

1. **Envelope click karte hi** → pehle **Happy Birthday** ka gaana bajta hai
   (Web Audio se bana hua, koi file nahi — ~8 second).
2. **Uske foran baad** → **Baaton Ko Teri** apne aap shuru ho jaati hai.
3. Wahi button **pause / play** karta hai — kabhi bhi scroll karte hue.

| Button | Kya karta hai |
|---|---|
| 🤗 | Virtual hug |
| ✦ | 11:11 wish par le jaata hai aur daba deta hai |
| 🎵 | Gaana pause / play |
| ↑ | Top par |

Keyboard: `H` = hug, `M` = music.

> Browser sirf tabhi gaana chalata hai jab user ne **khud click kiya** ho.
> Isliye pehli baar mein gate (envelope) ke baad music aayega — refresh karne par
> wapas nahi chalega (browser block kar deta hai). Gate mein "Skip intro" dabao
> toh seedha gaana bajega.

Gaana badalna ho to `content.js`:
```js
backgroundTrack: { enabled: true, title: "Baaton Ko Teri", src: "assets/media/audio/00-baaton-ko-teri.mp3" }
```

### Voice messages (optional)

```
assets/media/audio/  01-from-mum.mp3   02-from-friend.mp3
                     03-from-work.mp3  04-surprise.mp3
```
Phone par record kiye hue voice notes perfect chalte hain. Na milein to
placeholder dikhta hai — kuch tootega nahi.

### Videos (optional)

```
assets/media/video/  01-happy-birthday.mp4   02-few-words.mp4
                     03-the-trip.mp4         04-sing.mp4
```
MP4 (H.264 + AAC). WhatsApp ke liye clip 100 MB se kam rakho.

---

## ✏️ Step 3 — Content

**Sab kuch ek hi file mein: `assets/js/content.js`.** Sirf wahi edit karna hai.

| Kya badalna hai | Kahan |
|---|---|
| Naam, DOB (`2000-11-21`), age, countdown date | `meta`, `countdown` |
| 6 wishes — title, body, aur woh ek line jo reh jaaye | `wishes` |
| Har wish ka **mood** (mausam) aur photo | `wishes[i].mood`, `wishes[i].image` |
| 11:11 ki lines aur dua | `eleven` |
| 8 wish cards (sideways) | `cards` |
| 6 manzile | `timeline` |
| Logo ke messages | `messages` |
| 18 photos + captions | `gallery` |
| Chitthi | `letter` |
| Aakhri closing line | `closing` |
| Colours | `theme` |

### Story-telling style

Scroll hi poori kahani hai. Har wish pin hota hai aur scroll position se uski har layer
apne aap khulti hai — number → title (shabd-shabd) → line-by-line paragraph → aakhri line.
Koi bhi animation "trigger" nahi hota; sab scroll ke saath chipak-ta hai.

---

## 🗂 Page ka structure

| Section | Kya hota hai |
|---|---|
| **Envelope** | Wax-sealed envelope. Click karo → khulta hai, confetti, hero dikhta hai. Ek baar per session. |
| **Hero** | Letters scramble hote hain, title mask se uthta hai, **live countdown** next birthday tak, "days lived" counter DOB se gina jaata hai. |
| **6 Wishes** | Har wish ek pinned, scroll-scrubbed scene. Scroll karte hi number → title → line-by-line → ek line jo reh jaaye. Har wish par mausam badalta hai. |
| **11:11** | Poora pinned section. Raat ka clock, lines ek-ek karke, phir asli wish button. |
| **Wish Cards** | Neeche scroll karo, wishes **sideways** chalti hain — 8 cards. |
| **Manzile** | Timeline; dots aate hi jal jaate hain. |
| **Videos** | Poster cards → lightbox player (prev/next, arrow keys, Esc). |
| **Awaaz** | Custom players: waveform, click-to-seek, agla message khud bajta hai. |
| **Messages** | Logo ki chhoti chhoti baatein, card wall par. |
| **Virtual Hug** | Bada gol button 🤗 — dabao, screen par pura hug. `H` key se bhi. |
| **Photos** | 18 photos, masonry → lightbox. |
| **Letter** | Seal khulta hai, paragraphs aate hain, signature khud likhta hai. |
| **Ek dua** | Flickering candle → bujhao → confetti cannons + rain → final message. |
| **Closing** | "Vo zid thi meri, phir ishq hua…" |

### Buttons kabhi gayab nahi hote

Ek **sticky dock** hamesha screen par rehta hai (scroll ki kahin bhi):

| Button | Kya karta hai |
|---|---|
| 🤗 | Virtual hug turant |
| ✦ | 11:11 wish par le jaata hai aur daba deta hai |
| 🎵 | Gaana pause / play |
| ↑ | Top par wapas |

Aur keyboard: `H` = hug, `M` = gaana.

Button kabhi scroll mein gayab nahi hota — dock hamesha screen par rehta hai.

### Mausam (weather)

Har wish ka apna mausam hai — canvas particles + background glow change hota rehta hai:

`winter` (dhuaan/halki barf) · `rain` (baarish + ** girte patte**) · `mist` (dhund) ·
`summer` (sooraj ki kirnen) · `storm` (tez baarish) · `dusk` (shaam) · `night` (taare) · `dawn` (subah)

Badalna ho to `content.js` mein har wish ka `mood` badal do. Screen par ek chhota HUD bhi dikhata hai kaun sa mausam chal raha hai.

---

## ♿ A11y & performance

- Lighthouse **100 / 100 / 100** (zero failures).
- Poora keyboard support, visible focus rings, ARIA dialogs.
- `prefers-reduced-motion` respect karta hai — sab animations band, sab kuch padhne layak, pinned sections normal blocks ban jaate hain.
- Background tab mein bhi chalta hai (rAF throttle-safe scheduler).
- Button dock hamesha visible rehta hai — koi button scroll mein kho nahi jaata.
- 390 / 768 / 1440 px pe zero horizontal overflow.
- Media ke liye fixed aspect ratios — koi layout shift nahi.

---

## 🚀 Share karna

- **Netlify Drop** — <https://app.netlify.com/drop> (sabse aasan, public link milta hai)
- **Vercel** — `npx vercel --prod`
- **GitHub Pages** — repo me push karo → Settings → Pages
- **WhatsApp/Instagram** — folder zip karke bhejo (videos chhoti rakhna)

> WhatsApp par phone pe zaroor test karo — kuch purane Android browser bade MP4 par atak jaate hain.
