/* ==========================================================================
   planet-view.js — Menampilkan planet 3D yang bisa berputar di elemen <canvas>
   Memakai PlanetCore untuk tekstur & pemetaan bola. Tidak butuh WebGL,
   jadi berjalan di semua perangkat (termasuk HP lama).
   ========================================================================== */
(function (global) {
  "use strict";

  var Core = global.PlanetCore;
  var TW = 768, TH = 384, PHI = 0.30, TAU = Math.PI * 2;

  /* ------------------------------------------------ cache tekstur */
  var promises = {}, ready = {};
  function getTexture(kind) {
    if (!promises[kind]) {
      promises[kind] = Core.runAsync(Core.createTexture(kind, TW, TH)).then(function (job) {
        ready[kind] = job; return job;
      });
    }
    return promises[kind];
  }
  function isReady(kind) { return !!ready[kind]; }

  /* Muat tekstur lain pelan-pelan saat browser sedang menganggur */
  function preload(kinds) {
    var i = 0;
    function next() {
      if (i >= kinds.length) return;
      var k = kinds[i++];
      getTexture(k).then(function () { later(next); });
    }
    function later(fn) {
      if ("requestIdleCallback" in global) global.requestIdleCallback(fn, { timeout: 2500 });
      else setTimeout(fn, 400);
    }
    later(next);
  }

  function toCanvas(data, C) {
    var cv = document.createElement("canvas");
    cv.width = C; cv.height = C;
    cv.getContext("2d").putImageData(new ImageData(data, C, C), 0, 0);
    return cv;
  }

  /* ------------------------------------------------------- kelas */
  function PlanetView(canvas, opts) {
    opts = opts || {};
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.maxPx = opts.maxPx || 560;
    this.off = document.createElement("canvas");
    this.octx = this.off.getContext("2d");
    this.C = 0; this.R = 0; this.cssSize = 0;
    this.rot = 0; this.vel = 0; this.dragging = false;
    this.auto = true; this.speed = 1; this.dir = 1; this.baseSpeed = 0.03;
    this.p = null; this.tex = null; this.map = null; this.ringCv = null;
    this.tiltDeg = 0; this.token = 0; this.dirty = true; this.visible = true;
    this.mapKey = ""; this.layerKey = "";
  }

  PlanetView.getTexture = getTexture;
  PlanetView.isReady = isReady;
  PlanetView.preload = preload;

  PlanetView.prototype.resize = function () {
    var css = this.canvas.clientWidth || this.canvas.getBoundingClientRect().width || 300;
    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    var C = Math.max(180, Math.min(this.maxPx, Math.round(css * dpr)));
    this.cssSize = css;
    if (C === this.C) return;
    this.C = C;
    this.canvas.width = C; this.canvas.height = C;
    this.off.width = C; this.off.height = C;
    this.imgData = this.octx.createImageData(C, C);
    this.out32 = new Uint32Array(this.imgData.data.buffer);
    this.mapKey = ""; this.layerKey = "";
    if (this.p && this.tex) this._layers();
    this.dirty = true;
  };

  /* Radius planet dalam piksel css (dipakai untuk menghitung geseran jari saat menyeret) */
  PlanetView.prototype.radiusCss = function () {
    return this.C ? this.R * this.cssSize / this.C : 100;
  };

  PlanetView.prototype._layers = function () {
    var p = this.p, C = this.C, ring = p.render.ring;
    var R = ring ? (C / 2) / ring.outer / 1.03 : (C / 2) * 0.93;
    this.R = R;
    var mk = C + "|" + R.toFixed(2);
    if (mk !== this.mapKey) { this.map = Core.buildMapping(C, R, PHI, TW, TH); this.mapKey = mk; }
    var lk = p.id + "|" + mk;
    if (lk === this.layerKey) return;
    var L = Core.lightVector(p.render.tilt);
    this.shadeCv = toCanvas(Core.buildShade(this.map, L), C);
    this.rimCv = toCanvas(Core.buildRim(this.map, L, p.render.rim), C);
    this.ringCv = ring ? toCanvas(Core.buildRing(ring, C, R, PHI), C) : null;
    this.hasRing = !!ring;
    this.layerKey = lk;
  };

  /* Ganti planet. Mengembalikan Promise<boolean> (false bila dibatalkan permintaan lebih baru). */
  PlanetView.prototype.setPlanet = function (p) {
    var self = this, token = ++this.token;
    return getTexture(p.render.kind).then(function (job) {
      if (token !== self.token) return false;
      if (!self.C) self.resize();
      self.p = p; self.tex = job.tex;
      self.tiltDeg = p.render.tilt;
      self.dir = p.render.retro ? -1 : 1;
      var per = Math.max(1, p.render.periodJam);
      self.baseSpeed = Math.max(0.012, Math.min(0.06, 0.03 * Math.sqrt(24 / per)));
      self._layers();
      self.dirty = true;
      return true;
    });
  };

  PlanetView.prototype.update = function (dt) {
    if (this.dragging) return;
    var s = this.auto ? this.baseSpeed * this.speed * this.dir : 0;
    if (s !== 0 || this.vel !== 0) this.dirty = true;
    this.rot += (s + this.vel) * dt;
    if (this.vel !== 0) {
      this.vel *= Math.exp(-2.2 * dt);
      if (Math.abs(this.vel) < 0.0008) this.vel = 0;
    }
  };

  PlanetView.prototype.render = function () {
    if (!this.p || !this.map || !this.tex) return;
    var m = this.map, C = this.C, W = TW, tex = this.tex, out = this.out32;
    var idx = m.idx, u0 = m.u0, rb = m.rb, n = m.n, rot = this.rot;
    for (var i = 0; i < n; i++) {
      var t = u0[i] - rot; t -= Math.floor(t);
      out[idx[i]] = tex[rb[i] + ((t * W) | 0)];
    }
    var o = this.octx;
    o.globalCompositeOperation = "source-over";
    o.putImageData(this.imgData, 0, 0);
    o.drawImage(this.shadeCv, 0, 0);
    o.globalCompositeOperation = "lighter";
    o.drawImage(this.rimCv, 0, 0);
    o.globalCompositeOperation = "destination-in";
    o.beginPath(); o.arc(C / 2, C / 2, this.R, 0, TAU); o.fill();
    o.globalCompositeOperation = "source-over";

    var g = this.ctx, half = C / 2;
    g.clearRect(0, 0, C, C);
    if (this.ringCv) g.drawImage(this.ringCv, 0, 0, C, half, 0, 0, C, half);
    g.drawImage(this.off, 0, 0);
    if (this.ringCv) g.drawImage(this.ringCv, 0, half, C, half, 0, half, C, half);
    this.dirty = false;
  };

  /* Dipanggil oleh loop utama */
  PlanetView.prototype.tick = function (dt) {
    this.update(dt);
    if (this.dirty) this.render();
  };

  global.PlanetView = PlanetView;
})(window);
