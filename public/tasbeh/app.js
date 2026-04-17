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
  fontValSpan.textContent = Math.round(scale * 100) + '%';
  localStorage.setItem('fivetimes-font-scale', scale);
}

// Init font scale
const savedScale = localStorage.getItem('fivetimes-font-scale') || 1.1;
fontSlider.value = savedScale;
applyFontScale(savedScale);

fontSlider.addEventListener('input', (e) => {
  applyFontScale(e.target.value);
});

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
    document.getElementById(`section-${target}`).classList.add('active');
    
    const titles = {
      'tasbeh': 'FiveTimes',
      'qibla': 'Arah Kiblat',
      'jadwal': 'Waktu Shalat',
      'doa': 'Do\'a & Surah',
      'settings': 'Setelan'
    };
    appTitle.textContent = titles[target];
    
    const floatBtn = document.getElementById('floating-tasbeh');
    if (target === 'tasbeh') floatBtn.classList.add('hidden');
    else floatBtn.classList.remove('hidden');
  });
});

// SUB-TABS IN JADWAL
const sectionTabs = document.querySelectorAll('.section-tab-btn');
const subviews = document.querySelectorAll('.subview');

sectionTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    sectionTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    const target = tab.getAttribute('data-tab');
    subviews.forEach(v => v.classList.remove('active'));
    document.getElementById(`subview-${target}`).classList.add('active');
  });
});

// GUIDE TABS
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
// TASBEH LOGIC (Core)
// ----------------------------------------
const btnTap = document.getElementById('btn-tap');
const btnReset = document.getElementById('btn-reset');
const countDisplay = document.getElementById('tasbeh-count');
const cycleDisplay = document.getElementById('tasbeh-cycle');
const totalDisplay = document.getElementById('tasbeh-total');
const ringProgress = document.getElementById('ring-progress');
const rippleContainer = document.getElementById('ripple-container');

const MAX_COUNT = 33;
const CIRCUMFERENCE = 565.48;

let currentCount = localStorage.getItem('tasbehCount') ? parseInt(localStorage.getItem('tasbehCount')) : 0;

function updateTasbehUI() {
  let displayNum = currentCount % MAX_COUNT;
  let cycle = Math.floor(currentCount / MAX_COUNT);
  if (currentCount > 0 && displayNum === 0) { displayNum = MAX_COUNT; cycle--; }
  
  countDisplay.textContent = displayNum;
  document.getElementById('floating-count').textContent = displayNum;
  cycleDisplay.textContent = `Putaran: ${cycle}`;
  document.getElementById('floating-cycle').textContent = cycle;
  totalDisplay.textContent = `Total: ${currentCount}`;
  
  const offset = CIRCUMFERENCE - (displayNum / MAX_COUNT) * CIRCUMFERENCE;
  ringProgress.style.strokeDashoffset = offset;
  if (displayNum === MAX_COUNT) ringProgress.classList.add('glow-active');
  else ringProgress.classList.remove('glow-active');
}

