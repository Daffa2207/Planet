/* ==========================================================================
   galaxy.js — Ilustrasi Bima Sakti (galaksi spiral berbatang) dilihat dari atas.
   Bisa diseret untuk diputar. Penanda menunjukkan posisi Tata Surya.
   ========================================================================== */
(function () {
  "use strict";
  var cv = document.getElementById("galaxy");
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext("2d");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var S = 0, dpr = 1, sprite = null, angle = 0, vel = reduce ? 0 : 0.035, pulse = 0;
  var dragging = false, lastA = 0, lastT = 0, touched = false;
  var BAR = 0.55, PITCH = 0.3, R0 = 0.1, SUN_R = 0.55, SUN_TH;

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function build() {
    var css = cv.clientWidth || 360;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var size = Math.round(css * dpr);
    if (size === S) return;
    S = size; cv.width = S; cv.height = S;
    sprite = document.createElement("canvas"); sprite.width = S; sprite.height = S;
    var g = sprite.getContext("2d"), c = S / 2, R = S * 0.46, rnd = mulberry32(2026), i;

    /* cahaya cakram dan tonjolan pusat */
    var gr = g.createRadialGradient(c, c, 0, c, c, R * 1.05);
    gr.addColorStop(0, "rgba(255,240,205,0.62)");
    gr.addColorStop(0.12, "rgba(255,214,150,0.30)");
    gr.addColorStop(0.45, "rgba(110,140,240,0.10)");
    gr.addColorStop(1, "rgba(80,110,240,0)");
    g.fillStyle = gr; g.fillRect(0, 0, S, S);

    function dot(x, y, r, rgb, a) {
      g.fillStyle = "rgba(" + rgb + "," + a.toFixed(3) + ")";
      g.fillRect(x - r / 2, y - r / 2, r, r);
    }
    function mix(f) { // kuning di tengah, biru di tepi
      return Math.round(255 - 95 * f) + "," + Math.round(226 - 26 * f) + "," + Math.round(172 + 83 * f);
    }

    /* lengan spiral logaritmik (4 lengan) */
    var N = Math.round(Math.min(9500, S * S / 60));
    for (i = 0; i < N; i++) {
      var arm = i % 4, f = Math.pow(rnd(), 0.6), r = R0 + f * (1 - R0);
      var th = Math.log(r / R0) / PITCH + arm * Math.PI / 2 + BAR;
      th += (rnd() + rnd() + rnd() - 1.5) * (0.30 - 0.14 * r);
      var rr = r + (rnd() + rnd() - 1) * 0.03;
      var x = c + Math.cos(th) * rr * R, y = c + Math.sin(th) * rr * R;
      var knot = rnd() < 0.035;
      dot(x, y, (0.6 + rnd() * 1.5) * dpr, knot ? "255,150,190" : mix(f), 0.30 + rnd() * 0.6);
    }
    /* debu tipis di antara lengan */
    for (i = 0; i < N * 0.22; i++) {
      var a2 = rnd() * 6.283, r2 = Math.sqrt(rnd()) * 0.95;
      dot(c + Math.cos(a2) * r2 * R, c + Math.sin(a2) * r2 * R, (0.5 + rnd()) * dpr, mix(r2), 0.10 + rnd() * 0.18);
    }
    /* batang pusat */
    for (i = 0; i < 900; i++) {
      var t = (rnd() * 2 - 1), w = (rnd() + rnd() + rnd() - 1.5) * 0.05;
      var bx = Math.cos(BAR) * t * 0.27 - Math.sin(BAR) * w, by = Math.sin(BAR) * t * 0.27 + Math.cos(BAR) * w;
      dot(c + bx * R, c + by * R, (0.6 + rnd() * 1.3) * dpr, "255,226,168", 0.35 + rnd() * 0.5);
    }
    var core = g.createRadialGradient(c, c, 0, c, c, R * 0.2);
    core.addColorStop(0, "rgba(255,247,222,0.95)");
    core.addColorStop(0.4, "rgba(255,222,160,0.45)");
    core.addColorStop(1, "rgba(255,200,120,0)");
    g.fillStyle = core; g.fillRect(0, 0, S, S);

    SUN_TH = Math.log(SUN_R / R0) / PITCH + BAR + Math.PI / 2 * 1 + 0.04;
  }

  function draw() {
    var c = S / 2, R = S * 0.46;
    ctx.clearRect(0, 0, S, S);
    ctx.save(); ctx.translate(c, c); ctx.rotate(angle); ctx.drawImage(sprite, -c, -c); ctx.restore();

    /* penanda Tata Surya */
    var th = SUN_TH + angle, mx = c + Math.cos(th) * SUN_R * R, my = c + Math.sin(th) * SUN_R * R;
    var p = 0.5 + 0.5 * Math.sin(pulse * 2.4);
    ctx.lineWidth = 1.6 * dpr; ctx.strokeStyle = "rgba(255,179,107," + (0.85 - 0.6 * p).toFixed(2) + ")";
    ctx.beginPath(); ctx.arc(mx, my, (7 + 12 * p) * dpr, 0, 6.2832); ctx.stroke();
    ctx.fillStyle = "#ffd9a8"; ctx.shadowColor = "rgba(255,170,90,0.95)"; ctx.shadowBlur = 12 * dpr;
    ctx.beginPath(); ctx.arc(mx, my, 3.6 * dpr, 0, 6.2832); ctx.fill(); ctx.shadowBlur = 0;

    var dx = mx - c, dy = my - c, len = Math.sqrt(dx * dx + dy * dy) || 1;
    var lx = mx + dx / len * 26 * dpr, ly = my + dy / len * 26 * dpr;
    ctx.strokeStyle = "rgba(255,179,107,0.7)"; ctx.lineWidth = 1 * dpr;
    ctx.beginPath(); ctx.moveTo(mx + dx / len * 10 * dpr, my + dy / len * 10 * dpr); ctx.lineTo(lx, ly); ctx.stroke();
    var right = dx >= 0;
    ctx.font = "700 " + (13 * dpr) + "px Figtree, system-ui, sans-serif";
    ctx.textAlign = right ? "left" : "right"; ctx.textBaseline = "middle";
    var tx = lx + (right ? 6 : -6) * dpr;
    ctx.lineWidth = 4 * dpr; ctx.strokeStyle = "rgba(6,8,20,0.9)"; ctx.strokeText("Kita di sini", tx, ly - 7 * dpr);
    ctx.fillStyle = "#ffe0bd"; ctx.fillText("Kita di sini", tx, ly - 7 * dpr);
    ctx.font = "500 " + (11.5 * dpr) + "px Figtree, system-ui, sans-serif";
    ctx.strokeText("Tata Surya, Lengan Orion", tx, ly + 9 * dpr);
    ctx.fillStyle = "#c3cbea"; ctx.fillText("Tata Surya, Lengan Orion", tx, ly + 9 * dpr);

    /* label pusat */
    ctx.textAlign = "center"; ctx.font = "500 " + (11.5 * dpr) + "px Figtree, system-ui, sans-serif";
    ctx.lineWidth = 4 * dpr; ctx.strokeStyle = "rgba(6,8,20,0.9)";
    ctx.strokeText("Pusat galaksi", c, c + R * 0.2);
    ctx.fillStyle = "#c3cbea"; ctx.fillText("Pusat galaksi", c, c + R * 0.2);
  }

  var api = {
    el: cv, visible: false,
    tick: function (dt) {
      pulse += dt;
      if (!dragging) {
        angle += vel * dt;
        if (!reduce) vel += (0.035 - vel) * Math.min(1, dt * 0.8);
      }
      draw();
    }
  };

  /* seret untuk memutar */
  function ang(e) {
    var r = cv.getBoundingClientRect();
    return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
  }
  cv.style.touchAction = "pan-y"; cv.style.cursor = "grab";
  cv.addEventListener("pointerdown", function (e) {
    dragging = true; lastA = ang(e); lastT = performance.now();
    try { cv.setPointerCapture(e.pointerId); } catch (x) { /* abaikan */ }
    cv.style.cursor = "grabbing";
  });
  cv.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var a = ang(e), d = a - lastA, now = performance.now();
    if (d > Math.PI) d -= 6.2832; else if (d < -Math.PI) d += 6.2832;
    angle += d; vel = d / Math.max(0.008, (now - lastT) / 1000); lastA = a; lastT = now;
    vel = Math.max(-2.5, Math.min(2.5, vel));
  });
  function end() { dragging = false; cv.style.cursor = "grab"; }
  cv.addEventListener("pointerup", end);
  cv.addEventListener("pointercancel", end);

  if (window.ResizeObserver) new ResizeObserver(function () { build(); draw(); }).observe(cv);
  else window.addEventListener("resize", function () { build(); draw(); });
  build(); draw();

  (window.Tickers = window.Tickers || []).push(api);
})();
