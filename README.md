# Jelajah Tata Surya 🪐

Website interaktif tentang delapan planet Tata Surya di galaksi Bima Sakti.
Planet dirender dengan kode (kanvas HTML5), jadi tidak ada gambar/foto yang
diunduh dari internet — semua tekstur permukaan planet dibuat secara
prosedural oleh JavaScript.

## Cara membuka di Visual Studio Code

1. Ekstrak (unzip) folder ini, lalu buka foldernya di VS Code
   (`File → Open Folder…`).
2. Karena halaman ini memakai JavaScript modul biasa yang memuat file
   (`fetch`/canvas), sebaiknya jalankan lewat server lokal, bukan dibuka
   langsung sebagai `file://`. Cara termudah:
   - Install ekstensi **Live Server** (oleh Ritwick Dey) dari Extensions
     Marketplace.
   - Klik kanan pada `index.html` → **Open with Live Server**.
   - Browser akan terbuka otomatis di `http://127.0.0.1:5500` (atau port
     serupa).
3. Alternatif tanpa ekstensi, jalankan salah satu perintah ini di terminal
   VS Code pada folder proyek:
   ```bash
   # Python 3 (biasanya sudah tersedia)
   python3 -m http.server 5500

   # atau Node.js
   npx serve .
   ```
   Lalu buka `http://localhost:5500` di browser.

Membuka `index.html` langsung dengan dobel klik (protokol `file://`)
biasanya masih tetap berjalan di sebagian besar browser karena situs ini
tidak memakai `fetch`, tetapi menjalankannya lewat server lokal seperti di
atas lebih aman dan direkomendasikan.

## Struktur folder

```
index.html            Halaman utama
css/style.css          Semua gaya visual (responsif, tema luar angkasa)
js/data.js              Data & teks lengkap kedelapan planet (Bahasa Indonesia)
js/planet-core.js       Mesin pembuat tekstur planet (noise prosedural, tanpa gambar)
js/planet-view.js       Kelas untuk menampilkan & memutar planet di <canvas>
js/starfield.js         Latar bintang berkelip + parallax + bintang jatuh
js/galaxy.js            Ilustrasi galaksi Bima Sakti yang bisa diputar
js/orrery.js            Peta orbit interaktif (planet mengelilingi Matahari)
js/main.js              Logika utama: navigasi, tab info, kalkulator, dsb.
assets/favicon.svg      Ikon tab browser
```

## Mengedit konten

- **Mengubah teks/fakta planet**: edit `js/data.js`. Setiap planet punya
  properti seperti `ringkasan`, `struktur`, `atmosfer`, `bulan`, `misi`,
  `fakta`, dan `kilat` (fakta cepat saat planet diketuk).
- **Mengubah warna/tampilan**: edit `css/style.css`. Warna aksen tiap
  planet otomatis mengikuti `p.accent` di `data.js`.
- **Mengubah bentuk/tekstur planet**: edit fungsi generator di
  `js/planet-core.js` (misalnya `genJupiter`, `genBumi`, dst).

## Kompatibilitas

Situs ini murni HTML, CSS, dan JavaScript (tanpa framework, tanpa build
step, tanpa dependensi npm), jadi bisa dibuka di perangkat apa pun yang
punya browser modern: desktop, laptop, tablet, maupun HP (Android/iOS).
Tampilannya menyesuaikan otomatis (responsif) untuk layar kecil maupun
besar.

## Sumber data

Angka-angka dibulatkan dari data publik NASA, ESA, dan IAU, dan dapat
berubah seiring penemuan baru (misalnya jumlah bulan yang terus
bertambah).