function triggerHaptic() {
  if (navigator.vibrate) {
    if (currentCount > 0 && currentCount % MAX_COUNT === 0) navigator.vibrate([100, 50, 100]); 
    else navigator.vibrate(40); 
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
  if (document.getElementById('section-tasbeh').classList.contains('active')) createRipple();
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
// INFINITY CLOCK & PRAYER LOGIC
// ----------------------------------------
const prayerNodesGroup = document.getElementById('prayer-nodes');
const timeIndicator = document.getElementById('time-indicator');
const infinityPath = document.querySelector('.infinity-path-bg');
const infinityProgress = document.getElementById('infinity-progress');

let prayerTimesData = null;

function updateInfinityClock() {
  if (!infinityPath) return;
  const now = new Date();
  const hours = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  const t = hours / 24; 
  
  const totalLength = infinityPath.getTotalLength();
  const currentPos = t * totalLength;
  const point = infinityPath.getPointAtLength(currentPos);
  
  if (timeIndicator) {
    timeIndicator.setAttribute('cx', point.x);
    timeIndicator.setAttribute('cy', point.y);
  }
  
  if (infinityProgress) {
    infinityProgress.style.strokeDasharray = totalLength;
    infinityProgress.style.strokeDashoffset = totalLength - currentPos;
  }

  // Render Nodes
  if (prayerTimesData) {
    prayerNodesGroup.innerHTML = '';
    Object.entries(prayerTimesData).forEach(([name, time]) => {
      const [h, m] = time.split(':').map(Number);
      const pt = (h + m/60) / 24;
      const pPoint = infinityPath.getPointAtLength(pt * totalLength);
      
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute('cx', pPoint.x);
      circle.setAttribute('cy', pPoint.y);
      circle.setAttribute('r', '3');
      circle.classList.add('prayer-node');
      prayerNodesGroup.appendChild(circle);
    });
  }
}

// ----------------------------------------
// JADWAL & NIAT SHALAT
// ----------------------------------------
const niatData = {
  'Subuh': {
    arabic: "أُصَلِّيْ فَرْضَ الصُّبْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً مَأْمُوْمًا لِلّٰهِ تَعَالَى",
    latin: "Ushallii fardhash-shubhi rak‘ataini mustaqbilal-qiblati adaa-an ma’muuman lillaahi ta‘aalaa.",
    translate: "Niat shalat fardu Subuh (2 rakaat)"
  },
  'Dzuhur': {
    arabic: "أُصَلِّيْ فَرْضَ الظُّهْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً مَأْمُوْمًا لِلّٰهِ تَعَالَى",
    latin: "Ushallii fardhazh-zhuhri arba‘a raka‘aatin mustaqbilal-qiblati adaa-an ma’muuman lillaahi ta‘aalaa.",
    translate: "Niat shalat fardu Zuhur (4 rakaat)"
  },
  'Ashar': {
    arabic: "أُصَلِّيْ فَرْضَ الْعَصْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً مَأْمُوْمًا لِلّٰهِ تَعَالَى",
    latin: "Ushallii fardhal-‘ashri arba‘a raka‘aatin mustaqbilal-qiblati adaa-an ma’muuman lillaahi ta‘aalaa.",
    translate: "Niat shalat fardu Ashar (4 rakaat)"
  },
  'Maghrib': {
    arabic: "أُصَلِّيْ فَرْضَ الْمَغْرِبِ ثَلَاثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً مَأْمُوْمًا لِلّٰهِ تَعَالَى",
    latin: "Ushallii fardhal-maghribi tsalaatha raka‘aatin mustaqbilal-qiblati adaa-an ma’muuman lillaahi ta‘aalaa.",
    translate: "Niat shalat fardu Maghrib (3 rakaat)"
  },
  'Isya': {
    arabic: "أُصَلِّيْ فَرْضَ الْعِشَاءِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً مَأْمُوْمًا لِلّٰهِ تَعَالَى",
    latin: "Ushallii fardhal-‘isyaa-i arba‘a raka‘aatin mustaqbilal-qiblati adaa-an ma’muuman lillaahi ta‘aalaa.",
    translate: "Niat shalat fardu Isya (4 rakaat)"
  }
};

function fetchPrayerTimes(lat, lng) {
  const timestamp = Math.floor(Date.now() / 1000);
  const apiUrl = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lng}&method=20`;

  fetch(apiUrl).then(res => res.json()).then(data => {
    const t = data.data.timings;
    prayerTimesData = { 'Subuh': t.Fajr, 'Sunrise': t.Sunrise, 'Dzuhur': t.Dhuhr, 'Ashar': t.Asr, 'Maghrib': t.Maghrib, 'Isya': t.Isha };
    document.getElementById('location-name').textContent = `Koordinat: ${lat.toFixed(2)}, ${lng.toFixed(2)}`;
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
    let li = document.createElement('li');
    li.className = 'prayer-item';
    li.innerHTML = `${name} <span>${time}</span>`;
    list.appendChild(li);
  });
}

function startCountdown() {
  setInterval(() => {
    const now = new Date();
    let nextName = '--';
    let nextDiff = '--:--:--';
    const currentMins = now.getHours() * 60 + now.getMinutes();

    for (const [name, time] of Object.entries(prayerTimesData)) {
      if (name === 'Sunrise') continue;
      const [h, m] = time.split(':').map(Number);
      const prayerMins = h * 60 + m;
      if (prayerMins > currentMins) {
        nextName = name;
        const diffMs = (prayerMins - currentMins) * 60 * 1000 - now.getSeconds() * 1000;
        const hrs = Math.floor(diffMs / 3600000);
        const mins = Math.floor((diffMs % 3600000) / 60000);
        const secs = Math.floor((diffMs % 60000) / 1000);
        nextDiff = `${hrs.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
        break;
      }
    }
    document.getElementById('next-prayer-name').textContent = nextName;
    document.getElementById('countdown-timer').textContent = nextDiff;
    
    const cleanName = nextName.split(' ')[0];
    if (niatData[cleanName]) {
      document.getElementById('niat-arabic').textContent = niatData[cleanName].arabic;
      document.getElementById('niat-latin').textContent = niatData[cleanName].latin;
      document.getElementById('niat-translate').textContent = niatData[cleanName].translate;
      document.getElementById('contextual-niat').classList.remove('hidden');
    } else {
      document.getElementById('contextual-niat').classList.add('hidden');
    }
    updateInfinityClock();
  }, 1000);
}

