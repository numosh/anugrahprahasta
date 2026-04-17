// REGISTER SERVICE WORKER FOR PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('SW Registered'))
      .catch(err => console.log('SW Registration failed', err));
  });
}

// ----------------------------------------
// NAVIGATION LOGIC
// ----------------------------------------
const navItems = document.querySelectorAll('.nav-item');
const viewSections = document.querySelectorAll('.view-section');
const appTitle = document.getElementById('app-title');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    // Update active nav
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    
    // Update active section
    const target = item.getAttribute('data-target');
    viewSections.forEach(sec => sec.classList.remove('active'));
    document.getElementById(`section-${target}`).classList.add('active');
    
    // Update header title
    const titles = {
      'tasbeh': 'Tasbeh',
      'qibla': 'Arah Kiblat',
      'jadwal': 'Jadwal Shalat',
      'doa': 'Do\'a Pilihan'
    };
    appTitle.textContent = titles[target];
    
    // Manage floating tasbeh visibility
    const floatBtn = document.getElementById('floating-tasbeh');
    if (target === 'tasbeh') {
      floatBtn.classList.add('hidden');
    } else {
      floatBtn.classList.remove('hidden');
    }
  });
});


// ----------------------------------------
// FLOATING TASBEH LOGIC
// ----------------------------------------
const floatingTasbeh = document.getElementById('floating-tasbeh');
let isDragging = false;
let dragMoved = false;
let initialX, initialY;

floatingTasbeh.addEventListener('touchstart', dragStart, {passive: false});
floatingTasbeh.addEventListener('touchmove', drag, {passive: false});
floatingTasbeh.addEventListener('touchend', dragEnd);

floatingTasbeh.addEventListener('mousedown', dragStart);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', dragEnd);

floatingTasbeh.addEventListener('click', (e) => {
  if (dragMoved) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  incrementTasbeh();
});

function dragStart(e) {
  isDragging = true;
  dragMoved = false;
  if (e.type === 'touchstart') {
    initialX = e.touches[0].clientX - floatingTasbeh.getBoundingClientRect().left;
    initialY = e.touches[0].clientY - floatingTasbeh.getBoundingClientRect().top;
  } else {
    initialX = e.clientX - floatingTasbeh.getBoundingClientRect().left;
    initialY = e.clientY - floatingTasbeh.getBoundingClientRect().top;
  }
  floatingTasbeh.style.transition = 'none';
}

function drag(e) {
  if (!isDragging) return;
  dragMoved = true;
  if (e.type === 'touchmove') {
    e.preventDefault();
  }
  
  let currentX, currentY;
  if (e.type === 'touchmove') {
    currentX = e.touches[0].clientX - initialX;
    currentY = e.touches[0].clientY - initialY;
  } else {
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;
  }
  
  const maxX = window.innerWidth - 65;
  const maxY = window.innerHeight - 85;
  
  currentX = Math.max(0, Math.min(currentX, maxX));
  currentY = Math.max(0, Math.min(currentY, maxY));

  floatingTasbeh.style.left = currentX + 'px';
  floatingTasbeh.style.top = currentY + 'px';
  floatingTasbeh.style.bottom = 'auto';
  floatingTasbeh.style.right = 'auto';
}

function dragEnd(e) {
  if (!isDragging) return;
  isDragging = false;
  floatingTasbeh.style.transition = 'transform 0.1s, opacity 0.3s';
}

// ----------------------------------------
// TASBEH LOGIC
// ----------------------------------------
const btnTap = document.getElementById('btn-tap');
const btnReset = document.getElementById('btn-reset');
const countDisplay = document.getElementById('tasbeh-count');
const cycleDisplay = document.getElementById('tasbeh-cycle');
const totalDisplay = document.getElementById('tasbeh-total');
const ringProgress = document.getElementById('ring-progress');
const rippleContainer = document.getElementById('ripple-container');

const MAX_COUNT = 33;
const CIRCUMFERENCE = 565.48; // 2 * PI * 90

let currentCount = localStorage.getItem('tasbehCount') ? parseInt(localStorage.getItem('tasbehCount')) : 0;

function updateTasbehUI() {
  let displayNum = currentCount % MAX_COUNT;
  let cycle = Math.floor(currentCount / MAX_COUNT);
  
  if (currentCount > 0 && displayNum === 0) {
    displayNum = MAX_COUNT;
    cycle = cycle - 1;
  }
  
  countDisplay.textContent = displayNum;
  document.getElementById('floating-count').textContent = displayNum;
  cycleDisplay.textContent = `Putaran: ${cycle}`;
  document.getElementById('floating-cycle').textContent = cycle;
  totalDisplay.textContent = `Total: ${currentCount}`;
  
  const offset = CIRCUMFERENCE - (displayNum / MAX_COUNT) * CIRCUMFERENCE;
  ringProgress.style.strokeDashoffset = offset;
  
  if (displayNum === MAX_COUNT) {
    ringProgress.classList.add('glow-active');
  } else {
    ringProgress.classList.remove('glow-active');
  }
}

