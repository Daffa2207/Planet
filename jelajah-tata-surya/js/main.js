/* ==========================================================================
   main.js — Logika utama halaman
   ========================================================================== */
(function () {
  "use strict";

  var P = window.PLANETS, EXTRAS = window.EXTRAS || [];
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var Tickers = (window.Tickers = window.Tickers || []);

  /* ------------------------------------------------------- utilitas */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function h(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function hexRgb(hex) {
    var n = parseInt(hex.slice(1), 16);
    return ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255);
  }
  function nf(v, d) {
    return Number(v).toLocaleString("id-ID", { maximumFractionDigits: d == null ? 0 : d, minimumFractionDigits: 0 });
  }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function idxOf(id) { for (var i = 0; i < P.length; i++) if (P[i].id === id) return i; return -1; }

  /* ---------------------------------------------- loop animasi tunggal */
  var visMap = [];
  Tickers.forEach(function (t) { if (t.el) visMap.push(t); });
  function registerTicker(t) { Tickers.push(t); if (t.el) { visMap.push(t); observeVis(t); } }
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      visMap.forEach(function (t) { if (t.el === en.target) t.visible = en.isIntersecting; });
    });
  }, { rootMargin: "80px" }) : null;
  function observeVis(t) { if (io) io.observe(t.el); else t.visible = true; }
  visMap.forEach(observeVis);

  var last = performance.now();
  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!document.hidden) {
      for (var i = 0; i < Tickers.length; i++) {
        var t = Tickers[i];
        if (!t.el || t.visible) { try { t.tick(dt, now / 1000); } catch (e) { /* jangan hentikan loop */ } }
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ------------------------------------------------------ navigasi */
  var nav = $("#nav"), navToggle = $("#navToggle");
  function closeNav() { nav.classList.remove("open"); navToggle.setAttribute("aria-expanded", "false"); navToggle.setAttribute("aria-label", "Buka menu"); }
  navToggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  });
  $$("a", nav).forEach(function (a) { a.addEventListener("click", closeNav); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });

  if (io) {
    var links = {};
    $$("a", nav).forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].classList.toggle("active", k === en.target.id); });
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) navIo.observe(s); });
  }

  /* --------------------------------------------------- efek sentuhan */
  var Fx = {
    ripple: function (layer, x, y) {
      var r = h("span", "ripple"); r.style.left = x + "px"; r.style.top = y + "px";
      layer.appendChild(r); setTimeout(function () { r.remove(); }, 1000);
    },
    sparks: function (layer, x, y, count) {
      for (var i = 0; i < count; i++) {
        var s = h("span", "spark"); s.style.left = x + "px"; s.style.top = y + "px";
        layer.appendChild(s);
        var a = (i / count) * Math.PI * 2 + Math.random() * 0.5, d = 50 + Math.random() * 110;
        var dx = Math.cos(a) * d, dy = Math.sin(a) * d, dur = 650 + Math.random() * 450;
        if (s.animate) {
          var an = s.animate([
            { transform: "translate(0,0) scale(1)", opacity: 1 },
            { transform: "translate(" + dx + "px," + dy + "px) scale(0.1)", opacity: 0 }
          ], { duration: dur, easing: "cubic-bezier(.15,.8,.3,1)" });
          an.onfinish = (function (el) { return function () { el.remove(); }; })(s);
        } else setTimeout((function (el) { return function () { el.remove(); }; })(s), 300);
      }
    },
    burst: function (layer, x, y) {
      if (reduce) return;
      Fx.ripple(layer, x, y); Fx.sparks(layer, x, y, 16);
    },
    buzz: function () { if (navigator.vibrate) { try { navigator.vibrate(8); } catch (e) { /* abaikan */ } } }
  };

  /* Seret untuk memutar + ketuk untuk efek. Dipakai planet utama dan planet di beranda. */
  function attachDrag(canvas, view, onTap) {
    var d = { on: false, id: null, x: 0, y: 0, t: 0, t0: 0, moved: 0, v: 0 };
    canvas.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      d.on = true; d.id = e.pointerId; d.x = e.clientX; d.y = e.clientY; d.t = d.t0 = performance.now(); d.moved = 0; d.v = 0;
      view.dragging = true; view.vel = 0;
      canvas.classList.add("grabbing");
      try { canvas.setPointerCapture(e.pointerId); } catch (x) { /* abaikan */ }
    });
    canvas.addEventListener("pointermove", function (e) {
      if (!d.on || e.pointerId !== d.id) return;
      var dx = e.clientX - d.x, dy = e.clientY - d.y, now = performance.now();
      var dt = Math.max(4, now - d.t) / 1000;
      d.moved += Math.abs(dx) + Math.abs(dy);
      var th = (view.tiltDeg || 0) * Math.PI / 180;
      var lx = dx * Math.cos(th) + dy * Math.sin(th); // gerakan jari searah sumbu lokal kanvas
      var turns = lx / (2 * Math.PI * view.radiusCss());
      view.rot += turns; view.dirty = true;
      d.v = d.v * 0.6 + (turns / dt) * 0.4;
      d.x = e.clientX; d.y = e.clientY; d.t = now;
    });
    function end(e) {
      if (!d.on || e.pointerId !== d.id) return;
      d.on = false; view.dragging = false; canvas.classList.remove("grabbing");
      var now = performance.now();
      if (e.type === "pointerup" && d.moved < 10 && now - d.t0 < 450) { if (onTap) onTap(e); return; }
      if (e.type === "pointerup" && now - d.t < 90) view.vel = clamp(d.v, -1.6, 1.6);
    }
    canvas.addEventListener("pointerup", end);
    canvas.addEventListener("pointercancel", end);
    canvas.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  }

  /* ========================================================= BERANDA */
  var heroBox = $("#heroPlanet"), heroCv = $("#heroCanvas"), heroCap = $("#heroCaption");
  var heroView = new PlanetView(heroCv, { maxPx: 520 });
  var heroOrder = ["bumi", "jupiter", "saturnus", "mars", "neptunus", "venus", "uranus", "merkurius"], heroIdx = 0, heroToken = 0;
  heroView.auto = !reduce;

  function setHero(id) {
    var p = P[idxOf(id)], tk = ++heroToken;
    heroBox.style.setProperty("--accent-rgb", hexRgb(p.accent));
    heroBox.style.setProperty("--accent", p.accent);
    heroCv.style.transition = "transform .9s cubic-bezier(.2,.8,.2,1), opacity .9s";
    heroCv.style.transform = "rotate(" + p.render.tilt + "deg)";
    heroCv.style.touchAction = Math.abs(p.render.tilt) > 45 ? "none" : "pan-y";
    heroView.setPlanet(p).then(function (ok) {
      if (!ok || tk !== heroToken) return;
      heroBox.classList.add("is-ready");
      heroCap.textContent = p.nama + ". Ketuk untuk ganti planet.";
    });
  }
  heroView.resize();
  attachDrag(heroCv, heroView, function (e) {
    var r = heroBox.getBoundingClientRect();
    var fx = $(".hero-fx", heroBox);
    if (!fx) { fx = h("div", "fx-layer hero-fx"); heroBox.appendChild(fx); }
    Fx.burst(fx, e.clientX - r.left, e.clientY - r.top); Fx.buzz();
    heroView.vel += heroView.dir * 0.5;
    heroIdx = (heroIdx + 1) % heroOrder.length;
    setHero(heroOrder[heroIdx]);
  });
  heroCv.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); heroIdx = (heroIdx + 1) % heroOrder.length; setHero(heroOrder[heroIdx]); }
  });
  if (window.ResizeObserver) new ResizeObserver(function () { heroView.resize(); }).observe(heroCv);
  registerTicker({ el: heroCv, visible: true, tick: function (dt) { heroView.tick(dt); } });
  setHero(heroOrder[0]);

  /* ==================================================== PENJELAJAH */
  var stage = $("#stage"), tiltEl = $("#tilt"), canvas = $("#planetCanvas"), parallax = $("#parallax");
  var fxLayer = $("#fxLayer"), bubble = $("#factBubble"), picker = $("#picker");
  var view = new PlanetView(canvas, { maxPx: 560 });
  view.auto = !reduce;
  var state = { i: -1, factIdx: 0, kg: 50, age: 20, jump: 40, tab: "ringkasan", bubbleTimer: 0, switchToken: 0 };

  view.resize();
  if (window.ResizeObserver) new ResizeObserver(function () { view.resize(); }).observe(canvas);
  registerTicker({ el: canvas, visible: false, tick: function (dt) { view.tick(dt); } });

  /* --- pemilih planet (chip) --- */
  var chips = P.map(function (p, i) {
    var b = h("button", "chip"); b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-selected", "false"); b.tabIndex = -1;
    b.style.setProperty("--c1", p.warna[0]); b.style.setProperty("--c2", p.warna[1]); b.style.setProperty("--c3", p.warna[2]);
    b.appendChild(h("i")); b.appendChild(document.createTextNode(p.nama));
    b.addEventListener("click", function () { selectPlanet(i); });
    picker.appendChild(b); return b;
  });
  picker.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault(); e.stopPropagation();
      var n = (state.i + (e.key === "ArrowRight" ? 1 : P.length - 1)) % P.length;
      selectPlanet(n); chips[n].focus();
    }
  });

  /* --- bagian info --- */
  var STAT_LABELS = [
    ["diameter", "Diameter"], ["massa", "Massa"], ["gravitasi", "Gravitasi permukaan"], ["jarak", "Jarak dari Matahari"],
    ["hari", "Lama satu hari (rotasi)"], ["tahun", "Lama satu tahun (orbit)"], ["suhu", "Suhu"], ["bulan", "Jumlah bulan"]
  ];
  function readoutList(pairs, cls) {
    var dl = h("dl", "readout" + (cls ? " " + cls : ""));
    pairs.forEach(function (pr) {
      var d = h("div"); d.appendChild(h("dt", null, pr[0])); d.appendChild(h("dd", null, pr[1])); dl.appendChild(d);
    });
    return dl;
  }
  function paras(arr, parent) { arr.forEach(function (t) { parent.appendChild(h("p", null, t)); }); }

  var calcRefs = {};
  function renderInfo(p, i) {
    $("#infoOrder").textContent = "Planet ke-" + (i + 1) + " dari Matahari";
    $("#infoName").textContent = p.nama;
    $("#infoLatin").textContent = p.tipe + " (Inggris: " + p.latin + ")";
    $("#infoTagline").textContent = p.tagline;

    var st = $("#stats"); st.innerHTML = "";
    STAT_LABELS.forEach(function (pr) {
      var d = h("div"); d.appendChild(h("dt", null, pr[1])); d.appendChild(h("dd", null, p.stat[pr[0]])); st.appendChild(d);
    });

    /* Ringkasan */
    var pr = $("#panel-ringkasan"); pr.innerHTML = "";
    paras(p.ringkasan, pr);
    pr.appendChild(readoutList(p.detail));

    /* Struktur dan atmosfer */
    var ps = $("#panel-struktur"); ps.innerHTML = "";
    ps.appendChild(h("h4", null, "Struktur dan permukaan"));
    paras(p.struktur, ps);
    ps.appendChild(h("h4", null, "Atmosfer"));
    ps.appendChild(h("p", null, p.atmosfer.teks));
    ps.appendChild(h("h4", null, p.atmosfer.judul));
    var ul = h("ul", "comp");
    p.atmosfer.komposisi.forEach(function (c) {
      var li = h("li"); li.appendChild(h("span", null, c.n));
      var tr = h("span", "comp-track"), fl = h("span", "comp-fill"); fl.dataset.w = c.v; tr.appendChild(fl); li.appendChild(tr);
      li.appendChild(h("span", "comp-val", nf(c.v, 1) + "%")); ul.appendChild(li);
    });
    ps.appendChild(ul);

    /* Bulan */
    var pb = $("#panel-bulan"); pb.innerHTML = "";
    pb.appendChild(h("p", null, p.bulan.teks));
    if (p.bulan.daftar.length) {
      var dl = h("dl", "moons");
      p.bulan.daftar.forEach(function (m) { var d = h("div"); d.appendChild(h("dt", null, m.n)); d.appendChild(h("dd", null, m.i)); dl.appendChild(d); });
      pb.appendChild(dl);
    }

    /* Misi */
    var pm = $("#panel-misi"); pm.innerHTML = "";
    var ol = h("ol", "timeline");
    p.misi.forEach(function (m) {
      var li = h("li"); li.appendChild(h("div", "tl-year", m.tahun)); li.appendChild(h("div", "tl-name", m.nama)); li.appendChild(h("div", "tl-text", m.ket)); ol.appendChild(li);
    });
    pm.appendChild(ol);

    /* Fakta */
    var pf = $("#panel-fakta"); pf.innerHTML = "";
    var fl = h("ul", "facts"); p.fakta.forEach(function (t) { fl.appendChild(h("li", null, t)); }); pf.appendChild(fl);

    /* Coba sendiri */
    var pc = $("#panel-coba"); pc.innerHTML = "";
    var wrap = h("div", "try");
    function item(id, label, unit, val, key, min, max) {
      var box = h("div", "try-item");
      var lab = h("label", null, label); lab.htmlFor = id; box.appendChild(lab);
      var row = h("div", "try-row");
      var inp = document.createElement("input"); inp.type = "number"; inp.id = id; inp.min = min; inp.max = max; inp.step = "any"; inp.inputMode = "decimal"; inp.value = val;
      row.appendChild(inp); row.appendChild(h("span", "try-unit", unit)); box.appendChild(row);
      var res = h("p", "try-result"), cap = h("p", "try-caption"); box.appendChild(res); box.appendChild(cap);
      inp.addEventListener("input", function () { var v = parseFloat(inp.value); if (isFinite(v) && v >= 0) { state[key] = v; calc(); } });
      wrap.appendChild(box); calcRefs[key] = { res: res, cap: cap };
    }
    item("kgIn", "Berapa berat badanmu di " + p.nama + "?", "kg di Bumi", state.kg, "kg", 0, 1000);
    item("ageIn", "Berapa umurmu di " + p.nama + "?", "tahun Bumi", state.age, "age", 0, 130);
    item("jumpIn", "Seberapa tinggi lompatanmu di " + p.nama + "?", "cm di Bumi", state.jump, "jump", 0, 300);
    pc.appendChild(wrap);
    calc();

    /* atur ulang tab bila animasi batang perlu diputar */
    if (state.tab === "struktur") animateComp();
  }

  function calc() {
    var p = P[state.i]; if (!p || !calcRefs.kg) return;
    var w = state.kg * p.gravRatio;
    calcRefs.kg.res.textContent = nf(w, 1) + " kg";
    calcRefs.kg.cap.textContent = "Timbangan di " + p.nama + " menunjukkan angka ini. Massamu tetap " + nf(state.kg, 1) + " kg; yang berubah hanya gaya tarik gravitasinya (" + nf(p.gravRatio * 100, 0) + "% dari Bumi).";
    var yrs = state.age * 365.25 / p.orbitDays;
    calcRefs.age.res.textContent = nf(yrs, yrs < 10 ? 2 : 1) + " tahun " + p.nama;
    calcRefs.age.cap.textContent = "Satu tahun di " + p.nama + " sama dengan " + (p.orbitDays >= 730 ? nf(p.orbitDays / 365.25, 1) + " tahun" : nf(p.orbitDays, 0) + " hari") + " di Bumi.";
    var jh = state.jump / p.gravRatio;
    calcRefs.jump.res.textContent = jh >= 100 ? nf(jh / 100, 2) + " m" : nf(jh, 0) + " cm";
    calcRefs.jump.cap.textContent = "Gravitasi yang " + (p.gravRatio < 1 ? "lebih lemah" : p.gravRatio > 1 ? "lebih kuat" : "sama") + " mengubah tinggi lompatan dengan tenaga yang sama.";
  }

  function animateComp() {
    var fills = $$("#panel-struktur .comp-fill");
    fills.forEach(function (f) { f.style.width = "0"; });
    requestAnimationFrame(function () { requestAnimationFrame(function () { fills.forEach(function (f) { f.style.width = f.dataset.w + "%"; }); }); });
  }

  /* --- tab --- */
  var tabBtns = $$("#tabs [role=tab]");
  function activateTab(key, focus) {
    state.tab = key;
    tabBtns.forEach(function (b) {
      var on = b.id === "tab-" + key;
      b.setAttribute("aria-selected", on ? "true" : "false"); b.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(b.getAttribute("aria-controls")); panel.hidden = !on;
      if (on && focus) b.focus();
    });
    if (key === "struktur") animateComp();
  }
  tabBtns.forEach(function (b, i) {
    b.addEventListener("click", function () { activateTab(b.id.replace("tab-", "")); });
    b.addEventListener("keydown", function (e) {
      var n = -1;
      if (e.key === "ArrowRight") n = (i + 1) % tabBtns.length;
      else if (e.key === "ArrowLeft") n = (i + tabBtns.length - 1) % tabBtns.length;
      else if (e.key === "Home") n = 0; else if (e.key === "End") n = tabBtns.length - 1;
      if (n >= 0) { e.preventDefault(); e.stopPropagation(); activateTab(tabBtns[n].id.replace("tab-", ""), true); }
    });
  });

  /* --- pilih planet --- */
  function setAccent(p) {
    var root = document.documentElement;
    root.style.setProperty("--accent", p.accent);
    root.style.setProperty("--accent-rgb", hexRgb(p.accent));
    tiltEl.style.setProperty("--tilt", p.render.tilt + "deg");
    canvas.style.touchAction = Math.abs(p.render.tilt) > 45 ? "none" : "";
  }

  function selectPlanet(target, opts) {
    opts = opts || {};
    var i = typeof target === "number" ? target : idxOf(target);
    if (i < 0 || i >= P.length) return;
    var first = state.i < 0, p = P[i], tk = ++state.switchToken;
    state.i = i; state.factIdx = 0;
    hideBubble();

    chips.forEach(function (c, k) {
      var on = k === i; c.setAttribute("aria-selected", on ? "true" : "false"); c.tabIndex = on ? 0 : -1;
    });
    if (chips[i].scrollIntoView && !first) {
      try { chips[i].scrollIntoView({ inline: "center", block: "nearest", behavior: reduce ? "auto" : "smooth" }); } catch (e) { /* abaikan */ }
    }
    setAccent(p);
    renderInfo(p, i);

    var ready = PlanetView.isReady(p.render.kind);
    if (first) stage.classList.add("loading");
    else { stage.classList.add("switching"); if (!ready) stage.classList.add("loading"); }
    setTimeout(function () {
      if (tk !== state.switchToken) return;
      view.setPlanet(p).then(function (ok) {
        if (!ok || tk !== state.switchToken) return;
        stage.classList.remove("switching", "loading");
      });
    }, first ? 0 : 230);

    if (opts.scroll) {
      var sec = document.getElementById("jelajah");
      if (sec) sec.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }
  window.selectPlanet = selectPlanet;

  $("#prevBtn").addEventListener("click", function () { selectPlanet((state.i + P.length - 1) % P.length); });
  $("#nextBtn").addEventListener("click", function () { selectPlanet((state.i + 1) % P.length); });

  /* Panah kiri/kanan di keyboard untuk berpindah planet */
  var stageTicker = Tickers[Tickers.length - 1]; // milik kanvas planet utama
  document.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    var t = e.target, tag = t && t.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (t.closest && t.closest("[role=tablist]"))) return;
    if (!stageTicker.visible) return;
    selectPlanet((state.i + (e.key === "ArrowRight" ? 1 : P.length - 1)) % P.length);
  });

  /* --- kontrol putar --- */
  var autoBtn = $("#autoBtn"), speedSeg = $("#speedSeg");
  autoBtn.setAttribute("aria-checked", view.auto ? "true" : "false");
  autoBtn.addEventListener("click", function () {
    view.auto = !view.auto; autoBtn.setAttribute("aria-checked", view.auto ? "true" : "false"); view.dirty = true;
  });
  $$("button", speedSeg).forEach(function (b) {
    b.addEventListener("click", function () {
      view.speed = parseFloat(b.dataset.speed);
      $$("button", speedSeg).forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
    });
  });

  /* --- efek sentuhan pada planet utama --- */
  function showBubble(text) {
    bubble.textContent = text; bubble.classList.add("show");
    clearTimeout(state.bubbleTimer);
    state.bubbleTimer = setTimeout(hideBubble, 4600);
  }
  function hideBubble() { bubble.classList.remove("show"); clearTimeout(state.bubbleTimer); }

  attachDrag(canvas, view, function (e) {
    var r = stage.getBoundingClientRect(), p = P[state.i];
    Fx.burst(fxLayer, e.clientX - r.left, e.clientY - r.top); Fx.buzz();
    if (!reduce) {
      stage.classList.remove("pulse"); void stage.offsetWidth; stage.classList.add("pulse");
      view.vel += view.dir * 0.5;
    }
    showBubble(p.kilat[state.factIdx % p.kilat.length]); state.factIdx++;
  });
  canvas.addEventListener("pointerdown", function () { stage.classList.add("touched"); });

  /* parallax miring saat kursor bergerak di atas panggung (mouse saja) */
  stage.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse" || reduce || view.dragging) return;
    var r = stage.getBoundingClientRect();
    var nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
    parallax.style.setProperty("--rx", (-ny * 8).toFixed(2) + "deg");
    parallax.style.setProperty("--ry", (nx * 10).toFixed(2) + "deg");
  });
  stage.addEventListener("pointerleave", function () {
    parallax.style.setProperty("--rx", "0deg"); parallax.style.setProperty("--ry", "0deg");
  });

  /* ============================================== PERBANDINGAN */
  var METRICS = [
    { k: "diameterKm", label: "Diameter", fmt: function (v) { return nf(v) + " km"; } },
    { k: "massaBumi", label: "Massa", fmt: function (v) { return nf(v, v < 1 ? 3 : 1) + " × Bumi"; } },
    { k: "gravitasi", label: "Gravitasi", fmt: function (v) { return nf(v, 1) + " m/s²"; } },
    { k: "jarakJuta", label: "Jarak dari Matahari", fmt: function (v) { return v >= 1000 ? nf(v / 1000, 2) + " miliar km" : nf(v, 1) + " juta km"; } },
    { k: "tahunHari", label: "Lama satu tahun", fmt: function (v) { return v >= 730 ? nf(v / 365.25, 1) + " tahun" : nf(v, 0) + " hari"; } },
    { k: "hariJam", label: "Lama satu hari", fmt: function (v) { return v >= 48 ? nf(v / 24, 1) + " hari" : nf(v, 1) + " jam"; } },
    { k: "bulan", label: "Jumlah bulan", fmt: function (v, p) { return p.stat.bulan; } }
  ];
  var barsEl = $("#bars"), metricSeg = $("#metricSeg"), scaleSeg = $("#scaleSeg");
  var cmp = { metric: 0, scale: "linear" }, rows = [];

  P.forEach(function (p, i) {
    var b = h("button", "bar-row"); b.type = "button";
    b.style.setProperty("--c1", p.warna[0]); b.style.setProperty("--c2", p.warna[1]); b.style.setProperty("--c3", p.warna[2]);
    var nm = h("span", "bar-name"); nm.appendChild(h("i")); nm.appendChild(document.createTextNode(p.nama)); b.appendChild(nm);
    var tr = h("span", "bar-track"), fl = h("span", "bar-fill"); tr.appendChild(fl); b.appendChild(tr);
    var val = h("span", "bar-val"); b.appendChild(val);
    b.addEventListener("click", function () { selectPlanet(i, { scroll: true }); });
    barsEl.appendChild(b); rows.push({ fill: fl, val: val, btn: b });
  });
  function drawBars() {
    var m = METRICS[cmp.metric], max = 0;
    P.forEach(function (p) { if (p.num[m.k] > max) max = p.num[m.k]; });
    P.forEach(function (p, i) {
      var v = p.num[m.k], w = cmp.scale === "log" ? Math.log(1 + v) / Math.log(1 + max) : v / max;
      rows[i].btn.style.setProperty("--w", (w * 100).toFixed(2));
      rows[i].val.textContent = m.fmt(v, p);
      rows[i].btn.setAttribute("aria-label", p.nama + ": " + m.fmt(v, p) + ". Buka penjelasan.");
    });
  }
  METRICS.forEach(function (m, i) {
    var b = h("button", null, m.label); b.type = "button"; b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
    b.addEventListener("click", function () {
      cmp.metric = i; $$("button", metricSeg).forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); drawBars();
    });
    metricSeg.appendChild(b);
  });
  $$("button", scaleSeg).forEach(function (b) {
    b.addEventListener("click", function () {
      cmp.scale = b.dataset.scale; $$("button", scaleSeg).forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); drawBars();
    });
  });
  drawBars();
  if (io) {
    var barsIo = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { barsEl.classList.add("in"); barsIo.disconnect(); } }, { threshold: 0.2 });
    barsIo.observe(barsEl);
  } else barsEl.classList.add("in");

  /* perbandingan ukuran */
  var sizesEl = $("#sizes"), maxD = 0;
  P.forEach(function (p) { if (p.num.diameterKm > maxD) maxD = p.num.diameterKm; });
  P.forEach(function (p, i) {
    var b = h("button", "size-item"); b.type = "button"; b.title = p.nama + ", diameter " + p.stat.diameter;
    b.setAttribute("aria-label", p.nama + ", diameter " + p.stat.diameter + ". Buka penjelasan.");
    var dot = h("span", "size-dot" + (p.id === "saturnus" ? " has-ring" : ""));
    dot.style.setProperty("--k", (p.num.diameterKm / maxD).toFixed(4));
    dot.style.setProperty("--c1", p.warna[0]); dot.style.setProperty("--c2", p.warna[1]); dot.style.setProperty("--c3", p.warna[2]);
    dot.style.setProperty("--rgb", hexRgb(p.accent));
    b.appendChild(dot); b.appendChild(h("span", null, p.nama));
    b.addEventListener("click", function () { selectPlanet(i, { scroll: true }); });
    sizesEl.appendChild(b);
  });

  /* ================================================= KARTU BALIK */
  var flipGrid = $("#flipGrid"), flipColors = ["255,170,90", "200,180,150", "150,180,255", "140,210,255", "170,160,255", "190,240,230", "255,150,200"];
  EXTRAS.forEach(function (x, i) {
    var b = h("button", "flip"); b.type = "button"; b.setAttribute("aria-pressed", "false");
    b.setAttribute("aria-label", x.judul + ". " + x.teaser + ". Ketuk untuk membalik kartu.");
    b.style.setProperty("--accent-rgb", flipColors[i % flipColors.length]);
    b.style.setProperty("--accent", "rgb(" + flipColors[i % flipColors.length] + ")");
    var inner = h("div", "flip-inner");
    var front = h("div", "flip-face flip-front"), back = h("div", "flip-face flip-back");
    front.appendChild(h("span", "flip-icon", x.ikon));
    var fw = h("div"); fw.appendChild(h("h3", "flip-title", x.judul)); fw.appendChild(h("p", "flip-teaser", x.teaser)); front.appendChild(fw);
    back.appendChild(h("h3", "flip-title", x.judul)); back.appendChild(h("p", null, x.isi));
    inner.appendChild(front); inner.appendChild(back); b.appendChild(inner);
    b.addEventListener("click", function () {
      var on = b.classList.toggle("is-flipped"); b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    flipGrid.appendChild(b);
  });

  /* ================================================== MULAI */
  selectPlanet(idxOf("bumi"));
  /* muat tekstur planet lain di latar belakang saat browser menganggur */
  PlanetView.getTexture("bumi").then(function () {
    PlanetView.preload(["jupiter", "saturnus", "mars", "venus", "neptunus", "uranus", "merkurius"]);
  });
})();