// ----------------------------------------
// QIBLA LOGIC
// ----------------------------------------
const compassNeedle = document.getElementById('compass-needle');
const qiblaStatus = document.getElementById('qibla-status');
let qiblaAzimuth = null;

function initQibla() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude: lat, longitude: lng } = pos.coords;
    const phiK = 21.422487 * Math.PI / 180.0;
    const lambdaK = 39.826206 * Math.PI / 180.0;
    const phi = lat * Math.PI / 180.0;
    const lambda = lng * Math.PI / 180.0;
    const y = Math.sin(lambdaK - lambda);
    const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);
    qiblaAzimuth = (Math.atan2(y, x) * 180.0 / Math.PI + 360) % 360;
    qiblaStatus.innerHTML = `GPS Terkunci.<br>Kiblat: ${Math.round(qiblaAzimuth)}°`;
    fetchPrayerTimes(lat, lng);
  });
}

window.addEventListener("deviceorientationabsolute", (e) => {
  if (qiblaAzimuth === null) return;
  let compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
  compassNeedle.style.transform = `rotate(${qiblaAzimuth - compass}deg)`;
}, true);

// ----------------------------------------
// GUIDES & DOA DATA
// ----------------------------------------
const guideContent = document.getElementById('guide-content');
function renderGuideContent(type) {
  if (type === 'wudhu') {
    guideContent.innerHTML = `<div class="doa-card"><div class="doa-title">Niat Wudhu</div><div class="doa-arabic">نَوَيْتُ الْوُضُوءَ لِرَفْعِ الْحَدَثِ الْأَصْغَرِ فَرْضًا لِلَّهِ تَعَالَى</div><div class="doa-latin">Nawaitul wudhuu-a liraf'il hadatsil ashghari fardhal lillaahi ta'aala.</div></div><div class="doa-card"><div class="doa-title">Langkah Wudhu</div><p class="doa-latin">Basmalah, Kumur, Hidung, Wajah, Tangan, Kepala, Telinga, Kaki.</p></div>`;
  } else {
    guideContent.innerHTML = `<div class="doa-card"><div class="doa-title">Urutan Shalat</div><p class="doa-latin">Takbir, Iftitah, Fatihah, Surat, Ruku, I'tidal, Sujud, Duduk, Tahiyat, Salam.</p></div>`;
  }
}

const doaListData = [
  { type: "doa", category: "Do'a Pendek", title: "Sapu Jagat", arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً...", latin: "Rabbana atina...", translate: "..." },
  { type: "doa", category: "Do'a Pendek", title: "Mohon Ampunan", arabic: "رَبَّنَا ظَلَمْنَا أَنفُسَنَا...", latin: "Rabbana dhalamna...", translate: "..." },
  { type: "surah", category: "Surat", title: "QS. Al-Fatihah", arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ...", latin: "Bismillahir-rahman...", translate: "..." },
  { type: "surah", category: "Surat", title: "QS. Al-Ikhlas", arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ...", latin: "Qul huwallahu ahad...", translate: "..." },
  { type: "surah", category: "Surat", title: "QS. Al-Falaq", arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ...", latin: "Qul a'uudzu birabbil...", translate: "..." },
  { type: "surah", category: "Surat", title: "QS. An-Nas", arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ...", latin: "Qul a'udzu birabbin-nas...", translate: "..." }
];

function renderDoaList() {
  const container = document.getElementById('doa-list');
  const activeType = document.querySelector('.subtab-btn.active').getAttribute('data-doatype');
  container.innerHTML = '';
  doaListData.filter(d => d.type === activeType).forEach(doa => {
    let card = document.createElement('div');
    card.className = 'doa-card';
    card.innerHTML = `<div class="doa-category">${doa.category}</div><div class="doa-title">${doa.title}</div><div class="doa-arabic">${doa.arabic}</div>`;
    container.appendChild(card);
  });
}

document.querySelectorAll('.subtab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.subtab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderDoaList();
  });
});

// INITIALIZE
initQibla();
updateTasbehUI();
renderDoaList();
renderGuideContent('wudhu');
initGuideTabs();
setInterval(updateInfinityClock, 60000);
setTimeout(updateInfinityClock, 1000);