function triggerHaptic() {
  if (navigator.vibrate) {
    // Pattern alert on multiple of 33
    if (currentCount > 0 && currentCount % MAX_COUNT === 0) {
      navigator.vibrate([100, 50, 100]); 
    } else {
      navigator.vibrate(40); 
    }
  }
}

function createRipple() {
  const ripple = document.createElement('div');
  ripple.classList.add('ripple');
  rippleContainer.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

function incrementTasbeh() {
  currentCount++;
  localStorage.setItem('tasbehCount', currentCount);
  updateTasbehUI();
  triggerHaptic();
  
  if (document.getElementById('section-tasbeh').classList.contains('active')) {
    createRipple();
  }
}

btnTap.addEventListener('click', incrementTasbeh);

btnReset.addEventListener('click', (e) => {
  e.stopPropagation(); 
  if (confirm("Reset penghitung tasbeh?")) {
    currentCount = 0;
    localStorage.setItem('tasbehCount', currentCount);
    updateTasbehUI();
  }
});


// ----------------------------------------
// QIBLA LOGIC (Using GPS & Device Orientation)
// ----------------------------------------
const qiblaStatus = document.getElementById('qibla-status');
const btnCalibrate = document.getElementById('btn-calibrate');
const compassNeedle = document.getElementById('compass-needle');

const kaabaLat = 21.422487;
const kaabaLng = 39.826206;

let userLat = null;
let userLng = null;
let qiblaAzimuth = null;

function getQiblaBearing(lat, lng) {
  const phiK = kaabaLat * Math.PI / 180.0;
  const lambdaK = kaabaLng * Math.PI / 180.0;
  const phi = lat * Math.PI / 180.0;
  const lambda = lng * Math.PI / 180.0;

  const y = Math.sin(lambdaK - lambda);
  const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);
  
  let qibla = Math.atan2(y, x) * 180.0 / Math.PI;
  return (qibla + 360) % 360;
}

function initQibla() {
  if (!navigator.geolocation) {
    qiblaStatus.textContent = "Geolokasi tidak didukung.";
    return;
  }
  
  navigator.geolocation.getCurrentPosition(pos => {
    userLat = pos.coords.latitude;
    userLng = pos.coords.longitude;
    qiblaAzimuth = getQiblaBearing(userLat, userLng);
    qiblaStatus.innerHTML = `GPS Terkunci.<br>Kiblat berada pada ${Math.round(qiblaAzimuth)}°`;
    fetchPrayerTimes(userLat, userLng);
    initCompass();
  }, err => {
    qiblaStatus.textContent = "Gagal lokasi. Izinkan GPS.";
  });
}

function initCompass() {
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    qiblaStatus.textContent = "Akses kompas diperlukan.";
    btnCalibrate.style.display = 'block';
  } else {
    window.addEventListener("deviceorientationabsolute", handleOrientation, true);
    window.addEventListener("deviceorientation", handleOrientation, true);
  }
}

btnCalibrate.addEventListener('click', () => {
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(response => {
        if (response === 'granted') {
          window.addEventListener("deviceorientation", handleOrientation, true);
          btnCalibrate.style.display = 'none';
        }
      });
  }
});

function handleOrientation(event) {
  if (qiblaAzimuth === null) return;
  let compass = event.webkitCompassHeading || Math.abs(event.alpha - 360);
  if (compass != null) {
    let needleAngle = qiblaAzimuth - compass;
    compassNeedle.style.transform = `rotate(${needleAngle}deg)`;
  }
}

// ----------------------------------------
// JADWAL SHALAT LOGIC (Aladhan API)
// ----------------------------------------
const locationName = document.getElementById('location-name');
const hijriDate = document.getElementById('hijri-date');
const prayerList = document.getElementById('prayer-list');

let currentPrayerTimes = null;
let currentPrayerNames = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];
let countdownInterval = null;

