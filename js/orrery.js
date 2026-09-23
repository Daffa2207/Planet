/* ==========================================================================
   orrery.js — Peta orbit Tata Surya (tampak atas, tidak sesuai skala)
   Sentuh/hover planet untuk menahannya; ketuk untuk membuka penjelasan.
   ========================================================================== */
(function () {
  "use strict";
  var box = document.getElementById("orrery");
  if (!box || !window.PLANETS) return;
  var P = window.PLANETS;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* r = diameter orbit (pecahan dari lebar kotak), d = diameter titik planet, a0 = sudut awal */
  var CFG = {
    merkurius: { r: 0.19, d: 0.021, a0: 0.5 },
    venus:     { r: 0.27, d: 0.030, a0: 2.2 },
    bumi:      { r: 0.35, d: 0.032, a0: 4.0 },
    mars:      { r: 0.43, d: 0.024, a0: 5.3 },
    jupiter:   { r: 0.57, d: 0.074, a0: 1.0 },
    saturnus:  { r: 0.70, d: 0.058, a0: 3.1 },
    uranus:    { r: 0.83, d: 0.044, a0: 5.9 },
    neptunus:  { r: 0.96, d: 0.043, a0: 2.6 }
  };

  function hexRgb(h) {
    var n = parseInt(h.slice(1), 16);
    return ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255);
  }

  var orbs = [], rings = [], playing = true, speed = 1, held = -1, locked = -1, lastType = "mouse";
  var readout = document.getElementById("orreryReadout");
  var defaultReadout = readout ? readout.innerHTML : "";

  /* ------------------------------------------------ bangun elemen */
  var frag = document.createDocumentFragment();
  P.forEach(function (p, i) {
    var c = CFG[p.id], rgb = hexRgb(p.accent);
    var ring = document.createElement("div");
    ring.className = "orbit-ring";
    ring.style.setProperty("--r", c.r);
    ring.style.setProperty("--ring-rgb", rgb);
    frag.appendChild(ring); rings.push(ring);
  });
  var belt = document.createElement("div"); belt.className = "belt"; belt.style.width = belt.style.height = "50%";
  frag.appendChild(belt);
  var sun = document.createElement("div"); sun.className = "sun"; sun.setAttribute("aria-hidden", "true");
  frag.appendChild(sun);

  P.forEach(function (p, i) {
    var c = CFG[p.id], rgb = hexRgb(p.accent);
    var b = document.createElement("button");
    b.type = "button"; b.className = "orb"; b.dataset.i = i;
    b.setAttribute("aria-label", p.nama + ", planet ke-" + (i + 1) + " dari Matahari");
    b.style.setProperty("--c1", p.warna[0]); b.style.setProperty("--c2", p.warna[1]); b.style.setProperty("--c3", p.warna[2]);
    b.style.setProperty("--rgb", rgb);
    var dot = document.createElement("span"); dot.className = "orb-dot" + (p.render.ring && p.id === "saturnus" ? " has-ring" : "");
    var lab = document.createElement("span"); lab.className = "orb-label"; lab.textContent = p.nama;
    b.appendChild(dot); b.appendChild(lab); frag.appendChild(b);
    var period = p.orbitDays;
    orbs.push({
      el: b, theta: c.a0, rad: 0,
      w: 0.9 / Math.sqrt(period / 88), // kecepatan sudut yang dipercepat (rad/detik)
      cfg: c
    });
  });
  box.appendChild(frag);
  if (window.matchMedia && window.matchMedia("(min-width: 520px)").matches) box.classList.add("labels-on");

  /* ------------------------------------------------ tata letak */
  function layout() {
    var S = box.clientWidth; if (!S) return;
    orbs.forEach(function (o) {
      o.rad = o.cfg.r * S / 2;
      o.el.style.setProperty("--d", Math.max(6, o.cfg.d * S) + "px");
    });
    place();
  }
  function place() {
    for (var i = 0; i < orbs.length; i++) {
      var o = orbs[i];
      o.el.style.transform = "translate(" + (Math.cos(o.theta) * o.rad).toFixed(1) + "px," + (Math.sin(o.theta) * o.rad).toFixed(1) + "px)";
    }
  }

  /* ------------------------------------------------ interaksi */
  function fmtYear(d) { return d >= 730 ? (d / 365.25).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " tahun Bumi" : d.toLocaleString("id-ID", { maximumFractionDigits: 0 }) + " hari Bumi"; }

  function showReadout(i) {
    if (!readout) return;
    var p = P[i], rgb = hexRgb(p.accent);
    readout.style.setProperty("--ro-rgb", rgb);
    readout.innerHTML = "";
    var t = document.createElement("p"); t.className = "orrery-readout-title"; t.textContent = p.nama;
    var d = document.createElement("p"); d.className = "orrery-readout-text";
    d.textContent = p.tagline + ". Jarak dari Matahari " + p.stat.jarak + ". Satu tahun di sini berlangsung " + fmtYear(p.orbitDays) + ".";
    var g = document.createElement("button"); g.type = "button"; g.className = "btn btn-ghost go"; g.textContent = "Buka penjelasan " + p.nama;
    g.addEventListener("click", function () { go(i); });
    readout.appendChild(t); readout.appendChild(d); readout.appendChild(g);
  }
  function clearReadout() {
    if (!readout) return;
    readout.style.removeProperty("--ro-rgb");
    readout.innerHTML = defaultReadout;
  }
  function hold(i) {
    if (held === i) return;
    release();
    held = i;
    orbs[i].el.classList.add("hold"); rings[i].classList.add("on");
    showReadout(i);
  }
  function release() {
    if (held < 0) return;
    orbs[held].el.classList.remove("hold"); rings[held].classList.remove("on");
    held = -1; clearReadout();
  }
  function go(i) {
    if (window.selectPlanet) window.selectPlanet(P[i].id, { scroll: true });
  }

  orbs.forEach(function (o, i) {
    var el = o.el;
    el.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") hold(i); });
    el.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse" && locked !== i) release(); });
    el.addEventListener("pointerdown", function (e) { lastType = e.pointerType || "mouse"; hold(i); });
    el.addEventListener("focus", function () { hold(i); });
    el.addEventListener("blur", function () { if (locked !== i) release(); });
    el.addEventListener("click", function () {
      var touch = lastType === "touch" || lastType === "pen";
      if (touch && locked !== i) { locked = i; hold(i); }
      else { locked = -1; go(i); }
      lastType = "mouse";
    });
  });
  box.addEventListener("pointerdown", function (e) {
    if (!e.target.closest(".orb")) { locked = -1; release(); }
  });

  /* kontrol */
  var playBtn = document.getElementById("orreryPlay");
  var speedIn = document.getElementById("orrerySpeed");
  var labelBtn = document.getElementById("orreryLabels");
  if (labelBtn) labelBtn.setAttribute("aria-checked", box.classList.contains("labels-on") ? "true" : "false");
  if (reduce) { playing = false; }
  if (playBtn) {
    playBtn.textContent = playing ? "Jeda orbit" : "Putar orbit";
    playBtn.setAttribute("aria-pressed", playing ? "false" : "true");
    playBtn.addEventListener("click", function () {
      playing = !playing;
      playBtn.textContent = playing ? "Jeda orbit" : "Putar orbit";
      playBtn.setAttribute("aria-pressed", playing ? "false" : "true");
    });
  }
  if (speedIn) speedIn.addEventListener("input", function () { speed = parseFloat(speedIn.value) || 1; });
  if (labelBtn) labelBtn.addEventListener("click", function () {
    var on = labelBtn.getAttribute("aria-checked") !== "true";
    labelBtn.setAttribute("aria-checked", on ? "true" : "false");
    box.classList.toggle("labels-on", on);
  });

  /* ------------------------------------------------ loop */
  var api = {
    el: box, visible: false,
    tick: function (dt) {
      if (!playing) return;
      var k = dt * speed;
      for (var i = 0; i < orbs.length; i++) if (i !== held) orbs[i].theta += orbs[i].w * k;
      place();
    }
  };

  if (window.ResizeObserver) new ResizeObserver(layout).observe(box);
  else window.addEventListener("resize", layout);
  layout();

  (window.Tickers = window.Tickers || []).push(api);
})();
