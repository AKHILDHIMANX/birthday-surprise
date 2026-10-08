/* =========================================================================
   The Star I Wore For You — engine
   No dependencies. Classic script, so it runs from file:// too.
     1 helpers · 2 binding · 3 splitting · 4 confetti · 5 weather
     6 scroll chrome · 7 reveal · 8 hero+countdown · 9 scenes · 10 journey
     11 eleven · 12 timeline · 13 video · 14 audio · 15 chats
     16 messages · 17 gallery · 18 reader · 19 letter · 20 finale
     21 gate · 22 boot
   ========================================================================= */
(function () {
  "use strict";

  /* ── 1 · HELPERS ─────────────────────────────────────────────────────── */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  /* a quote's <br> is a real line break, never the literal characters */
  var brLines = function (s) {
    return String(s == null ? "" : s).split(/<br\s*\/?>/i).map(function (l) {
      return '<span class="ql">' + esc(l) + "</span>";
    }).join("");
  };
  var pad = function (n) { n = Math.floor(n || 0); return (n < 10 ? "0" : "") + n; };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  /* a real photo dropped next to a placeholder takes its slot everywhere —
     scenes, posters and gallery all ask for the picture through here */
  function real(path) { return (window.IMGMAP && path && window.IMGMAP[path]) || path; }
  var raf = window.requestAnimationFrame.bind(window);
  var nextBirthday = function (dob) {
    if (!dob) return null;
    var d = new Date(dob + "T00:00:00");
    if (isNaN(d)) return null;
    var now = new Date();
    var t = new Date(now.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
    if (t.getTime() <= now.getTime()) t = new Date(now.getFullYear() + 1, d.getMonth(), d.getDate(), 0, 0, 0, 0);
    return t;
  };

  var B = window.BIRTHDAY || {};
  var THEME = B.theme || {};
  var MOODS = {
    winter: { ico: "\u2744", name: "Winter", a: "rgba(160,205,235,.55)", b: "rgba(226,238,248,.5)", c: "rgba(120,170,215,.35)" },
    rain:   { ico: "\u2614", name: "Rain",   a: "rgba(120,175,225,.5)",  b: "rgba(200,225,245,.45)", c: "rgba(90,140,200,.3)" },
    mist:   { ico: "\u2601", name: "Mist",   a: "rgba(200,225,215,.5)",  b: "rgba(235,245,238,.5)",  c: "rgba(140,190,170,.3)" },
    summer: { ico: "\u2600", name: "Summer", a: "rgba(255,205,120,.6)",  b: "rgba(255,235,190,.5)",  c: "rgba(255,180,110,.35)" },
    storm:  { ico: "\u26A1", name: "Storm",  a: "rgba(110,95,150,.5)",   b: "rgba(180,175,200,.4)",  c: "rgba(70,60,110,.35)" },
    dusk:   { ico: "\uD83C\uDF19", name: "Dusk", a: "rgba(255,170,130,.5)", b: "rgba(255,215,180,.45)", c: "rgba(200,110,110,.3)" },
    night:  { ico: "\u2600\uFE0F", name: "Night", a: "rgba(70,60,130,.55)", b: "rgba(150,140,220,.4)", c: "rgba(40,35,90,.4)" },
    dawn:   { ico: "\uD83C\uDF07", name: "Dawn", a: "rgba(255,200,150,.55)", b: "rgba(255,230,200,.5)", c: "rgba(240,170,120,.35)" }
  };
  var MOOD_KEYS = Object.keys(MOODS);

  /* ── 2 · CONTENT BINDING ─────────────────────────────────────────────── */
  function get(path) { return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, B); }
  function bindAll() {
    $$("[data-bind]").forEach(function (n) {
      var v = get(n.getAttribute("data-bind"));
      if (v == null || v === "") return;
      n.textContent = v;
    });
    /* values that carry <br>/<em> render as markup — content.js is ours */
    $$("[data-bind-html]").forEach(function (n) {
      var v = get(n.getAttribute("data-bind-html"));
      if (v == null || v === "") return;
      n.innerHTML = String(v).replace(/<br\s*\/?>/gi, "<br>");
    });
  }

  /* Buttons here are never mandatory — every hug, wish, candle and confetti
     is an invitation, not a gate. Nothing ever locks the scroll. */

  /* ── SUPER SMOOTH SCROLL ───────────────────────────────────────────────
     The wheel stops being a jump and becomes a glide: every delta is poured
     into a single target and one rAF walks the page towards it, so a hard
     flick coasts to a stop instead of snapping. Every jump (dock, rail,
     letter, finale) rides the same easing. Reduced-motion readers keep
     plain native scrolling. Nothing ever holds the page. */
  var SMOOTH = (function () {
    var on = !REDUCED;
    var target = window.pageYOffset, cur = target, job = 0;
    var mx = -1, mxAt = 0;
    function max() {                       /* cached — one layout read is plenty */
      var now = Date.now();
      if (mx < 0 || now - mxAt > 300) {
        mx = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        mxAt = now;
      }
      return mx;
    }
    function cap(y) {
      if (!(y > 0)) y = 0;
      var m = max(); if (y > m) y = m;
      return y;
    }
    function place(y) { window.scrollTo({ top: y, behavior: "instant" }); }
    function step() {
      job = 0;
      target = cap(target);
      var d = target - cur;
      if (Math.abs(d) < 0.6) { cur = target; place(cur); return; }
      cur += d * 0.16;
      place(cur);
      job = requestAnimationFrame(step);
    }
    function glide() { if (!job) job = requestAnimationFrame(step); }
    function to(y) {
      y = cap(y);
      if (!on) { target = cur = y; place(y); return; }
      target = y; glide();
    }
    function toNode(node, mode) {
      if (!node) return;
      var r = node.getBoundingClientRect();
      var y = window.pageYOffset + r.top;
      if (mode === "center") { y += r.height / 2 - window.innerHeight / 2; }
      else { y -= parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0; }
      to(Math.round(y));
    }
    if (on) {
      /* the easing lives here now — anchors and native jumps would only fight it */
      document.documentElement.style.scrollBehavior = "auto";
      window.addEventListener("wheel", function (e) {
        if (e.ctrlKey || !e.cancelable) return;
        /* a panel that scrolls itself (reader, lightbox) keeps its own wheel */
        var n = e.target && e.target.nodeType === 1 ? e.target : (e.target && e.target.parentElement);
        while (n && n !== document.body) {
          var ov = getComputedStyle(n).overflowY;
          if ((ov === "auto" || ov === "scroll") && n.scrollHeight > n.clientHeight + 4) return;
          n = n.parentElement;
        }
        var d = e.deltaY;
        if (e.deltaMode === 1) d *= 16;
        else if (e.deltaMode === 2) d *= window.innerHeight;
        if (!d) return;
        e.preventDefault();
        target = cap(target + d);
        glide();
      }, { passive: false });
      window.addEventListener("scroll", function () {
        /* scrollbar drags, keyboard and native jumps re-base the target */
        if (!job) target = cur = window.pageYOffset;
      }, { passive: true });
    }
    return { to: to, toNode: toNode, isOn: function () { return on; } };
  })();

  /* ── 3 · TEXT SPLITTING ──────────────────────────────────────────────── */
  function splitText(node) {
    if (!node || node.dataset.splitDone) return;
    var words = String(node.textContent).trim().split(/\s+/);
    node.textContent = "";
    node.classList.add("split");
    words.forEach(function (w, i) {
      var s = el("span", "w", esc(w));
      s.style.setProperty("--i", i);
      node.appendChild(s);
      if (i < words.length - 1) node.appendChild(document.createTextNode(" "));
    });
    node.dataset.splitDone = "1";
  }

  /* ── 4 · CONFETTI ────────────────────────────────────────────────────── */
  var FX = (function () {
    var cv = $("#fx-canvas");
    if (!cv) return { burst: function () {}, cannons: function () {}, rain: function () {} };
    var ctx = cv.getContext("2d"), W = 0, H = 0;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var parts = [], dust = [], running = false, rafId = null;
    var PAL = [THEME.accent || "#c98a2e", THEME.accent2 || "#d94f76", THEME.accent3 || "#6f52c9", "#ffffff", THEME.accent4 || "#1f9c7d", "#f0c46a"];

    function size() {
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    window.addEventListener("resize", size);

    function P(x, y, cfg) {
      cfg = cfg || {};
      this.x = x; this.y = y;
      this.vx = cfg.vx != null ? cfg.vx : (Math.random() - .5) * 14;
      this.vy = cfg.vy != null ? cfg.vy : -(6 + Math.random() * 12);
      this.g = cfg.g != null ? cfg.g : .34;
      this.drag = cfg.drag != null ? cfg.drag : .985;
      this.w = cfg.w != null ? cfg.w : 5 + Math.random() * 7;
      this.h = this.w * (.45 + Math.random() * .9);
      this.rot = Math.random() * 6.283; this.vr = (Math.random() - .5) * .34;
      this.flip = .06 + Math.random() * .12; this.phi = Math.random() * 6.283;
      this.color = cfg.color || PAL[(Math.random() * PAL.length) | 0];
      this.round = Math.random() > .72;
      this.life = 0; this.ttl = cfg.ttl || (150 + Math.random() * 90);
      this.shine = Math.random() > .55;
    }
    P.prototype.step = function () {
      this.life++; this.vy += this.g; this.vx *= this.drag; this.vy *= this.drag;
      this.x += this.vx; this.y += this.vy; this.rot += this.vr; this.phi += this.flip;
      return this.life < this.ttl && this.y < H + 60;
    };
    P.prototype.draw = function (c) {
      c.save(); c.translate(this.x, this.y); c.rotate(this.rot);
      c.scale(1, Math.max(.12, Math.abs(Math.cos(this.phi))));
      c.globalAlpha = this.life > this.ttl * .72 ? clamp((this.ttl - this.life) / (this.ttl * .28), 0, 1) : 1;
      if (this.shine) { c.shadowBlur = 12; c.shadowColor = this.color; }
      c.fillStyle = this.color;
      if (this.round) { c.beginPath(); c.arc(0, 0, this.w / 2, 0, 6.283); c.fill(); }
      else c.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
      c.restore(); c.globalAlpha = 1;
    };

    function loop() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < dust.length; i++) {
        var d = dust[i];
        ctx.globalAlpha = d.a; ctx.fillStyle = d.c;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
      for (var j = parts.length - 1; j >= 0; j--) {
        if (!parts[j].step()) parts.splice(j, 1); else parts[j].draw(ctx);
      }
      if (parts.length) rafId = raf(loop);
      else { running = false; ctx.clearRect(0, 0, W, H); }
    }
    function start() { if (running) return; running = true; rafId = raf(loop); }

    function makeDust() {
      if (REDUCED) return;
      var n = window.innerWidth < 700 ? 16 : 34;
      for (var i = 0; i < n; i++) dust.push({
        x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.8 + .5,
        a: Math.random() * .28 + .06, vy: -(Math.random() * .14 + .03),
        vx: (Math.random() - .5) * .1, c: "#c98a2e"
      });
      start();
    }
    function driftDust() {
      for (var i = 0; i < dust.length; i++) {
        var d = dust[i];
        d.y += d.vy; d.x += d.vx;
        if (d.y < -10) { d.y = H + 10; d.x = Math.random() * W; }
        if (d.x < -10) d.x = W + 10; else if (d.x > W + 10) d.x = -10;
      }
    }

    function burst(x, y, n, cfg) {
      if (REDUCED) return;
      n = n || 90;
      for (var i = 0; i < n; i++) {
        var a = Math.random() * 6.283, sp = 3 + Math.random() * 15;
        parts.push(new P(x, y, { vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 4, g: .24, ttl: 110 + Math.random() * 80, w: 5 + Math.random() * 8, color: cfg && cfg.color }));
      }
      if (parts.length > 800) parts.splice(0, parts.length - 800);
      start();
    }
    function cannons() {
      if (REDUCED) return;
      burst(W * .06, H * .98, 100); setTimeout(function(){ burst(W * .94, H * .98, 100); }, 130);
      setTimeout(function(){ burst(W * .5, H * .42, 120); }, 300);
    }
    function rain(ms) {
      if (REDUCED) return;
      var end = Date.now() + (ms || 4000);
      (function step() {
        if (Date.now() > end) return;
        burst(Math.random() * W, -20, 4, { vy: 1 + Math.random() * 2, vx: (Math.random() - .5) * 4, g: .13 });
        setTimeout(step, 110);
      })();
    }
    makeDust();
    setInterval(driftDust, 50);
    return { burst: burst, cannons: cannons, rain: rain, dust: driftDust };
  })();

  /* ── 5 · WEATHER / SEASONS ─────────────────────────────────────────────
     One canvas. Each mood spawns its own particles and tints the three
     background glows, so every chapter arrives with its own season.   */
  var Weather = (function () {
    var cv = $("#fx-canvas");
    if (!cv) return { set: function () {} };
    var ctx = cv.getContext("2d"), W = 0, H = 0;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var bits = [], mode = "summer", t = 0, on = false, rafId = null;
    var glows = [$(".backdrop__glow--a"), $(".backdrop__glow--b"), $(".backdrop__glow--c")];
    var rays = $("#sunrays");
    var ico = $("#mood-ico"), name = $("#mood-name"), hud = $("#mood");

    function size() {
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    window.addEventListener("resize", size);

    function spawn() {
      var x, y, i;
      if (mode === "rain" || mode === "storm") {
        if (Math.random() < .06) {
          bits.push({ k: "leaf", x: Math.random() * W, y: -24,
            vx: .5 + Math.random() * .9, vy: .3 + Math.random() * .5,
            r: 4 + Math.random() * 5, a: .5 + Math.random() * .4,
            ph: Math.random() * 6.283, vr: (Math.random() - .5) * .3,
            c: ["#c98a2e", "#d94f76", "#b46b2a", "#8a4b22"][(Math.random() * 4) | 0] });
        }
        bits.push({ k: "rain", x: Math.random() * (W + 200) - 100, y: -20,
          vx: -(mode === "storm" ? 4.4 : 1.6) - Math.random(), vy: (mode === "storm" ? 13 : 7) + Math.random() * 5,
          len: 10 + Math.random() * (mode === "storm" ? 26 : 16), a: .18 + Math.random() * .3, r: 0 });
      } else if (mode === "winter") {
        i = Math.random();
        bits.push({ k: i > .45 ? "snow" : "smoke",
          x: Math.random() * W, y: i > .45 ? -14 : H + Math.random() * 120,
          vx: (Math.random() - .5) * (i > .45 ? .5 : .28), vy: i > .45 ? .35 + Math.random() * .5 : -.28 - Math.random() * .3,
          r: i > .45 ? 1 + Math.random() * 2.2 : 34 + Math.random() * 70,
          a: i > .45 ? .35 + Math.random() * .45 : .05 + Math.random() * .07, ph: Math.random() * 6.283 });
      } else if (mode === "mist") {
        bits.push({ k: "fog", x: Math.random() * W, y: H * (.2 + Math.random() * .7),
          vx: .18 + Math.random() * .4, vy: -.03,
          r: 90 + Math.random() * 190, a: .035 + Math.random() * .055, ph: Math.random() * 6.283 });
      } else if (mode === "summer" || mode === "dusk") {
        bits.push({ k: "fly", x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - .5) * .34, vy: -.08 - Math.random() * .2,
          r: .9 + Math.random() * 1.7, a: .3 + Math.random() * .45, ph: Math.random() * 6.283,
          c: mode === "dusk" ? "#ffd79a" : "#ffe9a8" });
      } else if (mode === "night") {
        bits.push({ k: "star", x: Math.random() * W, y: Math.random() * H * .85,
          r: .6 + Math.random() * 1.5, a: .2 + Math.random() * .7, ph: Math.random() * 6.283 });
      } else if (mode === "dawn") {
        bits.push({ k: "fly", x: Math.random() * W, y: H * (.2 + Math.random() * .8),
          vx: (Math.random() - .5) * .28, vy: .06 + Math.random() * .16,
          r: 1 + Math.random() * 1.9, a: .25 + Math.random() * .4, ph: Math.random() * 6.283, c: "#ffd6a0" });
      }
    }

    function step() {
      t++;
      var n = W < 700 ? 1 : 2;
      for (var q = 0; q < n; q++) if (bits.length < (mode === "rain" || mode === "storm" ? 260 : 90)) spawn();

      for (var i = bits.length - 1; i >= 0; i--) {
        var b = bits[i];
        b.ph += .03;
        if (b.k === "rain") { b.x += b.vx; b.y += b.vy; }
        else if (b.k === "snow") { b.x += b.vx + Math.sin(b.ph) * .3; b.y += b.vy; }
        else if (b.k === "smoke") { b.x += b.vx + Math.sin(b.ph * .4) * .3; b.y += b.vy; b.r += .22; }
        else if (b.k === "fog") { b.x += b.vx; if (b.x - b.r > W + 60) b.x = -b.r - 60; }
        else if (b.k === "fly") { b.x += b.vx + Math.sin(b.ph) * .3; b.y += b.vy + Math.cos(b.ph * .7) * .22; }
        else if (b.k === "star") { /* fixed, twinkle only */ }

        if (b.k === "rain" && b.y > H + 30) { bits.splice(i, 1); continue; }
        if (b.k === "snow" && b.y > H + 20) { bits.splice(i, 1); continue; }
        if (b.k === "smoke" && b.y < -140) { bits.splice(i, 1); continue; }
        if ((b.k === "fly" || b.k === "leaf") && (b.y < -20 || b.y > H + 20 || b.x < -30 || b.x > W + 30)) { bits.splice(i, 1); continue; }

        var al = b.a;
        if (b.k === "star") al = b.a * (.35 + .65 * (.5 + .5 * Math.sin(b.ph)));
        if (b.k === "fog") al = b.a * (.5 + .5 * Math.sin(b.ph * .35));

        ctx.globalAlpha = al;
        if (b.k === "rain") {
          ctx.strokeStyle = "rgba(120,170,215,.9)"; ctx.lineWidth = 1.1;
          ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x + b.vx * .6, b.y + b.len); ctx.stroke();
        } else if (b.k === "snow") {
          ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.283); ctx.fill();
        } else if (b.k === "smoke") {
          var g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
          g.addColorStop(0, "rgba(255,255,255,.5)"); g.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.283); ctx.fill();
        } else if (b.k === "fog") {
          var g2 = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
          g2.addColorStop(0, "rgba(255,255,255,.75)"); g2.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.283); ctx.fill();
        } else if (b.k === "leaf") {
          ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.rot);
          ctx.fillStyle = b.c; ctx.globalAlpha = al;
          ctx.beginPath();
          ctx.ellipse(0, 0, b.r, b.r * .45, 0, 0, 6.283);
          ctx.fill(); ctx.restore(); ctx.globalAlpha = 1;
        } else if (b.k === "fly") {
          ctx.fillStyle = b.c || "#ffe9a8"; ctx.shadowBlur = 10; ctx.shadowColor = b.c || "#ffe9a8";
          ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.283); ctx.fill(); ctx.shadowBlur = 0;
        } else if (b.k === "star") {
          ctx.fillStyle = "#fff8e0"; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.283); ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      rafId = raf(loop);
    }
    function loop() { step(); }

    function paint() {
      var m = MOODS[mode] || MOODS.summer;
      glows.forEach(function (g, i) {
        if (!g) return;
        var c = [m.a, m.b, m.c][i] || m.a;
        g.style.background = "radial-gradient(circle at 50% 50%," + c + ",transparent 62%)";
      });
      if (rays) rays.classList.toggle("is-on", mode === "summer" || mode === "dawn");
      if (ico) ico.textContent = m.ico;
      if (name) name.textContent = m.name;
      if (hud) hud.classList.toggle("is-on", true);
    }

    function set(next) {
      if (MOODS[next]) mode = next;
      paint();
      if (REDUCED) return;
      if (!on) { on = true; rafId = raf(loop); }
    }
    set(MOOD_KEYS[0]);
    return { set: set };
  })();

  /* ── 6 · SCROLL CHROME ──────────────────────────────────────────────── */
  var SECTIONS = [];
  function initScroll() {
    var bar = $("#progress-bar"), num = $("#progress-num"), topbar = $("#topbar"), rail = $("#rail");
    SECTIONS = ["hero", "story", "eleven", "journey", "timeline", "videos", "voices", "messages", "gallery", "letter", "closing", "finale"]
      .map(function (id) { return document.getElementById(id); }).filter(Boolean);
    var labels = { hero: "Shuru", story: "Kahani", eleven: "11:11", journey: "Safar", timeline: "Moments", videos: "Videos", voices: "Awaaz", messages: "Khat", gallery: "Photos", letter: "Letter", closing: "Aakhri", finale: "Dua" };

    if (rail) SECTIONS.forEach(function (s) {
      var b = el("button", "rail__item");
      b.type = "button";
      b.innerHTML = '<span class="rail__dot"></span><span class="rail__label">' + esc(labels[s.id] || s.id) + "</span>";
      b.addEventListener("click", function () { SMOOTH.toNode(s, "start"); });
      rail.appendChild(b); s._rail = b;
    });

    var ticking = false, lastPct = -1;
    function onScroll() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      var p = clamp(y / max, 0, 1);
      if (bar) bar.style.transform = "scaleX(" + p + ")";
      if (num) {
        var pct = Math.round(p * 100);
        if (pct !== lastPct) { num.textContent = pct + "%"; lastPct = pct; }
        num.classList.toggle("is-hot", pct >= 99);
      }
      if (topbar) topbar.classList.toggle("is-stuck", y > 40);
      var mid = y + window.innerHeight * .42, best = 0;
      SECTIONS.forEach(function (s, i) { if (s.offsetTop <= mid) best = i; });
      SECTIONS.forEach(function (s) { if (s._rail) s._rail.classList.toggle("is-on", s === SECTIONS[best]); });
      ticking = false;
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; raf(onScroll); } }, { passive: true });
    onScroll();
  }

  /* ── 7 · REVEAL ON SCROLL ───────────────────────────────────────────── */
  function initReveal() {
    /* IntersectionObserver silently never fires in some renderers — and when
       it does not, every .gshot / .vcard / .card stays at opacity:0 and the
       page looks empty. So reveal is driven by measured rects instead. */
    var sel = ".reveal,.card,.vcard,.player,.gshot,.tl__item,.chat,[data-head]";
    $$(sel).forEach(function (n) { armReveal(n, 0); });
    setInterval(sweepReveal, 320);
    sweepReveal();
  }
  var PENDING = [];
  function revealNow(n) {
    if (!n || n._revealed) return;
    n._revealed = 1;
    n.classList.add("in-view", "is-visible");
    if (n._stagger) n._stagger.forEach(function (s, i) {
      s.style.transitionDelay = (i * 120) + "ms";
      requestAnimationFrame(function () { s.classList.add("is-in"); });
    });
  }
  function armReveal(n, d) {
    if (!n || n._revealed || PENDING.indexOf(n) > -1) return;
    if (d) n.setAttribute("data-delay", d);
    PENDING.push(n);
  }
  function sweepReveal() {
    if (!PENDING.length) return;
    var vh = window.innerHeight, keep = [];
    for (var i = 0; i < PENDING.length; i++) {
      var n = PENDING[i], r = n.getBoundingClientRect();
      /* reached the viewport (or already scrolled past) -> light it up */
      if (r.top < vh * .92) {
        var d = parseInt(n.getAttribute("data-delay") || 0, 10);
        if (d) setTimeout(function (node, delay) { return function () { revealNow(node); }; }(n, d), d);
        else revealNow(n);
      } else {
        keep.push(n);
      }
    }
    PENDING = keep;
  }
  function observe(n, d) {
    if (!n) return;
    if (d) n.setAttribute("data-delay", d);
    armReveal(n, 0);
  }

  /* ── 8 · HERO + COUNTDOWN ────────────────────────────────────────────── */
  function initHero() {
    var kick = $("#hero-kicker");
    if (kick && B.hero && B.hero.kicker) { kick.dataset.text = B.hero.kicker; kick.textContent = REDUCED ? B.hero.kicker : ""; }
    var nm = $("#hero-name"); if (nm) nm.textContent = (B.meta && (B.meta.firstName || B.meta.fullName)) || "";
    var sub = $("#hero-sub"); if (sub) { sub.textContent = (B.hero && B.hero.sub) || ""; observe(sub, 700); }

    var stats = $("#hero-stats");
    if (stats && B.hero && B.hero.highlights) B.hero.highlights.forEach(function (h, i) {
      var li = el("li", "hero__stat", "<b>" + esc(h.value) + "</b><span>" + esc(h.label) + "</span>");
      stats.appendChild(li); observe(li, 850 + i * 140);
    });

    /* twinkling stars behind the hero */
    var hs = $("#hero-stars");
    if (hs && !REDUCED) for (var i = 0; i < 46; i++) {
      var s = el("i");
      s.style.left = (Math.random() * 100) + "%";
      s.style.top = (Math.random() * 100) + "%";
      s.style.animationDelay = (Math.random() * 3.4) + "s";
      hs.appendChild(s);
    }
  }

  function startHero() {
    var kick = $("#hero-kicker");
    if (kick && kick.dataset.text) scramble(kick, kick.dataset.text);

    var live = $("#hero-stats li:nth-child(2) b");
    if (live && B.meta && B.meta.birthDate) {
      var born = new Date(B.meta.birthDate + "T00:00:00");
      if (!isNaN(born)) countTo(live, Math.max(0, Math.floor((Date.now() - born.getTime()) / 864e5)).toLocaleString());
    }
    initCountdown();
  }

  function scramble(node, text) {
    node.textContent = text;
    if (REDUCED) return;
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ&*+-<>/";
    var q = text.split("").map(function (c, i) { return { f: chars[(Math.random() * chars.length) | 0], t: c, s: i * 34, e: i * 34 + 900 }; });
    var t0 = null, stop = false;
    var bail = setTimeout(function () { stop = true; node.textContent = text; }, 6000);
    function frame(t) {
      if (stop) return;
      if (t0 === null) t0 = t;
      var out = "", done = 0;
      q.forEach(function (x) {
        var p = clamp((t - t0 - x.s) / (x.e - x.s), 0, 1);
        if (p >= 1) { out += x.t; done++; }
        else if (p > 0) out += x.f[(Math.random() * x.f.length) | 0];
        else out += " ";
      });
      node.textContent = out;
      if (done < q.length) raf(frame); else { clearTimeout(bail); node.textContent = text; }
    }
    raf(frame);
  }

  function countTo(node, target) {
    if (REDUCED) { node.textContent = target; return; }
    var end = parseInt(String(target).replace(/[^0-9]/g, ""), 10);
    if (!end) { node.textContent = target; return; }
    var suf = String(target).replace(/[0-9]/g, ""), t0 = null, stop = false;
    var bail = setTimeout(function () { stop = true; node.textContent = target; }, 5000);
    function frame(t) {
      if (stop) return;
      if (t0 === null) t0 = t;
      var p = clamp((t - t0) / 1700, 0, 1);
      node.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString() + suf;
      if (p < 1) raf(frame); else { clearTimeout(bail); node.textContent = target; }
    }
    raf(frame);
  }

  function initCountdown() {
    var wrap = $("#countdown");
    if (!wrap || !B.countdown || B.countdown.enabled === false) return;
    var target = B.countdown.date ? new Date(B.countdown.date + "T00:00:00") : nextBirthday(B.meta && B.meta.birthDate);
    if (!target || isNaN(target)) return;
    wrap.hidden = false;

    var d = $("#cd-d"), h = $("#cd-h"), m = $("#cd-m"), s = $("#cd-s"), past = $("#cd-past");
    var last = {};
    function set(node, v, key) {
      if (!node || v === last[key]) return;
      last[key] = v; node.textContent = v;
      var cell = node.parentNode;
      if (cell && !REDUCED) { cell.classList.remove("tick"); void cell.offsetWidth; cell.classList.add("tick"); }
    }
    function tick() {
      var diff = target.getTime() - Date.now();
      if (diff <= 0) {
        if (past) past.hidden = false;
        wrap.querySelector(".count__grid").style.opacity = .35;
        return;
      }
      var sec = Math.floor(diff / 1000);
      set(d, pad(sec / 86400), "d");
      set(h, pad((sec % 86400) / 3600), "h");
      set(m, pad((sec % 3600) / 60), "m");
      set(s, pad(sec % 60), "s");
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ── 9 · SCENES (prologue + chapters + epilogue) ─────────────────────── */
  var Reader = { open: function (o) { RD.open(o); }, _i: null };

  function buildScene(c, i, total) {
    var sec = el("section", "scene " + (i % 2 ? "scene--right" : "scene--left"));
    if (c.mood === "night" || c.mood === "storm") sec.classList.add("scene--dark");
    sec.style.setProperty("--len", c.scroll || 3);
    var key = ["rose", "violet", "mint", "gold", "sky"][i % 5];
    var map = { rose: "accent2", violet: "accent3", mint: "accent4", gold: "accent", sky: "accent3" };
    sec.style.setProperty("--accent", THEME[map[key]] || THEME.accent);

    var pin = el("div", "scene__pin");
    var bg = el("div", "scene__bg");
    if (c.image) {
      var img = el("img");
      img.src = real(c.image); img.alt = ""; img.decoding = "async";
      img.loading = i < 2 ? "eager" : "lazy";
      img.onerror = function () {
        bg.classList.add("scene__bg--empty");
        bg.innerHTML = "<span>\u{1F4F7}</span><code>" + esc(c.image) + "</code>";
      };
      bg.appendChild(img);
    } else {
      bg.classList.add("scene__bg--empty");
      bg.innerHTML = "<span>\u{1F4F7}</span><code>image goes here</code>";
    }
    pin.appendChild(bg);
    pin.appendChild(el("div", "scene__veil"));

    var inner = el("div", "scene__inner");
    inner.innerHTML =
      '<div class="scene__meta">' +
        '<span class="scene__num">' + esc(c.number || pad(i + 1)) + "</span>" +
        '<span class="scene__of">/ ' + pad(total) + "</span>" +
        (c.label ? '<span class="scene__label">' + esc(c.label) + "</span>" : "") +
      "</div>" +
      '<p class="scene__kicker">' + esc(c.kicker || "") + "</p>" +
      '<h3 class="scene__title" data-split>' + esc(c.title || "") + "</h3>" +
      '<p class="scene__body" data-read>' + esc(c.body || "") + "</p>" +
      (c.quote ? '<blockquote class="scene__quote">' + brLines(c.quote) + "</blockquote>" : "") +
      (c.full ? '<div class="scene__read"><button class="linkish" type="button" data-read-full>Poora safar padho \u2192</button></div>' : "") +
      (c.transition ? '<p class="scene__next">' + esc(c.transition) + "</p>" : "");
    pin.appendChild(inner);

    var meter = el("div", "scene__meter");
    meter.appendChild(el("span", "scene__meterFill"));
    pin.appendChild(meter);
    sec.appendChild(pin);

    $$("[data-split]", sec).forEach(splitText);

    var btn = $("[data-read-full]", sec);
    if (btn) btn.addEventListener("click", function () { RD.open(c); });

    sec._mood = c.mood;
    return sec;
  }

  function renderStory() {
    var wrap = $("#chapters");
    if (!wrap) return;
    if (REDUCED) document.documentElement.classList.add("no-motion");

    var list = B.scenes || B.wishes || [];
    list.forEach(function (c, i) { wrap.appendChild(buildScene(c, i, list.length)); });

    /* closing quote */
    var cl = B.closing;
    if (cl) {
      var hi = $("#closing-hi");
      if (hi) hi.innerHTML = esc(cl.quoteHi || "").replace(/\n/g, "<br>");
      var sg = $("#closing-sign"); if (sg) sg.textContent = cl.sign || "";
      var ss = $("#closing-signsub"); if (ss) ss.textContent = cl.signSub || "";
      var cw = $(".closing__wrap"); if (cw) observe(cw, 0);
    }
  }

  function markReadable(node) {
    if (!node || node.dataset.ready) return [];
    var words = String(node.textContent).trim().split(/\s+/);
    node.textContent = "";
    var spans = [];
    words.forEach(function (w, i) {
      var s = el("span", "rw");
      s.textContent = w;
      node.appendChild(s); spans.push(s);
      if (i < words.length - 1) node.appendChild(document.createTextNode(" "));
    });
    node.dataset.ready = "1";
    return spans;
  }

  /* ── 10 · SCROLL DIRECTOR ──────────────────────────────────────────────
     One loop writes scroll position into CSS custom properties:
       --sp  hero drift · --p scene scrub · --jp journey · --vp card
       words get .lit / .now as the scene's own --p passes them.     */
  var Director = (function () {
    var scenes = [], reads = [], cards = [];
    var jEl = null, jTrack = null, eEl = null;
    var gEl = null, gShots = [];
    var vEl = null, vTrack = null, vCards = [], vFill = null;
    var vh = 0, vw = 0, dirty = true, queued = false, mood = null;

    function measure() {
      vh = window.innerHeight; vw = window.innerWidth;
      var y = window.pageYOffset || document.documentElement.scrollTop;
      scenes.forEach(function (s) {
        s.top = s.el.getBoundingClientRect().top + y;
        s.len = Math.max(1, s.el.offsetHeight - vh);
      });
      reads.forEach(function (r) { r.state = r.words.map(function () { return -1; }); });
      if (jEl) jEl.len = Math.max(1, jEl.offsetHeight - vh);
      if (eEl) eEl.len = Math.max(1, eEl.offsetHeight - vh);
      /* the clip strip is as tall as it needs to be to travel its own width */
      if (vEl && vTrack) {
        if (REDUCED) {
          vEl.style.height = "";
        } else {
          vEl.style.height = "";
          vEl.dist = Math.max(0, vTrack.scrollWidth - vw);
          vEl.style.height = (vh + Math.max(Math.round(vh * .85), vEl.dist)) + "px";
          vEl.len = Math.max(1, vEl.offsetHeight - vh);
        }
      }
      dirty = true;
    }

    function update() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      var i, s, p;

      var hero = document.getElementById("hero");
      if (hero && hero.offsetHeight) hero.style.setProperty("--sp", clamp(y / hero.offsetHeight, 0, 1).toFixed(4));

      for (i = 0; i < scenes.length; i++) {
        s = scenes[i];
        if (y + vh < s.top || y > s.top + s.len + vh) continue;
        p = clamp((y - s.top) / s.len, 0, 1);
        s.el.style.setProperty("--p", p.toFixed(4));
        /* season follows the scene you are inside */
        if (s.el._mood && s.el._mood !== mood && p > 0 && p < 1) { mood = s.el._mood; Weather.set(mood); }
      }

      for (i = 0; i < reads.length; i++) {
        var r = reads[i];
        if (!r.words.length || !r.scene) continue;
        var rp = parseFloat(r.scene.style.getPropertyValue("--p"));
        if (isNaN(rp)) continue;
        var reach = clamp((rp - .30) / .34, 0, 1) * r.words.length;
        for (var k = 0; k < r.words.length; k++) {
          var kv = clamp(reach - k, 0, 1);
          if (kv === r.state[k]) continue;
          r.state[k] = kv;
          r.words[k].classList.toggle("lit", kv > .45);
          r.words[k].classList.toggle("now", kv > .05 && kv <= .45);
        }
      }

      if (eEl) {
        var er = eEl.getBoundingClientRect();
        if (er.bottom > -100 && er.top < vh + 100) {
          var ep = clamp(-er.top / eEl.len, 0, 1);
          eEl.style.setProperty("--p", ep.toFixed(4));
          eEl.classList.toggle("is-armed", ep > .62);
        }
      }

      if (jEl && jTrack) {
        var jr = jEl.getBoundingClientRect();
        if (jr.bottom > -100 && jr.top < vh + 100) {
          var jp = clamp(-jr.top / jEl.len, 0, 1);
          var dist = Math.max(0, jTrack.scrollWidth - vw);
          jTrack.style.transform = "translate3d(" + (-jp * dist).toFixed(1) + "px,0,0)";
          jEl.style.setProperty("--jp", jp.toFixed(4));
          jEl.style.setProperty("--vp", clamp(1 - Math.abs(jr.top) / vh, 0, 1).toFixed(3));
          for (i = 0; i < cards.length; i++) {
            var cr = cards[i].getBoundingClientRect();
            cards[i].style.setProperty("--vp", clamp(1 - Math.abs(cr.left + cr.width / 2 - vw / 2) / (vw * .62), 0, 1).toFixed(3));
          }
        }
      }
      /* photos: each frame opens a little further as you scroll */
      if (!REDUCED && gEl && gShots.length) {
        var gr = gEl.getBoundingClientRect();
        if (gr.bottom > -vh * .35 && gr.top < vh + 240) {
          for (i = 0; i < gShots.length; i++) {
            var sr = gShots[i].getBoundingClientRect();
            if (sr.bottom < -80 || sr.top > vh + 80) continue;
            var gp = clamp((vh * .9 - sr.top) / (vh * .5), 0, 1);
            if (gShots[i]._gp === gp) continue;
            gShots[i]._gp = gp;
            gShots[i].style.setProperty("--gp", gp.toFixed(3));
          }
        }
      }

      /* clip strip: rides the scroll, one card lit at a time */
      if (vEl && vTrack) {
        var vr = vEl.getBoundingClientRect();
        if (vr.bottom > -100 && vr.top < vh + 100) {
          var vp = clamp(-vr.top / vEl.len, 0, 1);
          vTrack.style.transform = "translate3d(" + (-vp * (vEl.dist || 0)).toFixed(1) + "px,0,0)";
          vEl.style.setProperty("--vp", vp.toFixed(4));
          if (vFill) vFill.style.width = (vp * 100).toFixed(1) + "%";
          for (i = 0; i < vCards.length; i++) {
            var ccr = vCards[i].getBoundingClientRect();
            var cv = clamp(1 - Math.abs(ccr.left + ccr.width / 2 - vw / 2) / (vw * .55), 0, 1);
            if (vCards[i]._vp === cv) continue;
            vCards[i]._vp = cv;
            vCards[i].style.setProperty("--vp", cv.toFixed(3));
            vCards[i].classList.toggle("is-live", cv > .58);
          }
        }
      }
      dirty = false;
    }

    function request() {
      dirty = true;
      if (queued) return;
      queued = true;
      /* whichever fires first wins; the guard makes the rest no-ops.
         rAF alone is not enough — it is fully suspended in background
         tabs, which would leave `queued` stuck true and kill the story. */
      function done() {
        if (!queued) return;
        queued = false;
        if (dirty) update();
      }
      raf(done);
      setTimeout(done, 60);
    }

    function init() {
      scenes = $$(".scene").map(function (n) { return { el: n, top: 0, len: 1 }; });
      reads = $$("[data-read]").map(function (n) {
        return { el: n, words: markReadable(n), scene: n.closest ? n.closest(".scene") : null, state: [] };
      });
      cards = $$(".journey__card");
      jEl = $("#journey-track"); jTrack = $("#journey-track-inner");
      eEl = $("#eleven");
      gEl = $("#masonry"); gShots = $$(".gshot");
      vEl = $("#vstory"); vTrack = $("#vgrid"); vCards = $$("#vgrid .vcard");
      vFill = document.getElementById("vstory-fill");
      measure();

      window.addEventListener("scroll", request, { passive: true });
      window.addEventListener("resize", function () { measure(); request(); }, { passive: true });
      window.addEventListener("orientationchange", function () { setTimeout(measure, 250); });
      window.addEventListener("load", function () { setTimeout(measure, 120); });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(measure, 60); });
      [500, 1400, 3000].forEach(function (t) { setTimeout(measure, t); });
      /* safety net — rAF is throttled in background tabs */
      setInterval(function () { if (dirty) update(); }, 120);
      update();
    }
    return { init: init };
  })();

  /* ── 11 · THE JOURNEY ────────────────────────────────────────────────── */
  function renderJourney() {
    var track = $("#journey-track-inner");
    if (!track || !B.cards) return;
    B.cards.forEach(function (e, i) {
      var c = el("article", "journey__card");
      c.innerHTML =
        '<span class="journey__cardNum">' + pad(i + 1) + "</span>" +
        '<p class="journey__era">' + esc(e.era || "") + "</p>" +
        '<span class="journey__span">' + esc(e.span || "") + "</span>" +
        '<h3 class="journey__cardTitle">' + esc(e.title || "") + "</h3>" +
        '<p class="journey__cardBody">' + esc(e.body || "") + "</p>";
      track.appendChild(c);
    });
  }

  /* ── 12 · 11:11 ──────────────────────────────────────────────────────── */
  function initEleven() {
    var host = $("#eleven"), lines = $("#eleven-lines"), btn = $("#wish-btn");
    if (!host) return;
    var ls = (B.eleven && B.eleven.lines) || [];
    ls.forEach(function (t, i) {
      var p = el("p", null, esc(t));
      p.style.setProperty("--li", i);
      lines.appendChild(p);
    });
    /* a wish already made stays made — a refresh never re-locks the page */
    var WKEY = "hbd_wished";
    function wishDone() {
      host.dataset.done = "1";
      host.classList.add("is-done");
      var w = $("#eleven-wish"), a = $("#eleven-after");
      if (w) w.hidden = false;
      if (a) a.hidden = false;
    }
    if (sessionStorage.getItem(WKEY) === "1") wishDone();
    if (btn) btn.addEventListener("click", function () {
      if (host.dataset.done) return;
      sessionStorage.setItem(WKEY, "1");
      host.dataset.done = "1";
      host.classList.add("is-done");
      var w = $("#eleven-wish"), a = $("#eleven-after");
      setTimeout(function () { if (w) w.hidden = false; }, 400);
      setTimeout(function () { if (a) a.hidden = false; }, 1900);
      var r = host.getBoundingClientRect();
      setTimeout(function () { FX.cannons(); FX.burst(r.left + r.width / 2, r.top + r.height * .45, 90, { color: "#f0c46a" }); }, 260);
      FX.rain(3600);
    });
    }

  /* ── 13 · TIMELINE ───────────────────────────────────────────────────── */
  function renderTimeline() {
    var ol = $("#tl");
    if (!ol || !B.timeline) return;
    B.timeline.forEach(function (t) {
      var li = el("li", "tl__item");
      li.innerHTML = '<span class="tl__dot"></span><p class="tl__date">' + esc(t.date || "") + "</p>" +
        '<h3 class="tl__title">' + esc(t.title || "") + "</h3><p class=\"tl__body\">" + esc(t.body || "") + "</p>";
      ol.appendChild(li); observe(li);
    });
  }

  /* ── 14 · VIDEO ──────────────────────────────────────────────────────── */
  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  var LB = { items: [], i: 0, lastFocus: null };
  function renderVideos() {
    var grid = $("#vgrid");
    if (!grid || !B.videos) return;
    LB.items = B.videos;
    LB.node = $("#lb"); LB.video = $("#lb-video"); LB.empty = $("#lb-empty");
    LB.path = $("#lb-path"); LB.title = $("#lb-title"); LB.cap = $("#lb-caption");

    B.videos.forEach(function (v, i) {
      var card = el("button", "vcard");
      card.type = "button";
      var media = el("div", "vcard__media");
      if (v.poster) {
        var img = el("img");
        img.src = real(v.poster); img.alt = ""; img.loading = "lazy"; img.decoding = "async";
        img.onerror = function () { media.innerHTML = ""; media.appendChild(el("div", "vcard__play", PLAY)); };
        media.appendChild(img);
      }
      media.appendChild(el("div", "vcard__play", PLAY));
      var body = el("div", "vcard__body",
        '<p class="vcard__title">' + esc(v.title || "Untitled clip") + "</p>" +
        (v.subtitle ? '<p class="vcard__sub">' + esc(v.subtitle) + "</p>" : "") +
        (v.caption ? '<p class="vcard__caption">' + esc(v.caption) + "</p>" : ""));
      card.appendChild(media); card.appendChild(body);
      grid.appendChild(card); observe(card, (i % 3) * 90);
      card.addEventListener("click", function () { openVideo(i); });
    });

    $$("[data-close]", LB.node).forEach(function (b) { b.addEventListener("click", closeVideo); });
    $("#lb-prev").addEventListener("click", function () { stepVideo(-1); });
    $("#lb-next").addEventListener("click", function () { stepVideo(1); });
    LB.video.addEventListener("error", function () {
      if (!LB.video.getAttribute("src")) return;
      LB.video.style.display = "none"; LB.empty.hidden = false;
      LB.path.textContent = LB.video.getAttribute("src");
    });
    document.addEventListener("keydown", function (e) {
      if (LB.node.hidden) return;
      if (e.key === "Escape") closeVideo();
      else if (e.key === "ArrowRight") stepVideo(1);
      else if (e.key === "ArrowLeft") stepVideo(-1);
    });
  }
  function openVideo(i) {
    if (!LB.node) return;
    LB.lastFocus = document.activeElement; LB.i = i;
    LB.node.hidden = false; document.body.classList.add("locked"); loadVideo();
    var c = $(".lb__close", LB.node); if (c) c.focus();
  }
  function loadVideo() {
    var v = LB.items[LB.i] || {};
    LB.title.textContent = v.title || "";
    LB.cap.textContent = v.caption || v.subtitle || "";
    LB.empty.hidden = true; LB.video.style.display = "";
    LB.video.poster = real(v.poster) || "";
    if (v.src) {
      LB.video.setAttribute("src", v.src); LB.video.load();
      var p = LB.video.play(); if (p && p.catch) p.catch(function () {});
    } else {
      LB.video.removeAttribute("src"); LB.video.style.display = "none";
      LB.empty.hidden = false;
      LB.path.textContent = "assets/media/video/0" + (LB.i + 1) + "-your-clip.mp4";
    }
  }
  function stepVideo(d) { if (!LB.items.length) return; LB.i = (LB.i + d + LB.items.length) % LB.items.length; loadVideo(); }
  function closeVideo() {
    if (!LB.node || LB.node.hidden) return;
    LB.node.hidden = true; document.body.classList.remove("locked");
    try { LB.video.pause(); } catch (e) {}
    if (LB.lastFocus && LB.lastFocus.focus) LB.lastFocus.focus();
  }

  /* ── 15 · AUDIO ──────────────────────────────────────────────────────── */
  var PAUSE = '<svg class="icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';
  var PLAYI = '<svg class="icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  var players = [], current = null;
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function fmt(s) { if (!isFinite(s) || s < 0) s = 0; return pad(s / 60) + ":" + pad(s % 60); }

  function renderPlayers() {
    var wrap = $("#players");
    if (!wrap || !B.audio) return;
    B.audio.forEach(function (a, i) {
      var row = el("div", "player");
      var btn = el("button", "player__btn", PLAYI + PAUSE);
      btn.type = "button";
      btn.setAttribute("aria-label", "Play " + (a.title || "audio " + (i + 1)));
      var main = el("div", "player__main",
        '<p class="player__title">' + esc(a.title || "Message " + (i + 1)) + "</p>" +
        (a.subtitle ? '<p class="player__sub">' + esc(a.subtitle) + "</p>" : ""));
      var wave = el("div", "player__wave");
      wave.setAttribute("role", "slider");
      wave.setAttribute("aria-label", "Seek in " + (a.title || "audio"));
      wave.setAttribute("aria-valuemin", "0"); wave.setAttribute("aria-valuemax", "100");
      wave.setAttribute("aria-valuenow", "0"); wave.tabIndex = 0;
      var seed = rng(hash(a.src || a.title || "s")), N = 56;
      for (var b = 0; b < N; b++) {
        var bar = el("i", "player__bar");
        bar.style.height = (26 + seed() * 74) + "%";
        wave.appendChild(bar);
      }
      var time = el("div", "player__time", "<b>0:00</b> / --:--");
      time.setAttribute("aria-hidden", "true");
      main.appendChild(wave);
      row.appendChild(btn); row.appendChild(main); row.appendChild(time);
      wrap.appendChild(row);

      var p = { row: row, btn: btn, wave: wave, bars: $$(".player__bar", wave), time: time, audio: new Audio(), data: a, N: N };
      p.audio.preload = "metadata";
      if (a.src) p.audio.src = a.src; else p.audio.preload = "none";

      p.audio.addEventListener("loadedmetadata", function () {
        time.innerHTML = "<b>0:00</b> / " + fmt(p.audio.duration);
        wave.setAttribute("aria-valuemax", Math.round(p.audio.duration || 0) || 100);
      });
      p.audio.addEventListener("timeupdate", function () { paint(p); });
      p.audio.addEventListener("play", function () { onPlay(p); });
      p.audio.addEventListener("pause", function () { onPause(p); });
      p.audio.addEventListener("ended", function () { onPause(p); next(p); });
      p.audio.addEventListener("error", function () { if (!a.src) { time.innerHTML = "<b>drop file</b>"; row.classList.add("is-missing"); } });

      btn.addEventListener("click", function () { toggle(p); });
      wave.addEventListener("click", function (e) {
        if (!p.audio.duration) return;
        var r = wave.getBoundingClientRect();
        p.audio.currentTime = clamp((e.clientX - r.left) / r.width, 0, 1) * p.audio.duration;
        paint(p);
      });
      wave.addEventListener("keydown", function (e) {
        if (!p.audio.duration) return;
        if (e.key === "ArrowRight") { p.audio.currentTime = clamp(p.audio.currentTime + 5, 0, p.audio.duration); paint(p); e.preventDefault(); }
        if (e.key === "ArrowLeft") { p.audio.currentTime = clamp(p.audio.currentTime - 5, 0, p.audio.duration); paint(p); e.preventDefault(); }
      });
      players.push(p); observe(row, i * 80);
    });
  }
  function paint(p) {
    var d = p.audio.duration || 0, t = p.audio.currentTime || 0;
    var on = d ? Math.round((t / d) * p.N) : 0;
    for (var i = 0; i < p.N; i++) { if (i < on) p.bars[i].classList.add("on"); else p.bars[i].classList.remove("on"); }
    p.time.innerHTML = "<b>" + fmt(t) + "</b> / " + (d ? fmt(d) : "--:--");
    p.wave.setAttribute("aria-valuenow", Math.round(d ? (t / d) * 100 : 0));
  }
  function onPlay(p) { if (current && current !== p) current.audio.pause(); current = p; p.row.classList.add("is-playing"); p.btn.setAttribute("aria-label", "Pause " + (p.data.title || "audio")); }
  function onPause(p) { p.row.classList.remove("is-playing"); p.btn.setAttribute("aria-label", "Play " + (p.data.title || "audio")); }
  function toggle(p) { if (!p.data.src) { p.time.innerHTML = "<b>drop file</b>"; return; } if (p.audio.paused) p.audio.play().catch(function () {}); else p.audio.pause(); }
  function next(p) { var i = players.indexOf(p); if (i > -1 && i < players.length - 1) toggle(players[i + 1]); }

  /* the song, shared between the gate hand-off and the dock */
  var MUSIC = { song: null, play: function () {}, stop: function () {}, toggle: function () {} };

  function initDock() {
    var dock = $("#dock"), btn = $("#dock-music"), top = $("#dock-top");
    dock.hidden = false;

    var bt = B.backgroundTrack, song = null;
    if (bt && bt.enabled && bt.src) {
      song = new Audio(bt.src);
      song.loop = true;
      song.volume = 0.45;
      song.preload = "metadata";

      function paint(on) {
        btn.classList.toggle("is-on", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
        var lab = btn.querySelector(".dock__label");
        if (lab) lab.textContent = on ? "Chal raha hai" : (bt.title || "Music");
      }
      song.addEventListener("play", function () { paint(true); });
      song.addEventListener("pause", function () { paint(false); });
      song.addEventListener("error", function () {
        var lab = btn.querySelector(".dock__label");
        if (lab) lab.textContent = "audio missing";
        btn.title = bt.src + " nahi mila";
      });

      btn.addEventListener("click", function () {
        if (song.paused) {
          var pr = song.play();
          if (pr && pr.then) pr.then(function () { paint(true); }).catch(function () {});
        } else song.pause();
      });
      paint(false);

      MUSIC.song = song;
      MUSIC.play = function () {
        var p = song.play();
        if (p && p.then) p.then(function () { paint(true); }).catch(function () {});
      };
      MUSIC.stop = function () { song.pause(); paint(false); };
      MUSIC.toggle = function () { btn.click(); };
    } else {
      btn.hidden = true;
    }

    top.addEventListener("click", function () { SMOOTH.to(0); });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden && song && !song.paused) song.pause();
    });
  }

  /* Happy Birthday melody first, then the song — starts from the real click */
  function playIntro() {
    var secs = 0;
    try { secs = TUNE.play() || 0; } catch (e) { secs = 0; }
    if (secs > 0) setTimeout(function () { MUSIC.play(); }, secs * 1000 + 300);
    else MUSIC.play();
  }


  /* ── 17 · MESSAGES ───────────────────────────────────────────────────── */
  function renderMessages() {
    var wrap = $("#cards");
    if (!wrap || !B.messages) return;
    B.messages.forEach(function (m, i) {
      var card = el("article", "card");
      var ini = (m.from || "?").trim().charAt(0).toUpperCase();
      card.innerHTML = '<blockquote class="card__quote">' + esc(m.text || "") + "</blockquote>" +
        '<div class="card__foot"><span class="card__avatar" aria-hidden="true">' + esc(ini) + "</span>" +
        '<div><p class="card__from">' + esc(m.from || "Anonymous") + "</p>" +
        (m.relation ? '<p class="card__rel">' + esc(m.relation) + "</p>" : "") + "</div></div>";
      wrap.appendChild(card);
      observe(card, (i % 3) * 90);
    });
  }

  /* ── 18 · GALLERY ────────────────────────────────────────────────────── */
  var IMB = { items: [], i: 0, lastFocus: null };
  function renderGallery() {
    var wrap = $("#masonry");
    if (!wrap) return;
    /* PHOTOS is written by sync-photos.py from whatever real files exist */
    var list = (window.PHOTOS && window.PHOTOS.length) ? window.PHOTOS
             : (B.gallery || []);
    if (!list.length) return;
    IMB.items = list;
    list.forEach(function (g, i) {
      var b = el("button", "gshot");
      b.type = "button";
      if (g.src) {
        var img = el("img");
        img.src = real(g.src); img.alt = g.caption || ""; img.loading = "lazy"; img.decoding = "async";
        img.onerror = function () {
          b.classList.add("gshot--empty");
          b.innerHTML = "<span>\u{1F4F7}</span><code>" + esc(g.src) + "</code>";
          b.onclick = function () {};
        };
        b.appendChild(img);
        b.appendChild(el("span", "gshot__cap",
          "<b>" + esc(g.caption || "") + "</b><i>" + pad(i + 1) + " / " + pad(list.length) + "</i>"));
      } else {
        b.classList.add("gshot--empty");
        b.innerHTML = "<span>\u{1F4F7}</span><code>assets/media/images/…" + (i + 1) + ".jpg</code>";
      }
      wrap.appendChild(b); observe(b, (i % 4) * 70);
      b.addEventListener("click", function () { if (g.src) openImg(i); });
    });
    IMB.node = $("#lb-img"); IMB.img = $("#lb-img-el"); IMB.cap = $("#lb-img-cap");
    $$("[data-close-img]", IMB.node).forEach(function (b) { b.addEventListener("click", closeImg); });
    $("#lb-img-prev").addEventListener("click", function () { stepImg(-1); });
    $("#lb-img-next").addEventListener("click", function () { stepImg(1); });
    document.addEventListener("keydown", function (e) {
      if (IMB.node.hidden) return;
      if (e.key === "Escape") closeImg();
      else if (e.key === "ArrowRight") stepImg(1);
      else if (e.key === "ArrowLeft") stepImg(-1);
    });
  }
  function openImg(i) {
    IMB.lastFocus = document.activeElement; IMB.i = i;
    IMB.node.hidden = false; document.body.classList.add("locked");
    var g = IMB.items[i] || {};
    IMB.img.src = g.src || ""; IMB.img.alt = g.caption || ""; IMB.cap.textContent = g.caption || "";
    var c = $(".lb__close", IMB.node); if (c) c.focus();
  }
  function stepImg(d) {
    if (!IMB.items.length) return;
    IMB.i = (IMB.i + d + IMB.items.length) % IMB.items.length;
    var g = IMB.items[IMB.i]; if (!g.src) return;
    IMB.img.src = g.src; IMB.img.alt = g.caption || ""; IMB.cap.textContent = g.caption || "";
  }
  function closeImg() {
    IMB.node.hidden = true; document.body.classList.remove("locked");
    if (IMB.lastFocus && IMB.lastFocus.focus) IMB.lastFocus.focus();
  }

  /* ── 19 · READER ─────────────────────────────────────────────────────── */
  var RD = { node: null, lastFocus: null };
  RD.open = function (c) {
    if (!RD.node) return;
    RD.lastFocus = document.activeElement;
    $("#reader-kicker").textContent = [c.kicker, c.label].filter(Boolean).join(" · ");
    $("#reader-title").textContent = c.title || "";
    var body = $("#reader-body");
    body.innerHTML = "";
    (c.full || []).forEach(function (p) { body.appendChild(el("p", null, esc(p))); });
    $("#reader-quote").innerHTML = brLines(c.quote || "");
    RD.node.hidden = false; document.body.classList.add("locked");
    $(".reader__panel", RD.node).scrollTop = 0;
    var c2 = $(".reader__close", RD.node); if (c2) c2.focus();
  };
  function initReader() {
    RD.node = $("#reader");
    $$("[data-reader-close]", RD.node).forEach(function (b) {
      b.addEventListener("click", function () {
        RD.node.hidden = true; document.body.classList.remove("locked");
        if (RD.lastFocus && RD.lastFocus.focus) RD.lastFocus.focus();
      });
    });
    document.addEventListener("keydown", function (e) {
      if (RD.node.hidden) return;
      if (e.key === "Escape") { RD.node.hidden = true; document.body.classList.remove("locked"); if (RD.lastFocus && RD.lastFocus.focus) RD.lastFocus.focus(); }
    });
  }

  /* ── 20 · LETTER + FINALE ────────────────────────────────────────────── */
  function initLetter() {
    var folded = $("#letter-folded"), body = $("#letter-open-body"), txt = $("#letter-body");
    if (!folded || !body) return;
    ((B.letter && B.letter.paragraphs) || []).forEach(function (p) { txt.appendChild(el("p", null, esc(p))); });
    var sig = $("[data-signature]"); if (sig) sig.classList.add("sign-in");
    $("#letter-open").addEventListener("click", function () {
      folded.classList.add("is-gone");
      setTimeout(function () { folded.hidden = true; }, 850);
      setTimeout(function () {
        body.hidden = false;
        $$("p", txt).forEach(function (p, i) {
          p.style.opacity = 0; p.style.transform = "translateY(16px)";
          setTimeout(function () {
            p.style.transition = "opacity .8s var(--e), transform .8s var(--e-out)";
            p.style.opacity = 1; p.style.transform = "none";
          }, i * 130);
        });
        SMOOTH.toNode(body, "center");
      }, REDUCED ? 0 : 700);
      if (!REDUCED) FX.burst(window.innerWidth / 2, window.innerHeight * .55, 40);
    });
  }

  function initFinale() {
    var cake = $("#cake"), blow = $("#blow"), after = $("#after");
    if (!cake || !blow) return;
    var smoke = el("div", "cake__smoke");
    cake.appendChild(smoke);
    var BKEY = "hbd_blown", RKEY = "hbd_replayed";
    /* a candle already blown stays blown — refresh never re-locks the finale */
    var done = sessionStorage.getItem(BKEY) === "1";
    function blownQuiet() {
      if (smoke.parentNode) smoke.parentNode.removeChild(smoke);
      cake.classList.add("is-out");
      blow.textContent = "Ho gaya \u2728";
      after.hidden = false;
    }
    if (done) { blownQuiet(); $$("h3,p,.btn", after).forEach(function (n) { observe(n); }); }
    blow.addEventListener("click", function () {
      if (done) return; done = true;
      sessionStorage.setItem(BKEY, "1");
      if (smoke.parentNode) smoke.parentNode.removeChild(smoke);
      cake.classList.add("is-out");
      setTimeout(function () {
        FX.cannons();
        var r = cake.getBoundingClientRect();
        FX.burst(r.left + r.width / 2, r.top + r.height * .3, 70, { color: THEME.accent || "#c98a2e" });
        FX.rain(4600);
      }, REDUCED ? 0 : 420);
      setTimeout(function () {
        after.hidden = false;
        $$("h3,p,.btn", after).forEach(function (n, i) { observe(n, i * 130); });
        SMOOTH.toNode(after, "center");
      }, REDUCED ? 0 : 1500);
      blow.textContent = "Ho gaya \u2728";
    });
    var replay = document.getElementById("replay"), replayed = sessionStorage.getItem(RKEY) === "1";
    replay.addEventListener("click", function () {
      replayed = true;
      sessionStorage.setItem(RKEY, "1");
      FX.cannons(); FX.rain(2600);
    });
  }

  /* ── 21 · GATE ───────────────────────────────────────────────────────── */
  function initGate() {
    var gate = $("#gate"), env = $("#envelope"), open = $("#gate-open"), skip = $("#gate-skip");
    var KEY = "hbd_opened";
    if (sessionStorage.getItem(KEY) === "1") return skipGate(true);

    function skipGate(silent) {
      gate.hidden = true;
      document.body.classList.remove("is-loading");
      document.body.classList.add("is-ready");
      sessionStorage.setItem(KEY, "1");
      startHero();
      if (!silent) { FX.cannons(); setTimeout(function () { FX.rain(2200); }, 200); }
      }
    function openGate() {
      if (gate.dataset.done) return;
      gate.dataset.done = "1";
      /* real user gesture — the one moment a browser allows audio */
      setTimeout(playIntro, 640);
      env.classList.add("is-open");
      open.style.opacity = 0; skip.style.opacity = 0;
      var r = env.getBoundingClientRect();
      setTimeout(function () { FX.burst(r.left + r.width / 2, r.top + r.height * .45, 130); }, REDUCED ? 0 : 520);
      setTimeout(function () {
        gate.style.transition = "opacity .7s var(--e), transform .9s var(--e-out)";
        gate.style.opacity = 0; gate.style.transform = "scale(1.06)";
        setTimeout(function () { skipGate(false); FX.rain(2400); }, REDUCED ? 0 : 700);
      }, REDUCED ? 0 : 1700);
    }
    env.addEventListener("click", openGate);
    env.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openGate(); } });
    open.addEventListener("click", openGate);
    skip.addEventListener("click", function () { skipGate(false); playIntro(); });
  }

  /* ══════════════════════════════════════════════════════════════════════
     20b · TUNE — the Happy Birthday melody, synthesised with Web Audio
        (no file needed). Hands off to `backgroundTrack` when it ends.
        Sound only starts from a real click — the gate is that click.
     ════════════════════════════════════════════════════════════════════ */
  var TUNE = (function () {
    var AC = window.AudioContext || window.webkitAudioContext;
    function play() {
      if (REDUCED || !AC) return 0;
      var ctx = new AC();
      if (ctx.state === "suspended") ctx.resume();
      var master = ctx.createGain();
      master.gain.value = 0.0001;
      master.connect(ctx.destination);

      var N = { F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99 };
      /* [frequency, beats] — the usual four lines */
      var m = [
        [N.G4, .5], [N.G4, .5], [N.A4, .5], [N.G4, .5], [N.C5, .5], [N.B4, 1],
        [N.G4, .5], [N.G4, .5], [N.A4, .5], [N.G4, .5], [N.D5, .5], [N.C5, 1],
        [N.G4, .5], [N.G4, .5], [N.G5, .5], [N.E5, .5], [N.C5, .5], [N.B4, .5], [N.A4, 1],
        [N.F4, .5], [N.F4, .5], [N.E5, .5], [N.C5, .5], [N.D5, .5], [N.C5, 1.4]
      ];
      var beat = 60 / 104, t = ctx.currentTime + 0.12;
      m.forEach(function (n, idx) {
        var dur = n[1] * beat;
        var o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
        o.type = "triangle"; o.frequency.value = n[0];
        f.type = "lowpass"; f.frequency.value = 2600;
        o.connect(f); f.connect(g); g.connect(master);
        var peak = idx === 0 ? .17 : .14;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(peak, t + .03);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur * .9);
        o.start(t); o.stop(t + dur + .02);

        /* soft octave-down harmony on the held notes */
        if (n[1] >= 1) {
          var o2 = ctx.createOscillator(), g2 = ctx.createGain();
          o2.type = "sine"; o2.frequency.value = n[0] / 2;
          o2.connect(g2); g2.connect(master);
          g2.gain.setValueAtTime(0.0001, t);
          g2.gain.exponentialRampToValueAtTime(.05, t + .05);
          g2.gain.exponentialRampToValueAtTime(0.0001, t + dur * .88);
          o2.start(t); o2.stop(t + dur + .02);
        }
        t += dur;
      });
      var total = t - ctx.currentTime;
      master.gain.setValueAtTime(0.0001, ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(1, ctx.currentTime + .25);
      setTimeout(function () { try { master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.4); } catch (e) {} }, total * 1000);
      return total;
    }
    return { play: play };
  })();

  /* ── VIRTUAL HUG ────────────────────────────────────────────────────── */
  function initHug() {
    var sec = $("#hug"), btn = $("#hug-btn"), veil = $("#hug-veil"), close = $("#hug-close");
    if (!sec || !btn) return;
    function burst(cx, cy) {
      FX.burst(cx, cy, 46, { color: THEME.accent2 || "#d94f76" });
      FX.burst(cx, cy, 30, { color: THEME.accent || "#c98a2e" });
      if (navigator.vibrate) { try { navigator.vibrate([18, 40, 18]); } catch (e) {} }
    }
    btn.addEventListener("click", function () {
      var r = btn.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2);
      sessionStorage.setItem("hbd_hugged", "1");
      veil.hidden = false;
      document.body.classList.add("locked");
      sec.classList.add("is-hugging");
      close && close.focus();
    });
    function shut() {
      veil.hidden = true;
      document.body.classList.remove("locked");
      sec.classList.remove("is-hugging");
      btn.focus();
    }
    close && close.addEventListener("click", shut);
    veil && veil.addEventListener("click", function (e) { if (e.target === veil) shut(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && veil && !veil.hidden) shut();
    });
    var dockHug = $("#dock-hug");
    if (dockHug) dockHug.addEventListener("click", function () { btn.click(); });
    var dockWish = $("#dock-wish");
    if (dockWish) dockWish.addEventListener("click", function () {
      /* jump straight to where the 11:11 wish sits, then press the wish
         button for them — the button is invited, never forced */
      var e = $("#eleven"), w = $("#wish-btn");
      if (!e || !w) return;
      var len = Math.max(1, e.offsetHeight - window.innerHeight);
      var top = e.getBoundingClientRect().top + window.pageYOffset;
      SMOOTH.to(Math.round(top + len * 0.78));
      if (REDUCED) { w.click(); return; }
      var tries = 0;
      (function poll() {
        if (w.dataset.done) return;
        if (e.classList.contains("is-armed") || tries++ > 45) { w.click(); return; }
        setTimeout(poll, 100);
      })();
    });
  }

  /* ── 22 · BOOT ───────────────────────────────────────────────────────── */
  function boot() {
    document.documentElement.style.setProperty("--accent", THEME.accent || "#c98a2e");
    bindAll();
    initReveal();

    renderStory();
    renderJourney();
    renderTimeline();
    renderVideos();
    renderMessages();
    renderGallery();
    initReader();
    initLetter();
    initFinale();
    initEleven();
    initHug();
    initDock();
    initHero();
    initScroll();

    $$("[data-split]").forEach(splitText);
    $$("[data-head]").forEach(function (h) { observe(h); });

    Director.init();
    initGate();

    document.addEventListener("keydown", function (e) {
      if (e.key === "m" && !/input|textarea/i.test(e.target.tagName)) {
        if (MUSIC.song) MUSIC.toggle();
      }
      if (e.key === "h" && !/input|textarea/i.test(e.target.tagName)) {
        var hb = $("#hug-btn"); if (hb) hb.click();
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