function fetchPrayerTimes(lat, lng) {
  const date = new Date();
  const timestamp = Math.floor(date.getTime() / 1000);
  const apiUrl = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lng}&method=20`;

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      const timings = data.data.timings;
      const hijri = data.data.date.hijri;
      locationName.textContent = `Koordinat: ${lat.toFixed(2)}, ${lng.toFixed(2)}`;
      hijriDate.textContent = `${hijri.day} ${hijri.month.en} ${hijri.year} H`;
      currentPrayerTimes = [timings['Fajr'], timings['Dhuhr'], timings['Asr'], timings['Maghrib'], timings['Isha']];
      prayerList.innerHTML = '';
      currentPrayerNames.forEach((name, idx) => {
        let li = document.createElement('li');
        li.className = 'prayer-item';
        li.innerHTML = `${name} <span>${currentPrayerTimes[idx]}</span>`;
        prayerList.appendChild(li);
      });
      startCountdown();
    })
    .catch(() => {
      locationName.textContent = "Offline";
    });
}

function startCountdown() {
  if (countdownInterval) clearInterval(countdownInterval);
  countdownTick();
  countdownInterval = setInterval(countdownTick, 1000);
}

function countdownTick() {
  if (!currentPrayerTimes) return;
  const now = new Date();
  let nextIdx = -1;
  let nextTime = null;
  const currentMins = now.getHours() * 60 + now.getMinutes();

  for (let i=0; i<currentPrayerTimes.length; i++) {
    let parts = currentPrayerTimes[i].split(':');
    let prayerMins = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    if (prayerMins > currentMins) {
      nextIdx = i;
      nextTime = new Date();
      nextTime.setHours(parseInt(parts[0]), parseInt(parts[1]), 0, 0);
      break;
    }
  }
  
  if (nextIdx === -1) {
    nextIdx = 0;
    let parts = currentPrayerTimes[0].split(':');
    nextTime = new Date();
    nextTime.setDate(nextTime.getDate() + 1);
    nextTime.setHours(parseInt(parts[0]), parseInt(parts[1]), 0, 0);
  }
  
  const diff = Math.max(0, nextTime.getTime() - now.getTime());
  const hrs = Math.floor(diff / 3600000);
  const mins = Math.floor((diff / 60000) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  
  document.getElementById('next-prayer-name').textContent = currentPrayerNames[nextIdx];
  document.getElementById('countdown-timer').textContent = `${hrs.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
}

