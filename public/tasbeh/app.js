// REGISTER SERVICE WORKER FOR PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('FiveTimes SW Registered'))
      .catch(err => console.log('SW Registration failed', err));
  });
}

// ----------------------------------------
// SETTINGS & FONT SCALING
// ----------------------------------------
const fontSlider = document.getElementById('font-size-slider');
const fontValSpan = document.getElementById('font-size-val');

function applyFontScale(scale) {
  document.documentElement.style.setProperty('--font-scale', scale);
  if (fontValSpan) fontValSpan.textContent = Math.round(scale * 100) + '%';
  localStorage.setItem('fivetimes-font-scale', scale);
}

// Init font scale
const savedScale = localStorage.getItem('fivetimes-font-scale') || 1.1;
if (fontSlider) {
  fontSlider.value = savedScale;
  applyFontScale(savedScale);
  fontSlider.addEventListener('input', (e) => {
    applyFontScale(e.target.value);
  });
}

// ----------------------------------------
// NAVIGATION & TAB LOGIC
// ----------------------------------------
const navItems = document.querySelectorAll('.nav-item');
const viewSections = document.querySelectorAll('.view-section');
const appTitle = document.getElementById('app-title');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    
    const target = item.getAttribute('data-target');
    viewSections.forEach(sec => sec.classList.remove('active'));
    const targetSection = document.getElementById(`section-${target}`);
    if (targetSection) targetSection.classList.add('active');
    
    const titles = {
      'tasbeh': 'FiveTimes',
      'qibla': 'Arah Kiblat',
      'jadwal': 'Waktu Shalat',
      'doa': 'Do\'a & Surah',
      'settings': 'Setelan'
    };
    if (appTitle) appTitle.textContent = titles[target] || 'FiveTimes';
    
    const floatBtn = document.getElementById('floating-tasbeh');
    if (floatBtn) {
      if (target === 'tasbeh') floatBtn.classList.add('hidden');
      else floatBtn.classList.remove('hidden');
    }

    if (target === 'jadwal') setTimeout(updateInfinityClock, 50);
  });
});

// SUB-TABS (Jadwal vs Panduan)
const sectionTabs = document.querySelectorAll('.section-tab-btn');
const subviews = document.querySelectorAll('.subview');

sectionTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    sectionTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    const target = tab.getAttribute('data-tab');
    subviews.forEach(v => v.classList.remove('active'));
    document.getElementById(`subview-${target}`).classList.add('active');
    
    if (target === 'jadwal-main') setTimeout(updateInfinityClock, 50);
  });
});

// GUIDE TABS (Wudhu vs Shalat)
function initGuideTabs() {
  const guideTabs = document.querySelectorAll('.guide-tab-btn');
  guideTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      guideTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderGuideContent(tab.getAttribute('data-guide'));
    });
  });
}

// ----------------------------------------
// DATA CONTENT: NIAT & DOA
// ----------------------------------------
const niatData = {
  'Subuh': {
    arabic: "أُصَلِّيْ فَرْضَ الصُّبْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى",
    latin: "Ushallii fardhash-shubhi rak'ataini mustaqbilal qiblati adaa-an lillaahi ta'aalaa.",
    translate: "Niat Shalat Subuh"
  },
  'Dzuhur': {
    arabic: "أُصَلِّيْ فَرْضَ الظُّهْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى",
    latin: "Ushallii fardhazh-zhuhri arba'a raka'aatini mustaqbilal qiblati adaa-an lillaahi ta'aalaa.",
    translate: "Niat Shalat Dzuhur"
  },
  'Ashar': {
    arabic: "أُصَلِّيْ فَرْضَ الْعَصْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى",
    latin: "Ushallii fardhal 'ashri arba'a raka'aatini mustaqbilal qiblati adaa-an lillaahi ta'aalaa.",
    translate: "Niat Shalat Ashar"
  },
  'Maghrib': {
    arabic: "أُصَلِّيْ فَرْضَ الْمَغْرِبِ ثَلَاثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى",
    latin: "Ushallii fardhal maghribi tsalaatha raka'aatini mustaqbilal qiblati adaa-an lillaahi ta'aalaa.",
    translate: "Niat Shalat Maghrib"
  },
  'Isya': {
    arabic: "أُصَلِّيْ فَرْضَ الْعِشَاءِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى",
    latin: "Ushallii fardhal 'isyaa-i arba'a raka'aatini mustaqbilal qiblati adaa-an lillaahi ta'aalaa.",
    translate: "Niat Shalat Isya"
  }
};

