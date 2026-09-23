/* ==========================================================================
   data.js — Data delapan planet Tata Surya
   Semua angka dibulatkan dan bersumber dari data publik NASA / ESA / IAU.
   Edit file ini untuk mengubah isi teks tanpa menyentuh kode lain.
   ========================================================================== */
window.PLANETS = [
  /* ------------------------------------------------------------------ 1 */
  {
    id: "merkurius",
    nama: "Merkurius",
    latin: "Mercury",
    tipe: "Planet terestrial, planet dalam",
    tagline: "Si kecil yang terbakar di siang hari dan membeku di malam hari",
    warna: ["#cfc6bd", "#8f857c", "#4a433d"],
    accent: "#cbbfb2",
    render: { kind: "merkurius", tilt: 2, periodJam: 1407.6, retro: false, rim: null, ring: null },
    stat: {
      diameter: "4.879 km",
      massa: "3,30 × 10²³ kg",
      gravitasi: "3,7 m/s²",
      jarak: "57,9 juta km",
      hari: "58,6 hari Bumi",
      tahun: "88 hari Bumi",
      suhu: "−180 s.d. 430 °C",
      bulan: "0"
    },
    num: { diameterKm: 4879, massaBumi: 0.055, gravitasi: 3.7, jarakJuta: 57.9, tahunHari: 87.97, hariJam: 1407.6, bulan: 0 },
    gravRatio: 0.378,
    orbitDays: 87.97,
    detail: [
      ["Densitas", "5,43 g/cm³"],
      ["Kecepatan orbit rata-rata", "47,4 km/s"],
      ["Kemiringan sumbu", "0,03°"],
      ["Cincin", "Tidak ada"],
      ["Satu hari surya", "±176 hari Bumi"],
      ["Dikenal sejak", "Zaman kuno"]
    ],
    ringkasan: [
      "Merkurius adalah planet terkecil di Tata Surya dan yang paling dekat dengan Matahari. Ukurannya hanya sedikit lebih besar dari Bulan kita, dengan jarak rata-rata 57,9 juta km dari Matahari, sekitar sepertiga jarak Bumi–Matahari. Karena begitu dekat, ia menempuh satu putaran orbit hanya dalam 88 hari Bumi, sehingga menjadi planet dengan orbit tercepat. Namanya diambil dari dewa pembawa pesan Romawi yang bergerak cepat.",
      "Meski paling dekat dengan Matahari, Merkurius bukan planet terpanas. Ia nyaris tidak punya atmosfer untuk menahan panas: suhu siang bisa mencapai sekitar 430 °C, lalu jatuh ke sekitar −180 °C saat malam. Selisih lebih dari 600 °C ini termasuk yang paling ekstrem di Tata Surya.",
      "Rotasinya unik. Merkurius berputar tiga kali pada porosnya setiap dua kali mengelilingi Matahari (resonansi spin–orbit 3:2). Akibatnya, satu ‘hari’ dari matahari terbit ke matahari terbit berikutnya berlangsung sekitar 176 hari Bumi, dua kali lebih panjang dari ‘tahun’-nya sendiri."
    ],
    struktur: [
      "Merkurius adalah planet berbatu dengan inti besi yang sangat besar, sekitar 85% dari jari-jarinya. Inilah sebabnya densitasnya tinggi untuk ukurannya, hampir sama dengan Bumi. Inti yang sebagian masih cair ini dibungkus mantel silikat dan kerak tipis. Medan magnetnya lemah, sekitar 1% kekuatan medan magnet Bumi.",
      "Permukaannya penuh kawah tumbukan, mirip Bulan. Cekungan Caloris selebar ±1.550 km adalah salah satu kawah terbesar di Tata Surya. Seiring inti yang perlahan mendingin, planet ini menyusut beberapa kilometer dan membentuk tebing-tebing raksasa (lobate scarps) di permukaannya."
    ],
    atmosfer: {
      teks: "Merkurius hanya punya eksosfer yang sangat tipis, berupa atom yang terlepas dari permukaan oleh angin surya dan tumbukan mikrometeorit. Tidak ada angin, awan, ataupun cuaca. Di kawah-kawah kutub yang tak pernah tersinari Matahari, radar dan wahana MESSENGER mendeteksi es air.",
      judul: "Perkiraan komposisi eksosfer",
      komposisi: [
        { n: "Oksigen", v: 42 },
        { n: "Natrium", v: 29 },
        { n: "Hidrogen", v: 22 },
        { n: "Helium", v: 6 },
        { n: "Kalium dan lainnya", v: 1 }
      ]
    },
    bulan: {
      teks: "Merkurius tidak memiliki bulan maupun cincin. Gravitasi Matahari yang sangat kuat di dekatnya membuat orbit stabil bagi sebuah bulan hampir mustahil dipertahankan.",
      daftar: []
    },
    misi: [
      { tahun: "1974–1975", nama: "Mariner 10 (NASA)", ket: "Wahana pertama yang mendekati Merkurius. Tiga kali terbang lintas dan memetakan sekitar 45% permukaannya." },
      { tahun: "2011–2015", nama: "MESSENGER (NASA)", ket: "Wahana pertama yang mengorbit Merkurius. Memetakan seluruh permukaan dan menemukan es air di kutub sebelum sengaja dijatuhkan ke permukaan pada 2015." },
      { tahun: "2018–kini", nama: "BepiColombo (ESA/JAXA)", ket: "Diluncurkan Oktober 2018 dengan dua orbiter. Dijadwalkan memasuki orbit Merkurius pada akhir 2026." }
    ],
    fakta: [
      "Dua bulan, yaitu Ganymede milik Jupiter dan Titan milik Saturnus, ternyata lebih besar dari Merkurius, walau Merkurius jauh lebih masif.",
      "Dari permukaan Merkurius, Matahari tampak hingga sekitar tiga kali lebih besar daripada dilihat dari Bumi.",
      "Di lokasi tertentu, Matahari tampak terbit, berhenti, mundur sebentar, lalu terbit lagi. Ini efek dari orbit lonjong dan rotasi 3:2.",
      "Ada es air di kawah kutub yang selalu gelap, padahal planet ini yang paling dekat dengan Matahari."
    ],
    kilat: [
      "Suhu siang 430 °C, suhu malam −180 °C.",
      "Satu hari di Merkurius sama dengan 176 hari Bumi.",
      "Merkurius mengelilingi Matahari hanya dalam 88 hari.",
      "Di kutubnya tersimpan es, meski dekat Matahari."
    ]
  },

  /* ------------------------------------------------------------------ 2 */
  {
    id: "venus",
    nama: "Venus",
    latin: "Venus",
    tipe: "Planet terestrial, planet dalam",
    tagline: "Kembaran Bumi yang berubah menjadi tungku raksasa",
    warna: ["#fbe7b5", "#dba75c", "#8a5a25"],
    accent: "#f0c27a",
    render: { kind: "venus", tilt: 3, periodJam: 5832.5, retro: true, rim: [255, 214, 150, 0.55], ring: null },
    stat: {
      diameter: "12.104 km",
      massa: "4,87 × 10²⁴ kg",
      gravitasi: "8,9 m/s²",
      jarak: "108,2 juta km",
      hari: "243 hari Bumi (mundur)",
      tahun: "224,7 hari Bumi",
      suhu: "465 °C",
      bulan: "0"
    },
    num: { diameterKm: 12104, massaBumi: 0.815, gravitasi: 8.87, jarakJuta: 108.2, tahunHari: 224.7, hariJam: 5832.5, bulan: 0 },
    gravRatio: 0.904,
    orbitDays: 224.7,
    detail: [
      ["Densitas", "5,24 g/cm³"],
      ["Kecepatan orbit rata-rata", "35,0 km/s"],
      ["Kemiringan sumbu", "177,4° (berputar mundur)"],
      ["Tekanan permukaan", "±92 kali Bumi"],
      ["Cincin", "Tidak ada"],
      ["Dikenal sejak", "Zaman kuno"]
    ],
    ringkasan: [
      "Venus adalah planet kedua dari Matahari dan hampir kembar dengan Bumi dalam ukuran: diameternya 12.104 km (95% Bumi) dengan massa sekitar 81,5% Bumi. Di langit, Venus tampak sebagai ‘bintang’ paling terang, dikenal sebagai Bintang Kejora atau Bintang Timur, dan hanya kalah terang dari Matahari dan Bulan. Namanya berasal dari dewi cinta dan kecantikan Romawi.",
      "Di balik keindahannya, Venus adalah planet terpanas. Suhu permukaan rata-rata sekitar 465 °C, cukup untuk melelehkan timah dan timbal. Tekanan atmosfernya sekitar 92 kali tekanan di permukaan laut Bumi, setara berada ±900 meter di bawah laut. Penyebabnya adalah efek rumah kaca yang lepas kendali di bawah atmosfer karbon dioksida yang sangat tebal.",
      "Venus berotasi sangat lambat dan ke arah sebaliknya (retrograde) dibanding hampir semua planet lain. Satu rotasi butuh 243 hari Bumi, lebih lama daripada satu tahunnya (224,7 hari). Akibatnya Matahari terbit di barat dan terbenam di timur, dan satu hari surya berlangsung sekitar 117 hari Bumi."
    ],
    struktur: [
      "Struktur dalam Venus mirip Bumi: inti logam, mantel batuan, dan kerak berbatu. Namun belum ada bukti lempeng tektonik seperti di Bumi. Radar wahana Magellan menunjukkan permukaan yang relatif muda (sekitar 300–600 juta tahun), kemungkinan diremajakan oleh aktivitas vulkanik. Ada dataran lava yang luas, sekitar 1.600 gunung berapi besar, serta pegunungan seperti Maxwell Montes setinggi ±11 km.",
      "Venus tidak punya medan magnet global yang kuat, sehingga atmosfernya langsung berinteraksi dengan angin surya. Diduga dahulu Venus memiliki lautan air, tetapi menguap akibat pemanasan dan hidrogennya lepas ke antariksa."
    ],
    atmosfer: {
      teks: "Atmosfer Venus sangat tebal dan didominasi karbon dioksida, dengan lapisan awan asam sulfat yang membungkus seluruh planet dan memantulkan cahaya Matahari. Itulah yang membuatnya begitu terang di langit. Di ketinggian awan (sekitar 60 km), angin superrotasi mengelilingi planet dalam ±4 hari Bumi, jauh lebih cepat daripada rotasi planet itu sendiri.",
      judul: "Komposisi atmosfer",
      komposisi: [
        { n: "Karbon dioksida", v: 96.5 },
        { n: "Nitrogen", v: 3.5 },
        { n: "Gas lain (SO₂, dll.)", v: 0.1 }
      ]
    },
    bulan: {
      teks: "Venus tidak memiliki bulan maupun cincin. Para ilmuwan masih memperdebatkan alasannya; kemungkinan karena pengaruh gravitasi Matahari yang kuat atau tumbukan besar di masa lalu.",
      daftar: []
    },
    misi: [
      { tahun: "1962", nama: "Mariner 2 (NASA)", ket: "Wahana pertama yang berhasil terbang lintas planet lain, dan mengukur suhu tinggi Venus." },
      { tahun: "1970", nama: "Venera 7 (Uni Soviet)", ket: "Pendarat pertama yang mengirim data dari permukaan planet lain. Bertahan sekitar 23 menit." },
      { tahun: "1990–1994", nama: "Magellan (NASA)", ket: "Memetakan sekitar 98% permukaan Venus dengan radar." },
      { tahun: "2006–2014", nama: "Venus Express (ESA)", ket: "Mempelajari atmosfer dan awan Venus dari orbit." },
      { tahun: "2030-an", nama: "DAVINCI, VERITAS, EnVision", ket: "Misi-misi baru dalam tahap perencanaan untuk meneliti atmosfer dan geologi Venus." }
    ],
    fakta: [
      "Satu rotasi Venus (243 hari) lebih panjang daripada satu tahunnya (224,7 hari).",
      "Venus adalah satu-satunya planet yang namanya berasal dari dewi. Nama planet lain diambil dari dewa.",
      "Permukaan Venus lebih panas daripada Merkurius, padahal jaraknya dua kali lebih jauh dari Matahari.",
      "Hujan asam sulfat di Venus menguap sebelum menyentuh tanah karena panas yang ekstrem."
    ],
    kilat: [
      "Suhu permukaan 465 °C, cukup untuk melelehkan timah.",
      "Di Venus, Matahari terbit dari barat.",
      "Satu hari Venus lebih panjang dari satu tahunnya.",
      "Tekanan udara di permukaan setara ±900 m di dalam laut."
    ]
  },

  /* ------------------------------------------------------------------ 3 */
  {
    id: "bumi",
    nama: "Bumi",
    latin: "Earth",
    tipe: "Planet terestrial, planet dalam",
    tagline: "Satu-satunya rumah berpenghuni yang kita kenal",
    warna: ["#8fd0ff", "#2f7fd0", "#123a7a"],
    accent: "#5fb0ff",
    render: { kind: "bumi", tilt: 23.4, periodJam: 23.93, retro: false, rim: [120, 185, 255, 0.85], ring: null },
    stat: {
      diameter: "12.742 km",
      massa: "5,97 × 10²⁴ kg",
      gravitasi: "9,8 m/s²",
      jarak: "149,6 juta km",
      hari: "23 jam 56 menit",
      tahun: "365,25 hari",
      suhu: "±15 °C (rata-rata)",
      bulan: "1"
    },
    num: { diameterKm: 12742, massaBumi: 1, gravitasi: 9.8, jarakJuta: 149.6, tahunHari: 365.25, hariJam: 23.93, bulan: 1 },
    gravRatio: 1,
    orbitDays: 365.25,
    detail: [
      ["Densitas", "5,51 g/cm³ (tertinggi)"],
      ["Kecepatan orbit rata-rata", "29,8 km/s"],
      ["Kemiringan sumbu", "23,4°"],
      ["Permukaan berair", "±71%"],
      ["Cincin", "Tidak ada"],
      ["Usia", "±4,54 miliar tahun"]
    ],
    ringkasan: [
      "Bumi adalah planet ketiga dari Matahari dan satu-satunya tempat yang sejauh ini diketahui memiliki kehidupan. Jaraknya (1 satuan astronomi, sekitar 149,6 juta km) berada di ‘zona layak huni’, tempat air dapat berwujud cair di permukaan. Sekitar 71% permukaan Bumi tertutup lautan, itulah sebabnya ia dijuluki ‘planet biru’.",
      "Bumi terbentuk sekitar 4,54 miliar tahun lalu. Bukti kehidupan tertua di Bumi berusia setidaknya sekitar 3,5 miliar tahun. Selama kurun waktu itu, makhluk hidup mengubah atmosfer, lautan, dan bahkan batuan planet ini.",
      "Bumi berotasi sekali dalam sekitar 23 jam 56 menit dan mengorbit Matahari dalam 365,25 hari, itulah sebabnya ada tahun kabisat. Kemiringan sumbu 23,4° menyebabkan pergantian musim. Di Indonesia yang dekat khatulistiwa, pengaruhnya lebih terasa sebagai musim hujan dan musim kemarau."
    ],
    struktur: [
      "Bumi tersusun atas kerak, mantel, inti luar cair (besi–nikel), dan inti dalam padat. Gerakan inti luar menghasilkan medan magnet global (magnetosfer) yang melindungi kita dari angin surya dan radiasi kosmik. Lapisan terluarnya terpecah menjadi lempeng tektonik yang bergerak beberapa sentimeter per tahun. Gerakan inilah penyebab gempa, gunung berapi, dan terbentuknya pegunungan, termasuk Cincin Api Pasifik yang melintasi Indonesia.",
      "Bumi memiliki densitas tertinggi di antara semua planet. Bentuknya pun bukan bola sempurna, melainkan sedikit pepat di kutub akibat rotasinya."
    ],
    atmosfer: {
      teks: "Atmosfer Bumi berlapis: troposfer (tempat cuaca terjadi), stratosfer (lapisan ozon), mesosfer, termosfer, dan eksosfer. Oksigen bebas yang melimpah adalah hasil fotosintesis makhluk hidup selama miliaran tahun. Efek rumah kaca alami menjaga suhu rata-rata sekitar 15 °C; tanpanya Bumi akan membeku di sekitar −18 °C.",
      judul: "Komposisi atmosfer",
      komposisi: [
        { n: "Nitrogen", v: 78.1 },
        { n: "Oksigen", v: 20.9 },
        { n: "Argon", v: 0.9 },
        { n: "Lainnya (CO₂, uap air)", v: 0.1 }
      ]
    },
    bulan: {
      teks: "Bumi punya satu bulan alami. Diameternya 3.474 km (sekitar 27% Bumi) dan mengorbit pada jarak rata-rata 384.400 km setiap 27,3 hari. Bulan diyakini terbentuk dari tumbukan benda seukuran Mars, Theia, dengan Bumi purba sekitar 4,5 miliar tahun lalu. Gravitasinya menimbulkan pasang surut laut dan menstabilkan kemiringan sumbu Bumi. Bulan juga menjauh dari Bumi sekitar 3,8 cm per tahun.",
      daftar: [
        { n: "Bulan (Luna)", i: "Satu-satunya tempat di luar Bumi yang pernah dipijak manusia, pertama kali oleh Apollo 11 pada 1969." }
      ]
    },
    misi: [
      { tahun: "1968", nama: "Earthrise (Apollo 8)", ket: "Foto Bumi terbit di atas cakrawala Bulan mengubah cara manusia memandang planetnya." },
      { tahun: "1972", nama: "The Blue Marble (Apollo 17)", ket: "Foto Bumi utuh dan terang yang menjadi salah satu gambar paling dikenal sepanjang masa." },
      { tahun: "1990", nama: "Pale Blue Dot (Voyager 1)", ket: "Dari jarak sekitar 6 miliar km, Bumi tampak hanya sebagai setitik cahaya kecil." },
      { tahun: "1998–kini", nama: "Stasiun Luar Angkasa Internasional", ket: "Mengorbit di ketinggian ±400 km dan dihuni terus-menerus sejak November 2000." }
    ],
    fakta: [
      "Bumi bukan bola sempurna. Ia menggembung sekitar 43 km di khatulistiwa dibanding diameter antar-kutubnya.",
      "Sekitar 97% air di Bumi adalah air asin. Air tawar hanya ±3%, dan sebagian besarnya membeku di gletser dan es kutub.",
      "Bumi melaju mengelilingi Matahari dengan kecepatan sekitar 30 km/detik, atau ±107.000 km/jam.",
      "Indonesia berada di Cincin Api Pasifik dan memiliki lebih dari 120 gunung api aktif."
    ],
    kilat: [
      "Bumi melaju 30 km/detik mengelilingi Matahari.",
      "71% permukaan Bumi adalah lautan.",
      "Bumi satu-satunya planet yang kita tahu berpenghuni.",
      "Bulan menjauh dari Bumi ±3,8 cm setiap tahun."
    ]
  },

  /* ------------------------------------------------------------------ 4 */
  {
    id: "mars",
    nama: "Mars",
    latin: "Mars",
    tipe: "Planet terestrial, planet dalam",
    tagline: "Planet merah yang menyimpan jejak air purba",
    warna: ["#f5a27a", "#c4552f", "#6d2a15"],
    accent: "#ff7b52",
    render: { kind: "mars", tilt: 25.2, periodJam: 24.62, retro: false, rim: [255, 170, 120, 0.3], ring: null },
    stat: {
      diameter: "6.779 km",
      massa: "6,42 × 10²³ kg",
      gravitasi: "3,7 m/s²",
      jarak: "227,9 juta km",
      hari: "24 jam 37 menit",
      tahun: "687 hari Bumi",
      suhu: "−63 °C (rata-rata)",
      bulan: "2"
    },
    num: { diameterKm: 6779, massaBumi: 0.107, gravitasi: 3.71, jarakJuta: 227.9, tahunHari: 686.98, hariJam: 24.62, bulan: 2 },
    gravRatio: 0.379,
    orbitDays: 686.98,
    detail: [
      ["Densitas", "3,93 g/cm³"],
      ["Kecepatan orbit rata-rata", "24,1 km/s"],
      ["Kemiringan sumbu", "25,2°"],
      ["Tekanan atmosfer", "<1% tekanan Bumi"],
      ["Cincin", "Tidak ada"],
      ["Dikenal sejak", "Zaman kuno"]
    ],
    ringkasan: [
      "Mars adalah planet keempat dari Matahari dan sering dijuluki Planet Merah karena permukaannya kaya besi oksida (karat). Diameternya 6.779 km, sekitar separuh Bumi, dan gravitasinya hanya sekitar 38% gravitasi Bumi. Namanya diambil dari dewa perang Romawi, mungkin karena warna merahnya yang mengingatkan pada darah.",
      "Mars kini gersang dan dingin, dengan suhu rata-rata sekitar −63 °C. Namun bukti dari rover dan orbiter menunjukkan bahwa miliaran tahun lalu Mars pernah hangat dan basah, dengan sungai, danau, bahkan mungkin lautan. Karena itu Mars menjadi target utama pencarian tanda kehidupan masa lalu.",
      "Satu hari di Mars (disebut sol) berlangsung 24 jam 39 menit, hampir sama dengan Bumi, sedangkan satu tahunnya 687 hari Bumi. Kemiringan sumbu 25,2° membuat Mars punya empat musim, masing-masing hampir dua kali lebih lama daripada di Bumi."
    ],
    struktur: [
      "Mars punya kerak berbatu, mantel silikat, dan inti besi–belerang. Seismometer wahana InSight (2018–2022) merekam ribuan gempa Mars dan menunjukkan inti cair berjari-jari sekitar 1.830 km.",
      "Permukaannya menampilkan hal-hal ekstrem: Olympus Mons, gunung berapi perisai setinggi ±22 km (hampir 2,5 kali Everest dari permukaan laut), dan Valles Marineris, ngarai sepanjang ±4.000 km dan sedalam hingga 7 km. Belahan utara berupa dataran rendah, belahan selatan berupa dataran tinggi berkawah. Kutubnya diselimuti es air dan es karbon dioksida (es kering)."
    ],
    atmosfer: {
      teks: "Atmosfer Mars sangat tipis, tekanannya kurang dari 1% tekanan di Bumi, sehingga air cair tidak stabil di permukaan. Debu halus sering membentuk badai yang kadang menyelimuti seluruh planet selama berminggu-minggu. Langit Mars berwarna kuning kecokelatan di siang hari, sedangkan matahari terbenamnya tampak kebiruan.",
      judul: "Komposisi atmosfer",
      komposisi: [
        { n: "Karbon dioksida", v: 95.3 },
        { n: "Nitrogen", v: 2.7 },
        { n: "Argon", v: 1.6 },
        { n: "Lainnya", v: 0.4 }
      ]
    },
    bulan: {
      teks: "Mars memiliki dua bulan kecil berbentuk tak beraturan seperti kentang, ditemukan oleh Asaph Hall pada 1877.",
      daftar: [
        { n: "Phobos", i: "Sekitar 22 km. Mengorbit sangat dekat (±6.000 km dari permukaan) dan perlahan mendekat; diperkirakan hancur atau menjadi cincin dalam beberapa puluh juta tahun." },
        { n: "Deimos", i: "Sekitar 12 km. Lebih jauh dan lebih kecil, membutuhkan ±30 jam untuk mengelilingi Mars." }
      ]
    },
    misi: [
      { tahun: "1965", nama: "Mariner 4 (NASA)", ket: "Mengirim foto jarak dekat pertama Mars." },
      { tahun: "1976", nama: "Viking 1 dan 2 (NASA)", ket: "Pendarat pertama yang bertahan lama dan mengirim foto dari permukaan Mars." },
      { tahun: "1997", nama: "Sojourner (Mars Pathfinder)", ket: "Rover pertama yang menjelajahi Mars." },
      { tahun: "2004", nama: "Spirit dan Opportunity", ket: "Menemukan bukti kuat adanya air cair di masa lalu. Opportunity bekerja hampir 15 tahun." },
      { tahun: "2012", nama: "Curiosity (NASA)", ket: "Menjelajahi Kawah Gale dan menemukan lingkungan purba yang layak huni." },
      { tahun: "2021", nama: "Perseverance dan Ingenuity", ket: "Mencari tanda kehidupan purba di Kawah Jezero. Helikopter Ingenuity terbang 72 kali di planet lain hingga 2024." }
    ],
    fakta: [
      "Olympus Mons adalah gunung tertinggi di Tata Surya, lebarnya kira-kira sebesar negara bagian Arizona.",
      "Matahari terbenam di Mars berwarna biru, kebalikan dari Bumi yang cenderung merah dan oranye.",
      "Mars pernah memiliki medan magnet global yang kini sudah hilang, sehingga atmosfernya perlahan terkikis angin surya.",
      "Phobos terbit dua atau tiga kali sehari, dan terbit dari barat karena mengorbit lebih cepat daripada rotasi Mars."
    ],
    kilat: [
      "Olympus Mons ±22 km, hampir 2,5 kali tinggi Everest.",
      "Matahari terbenam di Mars berwarna biru.",
      "Gravitasi Mars hanya 38% Bumi, kamu bisa melompat hampir tiga kali lebih tinggi.",
      "Ingenuity, helikopter pertama di planet lain, terbang 72 kali."
    ]
  },

  /* ------------------------------------------------------------------ 5 */
  {
    id: "jupiter",
    nama: "Jupiter",
    latin: "Jupiter",
    tipe: "Raksasa gas, planet luar",
    tagline: "Raja para planet dengan badai berusia berabad-abad",
    warna: ["#f0d9b8", "#c48a5a", "#7a4b2c"],
    accent: "#e8a86c",
    render: { kind: "jupiter", tilt: 3, periodJam: 9.93, retro: false, rim: [255, 225, 190, 0.22], ring: null },
    stat: {
      diameter: "142.984 km",
      massa: "1,90 × 10²⁷ kg",
      gravitasi: "24,8 m/s²",
      jarak: "778,5 juta km",
      hari: "9 jam 56 menit",
      tahun: "11,86 tahun Bumi",
      suhu: "−110 °C (puncak awan)",
      bulan: "95+"
    },
    num: { diameterKm: 142984, massaBumi: 317.8, gravitasi: 24.79, jarakJuta: 778.5, tahunHari: 4332.6, hariJam: 9.93, bulan: 95 },
    gravRatio: 2.528,
    orbitDays: 4332.6,
    detail: [
      ["Densitas", "1,33 g/cm³"],
      ["Kecepatan orbit rata-rata", "13,1 km/s"],
      ["Kemiringan sumbu", "3,1°"],
      ["Cincin", "Ada, tipis dan redup"],
      ["Volume", "±1.300 kali Bumi"],
      ["Dikenal sejak", "Zaman kuno"]
    ],
    ringkasan: [
      "Jupiter adalah planet terbesar di Tata Surya, dengan diameter sekitar 143.000 km, lebih dari 11 kali Bumi. Massanya 318 kali massa Bumi, atau lebih dari dua kali lipat massa seluruh planet lain digabungkan. Sekitar 1.300 Bumi dapat muat di dalamnya. Namanya diambil dari raja para dewa Romawi.",
      "Sebagai raksasa gas, Jupiter tidak memiliki permukaan padat. Yang tampak adalah puncak awan berwarna-warni berupa pita ‘zona’ (terang) dan ‘sabuk’ (gelap) yang ditarik angin kencang berkecepatan hingga lebih dari 500 km/jam.",
      "Jupiter berotasi paling cepat di antara semua planet: satu putaran hanya ±9 jam 56 menit, membuat planet ini menggembung di khatulistiwa. Satu tahunnya sama dengan 11,86 tahun Bumi. Gravitasinya yang besar ikut membentuk sejarah Tata Surya dan mengarahkan lintasan asteroid serta komet."
    ],
    struktur: [
      "Jupiter tersusun terutama dari hidrogen dan helium, komposisi yang mirip Matahari. Makin ke dalam, tekanan meningkat sampai hidrogen berubah menjadi cairan, lalu hidrogen metalik yang dapat menghantarkan listrik. Gerakannya menghasilkan medan magnet terkuat di antara semua planet. Data wahana Juno menunjukkan bahwa inti Jupiter mungkin ‘kabur’, yakni bercampur dengan lapisan hidrogen di sekitarnya, bukan bola batu yang padat.",
      "Jupiter memancarkan panas lebih banyak daripada yang ia terima dari Matahari, sisa panas pembentukannya. Ia juga memiliki cincin tipis dari debu, ditemukan oleh Voyager 1 pada 1979, dan aurora yang sangat kuat di kedua kutubnya."
    ],
    atmosfer: {
      teks: "Atmosfer Jupiter sekitar 90% hidrogen dan 10% helium, dengan sedikit metana, uap air, dan amonia. Awan amonia, amonium hidrosulfida, dan air tersusun berlapis. Warna oranye, cokelat, dan merahnya diduga berasal dari senyawa belerang dan fosfor. Badai paling terkenal adalah Bintik Merah Besar, badai raksasa yang telah diamati terus-menerus sejak 1830-an dan kini menyusut hingga sekitar 1,3 kali lebar Bumi.",
      judul: "Komposisi atmosfer (berdasarkan volume)",
      komposisi: [
        { n: "Hidrogen", v: 89.8 },
        { n: "Helium", v: 10.2 }
      ]
    },
    bulan: {
      teks: "Jupiter memiliki lebih dari 95 bulan yang telah diakui, dan jumlahnya masih bertambah. Empat bulan terbesar dikenal sebagai bulan Galilean, ditemukan oleh Galileo Galilei pada 1610.",
      daftar: [
        { n: "Io", i: "Dunia paling aktif secara vulkanik di Tata Surya, dengan ratusan gunung berapi." },
        { n: "Europa", i: "Menyimpan samudra air asin di bawah kerak es. Kandidat utama pencarian kehidupan." },
        { n: "Ganymede", i: "Bulan terbesar di Tata Surya (5.268 km), lebih besar dari Merkurius, dengan medan magnet sendiri." },
        { n: "Callisto", i: "Permukaan paling banyak kawah di Tata Surya. Kemungkinan menyimpan samudra tersembunyi." }
      ]
    },
    misi: [
      { tahun: "1973", nama: "Pioneer 10 (NASA)", ket: "Wahana pertama yang terbang lintas Jupiter." },
      { tahun: "1979", nama: "Voyager 1 dan 2", ket: "Menemukan cincin Jupiter dan gunung berapi aktif di Io." },
      { tahun: "1995–2003", nama: "Galileo (NASA)", ket: "Orbiter pertama Jupiter. Mengirim probe ke atmosfer dan menemukan bukti samudra di Europa." },
      { tahun: "2016", nama: "Juno (NASA)", ket: "Mengorbit dari kutub ke kutub untuk mempelajari inti, medan magnet, dan atmosfer Jupiter." },
      { tahun: "2023–2024", nama: "JUICE dan Europa Clipper", ket: "JUICE (ESA, 2023) dan Europa Clipper (NASA, Oktober 2024) menuju sistem Jupiter untuk meneliti bulan-bulan es; tiba sekitar 2030–2031." }
    ],
    fakta: [
      "Jupiter perlu sekitar 80 kali lebih masif agar inti hidrogennya menyala menjadi bintang.",
      "Satu hari di Jupiter hanya sekitar 10 jam, padahal ukurannya raksasa.",
      "Bintik Merah Besar cukup lebar untuk memuat Bumi.",
      "Jupiter memancarkan gelombang radio kuat yang bisa ditangkap dari Bumi."
    ],
    kilat: [
      "Bintik Merah Besar muat lebih dari satu Bumi.",
      "Sehari di Jupiter hanya sekitar 10 jam.",
      "Ganymede, bulan Jupiter, lebih besar dari Merkurius.",
      "Sekitar 1.300 Bumi bisa muat di dalam Jupiter."
    ]
  },

  /* ------------------------------------------------------------------ 6 */
  {
    id: "saturnus",
    nama: "Saturnus",
    latin: "Saturn",
    tipe: "Raksasa gas, planet luar",
    tagline: "Sang planet bercincin yang lebih ringan daripada air",
    warna: ["#f5e2b0", "#d4b070", "#8d6d3a"],
    accent: "#e9cf8f",
    render: { kind: "saturnus", tilt: 26.7, periodJam: 10.56, retro: false, rim: [255, 235, 190, 0.22], ring: { kind: "saturnus", inner: 1.24, outer: 2.35 } },
    stat: {
      diameter: "120.536 km",
      massa: "5,68 × 10²⁶ kg",
      gravitasi: "10,4 m/s²",
      jarak: "1,43 miliar km",
      hari: "10 jam 33 menit",
      tahun: "29,4 tahun Bumi",
      suhu: "−178 °C (puncak awan)",
      bulan: "274"
    },
    num: { diameterKm: 120536, massaBumi: 95.2, gravitasi: 10.44, jarakJuta: 1434, tahunHari: 10759, hariJam: 10.56, bulan: 274 },
    gravRatio: 1.065,
    orbitDays: 10759,
    detail: [
      ["Densitas", "0,69 g/cm³ (lebih ringan dari air)"],
      ["Kecepatan orbit rata-rata", "9,7 km/s"],
      ["Kemiringan sumbu", "26,7°"],
      ["Cincin", "Ada, megah (A, B, C, dan lainnya)"],
      ["Lebar sistem cincin", "±282.000 km"],
      ["Dikenal sejak", "Zaman kuno"]
    ],
    ringkasan: [
      "Saturnus adalah planet keenam dari Matahari dan terbesar kedua, dengan diameter ekuator ±120.500 km (9,4 kali Bumi). Ia paling terkenal karena sistem cincinnya yang megah, yang bahkan terlihat lewat teleskop kecil. Namanya berasal dari dewa pertanian Romawi.",
      "Saturnus adalah planet dengan densitas terendah, sekitar 0,69 g/cm³, lebih kecil dari air. Secara teori, jika ada bak air yang cukup besar, Saturnus akan mengapung. Karena berotasi cepat (±10 jam 33 menit), planet ini sangat pepat: diameter kutubnya sekitar 10% lebih kecil daripada diameter ekuatornya.",
      "Satu tahun Saturnus setara 29,4 tahun Bumi. Kemiringan sumbunya 26,7° menimbulkan musim, dan membuat cincinnya tampak ‘membuka’ dan ‘menutup’ dari Bumi setiap ±15 tahun. Pada Maret 2025, cincinnya tampak nyaris menghilang ketika berada tepat menyamping."
    ],
    struktur: [
      "Seperti Jupiter, Saturnus terdiri dari hidrogen dan helium, dengan hidrogen metalik cair di kedalaman dan inti berbatu di pusatnya. Ia memancarkan energi sekitar 2,5 kali lebih banyak daripada yang diterimanya dari Matahari, sebagian akibat ‘hujan helium’ yang melepaskan panas saat tetesan helium tenggelam.",
      "Cincin Saturnus membentang hingga ±282.000 km dari planet, tetapi tebalnya di banyak bagian hanya sekitar 10 meter. Cincin tersusun dari miliaran keping es air (95–99%) dan debu berbatu, berukuran dari butiran debu hingga sebesar rumah. Cincin utama diberi nama A, B, dan C, dipisahkan oleh Celah Cassini selebar ±4.800 km. Asal-usulnya masih diperdebatkan: mungkin serpihan bulan atau komet yang hancur. Cincin juga perlahan menyusut karena ‘hujan cincin’, material yang jatuh ke planet."
    ],
    atmosfer: {
      teks: "Atmosfer Saturnus sekitar 96% hidrogen dan 3% helium, dengan sedikit metana dan amonia. Pita awannya lebih pucat dan berkabut daripada Jupiter karena lapisan kabut yang lebih tebal. Angin di ekuator mencapai sekitar 1.800 km/jam. Di kutub utara terdapat pusaran heksagonal raksasa, Heksagon Saturnus, yang tiap sisinya lebih panjang daripada diameter Bumi.",
      judul: "Komposisi atmosfer (berdasarkan volume)",
      komposisi: [
        { n: "Hidrogen", v: 96.3 },
        { n: "Helium", v: 3.2 },
        { n: "Metana dan lainnya", v: 0.5 }
      ]
    },
    bulan: {
      teks: "Saturnus memiliki 274 bulan yang telah dikonfirmasi (per 2025), terbanyak di Tata Surya, dan jumlahnya masih bertambah.",
      daftar: [
        { n: "Titan", i: "Bulan terbesar kedua di Tata Surya (5.150 km) dengan atmosfer nitrogen tebal serta danau dan sungai metana cair." },
        { n: "Enceladus", i: "Menyemburkan geyser uap air dari kutub selatannya. Menyimpan samudra di bawah es, target utama astrobiologi." },
        { n: "Mimas", i: "Kawah raksasa Herschel membuatnya mirip Bintang Kematian dalam film Star Wars." },
        { n: "Iapetus", i: "Berwarna dua: satu sisi terang, sisi lain gelap. Punya punggungan tinggi di sepanjang ekuatornya." },
        { n: "Rhea", i: "Bulan terbesar kedua Saturnus (±1.527 km), berupa dunia es penuh kawah." }
      ]
    },
    misi: [
      { tahun: "1979", nama: "Pioneer 11 (NASA)", ket: "Wahana pertama yang terbang lintas Saturnus." },
      { tahun: "1980–1981", nama: "Voyager 1 dan 2", ket: "Memotret cincin dan bulan-bulan Saturnus dari jarak dekat." },
      { tahun: "2004–2017", nama: "Cassini–Huygens", ket: "Mengorbit Saturnus selama 13 tahun. Probe Huygens mendarat di Titan pada 2005. Misi berakhir 15 September 2017 dengan terjun ke atmosfer Saturnus." },
      { tahun: "2028", nama: "Dragonfly (NASA)", ket: "Helikopter bertenaga nuklir yang akan menjelajahi Titan. Peluncuran direncanakan 2028, tiba sekitar 2034." }
    ],
    fakta: [
      "Saturnus lebih ringan daripada air, sehingga ia akan mengapung jika ada lautan cukup besar.",
      "Cincin Saturnus selebar 282.000 km tetapi setebal sekitar 10 meter saja.",
      "Saturnus adalah planet terjauh yang mudah terlihat dengan mata telanjang.",
      "Di kutub utaranya ada badai berbentuk segi enam yang telah bertahan setidaknya sejak Voyager melintas pada 1980-an."
    ],
    kilat: [
      "Saturnus bisa mengapung di lautan raksasa.",
      "Cincinnya selebar 282.000 km, setebal ±10 m.",
      "Saturnus punya 274 bulan, terbanyak di Tata Surya.",
      "Di kutub utaranya ada badai berbentuk segi enam."
    ]
  },

  /* ------------------------------------------------------------------ 7 */
  {
    id: "uranus",
    nama: "Uranus",
    latin: "Uranus",
    tipe: "Raksasa es, planet luar",
    tagline: "Planet yang berputar sambil berguling menyamping",
    warna: ["#c8f3f5", "#6fc7d3", "#2f7f92"],
    accent: "#7fe0ea",
    render: { kind: "uranus", tilt: 82, periodJam: 17.24, retro: false, rim: [150, 235, 245, 0.6], ring: { kind: "uranus", inner: 1.55, outer: 2.05 } },
    stat: {
      diameter: "51.118 km",
      massa: "8,68 × 10²⁵ kg",
      gravitasi: "8,7 m/s²",
      jarak: "2,87 miliar km",
      hari: "17 jam 14 menit",
      tahun: "84 tahun Bumi",
      suhu: "−195 °C",
      bulan: "29"
    },
    num: { diameterKm: 51118, massaBumi: 14.5, gravitasi: 8.69, jarakJuta: 2871, tahunHari: 30687, hariJam: 17.24, bulan: 29 },
    gravRatio: 0.886,
    orbitDays: 30687,
    detail: [
      ["Densitas", "1,27 g/cm³"],
      ["Kecepatan orbit rata-rata", "6,8 km/s"],
      ["Kemiringan sumbu", "97,8° (berguling)"],
      ["Cincin", "13 cincin tipis dan gelap"],
      ["Suhu terendah tercatat", "±−224 °C"],
      ["Ditemukan", "13 Maret 1781, William Herschel"]
    ],
    ringkasan: [
      "Uranus adalah planet ketujuh dari Matahari dan planet pertama yang ditemukan dengan teleskop. William Herschel mengamatinya pada 13 Maret 1781 dan awalnya mengira itu komet. Diameternya ±51.100 km (4 kali Bumi). Ia satu-satunya planet yang namanya berasal dari mitologi Yunani (Ouranos, dewa langit), bukan Romawi.",
      "Keunikan terbesar Uranus adalah sumbu rotasinya yang miring 97,8°, praktis berguling menyamping saat mengorbit. Akibatnya, setiap kutub mengalami sekitar 42 tahun terang terus-menerus lalu 42 tahun gelap terus-menerus dalam satu tahun Uranus (84 tahun Bumi). Penyebabnya diduga tumbukan besar di masa awal Tata Surya.",
      "Uranus adalah ‘raksasa es’. Selain hidrogen dan helium di atmosfernya, sebagian besar massanya berupa bahan ‘es’ yang panas dan padat seperti air, amonia, dan metana. Warna biru kehijauannya berasal dari metana yang menyerap cahaya merah."
    ],
    struktur: [
      "Interior Uranus terdiri dari inti kecil berbatu yang dikelilingi mantel besar air–amonia–metana yang berada dalam kondisi panas dan bertekanan sangat tinggi (berupa fluida, bukan es seperti yang kita bayangkan), lalu atmosfer hidrogen–helium. Para ilmuwan menduga pada kedalaman tertentu tekanan bisa memampatkan karbon menjadi berlian, hipotesis yang dikenal sebagai ‘hujan berlian’.",
      "Uranus mencatat suhu atmosfer terendah di Tata Surya, sekitar −224 °C, walau bukan planet terjauh. Berbeda dengan raksasa lain, ia memancarkan sangat sedikit panas dari dalam. Medan magnetnya miring sekitar 59° dari sumbu rotasi dan tidak berpusat di tengah planet, sehingga bentuknya tidak beraturan."
    ],
    atmosfer: {
      teks: "Atmosfer Uranus sekitar 83% hidrogen, 15% helium, dan 2,3% metana. Kabut membuat penampakannya tampak polos, tetapi pengamatan modern lewat Hubble dan James Webb memperlihatkan pita awan, badai, dan tudung kutub yang cerah. Warna sebenarnya biru kehijauan pucat, sedikit lebih kehijauan dibanding Neptunus.",
      judul: "Komposisi atmosfer",
      komposisi: [
        { n: "Hidrogen", v: 82.5 },
        { n: "Helium", v: 15.2 },
        { n: "Metana", v: 2.3 }
      ]
    },
    bulan: {
      teks: "Uranus memiliki 29 bulan yang diketahui (bulan ke-29 ditemukan Teleskop Webb pada 2025) dan 13 cincin tipis. Berbeda dengan bulan lain, nama bulan-bulan Uranus diambil dari tokoh dalam karya Shakespeare dan Alexander Pope.",
      daftar: [
        { n: "Titania", i: "Bulan terbesar Uranus (±1.578 km)." },
        { n: "Oberon", i: "Bulan terbesar kedua dengan permukaan tua penuh kawah." },
        { n: "Umbriel", i: "Salah satu bulan tergelap di Uranus." },
        { n: "Ariel", i: "Yang paling cerah dan tampak paling muda secara geologi." },
        { n: "Miranda", i: "Punya medan aneh dan tebing Verona Rupes setinggi ±20 km, salah satu tebing tertinggi di Tata Surya." }
      ]
    },
    misi: [
      { tahun: "1781", nama: "Penemuan Uranus", ket: "William Herschel menemukannya lewat teleskop di Bath, Inggris." },
      { tahun: "1986", nama: "Voyager 2 (NASA)", ket: "Satu-satunya wahana yang pernah mengunjungi Uranus (24 Januari 1986). Menemukan 10 bulan dan 2 cincin baru." },
      { tahun: "2022–kini", nama: "Teleskop James Webb", ket: "Menangkap citra detail cincin dan cuaca Uranus." },
      { tahun: "2030-an dan seterusnya", nama: "Uranus Orbiter and Probe", ket: "Direkomendasikan sebagai misi berprioritas tertinggi NASA dalam Decadal Survey 2023, namun belum ada jadwal pasti." }
    ],
    fakta: [
      "Cincin Uranus berdiri hampir tegak, karena planetnya berguling menyamping.",
      "Uranus pernah tercatat sebagai bintang biasa sejak 1690, sebelum Herschel menyadari bahwa itu planet.",
      "Awan di lapisan atas Uranus mengandung hidrogen sulfida, gas yang berbau seperti telur busuk.",
      "Satu tahun di Uranus sama dengan 84 tahun Bumi."
    ],
    kilat: [
      "Sumbu Uranus miring 98°, ia berguling menyamping.",
      "Setiap kutub Uranus mengalami 42 tahun siang terus-menerus.",
      "Awannya mengandung gas berbau telur busuk.",
      "Uranus ditemukan pada 1781, planet pertama lewat teleskop."
    ]
  },

  /* ------------------------------------------------------------------ 8 */
  {
    id: "neptunus",
    nama: "Neptunus",
    latin: "Neptune",
    tipe: "Raksasa es, planet luar",
    tagline: "Dunia biru dengan angin tercepat di Tata Surya",
    warna: ["#7fa2ff", "#3357d6", "#16297a"],
    accent: "#5b86ff",
    render: { kind: "neptunus", tilt: 28.3, periodJam: 16.1, retro: false, rim: [120, 160, 255, 0.6], ring: null },
    stat: {
      diameter: "49.528 km",
      massa: "1,02 × 10²⁶ kg",
      gravitasi: "11,2 m/s²",
      jarak: "4,50 miliar km",
      hari: "16 jam 6 menit",
      tahun: "164,8 tahun Bumi",
      suhu: "−214 °C",
      bulan: "16"
    },
    num: { diameterKm: 49528, massaBumi: 17.1, gravitasi: 11.15, jarakJuta: 4495, tahunHari: 60190, hariJam: 16.1, bulan: 16 },
    gravRatio: 1.137,
    orbitDays: 60190,
    detail: [
      ["Densitas", "1,64 g/cm³"],
      ["Kecepatan orbit rata-rata", "5,4 km/s"],
      ["Kemiringan sumbu", "28,3°"],
      ["Cincin", "5 cincin utama, redup"],
      ["Kecepatan angin", "hingga ±2.000 km/jam"],
      ["Ditemukan", "23 September 1846, Johann Galle"]
    ],
    ringkasan: [
      "Neptunus adalah planet kedelapan dan paling jauh dari Matahari, rata-rata 4,5 miliar km atau 30 kali jarak Bumi–Matahari. Cahaya Matahari butuh sekitar 4 jam untuk sampai ke sana, dan dari Neptunus Matahari tampak hanya sebagai titik yang sangat terang. Namanya diambil dari dewa laut Romawi.",
      "Neptunus adalah planet pertama yang ditemukan lewat perhitungan matematika sebelum diamati. Urbain Le Verrier dan John Couch Adams menduga keberadaannya dari penyimpangan orbit Uranus, dan Johann Galle mengamatinya pada 23 September 1846. Karena satu tahun Neptunus setara 164,8 tahun Bumi, ia baru menyelesaikan satu orbit penuh sejak penemuannya pada Juli 2011.",
      "Ukurannya hampir kembar dengan Uranus (diameter ±49.500 km), tetapi lebih padat dan lebih aktif. Neptunus memiliki angin tercepat di Tata Surya, hingga sekitar 2.000 km/jam, dan badai gelap besar, padahal ia sangat jauh dari Matahari sebagai sumber energi."
    ],
    struktur: [
      "Seperti Uranus, Neptunus adalah raksasa es dengan inti berbatu, mantel air–amonia–metana yang panas dan bertekanan, serta atmosfer hidrogen–helium. Neptunus memancarkan sekitar 2,6 kali energi yang diterimanya dari Matahari. Panas dari dalam inilah yang diduga menggerakkan angin dan badainya.",
      "Medan magnetnya miring sekitar 47° dari sumbu rotasi dan tidak berpusat di tengah planet. Neptunus punya lima cincin utama yang redup. Cincin terluar, Adams, mengandung busur cincin (arcs) yang tampak menggumpal, sesuatu yang masih menjadi bahan penelitian."
    ],
    atmosfer: {
      teks: "Atmosfer Neptunus sekitar 80% hidrogen, 19% helium, dan 1,5% metana. Metana menyerap cahaya merah sehingga planet ini tampak biru, dan warnanya lebih pekat daripada Uranus karena lapisan kabutnya lebih tipis. Awan cirrus putih dari es metana sering tampak melintas. Bintik Gelap Besar yang difoto Voyager 2 pada 1989 sudah hilang saat dipantau Hubble pada 1994; badai gelap baru muncul dan lenyap dalam hitungan tahun.",
      judul: "Perkiraan komposisi atmosfer",
      komposisi: [
        { n: "Hidrogen", v: 80 },
        { n: "Helium", v: 19 },
        { n: "Metana", v: 1.5 }
      ]
    },
    bulan: {
      teks: "Neptunus memiliki 16 bulan yang diketahui (dua bulan baru diumumkan pada 2024).",
      daftar: [
        { n: "Triton", i: "Bulan terbesar (±2.707 km). Mengorbit berlawanan arah rotasi Neptunus, tanda bahwa ia mungkin tangkapan dari Sabuk Kuiper. Ada geyser nitrogen dan suhu permukaan sekitar −235 °C." },
        { n: "Proteus", i: "Bulan terbesar kedua, tak beraturan dan gelap, ±420 km." },
        { n: "Nereid", i: "Memiliki orbit sangat lonjong, salah satu yang paling ekstrem di Tata Surya." }
      ]
    },
    misi: [
      { tahun: "1846", nama: "Penemuan Neptunus", ket: "Johann Galle mengamatinya di Berlin berdasarkan perhitungan Urbain Le Verrier." },
      { tahun: "1989", nama: "Voyager 2 (NASA)", ket: "Terbang lintas pada 25 Agustus 1989, satu-satunya kunjungan wahana. Menemukan enam bulan baru, cincin, Bintik Gelap Besar, dan geyser di Triton." },
      { tahun: "1994–kini", nama: "Hubble dan James Webb", ket: "Memantau badai dan cincin. Citra Webb pada 2022 memperlihatkan cincin Neptunus paling jelas dalam 30 tahun." },
      { tahun: "Mendatang", nama: "Belum ada misi terjadwal", ket: "Berbagai konsep orbiter ke Neptunus dan Triton masih diusulkan." }
    ],
    fakta: [
      "Neptunus ditemukan lewat matematika sebelum dilihat teleskop.",
      "Sejak ditemukan pada 1846, Neptunus baru menyelesaikan satu orbit penuh, yaitu pada 2011.",
      "Angin di Neptunus bisa mencapai ±2.000 km/jam, lebih cepat daripada kecepatan suara di Bumi.",
      "Triton mengorbit ke arah berlawanan dengan rotasi planetnya, dan perlahan-lahan mendekat."
    ],
    kilat: [
      "Angin Neptunus mencapai ±2.000 km/jam.",
      "Neptunus ditemukan lewat perhitungan matematika pada 1846.",
      "Satu tahun Neptunus sama dengan 164,8 tahun Bumi.",
      "Triton mengorbit berlawanan arah dengan rotasi Neptunus."
    ]
  }
];