// ----------------------------------------
// DOA PILIHAN LOGIC
// ----------------------------------------
const doaListData = [
  // --- DO'A PILIHAN ---
  {
    type: "doa",
    category: "Do'a Pendek",
    title: "Sapu Jagat (Dunia & Akhirat)",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    latin: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar",
    translate: "Ya Tuhan kami, berikanlah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka."
  },
  {
    type: "doa",
    category: "Do'a Pendek",
    title: "Mohon Ampunan (Nabi Adam)",
    arabic: "رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
    latin: "Rabbana dhalamna anfusana, wa in lam taghfir lana watarhamna lanakunanna minal khasirin",
    translate: "Ya Tuhan kami, kami telah menzalimi diri kami sendiri. Jika Engkau tidak mengampuni kami dan memberi rahmat kepada kami, niscaya kami termasuk orang-orang yang rugi."
  },
  {
    type: "doa",
    category: "Do'a Pendek",
    title: "Mohon Ampunan & Rahmat",
    arabic: "رَبِّ اغْفِرْ وَارْحَمْ وَأَنْتَ خَيْرُ الرَّاحِمِينَ",
    latin: "Rabbighfir warham wa anta khairur-rahimin",
    translate: "Ya Tuhanku, ampunilah dan berilah rahmat, Engkau adalah pemberi rahmat yang terbaik."
  },
  {
    type: "doa",
    category: "Do'a Pendek",
    title: "Tawakkal & Kecukupan",
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ ۝ نِعْمَ الْمَوْلَى وَنِعْمَ النَّصِيرُ",
    latin: "Hasbunallah wa ni'mal wakil, ni'mal mawla wa ni'man naseer",
    translate: "Cukuplah Allah menjadi Penolong kami, dan Allah adalah sebaik-baik Pelindung dan sebaik-baik Penolong."
  },
  {
    type: "doa",
    category: "Do'a Pendek",
    title: "Mohon Kelapangan (Nabi Musa)",
    arabic: "رَبِّ اشْرَحْ لِي صَدْرِي ۝ وَيَسِّرْ لِي أَمْرِي ۝ وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي ۝ يَفْقَهُوا قَوْلِي",
    latin: "Rabbish rahli sadri. Wa yassir li amri. Wahlul 'uqdatan min lisani. Yafqahu qawli.",
    translate: "Ya Tuhanku, lapangkanlah untukku dadaku. Dan mudahkanlah untukku urusanku. Dan lepaskanlah kekakuan dari lidahku. Supaya mereka mengerti perkataanku."
  },
  {
    type: "doa",
    category: "Do'a Pendek",
    title: "Penyesalan (Nabi Yunus)",
    arabic: "لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
    latin: "La ilaha illa anta, subhanaka inni kuntu minaz-zalimin",
    translate: "Tidak ada Tuhan (yang berhak disembah) selain Engkau. Maha Suci Engkau, sesungguhnya aku adalah orang yang zalim."
  },
  {
    type: "doa",
    category: "Do'a Pendek",
    title: "Ketenangan & Ketetapan Iman",
    arabic: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ",
    latin: "Ya muqallibal quluub, tsabbit qalbi 'ala diinik",
    translate: "Wahai Dzat yang membolak-balikkan hati, teguhkanlah hatiku di atas agama-Mu."
  },
  {
    type: "doa",
    category: "Do'a Pendek",
    title: "Tolak Bala & Kejahatan",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    latin: "Bismillahilladzi la yadhurru ma'asmihi syai'un fil ardhi wa laa fis-samaa'i wahuwas-samii'ul 'aliim",
    translate: "Dengan menyebut nama Allah yang dengan nama-Nya tidak ada satupun yang membahayakan di bumi maupun di langit. Dan Dialah Yang Maha Mendengar lagi Maha Mengetahui."
  },
  {
    type: "doa",
    category: "Do'a Khusus",
    title: "Terhindar dari Penyakit",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْبَرَصِ وَالْجُنُONĪ WAL JUDZĀMĪ WA MIN SAYYI'IL ASQĀM",
    latin: "Allahumma inni a'udzu bika minal barashi wal jununi wal judzami wa min sayyi'il asqami",
    translate: "Ya Allah, aku berlindung kepada-Mu dari penyakit kulit, gila, kusta, dan dari segala penyakit yang buruk."
  },

  // --- SURAT PENDEK ---
  {
    type: "surah",
    category: "Surah Pendek",
    title: "QS. Al-Fatihah",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْMِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    latin: "Bismillahir-rahmanir-rahim. Alhamdu lillahi rabbil-'alamin. Ar-rahmanir-rahim. Maliki yawmid-din. Iyyaka na'budu wa iyyaka nasta'in. Ihdinas-siratal-mustaqim. Siratal-ladzina an'amta 'alayhim ghayril-maghdhubi 'alayhim wa lad-dallin.",
    translate: "Al-Fatihah (Pembukaan)"
  },
  {
    type: "surah",
    category: "Surah Pendek",
    title: "QS. Al-Humazah",
    arabic: "وَيْلٌ لِّكُلِّ هُمَزَةٍ لُّمَزَةٍ ۝ الَّذِي جَمَعَ مَالًا وَعَدَّدَهُ...",
    latin: "Wailul-likulli humazatil-lumazah...",
    translate: "Pengumpat"
  },
  {
    type: "surah",
    category: "Surah Pendek",
    title: "QS. Al-Fil",
    arabic: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ...",
    latin: "Alam tara kaifa fa'ala rabbuka...",
    translate: "Gajah"
  },
  {
    type: "surah",
    category: "Surah Pendek",
    title: "QS. Al-Lahab",
    arabic: "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ...",
    latin: "Tabbat yadaa abii lahabiw-watabb...",
    translate: "Gejolak Api"
  },
  {
    type: "surah",
    category: "Surah Pendek",
    title: "QS. Al-Ikhlas",
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ...",
    latin: "Qul huwallahu ahad...",
    translate: "Memurnikan Keesaan Allah"
  },
  {
    type: "surah",
    category: "Surah Pendek",
    title: "QS. Al-Falaq",
    arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ...",
    latin: "Qul a'uudzu birabbil falaq...",
    translate: "Waktu Subuh"
  },
  {
    type: "surah",
    category: "Surah Pendek",
    title: "QS. An-Nas",
    arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ...",
    latin: "Qul a'udzu birabbin-nas...",
    translate: "Manusia"
  }
];

let activeDoaType = 'doa';

function renderDoaList() {
  const doaListEl = document.getElementById('doa-list');
  doaListEl.innerHTML = ''; 
  const filteredData = doaListData.filter(item => item.type === activeDoaType);
  filteredData.forEach(doa => {
    const card = document.createElement('div');
    card.className = 'doa-card';
    card.innerHTML = `
      <div class="doa-category">${doa.category}</div>
      <div class="doa-title">${doa.title}</div>
      <div class="doa-arabic">${doa.arabic}</div>
      <div class="doa-latin">${doa.latin}</div>
      <div class="doa-translate">"${doa.translate}"</div>
    `;
    doaListEl.appendChild(card);
  });
}

function initDoa() {
  const subtabs = document.querySelectorAll('.subtab-btn');
  subtabs.forEach(tab => {
    tab.addEventListener('click', () => {
      subtabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeDoaType = tab.getAttribute('data-doatype');
      renderDoaList();
    });
  });
  renderDoaList();
}

// ADSENSE REALISM INIT
window.addEventListener('load', () => {
  try {
     (adsbygoogle = window.adsbygoogle || []).push({});
     console.log("AdSense Initialized");
  } catch(e) {}
});

// INITIALIZE APP
updateTasbehUI();
initQibla();
initDoa();