const doaListData = [
  // --- DOA PILIHAN ---
  { type: "doa", category: "Keseharian", title: "Sapu Jagat", arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", latin: "Rabbana atina...", translate: "Kebaikan Dunia & Akhirat" },
  { type: "doa", category: "Keseharian", title: "Kedua Orang Tua", arabic: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا", latin: "Rabbighfirli...", translate: "Mohon Ampunan Orang Tua" },
  { type: "doa", category: "Ibadah", title: "Niat Wudhu", arabic: "نَوَيْتُ الْوُضُوءَ لِرَفْعِ الْحَدَثِ الْأَصْغَرِ فَرْضًا لِلَّهِ تَعَالَى", latin: "Nawaitul wudhuu-a...", translate: "Menghilangkan Hadas Kecil" },
  { type: "doa", category: "Keseharian", title: "Penerang Hati", arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي", latin: "Rabbisyrahli...", translate: "Kemudahan Urusan" },
  
  // --- SURAT PENDEK ---
  { type: "surah", category: "Juz 30", title: "QS. Al-Fatihah", arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ... صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ", latin: "Bismillahir-rahman...", translate: "Pembukaan" },
  { type: "surah", category: "Juz 30", title: "QS. An-Nas", arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ... مِنَ الْجِنَّةِ وَالنَّاسِ", latin: "Qul a'udzu birabbin-nas...", translate: "Manusia" },
  { type: "surah", category: "Juz 30", title: "QS. Al-Falaq", arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ... وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ", latin: "Qul a'uudzu birabbil-falaq...", translate: "Waktu Subuh" },
  { type: "surah", category: "Juz 30", title: "QS. Al-Ikhlas", arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ... وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ", latin: "Qul huwallahu ahad...", translate: "Memurnikan Keesaan Allah" },
  { type: "surah", category: "Juz 30", title: "QS. Al-Lahab", arabic: "تَبَّتْ يَدَا أَبِي لَهَبٍ... فِي جِيدِهَا حَبْلٌ مِنْ مَسَدٍ", latin: "Tabbat yadaa...", translate: "Gejolak Api" },
  { type: "surah", category: "Juz 30", title: "QS. An-Nasr", arabic: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ... إِنَّهُ كَانَ تَوَّابًا", latin: "Idzaa jaa'a...", translate: "Pertolongan" },
  { type: "surah", category: "Juz 30", title: "QS. Al-Kafirun", arabic: "قُلْ يَا أَيُّهَا الْكَافِرُونَ... لَكُمْ دِينُكُمْ وَلِيَ دِينِ", latin: "Qul yaa ayyuhal...", translate: "Orang-orang Kafir" },
  { type: "surah", category: "Juz 30", title: "QS. Al-Kautsar", arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْتْسَرَ... إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", latin: "Innaa a'thainaaka...", translate: "Nikmat yang Banyak" },
  { type: "surah", category: "Juz 30", title: "QS. Al-Ma'un", arabic: "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ... وَيَمْنَعُونَ الْمَاعُونَ", latin: "Ara'aitalladzii...", translate: "Barang-barang Berguna" },
  { type: "surah", category: "Juz 30", title: "QS. Quraisy", arabic: "لِإِيلَافِ قُرَيْشٍ... وَآمَنَهُمْ مِنْ خَوْفٍ", latin: "Li-iilaafi quraisyin...", translate: "Suku Quraisy" },
  { type: "surah", category: "Juz 30", title: "QS. Al-Fil", arabic: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ... فَجَعELAHUM KA'ASFIN MA'KUL", latin: "Alam tara kaifa...", translate: "Gajah" },
  { type: "surah", category: "Juz 30", title: "QS. Al-Humazah", arabic: "وَيْلٌ لِكُلِّ هُمَزَةٍ لُمَزَةٍ... فِي عَمَدٍ مُمَدَّدَةٍ", latin: "Wailul likulli...", translate: "Pengumpat" },
  { type: "surah", category: "Juz 30", title: "QS. Al-Asr", arabic: "وَالْعَصْرِ... وَتَوَاصَوْا بِالصَّبْرِ", latin: "Wal 'ashr...", translate: "Masa/Waktu" },
  { type: "surah", category: "Juz 30", title: "QS. At-Takatsur", arabic: "أَلْهَاكُمُ التَّكَاثُرُ... ثُمَّ لَتُسْأَلُنَّ يَوْمَئِذٍ عَنِ النَّعِيمِ", latin: "Alhaakumut-takaatsur...", translate: "Bermegah-megahan" },
  { type: "surah", category: "Juz 30", title: "QS. Al-Qari'ah", arabic: "الْقَارِعَةُ... نَارٌ حَامِيَةٌ", latin: "Al-qari'ah...", translate: "Hari Kiamat" }
];

function renderDoaList() {
  const container = document.getElementById('doa-list');
  if (!container) return;
  const activeBtn = document.querySelector('.subtab-btn.active');
  if (!activeBtn) return;
  const activeType = activeBtn.getAttribute('data-doatype');
  container.innerHTML = '';
  doaListData.filter(d => d.type === activeType).forEach(doa => {
    let card = document.createElement('div');
    card.className = 'doa-card';
    card.innerHTML = `<div class="doa-category">${doa.category}</div><div class="doa-title">${doa.title}</div><div class="doa-arabic">${doa.arabic}</div><div class="doa-translate">${doa.translate}</div>`;
    container.appendChild(card);
  });
}

// ----------------------------------------
// TASBEH LOGIC
// ----------------------------------------
const btnTap = document.getElementById('btn-tap');
const btnReset = document.getElementById('btn-reset');
const countDisplay = document.getElementById('tasbeh-count');
const ringProgress = document.getElementById('ring-progress');

const MAX_COUNT = 33;
const CIRCUMFERENCE = 565.48;
let currentCount = localStorage.getItem('tasbehCount') ? parseInt(localStorage.getItem('tasbehCount')) : 0;

function updateTasbehUI() {
  let displayNum = currentCount % MAX_COUNT;
  let cycle = Math.floor(currentCount / MAX_COUNT);
  if (currentCount > 0 && displayNum === 0) { displayNum = MAX_COUNT; cycle--; }
  
  if (countDisplay) countDisplay.textContent = displayNum;
  document.getElementById('floating-count').textContent = displayNum;
  document.getElementById('tasbeh-cycle').textContent = `Putaran: ${cycle}`;
  document.getElementById('floating-cycle').textContent = cycle;
  document.getElementById('tasbeh-total').textContent = `Total: ${currentCount}`;
  
  if (ringProgress) {
    const offset = CIRCUMFERENCE - (displayNum / MAX_COUNT) * CIRCUMFERENCE;
    ringProgress.style.strokeDashoffset = offset;
  }
}

function incrementTasbeh() {
  currentCount++;
  localStorage.setItem('tasbehCount', currentCount);
  updateTasbehUI();
  if (navigator.vibrate) navigator.vibrate(currentCount % 33 === 0 ? [100, 50, 100] : 40);
}

if (btnTap) btnTap.addEventListener('click', incrementTasbeh);
if (btnReset) btnReset.addEventListener('click', () => { if(confirm("Reset?")){ currentCount=0; updateTasbehUI(); } });

// ----------------------------------------
// INFINITY CLOCK & PRAYER TIMES
// ----------------------------------------
const infinityPath = document.querySelector('.infinity-path-bg');
const timeIndicator = document.getElementById('time-indicator');
const infinityProgress = document.getElementById('infinity-progress');
const prayerNodesGroup = document.getElementById('prayer-nodes');
let prayerTimesData = null;

function updateInfinityClock() {
  if (!infinityPath || infinityPath.offsetParent === null) return;
  const totalLength = infinityPath.getTotalLength();
  const now = new Date();
  const t = (now.getHours() + now.getMinutes()/60) / 24;
  const point = infinityPath.getPointAtLength(t * totalLength);
  
  if (timeIndicator) { timeIndicator.setAttribute('cx', point.x); timeIndicator.setAttribute('cy', point.y); }
  if (infinityProgress) { infinityProgress.style.strokeDasharray = totalLength; infinityProgress.style.strokeDashoffset = totalLength - (t * totalLength); }

  if (prayerTimesData) {
    prayerNodesGroup.innerHTML = '';
    Object.entries(prayerTimesData).forEach(([name, time]) => {
      const [h, m] = time.split(':').map(Number);
      const pt = (h + m/60) / 24;
      const pPoint = infinityPath.getPointAtLength(pt * totalLength);
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute('cx', pPoint.x); circle.setAttribute('cy', pPoint.y);
      circle.setAttribute('r', '3'); circle.classList.add('prayer-node');
      prayerNodesGroup.appendChild(circle);
    });
  }
}

function fetchPrayerTimes(lat, lng) {
  const ts = Math.floor(Date.now() / 1000);
  fetch(`https://api.aladhan.com/v1/timings/${ts}?latitude=${lat}&longitude=${lng}&method=20`)
    .then(r => r.json()).then(data => {
      const t = data.data.timings;
      prayerTimesData = { 'Subuh': t.Fajr, 'Dzuhur': t.Dhuhr, 'Ashar': t.Asr, 'Maghrib': t.Maghrib, 'Isya': t.Isha };
      document.getElementById('location-name').textContent = `Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`;
      document.getElementById('hijri-date').textContent = `${data.data.date.hijri.day} ${data.data.date.hijri.month.en} ${data.data.date.hijri.year} H`;
      renderPrayerList();
      startCountdown();
      updateInfinityClock();
    });
}

function renderPrayerList() {
  const list = document.getElementById('prayer-list');
  list.innerHTML = '';
  Object.entries(prayerTimesData).forEach(([name, time]) => {
    list.innerHTML += `<li class="prayer-item">${name} <span>${time}</span></li>`;
  });
}

function startCountdown() {
  setInterval(() => {
    if (!prayerTimesData) return;
    const now = new Date();
    const curM = now.getHours() * 60 + now.getMinutes();
    let next = null;

    for (const [name, time] of Object.entries(prayerTimesData)) {
      const [h, m] = time.split(':').map(Number);
      if (h * 60 + m > curM) { next = { name, h, m }; break; }
    }
    
    if (!next) next = { name: "Subuh", h: 4, m: 30 }; // Simplified
    
    document.getElementById('next-prayer-name').textContent = next.name;
    const clean = next.name.split(' ')[0];
    if (niatData[clean]) {
      document.getElementById('niat-arabic').textContent = niatData[clean].arabic;
      document.getElementById('niat-latin').textContent = niatData[clean].latin;
      document.getElementById('niat-translate').textContent = niatData[clean].translate;
      document.getElementById('contextual-niat').classList.remove('hidden');
    }
    updateInfinityClock();
  }, 1000);
}

function initQibla() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      fetchPrayerTimes(pos.coords.latitude, pos.coords.longitude);
    });
  }
}

function renderGuideContent(type) {
  const content = document.getElementById('guide-content');
  if (type === 'wudhu') content.innerHTML = `<div class="doa-card"><div class="doa-title">Niat Wudhu</div><div class="doa-arabic">نَوَيْتُ الْوُضُوءَ...</div></div>`;
  else content.innerHTML = `<div class="doa-card"><div class="doa-title">Rukun Shalat</div></div>`;
}

// INIT
initQibla();
updateTasbehUI();
renderDoaList();
renderGuideContent('wudhu');
initGuideTabs();
setInterval(updateInfinityClock, 60000);
document.querySelectorAll('.subtab-btn').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.subtab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); renderDoaList();
}));
