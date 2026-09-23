/* ==========================================================================
   starfield.js — Latar bintang: berkelip, parallax saat scroll / gerak kursor,
   dan sesekali bintang jatuh. Otomatis lebih ringan di layar kecil.
   ========================================================================== */
(function () {
  "use strict";
  var cv = document.getElementById("starfield");
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext("2d");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var W = 0, H = 0, dpr = 1, stars = [], meteor = null, nextMeteor = 6, scrollY = 0, tx = 0, ty = 0, px = 0, py = 0;
  var lastW = 0, lastH = 0;

  function resize() {
    var w = window.innerWidth, h = window.innerHeight;
    if (w === lastW && Math.abs(h - lastH) < 160) return; // abaikan perubahan kecil (bar alamat HP)
    lastW = w; lastH = h;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.width = Math.round(w * dpr);
    H = cv.height = Math.round(h * dpr);
    var count = Math.round(Math.min(280, (w * h) / 5200));
    stars = [];
    for (var i = 0; i < count; i++) {
      var z = 0.2 + Math.random() * 0.8;
      var warm = Math.random();
      stars.push({
        x: Math.random(), y: Math.random(), z: z,
        r: (0.35 + Math.random() * 1.15) * z * dpr,
        ph: Math.random() * 6.283, sp: 0.6 + Math.random() * 1.8,
        c: warm < 0.14 ? "255,222,190" : warm < 0.3 ? "190,214,255" : "236,240,255"
      });
    }
    if (reduce) draw(0);
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    var off = scrollY * dpr;
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var y = (s.y * H - off * 0.06 * s.z) % H; if (y < 0) y += H;
      var x = s.x * W + px * 14 * s.z * dpr;
      var a = reduce ? 0.75 : 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * s.sp + s.ph));
      ctx.fillStyle = "rgba(" + s.c + "," + (a * (0.35 + 0.65 * s.z)).toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(x, y, s.r, 0, 6.2832); ctx.fill();
    }
    if (meteor) {
      var g = ctx.createLinearGradient(meteor.x, meteor.y, meteor.x - meteor.vx * 0.14, meteor.y - meteor.vy * 0.14);
      g.addColorStop(0, "rgba(255,255,255," + meteor.a.toFixed(2) + ")");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = g; ctx.lineWidth = 1.6 * dpr; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(meteor.x, meteor.y); ctx.lineTo(meteor.x - meteor.vx * 0.14, meteor.y - meteor.vy * 0.14); ctx.stroke();
    }
  }

  var api = {
    visible: true,
    tick: function (dt, t) {
      if (reduce) return;
      px += (tx - px) * Math.min(1, dt * 3);
      py += (ty - py) * Math.min(1, dt * 3);
      nextMeteor -= dt;
      if (!meteor && nextMeteor <= 0) {
        var sp = (0.9 + Math.random() * 0.6) * W;
        meteor = { x: Math.random() * W * 0.8, y: Math.random() * H * 0.4, vx: sp * 0.8, vy: sp * 0.42, a: 0.9 };
        nextMeteor = 7 + Math.random() * 9;
      }
      if (meteor) {
        meteor.x += meteor.vx * dt; meteor.y += meteor.vy * dt; meteor.a -= dt * 0.9;
        if (meteor.a <= 0 || meteor.x > W + 50 || meteor.y > H + 50) meteor = null;
      }
      draw(t);
    }
  };

  window.addEventListener("resize", resize);
  window.addEventListener("scroll", function () { scrollY = window.pageYOffset || 0; if (reduce) draw(0); }, { passive: true });
  window.addEventListener("pointermove", function (e) {
    tx = (e.clientX / window.innerWidth - 0.5) * 2;
    ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });
  resize();

  (window.Tickers = window.Tickers || []).push(api);
})();
