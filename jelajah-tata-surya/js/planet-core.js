/* ==========================================================================
   planet-core.js — Inti perhitungan grafis planet (murni matematika, tanpa DOM)
   - Noise 3D + fBm untuk membuat tekstur permukaan planet secara prosedural
   - Pemetaan bola (sphere mapping), bayangan, cahaya tepi atmosfer, cincin
   Tidak memakai gambar eksternal: semua tekstur dibuat oleh kode ini.
   ========================================================================== */
(function (root) {
  "use strict";

  var TAU = Math.PI * 2;
  var DEG = Math.PI / 180;

  /* ------------------------------------------------------------ utilitas */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function smooth(a, b, x) {
    var t = (x - a) / (b - a);
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    return t * t * (3 - 2 * t);
  }
  function hashStr(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  /* Noise nilai 3D dengan tabel permutasi, hasil 0..1 */
  function createNoise(seed) {
    var rnd = mulberry32(seed);
    var p = new Uint8Array(256), i, j, t;
    for (i = 0; i < 256; i++) p[i] = i;
    for (i = 255; i > 0; i--) { j = (rnd() * (i + 1)) | 0; t = p[i]; p[i] = p[j]; p[j] = t; }
    var perm = new Uint8Array(512);
    for (i = 0; i < 512; i++) perm[i] = p[i & 255];
    var val = new Float32Array(256);
    for (i = 0; i < 256; i++) val[i] = rnd();

    function noise(x, y, z) {
      var x0 = Math.floor(x), y0 = Math.floor(y), z0 = Math.floor(z);
      var X = x0 & 255, Y = y0 & 255, Z = z0 & 255;
      var xf = x - x0, yf = y - y0, zf = z - z0;
      var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
      var A = perm[X] + Y, B = perm[X + 1] + Y;
      var AA = perm[A] + Z, AB = perm[A + 1] + Z, BA = perm[B] + Z, BB = perm[B + 1] + Z;
      var c000 = val[perm[AA]], c001 = val[perm[AA + 1]];
      var c010 = val[perm[AB]], c011 = val[perm[AB + 1]];
      var c100 = val[perm[BA]], c101 = val[perm[BA + 1]];
      var c110 = val[perm[BB]], c111 = val[perm[BB + 1]];
      var x00 = c000 + (c100 - c000) * u, x01 = c001 + (c101 - c001) * u;
      var x10 = c010 + (c110 - c010) * u, x11 = c011 + (c111 - c011) * u;
      var y0v = x00 + (x10 - x00) * v, y1v = x01 + (x11 - x01) * v;
      return y0v + (y1v - y0v) * w;
    }
    function fbm(x, y, z, oct, gain) {
      var a = 0.5, s = 0, n = 0, g = gain || 0.5;
      for (var k = 0; k < oct; k++) {
        s += a * noise(x, y, z); n += a; a *= g;
        x = x * 2.03 + 17.1; y = y * 2.03 + 9.7; z = z * 2.03 + 3.3;
      }
      return s / n;
    }
    return { noise: noise, fbm: fbm };
  }

  /* Warna: rampa gradien. st = [[posisi,r,g,b], ...] */
  var _r = 0, _g = 0, _b = 0;
  function ramp(st, t) {
    if (t <= st[0][0]) { _r = st[0][1]; _g = st[0][2]; _b = st[0][3]; return; }
    for (var i = 1; i < st.length; i++) {
      if (t <= st[i][0]) {
        var a = st[i - 1], b = st[i], k = (t - a[0]) / (b[0] - a[0]);
        _r = a[1] + (b[1] - a[1]) * k; _g = a[2] + (b[2] - a[2]) * k; _b = a[3] + (b[3] - a[3]) * k;
        return;
      }
    }
    var l = st[st.length - 1]; _r = l[1]; _g = l[2]; _b = l[3];
  }
  function pack(r, g, b) {
    r = r < 0 ? 0 : r > 255 ? 255 : r | 0;
    g = g < 0 ? 0 : g > 255 ? 255 : g | 0;
    b = b < 0 ? 0 : b > 255 ? 255 : b | 0;
    return (255 << 24) | (b << 16) | (g << 8) | r; // urutan byte RGBA (little-endian)
  }
  function bandStops(bands) {
    /* bands: [[lintangAwal, r,g,b], ...] terurut dari −90° ke +90°. Setiap pita punya dataran
       di tengahnya sehingga transisi antar pita halus. */
    var st = [], n = bands.length;
    for (var i = 0; i < n; i++) {
      var a = bands[i][0], b = i + 1 < n ? bands[i + 1][0] : 90, c = bands[i];
      st.push([(a + (b - a) * 0.22 + 90) / 180, c[1], c[2], c[3]]);
      st.push([(a + (b - a) * 0.78 + 90) / 180, c[1], c[2], c[3]]);
    }
    return st;
  }

  /* Tabel koordinat bola untuk tekstur equirectangular */
  function makeTables(W, H) {
    var lat = new Float32Array(H), sinLat = new Float32Array(H), cosLat = new Float32Array(H);
    var lon = new Float32Array(W), sinLon = new Float32Array(W), cosLon = new Float32Array(W), i;
    for (i = 0; i < H; i++) {
      lat[i] = Math.PI / 2 - (i + 0.5) / H * Math.PI;
      sinLat[i] = Math.sin(lat[i]); cosLat[i] = Math.cos(lat[i]);
    }
    for (i = 0; i < W; i++) {
      lon[i] = (i + 0.5) / W * TAU - Math.PI;
      sinLon[i] = Math.sin(lon[i]); cosLon[i] = Math.cos(lon[i]);
    }
    return { lat: lat, sinLat: sinLat, cosLat: cosLat, lon: lon, sinLon: sinLon, cosLon: cosLon };
  }

  function percentile(arr, p) {
    var mn = Infinity, mx = -Infinity, i;
    for (i = 0; i < arr.length; i++) { if (arr[i] < mn) mn = arr[i]; if (arr[i] > mx) mx = arr[i]; }
    var bins = 2048, h = new Uint32Array(bins), sc = (bins - 1) / (mx - mn || 1);
    for (i = 0; i < arr.length; i++) h[((arr[i] - mn) * sc) | 0]++;
    var target = arr.length * p, acc = 0;
    for (i = 0; i < bins; i++) { acc += h[i]; if (acc >= target) return mn + i / sc; }
    return mx;
  }

  /* Kawah tumbukan: gelapkan dasar, terangkan bibir. Dihitung dalam jarak sudut pada bola. */
  function* craters(c, count, minR, maxR, contrast) {
    var W = c.W, H = c.H, tex = c.tex, tab = c.tab, rnd = c.rnd;
    for (var k = 0; k < count; k++) {
      var lat = Math.asin(2 * rnd() - 1), lon = rnd() * TAU - Math.PI;
      var alpha = minR + (maxR - minR) * Math.pow(rnd(), 3.2);
      var cLat = Math.cos(lat), sLat = Math.sin(lat);
      var cx = cLat * Math.sin(lon), cy = sLat, cz = cLat * Math.cos(lon);
      var reach = alpha * 1.35, cosR = Math.cos(reach);
      var row0 = Math.round((Math.PI / 2 - lat) / Math.PI * H - 0.5);
      var rowSpan = Math.ceil(reach / Math.PI * H) + 1;
      var col0 = Math.round((lon + Math.PI) / TAU * W - 0.5);
      for (var y = Math.max(0, row0 - rowSpan); y <= Math.min(H - 1, row0 + rowSpan); y++) {
        var cl = tab.cosLat[y], sl = tab.sinLat[y];
        var span = cl < 0.03 ? W / 2 : Math.min(W / 2, Math.ceil(reach / cl / TAU * W) + 1);
        for (var dx = -span; dx <= span; dx++) {
          var x = ((col0 + dx) % W + W) % W;
          var dot = cx * cl * tab.sinLon[x] + cy * sl + cz * cl * tab.cosLon[x];
          if (dot < cosR) continue;
          var d = Math.acos(dot > 1 ? 1 : dot) / alpha;
          var f = 1;
          if (d < 0.82) {
            var sh = (dx / W * TAU * cl / alpha) * -0.6 + ((y - row0) / H * Math.PI / alpha) * -0.6; // sisi barat-laut lebih gelap
            f = 1 - contrast * (0.22 + 0.12 * (1 - d) + 0.10 * sh);
          } else if (d < 1.06) {
            f = 1 + contrast * 0.32 * (1 - Math.abs(d - 0.94) / 0.12);
          } else {
            f = 1 + contrast * 0.10 * (1 - (d - 1.06) / 0.29);
          }
          var idx = y * W + x, col = tex[idx];
          tex[idx] = pack((col & 255) * f, ((col >> 8) & 255) * f, ((col >> 16) & 255) * f);
        }
      }
      if ((k & 7) === 7) yield;
    }
  }

  /* Bercak elips (badai, bintik) dengan tepi lembut */
  function paintSpot(c, lon0, lat0, rx, ry, cr, cg, cb, strength, warp) {
    var W = c.W, H = c.H, tex = c.tex, tab = c.tab, noise = c.noise;
    var cl0 = Math.max(0.15, Math.cos(lat0));
    var row0 = Math.round((Math.PI / 2 - lat0) / Math.PI * H - 0.5);
    var rowSpan = Math.ceil(ry * 1.6 / Math.PI * H) + 1;
    var col0 = Math.round((lon0 + Math.PI) / TAU * W - 0.5);
    var colSpan = Math.min(W / 2, Math.ceil(rx * 1.6 / cl0 / TAU * W) + 1);
    for (var y = Math.max(0, row0 - rowSpan); y <= Math.min(H - 1, row0 + rowSpan); y++) {
      var dy = (tab.lat[y] - lat0) / ry;
      for (var k = -colSpan; k <= colSpan; k++) {
        var x = ((col0 + k) % W + W) % W;
        var dl = tab.lon[x] - lon0;
        if (dl > Math.PI) dl -= TAU; else if (dl < -Math.PI) dl += TAU;
        var dx = dl * cl0 / rx;
        var e = dx * dx + dy * dy;
        if (warp) e *= 1 + warp * (noise(dx * 2.6 + lon0 * 5, dy * 2.6, 1.7) - 0.5);
        if (e > 1.5) continue;
        var a = strength * (1 - smooth(0.30, 1.0, e));
        if (a < 0.004) continue;
        var idx = y * W + x, col = tex[idx];
        tex[idx] = pack((col & 255) * (1 - a) + cr * a, ((col >> 8) & 255) * (1 - a) + cg * a, ((col >> 16) & 255) * (1 - a) + cb * a);
      }
    }
  }

  /* ------------------------------------------------ generator tekstur */
  var MERC = [[0, 70, 62, 56], [0.42, 128, 116, 104], [0.78, 172, 158, 142], [1, 200, 186, 166]];
  var VENUS = [[0, 186, 136, 76], [0.35, 222, 178, 108], [0.7, 240, 208, 140], [1, 252, 236, 188]];
  var OCEAN = [[0, 70, 168, 208], [0.22, 36, 112, 178], [0.6, 18, 64, 138], [1, 10, 36, 96]];
  var LAND = [[0, 216, 190, 130], [0.3, 166, 158, 94], [0.6, 88, 130, 60], [1, 38, 92, 48]];
  var MARS = [[0, 128, 58, 34], [0.4, 174, 84, 48], [0.75, 208, 122, 76], [1, 228, 160, 110]];
  var JUP = bandStops([
    [-90, 150, 130, 112], [-62, 205, 184, 152], [-46, 172, 122, 88], [-38, 228, 208, 174], [-29, 196, 140, 98],
    [-19, 176, 118, 80], [-9, 234, 216, 182], [-3, 240, 224, 192], [7, 176, 108, 70], [17, 218, 184, 144],
    [24, 182, 132, 96], [31, 230, 210, 178], [41, 192, 152, 116], [52, 216, 196, 166], [66, 152, 136, 122]
  ]);
  var SAT = bandStops([
    [-90, 150, 154, 150], [-72, 206, 186, 140], [-52, 224, 202, 152], [-36, 200, 172, 120], [-22, 234, 214, 166],
    [-8, 240, 222, 174], [6, 214, 190, 140], [18, 228, 206, 158], [32, 204, 180, 132], [48, 222, 200, 152], [66, 176, 164, 132]
  ]);
  var URAN = [[0, 70, 146, 168], [0.5, 128, 206, 218], [1, 206, 246, 248]];
  var NEPT = [[0, 20, 40, 138], [0.5, 42, 82, 206], [1, 98, 142, 242]];

  function* genMerkurius(c) {
    var W = c.W, H = c.H, tex = c.tex, tab = c.tab, fbm = c.fbm;
    for (var y = 0; y < H; y++) {
      var cl = tab.cosLat[y], sl = tab.sinLat[y];
      for (var x = 0; x < W; x++) {
        var px = cl * tab.sinLon[x], py = sl, pz = cl * tab.cosLon[x];
        var n = fbm(px * 2.6 + 1.7, py * 2.6, pz * 2.6, 5);
        var d = fbm(px * 9 + 5, py * 9, pz * 9, 3);
        var t = clamp01((n - 0.5) * 2.5 + 0.5 + (d - 0.5) * 0.55);
        ramp(MERC, t);
        tex[y * W + x] = pack(_r, _g, _b);
      }
      yield;
    }
    yield* craters(c, 560, 0.007, 0.12, 0.55);
  }

  function* genVenus(c) {
    var W = c.W, H = c.H, tex = c.tex, tab = c.tab, fbm = c.fbm;
    for (var y = 0; y < H; y++) {
      var cl = tab.cosLat[y], sl = tab.sinLat[y], lat = tab.lat[y];
      for (var x = 0; x < W; x++) {
        var px = cl * tab.sinLon[x], py = sl, pz = cl * tab.cosLon[x];
        var w = fbm(px * 2.0 + 3, py * 2.0, pz * 2.0, 3);
        var n = fbm(px * 3.0 + w * 1.7 + 7, py * 5.0 + w * 2.2, pz * 3.0 + w * 1.7, 5);
        var streak = 0.5 + 0.5 * Math.sin(lat * 9 + w * 7 + n * 3.5);
        var t = clamp01(0.55 * ((n - 0.5) * 2.3 + 0.5) + 0.45 * streak);
        ramp(VENUS, t);
        tex[y * W + x] = pack(_r, _g, _b);
      }
      yield;
    }
  }

  function* genBumi(c) {
    var W = c.W, H = c.H, tex = c.tex, tab = c.tab, fbm = c.fbm, noise = c.noise;
    var h = new Float32Array(W * H), x, y;
    for (y = 0; y < H; y++) {
      var cl = tab.cosLat[y], sl = tab.sinLat[y];
      for (x = 0; x < W; x++) {
        var px = cl * tab.sinLon[x], py = sl, pz = cl * tab.cosLon[x];
        var big = fbm(px * 1.45 + 1.3, py * 1.45, pz * 1.45, 5);
        var fine = fbm(px * 6 + 4, py * 6, pz * 6, 3);
        h[y * W + x] = big * 0.86 + fine * 0.14;
      }
      yield;
    }
    var sea = percentile(h, 0.69), hmax = percentile(h, 0.996);
    var span = 0.13;
    for (y = 0; y < H; y++) {
      var cl2 = tab.cosLat[y], sl2 = tab.sinLat[y];
      var alat = Math.abs(tab.lat[y]) / DEG;
      for (x = 0; x < W; x++) {
        var px2 = cl2 * tab.sinLon[x], py2 = sl2, pz2 = cl2 * tab.cosLon[x];
        var hh = h[y * W + x], r, g, b;
        var iceLat = 74 + (noise(px2 * 4 + 11, py2 * 4, pz2 * 4) - 0.5) * 12;
        if (hh < sea) {
          var depth = clamp01((sea - hh) / span);
          ramp(OCEAN, depth); r = _r; g = _g; b = _b;
        } else {
          var e = clamp01((hh - sea) / (hmax - sea));
          var m = fbm(px2 * 3.1 + 5, py2 * 3.1, pz2 * 3.1, 3);
          var veg = smooth(0.40, 0.58, m);
          var dz = (alat - 25) / 9;
          veg *= 1 - 0.55 * Math.exp(-dz * dz);
          veg += 0.38 * Math.exp(-(alat / 15) * (alat / 15));
          veg = clamp01(veg);
          ramp(LAND, veg); r = _r; g = _g; b = _b;
          var tund = smooth(48, 66, alat);
          r += (146 - r) * tund; g += (156 - g) * tund; b += (138 - b) * tund;
          var rock = smooth(0.55, 0.9, e) * 0.75;
          r += (118 - r) * rock; g += (106 - g) * rock; b += (94 - b) * rock;
          var snow = smooth(0.90, 1.0, e) * 0.9;
          r += (245 - r) * snow; g += (247 - g) * snow; b += (250 - b) * snow;
        }
        var ice = smooth(0, 3.5, alat - iceLat);
        r += (238 - r) * ice; g += (245 - g) * ice; b += (251 - b) * ice;
        var cv = fbm(px2 * 3.6 + 21, py2 * 4.2 + 3, pz2 * 3.6, 5);
        var cloud = smooth(0.53, 0.76, cv) * 0.86;
        r += (252 - r) * cloud; g += (252 - g) * cloud; b += (254 - b) * cloud;
        tex[y * W + x] = pack(r, g, b);
      }
      yield;
    }
  }

  function* genMars(c) {
    var W = c.W, H = c.H, tex = c.tex, tab = c.tab, fbm = c.fbm, noise = c.noise;
    for (var y = 0; y < H; y++) {
      var cl = tab.cosLat[y], sl = tab.sinLat[y], lat = tab.lat[y];
      var alat = Math.abs(lat) / DEG;
      for (var x = 0; x < W; x++) {
        var px = cl * tab.sinLon[x], py = sl, pz = cl * tab.cosLon[x];
        var n = fbm(px * 2.2 + 3, py * 2.2, pz * 2.2, 5);
        var m = fbm(px * 6 + 1, py * 6, pz * 6, 4);
        var t = clamp01((n - 0.5) * 2.3 + 0.5 + (m - 0.5) * 0.4);
        ramp(MARS, t);
        var r = _r, g = _g, b = _b;
        var dark = smooth(0.54, 0.66, fbm(px * 1.7 + 9, py * 1.7 + 2, pz * 1.7, 4)) * 0.6;
        r += (70 - r) * dark; g += (42 - g) * dark; b += (38 - b) * dark;
        var edge = lat > 0 ? 80 : 84;
        var cap = smooth(edge - 1, edge + 3, alat + (noise(px * 7, py * 7, pz * 7) - 0.5) * 8);
        r += (243 - r) * cap; g += (240 - g) * cap; b += (240 - b) * cap;
        tex[y * W + x] = pack(r, g, b);
      }
      yield;
    }
    yield* craters(c, 200, 0.006, 0.09, 0.32);
  }

  function* genJupiter(c) {
    var W = c.W, H = c.H, tex = c.tex, tab = c.tab, fbm = c.fbm, rnd = c.rnd;
    for (var y = 0; y < H; y++) {
      var cl = tab.cosLat[y], sl = tab.sinLat[y], lat = tab.lat[y] / DEG;
      for (var x = 0; x < W; x++) {
        var px = cl * tab.sinLon[x], py = sl, pz = cl * tab.cosLon[x];
        var wob = fbm(px * 3, py * 7, pz * 3, 3) - 0.5;
        var lw = lat + wob * 9;
        ramp(JUP, clamp01((lw + 90) / 180));
        var s = fbm(px * 3 + 5, py * 30, pz * 3, 4);
        var s2 = fbm(px * 8, py * 16, pz * 8, 3);
        var k = (0.80 + 0.42 * s) * (0.92 + 0.16 * s2);
        tex[y * W + x] = pack(_r * k, _g * k, _b * k);
      }
      yield;
    }
    /* Bintik Merah Besar dengan ‘kerah’ pucat di sekelilingnya */
    var gl = 0.6, gt = -22 * DEG;
    paintSpot(c, gl, gt, 0.52, 0.24, 236, 214, 182, 0.55, 0.5);
    paintSpot(c, gl, gt, 0.34, 0.16, 178, 66, 40, 0.92, 0.55);
    paintSpot(c, gl + 0.03, gt + 0.01, 0.13, 0.06, 150, 46, 30, 0.45, 0.4);
    /* oval-oval kecil */
    paintSpot(c, -1.5, -33 * DEG, 0.09, 0.055, 236, 226, 212, 0.75, 0.4);
    for (var i = 0; i < 8; i++) {
      var la = (rnd() * 2 - 1) * 42 * DEG, lo = rnd() * TAU - Math.PI, pale = rnd() > 0.5;
      paintSpot(c, lo, la, 0.05 + rnd() * 0.06, 0.03 + rnd() * 0.03, pale ? 238 : 120, pale ? 228 : 78, pale ? 210 : 54, 0.38, 0.4);
    }
    yield;
  }

  function* genSaturnus(c) {
    var W = c.W, H = c.H, tex = c.tex, tab = c.tab, fbm = c.fbm;
    for (var y = 0; y < H; y++) {
      var cl = tab.cosLat[y], sl = tab.sinLat[y], lat = tab.lat[y] / DEG;
      for (var x = 0; x < W; x++) {
        var px = cl * tab.sinLon[x], py = sl, pz = cl * tab.cosLon[x];
        var wob = fbm(px * 3, py * 6, pz * 3, 3) - 0.5;
        ramp(SAT, clamp01((lat + wob * 5 + 90) / 180));
        var s = fbm(px * 3 + 2, py * 28, pz * 3, 3);
        var k = 0.90 + 0.20 * s;
        tex[y * W + x] = pack(_r * k, _g * k, _b * k);
      }
      yield;
    }
  }

  function* genUranus(c) {
    var W = c.W, H = c.H, tex = c.tex, tab = c.tab, fbm = c.fbm;
    for (var y = 0; y < H; y++) {
      var cl = tab.cosLat[y], sl = tab.sinLat[y], lat = tab.lat[y];
      var alat = Math.abs(lat) / DEG;
      for (var x = 0; x < W; x++) {
        var px = cl * tab.sinLon[x], py = sl, pz = cl * tab.cosLon[x];
        var s = fbm(px * 2 + 4, py * 10, pz * 2, 3);
        var t = 0.46 + 0.05 * Math.sin(lat * 9) + (s - 0.5) * 0.28 + smooth(42, 82, alat) * 0.30;
        ramp(URAN, clamp01(t));
        var r = _r, g = _g, b = _b;
        var cw = smooth(0.60, 0.72, fbm(px * 4 + 8, py * 15, pz * 4, 3)) * 0.35;
        r += (240 - r) * cw; g += (252 - g) * cw; b += (252 - b) * cw;
        tex[y * W + x] = pack(r, g, b);
      }
      yield;
    }
  }

  function* genNeptunus(c) {
    var W = c.W, H = c.H, tex = c.tex, tab = c.tab, fbm = c.fbm;
    for (var y = 0; y < H; y++) {
      var cl = tab.cosLat[y], sl = tab.sinLat[y], lat = tab.lat[y];
      var ld = lat / DEG;
      for (var x = 0; x < W; x++) {
        var px = cl * tab.sinLon[x], py = sl, pz = cl * tab.cosLon[x];
        var t = 0.44 + 0.14 * Math.sin(lat * 7 + 1) + (fbm(px * 2.4, py * 10, pz * 2.4, 4) - 0.5) * 0.55;
        ramp(NEPT, clamp01(t));
        var r = _r, g = _g, b = _b;
        if (ld > -60 && ld < 25) {
          var ci = smooth(0.64, 0.76, fbm(px * 2.6 + 6, py * 22, pz * 2.6, 3)) * 0.55;
          r += (238 - r) * ci; g += (246 - g) * ci; b += (255 - b) * ci;
        }
        tex[y * W + x] = pack(r, g, b);
      }
      yield;
    }
    var l0 = 1.2, t0 = -20 * DEG;
    paintSpot(c, l0, t0, 0.34, 0.17, 10, 22, 96, 0.88, 0.5);
    paintSpot(c, l0 + 0.42, t0 - 0.14, 0.26, 0.04, 240, 248, 255, 0.8, 0.3);
    paintSpot(c, l0 + 0.12, t0 - 0.24, 0.16, 0.03, 240, 248, 255, 0.55, 0.3);
    yield;
  }

  var GENERATORS = {
    merkurius: genMerkurius, venus: genVenus, bumi: genBumi, mars: genMars,
    jupiter: genJupiter, saturnus: genSaturnus, uranus: genUranus, neptunus: genNeptunus
  };

  /* Membuat generator tekstur. Mengembalikan {gen, tex, W, H}; jalankan gen sampai selesai. */
  function createTexture(kind, W, H) {
    var nz = createNoise(hashStr(kind));
    var ctx = {
      W: W, H: H, tex: new Uint32Array(W * H), tab: makeTables(W, H),
      noise: nz.noise, fbm: nz.fbm, rnd: mulberry32(hashStr(kind + "-rnd"))
    };
    var gen = GENERATORS[kind](ctx);
    return { gen: gen, tex: ctx.tex, W: W, H: H };
  }
  function runSync(job) { while (!job.gen.next().done) { /* jalan terus */ } return job; }
  function runAsync(job, budgetMs) {
    budgetMs = budgetMs || 9;
    return new Promise(function (resolve, reject) {
      function step() {
        try {
          var t0 = Date.now(), r;
          do { r = job.gen.next(); } while (!r.done && Date.now() - t0 < budgetMs);
          if (r.done) resolve(job); else setTimeout(step, 0);
        } catch (e) { reject(e); }
      }
      step();
    });
  }

  /* --------------------------------------------------- pemetaan bola */
  /* Untuk tiap piksel di dalam lingkaran: simpan indeks piksel, bujur awal (0..1),
     dan baris tekstur. Saat merender, cukup geser bujur dengan sudut rotasi. */
  function buildMapping(C, R, phi, W, H) {
    var max = C * C, idx = new Int32Array(max), u0 = new Float32Array(max), rb = new Int32Array(max);
    var nx = new Float32Array(max), ny = new Float32Array(max), nz = new Float32Array(max);
    var sp = Math.sin(phi), cp = Math.cos(phi), n = 0, half = C / 2;
    for (var y = 0; y < C; y++) {
      var dy = -(y + 0.5 - half) / R;
      for (var x = 0; x < C; x++) {
        var dx = (x + 0.5 - half) / R, rr = dx * dx + dy * dy;
        if (rr > 1) continue;
        var z = Math.sqrt(1 - rr);
        var by = dy * cp + z * sp, bz = -dy * sp + z * cp;
        var lat = Math.asin(by < -1 ? -1 : by > 1 ? 1 : by), lon = Math.atan2(dx, bz);
        var row = Math.floor((Math.PI / 2 - lat) / Math.PI * H);
        if (row > H - 1) row = H - 1; else if (row < 0) row = 0;
        idx[n] = y * C + x; u0[n] = lon / TAU + 0.5; rb[n] = row * W;
        nx[n] = dx; ny[n] = dy; nz[n] = z; n++;
      }
    }
    return { n: n, idx: idx, u0: u0, rb: rb, nx: nx, ny: ny, nz: nz, C: C, R: R };
  }

  /* Vektor cahaya (Matahari di kiri-atas depan), dikompensasi kemiringan sumbu planet
     karena kanvas diputar lewat CSS. Hasil: {x,y,z} dengan y positif ke atas. */
  function lightVector(tiltDeg) {
    var th = tiltDeg * DEG, c = Math.cos(th), s = Math.sin(th);
    var sx = -0.62, sy = -0.42; // koordinat layar (y ke bawah)
    var lx = sx * c + sy * s, ly = -sx * s + sy * c;
    var v = { x: lx, y: -ly, z: 0.66 };
    var m = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    v.x /= m; v.y /= m; v.z /= m;
    return v;
  }

  /* Lapisan bayangan (RGBA gelap, alpha = kegelapan) */
  function buildShade(map, L) {
    var C = map.C, out = new Uint8ClampedArray(C * C * 4);
    for (var i = 0; i < map.n; i++) {
      var lam = map.nx[i] * L.x + map.ny[i] * L.y + map.nz[i] * L.z;
      var light = smooth(-0.14, 0.62, lam);
      var limb = 0.72 + 0.28 * Math.sqrt(map.nz[i]);
      var a = 1 - (0.045 + 0.955 * light * limb);
      a = a < 0 ? 0 : a > 0.96 ? 0.96 : a;
      var o = map.idx[i] * 4;
      out[o] = 3; out[o + 1] = 5; out[o + 2] = 16; out[o + 3] = a * 255;
    }
    return out;
  }

  /* Cahaya tepi atmosfer (dipakai dengan mode 'lighter') */
  function buildRim(map, L, rim) {
    var C = map.C, out = new Uint8ClampedArray(C * C * 4);
    if (!rim) return out;
    for (var i = 0; i < map.n; i++) {
      var lam = map.nx[i] * L.x + map.ny[i] * L.y + map.nz[i] * L.z;
      var e = Math.pow(1 - map.nz[i], 2.7);
      var a = e * (0.22 + 0.78 * smooth(-0.35, 0.55, lam)) * rim[3];
      var o = map.idx[i] * 4;
      out[o] = rim[0]; out[o + 1] = rim[1]; out[o + 2] = rim[2]; out[o + 3] = a * 255 > 255 ? 255 : a * 255;
    }
    return out;
  }

  /* ------------------------------------------------------------ cincin */
  function ringProfile(kind, r, nz1) {
    /* r dalam jari-jari planet. Kembalikan alpha dan warna lewat variabel modul. */
    _ra = 0; _rr = 220; _rg = 200; _rb = 160;
    if (kind === "saturnus") {
      var fine = 0.78 + 0.44 * nz1(r * 190, 0.5, 0.5);
      var mid = 0.85 + 0.30 * nz1(r * 45, 3.5, 0.5);
      if (r < 1.24) { _ra = 0.035; _rr = 120; _rg = 110; _rb = 100; }
      else if (r < 1.53) { _ra = 0.30 * fine * mid; _rr = 150; _rg = 135; _rb = 116; }
      else if (r < 1.95) {
        var bk = smooth(1.53, 1.72, r);
        _ra = (0.42 + 0.44 * bk) * fine * mid; _rr = 236; _rg = 218; _rb = 178;
      }
      else if (r < 2.03) { _ra = 0.06 * fine; _rr = 130; _rg = 118; _rb = 104; }
      else if (r < 2.27) {
        _ra = 0.58 * fine * mid; _rr = 218; _rg = 202; _rb = 166;
        if (r > 2.203 && r < 2.217) _ra *= 0.12;
      }
      else if (r > 2.315 && r < 2.335) { _ra = 0.42; _rr = 214; _rg = 200; _rb = 170; }
    } else if (kind === "uranus") {
      var lines = [1.637, 1.652, 1.666, 1.75, 1.787, 1.846, 1.864, 1.89, 2.0];
      for (var i = 0; i < lines.length; i++) {
        var w = i === lines.length - 1 ? 0.011 : 0.0055, d = Math.abs(r - lines[i]);
        if (d < w * 2.2) {
          var aa = (i === lines.length - 1 ? 0.62 : 0.30) * (1 - smooth(w * 0.4, w * 2.2, d));
          if (aa > _ra) { _ra = aa; _rr = 176; _rg = 190; _rb = 198; }
        }
      }
    }
  }
  var _ra = 0, _rr = 0, _rg = 0, _rb = 0;

  /* Gambar cincin sebagai satu buffer RGBA. Bagian di atas garis tengah ada di belakang planet,
     bagian di bawahnya ada di depan planet. */
  function buildRing(cfg, C, R, phi) {
    var out = new Uint8ClampedArray(C * C * 4), nz1 = createNoise(hashStr("cincin-" + cfg.kind)).noise;
    var sp = Math.sin(phi), half = C / 2, edge = 1.6 / R;
    for (var y = 0; y < C; y++) {
      var dy = (y + 0.5 - half) / R / sp; // koordinat bidang cincin (jari-jari planet)
      for (var x = 0; x < C; x++) {
        var dx = (x + 0.5 - half) / R;
        var r = Math.sqrt(dx * dx + dy * dy);
        if (r < cfg.inner - edge || r > cfg.outer + edge) continue;
        ringProfile(cfg.kind, r, nz1);
        if (_ra <= 0.002) continue;
        var soft = smooth(cfg.inner - edge, cfg.inner + edge, r) * (1 - smooth(cfg.outer - edge, cfg.outer + edge, r));
        var a = _ra * (cfg.kind === "uranus" ? 1 : soft);
        var o = (y * C + x) * 4;
        out[o] = _rr; out[o + 1] = _rg; out[o + 2] = _rb; out[o + 3] = a * 255;
      }
    }
    return out;
  }

  var api = {
    createTexture: createTexture, runSync: runSync, runAsync: runAsync,
    buildMapping: buildMapping, buildShade: buildShade, buildRim: buildRim,
    buildRing: buildRing, lightVector: lightVector,
    createNoise: createNoise, mulberry32: mulberry32, GENERATORS: GENERATORS
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.PlanetCore = api;
})(typeof window !== "undefined" ? window : globalThis);