/* Konten kartu ‘Selain planet’ */
window.EXTRAS = [
  { ikon: "☀", judul: "Matahari", teaser: "Bintang tempat semuanya berputar",
    isi: "Bintang katai kuning dengan diameter 1,39 juta km (109 kali Bumi). Ia menyumbang 99,86% massa Tata Surya. Suhu intinya sekitar 15 juta °C dan permukaannya ±5.500 °C. Usianya 4,6 miliar tahun, dan dalam ±5 miliar tahun ia akan membengkak menjadi raksasa merah." },
  { ikon: "☄", judul: "Sabuk asteroid", teaser: "Puing-puing antara Mars dan Jupiter",
    isi: "Jutaan batuan sisa pembentukan Tata Surya mengorbit di antara Mars dan Jupiter. Jika semuanya digabung, massanya hanya sekitar 3–4% massa Bulan. Benda terbesarnya, Ceres (±940 km), tergolong planet kerdil." },
  { ikon: "◐", judul: "Planet kerdil", teaser: "Kenapa Pluto bukan lagi planet?",
    isi: "Pada 2006 IAU menetapkan planet harus mengorbit Matahari, cukup masif untuk berbentuk bulat, dan telah ‘membersihkan’ orbitnya. Pluto belum memenuhi syarat terakhir sehingga menjadi planet kerdil, bersama Ceres, Eris, Haumea, dan Makemake. Pluto dikunjungi wahana New Horizons pada 2015." },
  { ikon: "❄", judul: "Sabuk Kuiper", teaser: "Cakram es di balik Neptunus",
    isi: "Wilayah berbentuk cakram pada jarak 30–50 kali jarak Bumi–Matahari, berisi benda-benda es termasuk Pluto. New Horizons melintasi Arrokoth, benda Sabuk Kuiper berbentuk seperti manusia salju, pada 1 Januari 2019." },
  { ikon: "◌", judul: "Awan Oort", teaser: "Batas terjauh yang masih teoretis",
    isi: "Selubung bola raksasa berisi benda-benda es yang diperkirakan membentang ribuan hingga puluhan ribu kali jarak Bumi–Matahari. Diduga jadi asal komet periode panjang. Voyager 1 butuh sekitar 300 tahun untuk mencapai tepi dalamnya." },
  { ikon: "✦", judul: "Komet", teaser: "Bola salju kotor yang berekor",
    isi: "Gumpalan es dan debu. Saat mendekati Matahari, esnya menguap dan membentuk koma serta ekor yang selalu menjauhi Matahari. Komet Halley kembali setiap ±76 tahun; penampakan terakhirnya 1986 dan berikutnya sekitar 2061." },
  { ikon: "✧", judul: "Eksoplanet", teaser: "Planet di bintang lain",
    isi: "Planet di luar Tata Surya. Lebih dari 6.000 telah dikonfirmasi, banyak ditemukan oleh teleskop Kepler dan TESS. 51 Pegasi b (1995) adalah yang pertama ditemukan mengorbit bintang mirip Matahari. Sistem TRAPPIST-1 punya tujuh planet berbatu, tiga di antaranya di zona layak huni." }
];
