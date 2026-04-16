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

// Initial Render
updateTasbehUI();

function triggerHaptic() {
  if (navigator.vibrate) {
    if (currentCount > 0 && currentCount % MAX_COUNT === 0) {
      navigator.vibrate([100, 50, 100]); // Long vibration pattern indicating multiple of 33
    } else {
      navigator.vibrate(30); // Short vibration
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
  e.stopPropagation(); // Biar tidak trigger container misal bocor
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

// Kaaba Coordinates
const kaabaLat = 21.422487;
const kaabaLng = 39.826206;

let userLat = null;
let userLng = null;
let qiblaAzimuth = null;

// Calculate Qibla Bearing mathematically
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
    qiblaStatus.textContent = "Geolokasi tidak didukung di perangkat ini.";
    return;
  }
  
  qiblaStatus.textContent = "Mengambil Lokasi GPS...";
  
  navigator.geolocation.getCurrentPosition(pos => {
    userLat = pos.coords.latitude;
    userLng = pos.coords.longitude;
    qiblaAzimuth = getQiblaBearing(userLat, userLng);
    
    qiblaStatus.innerHTML = `GPS Terkunci.<br>Kiblat berada pada ${Math.round(qiblaAzimuth)}°`;
    
    // Automatically initialize prayer times using found lat/lng
    fetchPrayerTimes(userLat, userLng);
    
    // Start Compass listening
    initCompass();
  }, err => {
    qiblaStatus.textContent = "Gagal mendapatkan lokasi. Izinkan akses GPS.";
  });
}

function initCompass() {
  // Check if iOS 13+ DeviceOrientationEvent needs permission
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    qiblaStatus.textContent = "Ketuk Kalibrasi untuk akses Sensor Kompas";
    btnCalibrate.style.display = 'block';
  } else {
    window.addEventListener("deviceorientationabsolute", handleOrientation, true);
    window.addEventListener("deviceorientation", handleOrientation, true);
    btnCalibrate.style.display = 'none';
  }
}

btnCalibrate.addEventListener('click', () => {
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(response => {
        if (response === 'granted') {
          window.addEventListener("deviceorientation", handleOrientation, true);
          btnCalibrate.style.display = 'none';
          qiblaStatus.innerHTML = `Membaca kompas... (Kiblat ${Math.round(qiblaAzimuth)}°)`;
        } else {
          qiblaStatus.textContent = "Akses kompas ditolak.";
        }
      })
      .catch(console.error);
  }
});

function handleOrientation(event) {
  if (qiblaAzimuth === null) return;

  let compass = event.webkitCompassHeading || Math.abs(event.alpha - 360);
  
  if (compass != null) {
    // Calculate how the needle should point
    // The device rotation is `compass` (Clockwise from North).
    // The qibla is `qiblaAzimuth` (Clockwise from North).
    // The needle needs to rotate by qiblaAzimuth - compass
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
  // Using calculation method 11: Majlis Ugama Islam Singapura, or 20: Kemenag Indonesia
  const apiUrl = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lng}&method=20`;

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      const timings = data.data.timings;
      const hijri = data.data.date.hijri;
      
      const locStr = `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(2)}°${lng >= 0 ? 'E' : 'W'}`;
      locationName.textContent = `Koordinat: ${locStr}`;
      hijriDate.textContent = `${hijri.day} ${hijri.month.en} ${hijri.year} H`;
      
      currentPrayerTimes = [
        timings['Fajr'], timings['Dhuhr'], timings['Asr'], timings['Maghrib'], timings['Isha']
      ];
      
      // Clear list securely
      prayerList.innerHTML = '';
      
      currentPrayerNames.forEach((prayerName, index) => {
        let time = currentPrayerTimes[index];
        let li = document.createElement('li');
        li.className = 'prayer-item';
        li.innerHTML = `${prayerName} <span>${time}</span>`;
        prayerList.appendChild(li);
      });
      
      startCountdown();
      
    })
    .catch(err => {
      locationName.textContent = "Offline";
      hijriDate.textContent = "Pastikan Anda terhubung ke internet.";
    });
}

function startCountdown() {
  if (countdownInterval) clearInterval(countdownInterval);
  
  // Update UI immediately then start interval
  countdownTick();
  countdownInterval = setInterval(countdownTick, 1000);
}

function countdownTick() {
  if (!currentPrayerTimes) return;
  
  const now = new Date();
  let nextPrayerIndex = -1;
  let nextPrayerTime = null;
  
  const currentMins = now.getHours() * 60 + now.getMinutes();

  for (let i=0; i<currentPrayerTimes.length; i++) {
    let parts = currentPrayerTimes[i].split(':');
    let prayerMins = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    
    // Check if the prayer time is later today
    if (prayerMins > currentMins || (prayerMins === currentMins && now.getSeconds() === 0)) {
      nextPrayerIndex = i;
      nextPrayerTime = new Date();
      nextPrayerTime.setHours(parseInt(parts[0]), parseInt(parts[1]), 0, 0);
      break;
    }
  }
  
  // If no prayer is left today, next prayer is Subuh tomorrow
  if (nextPrayerIndex === -1) {
    nextPrayerIndex = 0;
    let parts = currentPrayerTimes[0].split(':');
    nextPrayerTime = new Date();
    nextPrayerTime.setDate(nextPrayerTime.getDate() + 1); // Tomorrow
    nextPrayerTime.setHours(parseInt(parts[0]), parseInt(parts[1]), 0, 0);
  }
  
  const diffMs = Math.max(0, nextPrayerTime.getTime() - now.getTime());
  const hrs = Math.floor(diffMs / (1000 * 60 * 60));
  const mins = Math.floor((diffMs / (1000 * 60)) % 60);
  const secs = Math.floor((diffMs / 1000) % 60);
  
  document.getElementById('next-prayer-name').textContent = currentPrayerNames[nextPrayerIndex];
  document.getElementById('countdown-timer').textContent = 
    `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    
  // Update Highlight in List
  const items = document.querySelectorAll('.prayer-item');
  if(items.length > 0) {
    items.forEach((item, idx) => {
      if (idx === nextPrayerIndex) item.classList.add('next-prayer');
      else item.classList.remove('next-prayer');
    });
  }
}

// ----------------------------------------
// DOA PILIHAN LOGIC
// ----------------------------------------
const doaListData = [
  // Do'a Pilihan
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
    title: "Ketenangan Hati",
    arabic: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ",
    latin: "Ya muqallibal quluub, tsabbit qalbi 'ala diinik",
    translate: "Wahai Dzat yang membolak-balikkan hati, teguhkanlah hatiku di atas agama-Mu."
  },
  {
    type: "doa",
    category: "Do'a Pendek",
    title: "Tolak Bala & Kejahatan (Santet)",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    latin: "Bismillahilladzi la yadhurru ma'asmihi syai'un fil ardhi wa laa fis-samaa'i wahuwas-samii'ul 'aliim",
    translate: "Dengan menyebut nama Allah yang dengan nama-Nya tidak ada satupun yang membahayakan di bumi maupun di langit. Dan Dialah Yang Maha Mendengar lagi Maha Mengetahui."
  },
  {
    type: "doa",
    category: "Do'a Pendek",
    title: "Keberanian & Melawan Musuh",
    arabic: "اللَّهُمَّ إِنَّا نَجْعَلُكَ فِي نُحُورِهِمْ وَنَعُوذُ بِكَ مِنْ شُرُورِهِمْ",
    latin: "Allahumma inna naj'aluka fi nuhurihim wa na'udzu bika min shururihim",
    translate: "Ya Allah, sesungguhnya kami menjadikan Engkau di dada-dada mereka (sebagai pelindung dari hadapan mereka) dan kami berlindung kepada-Mu dari kejahatan mereka."
  },
  {
    type: "doa",
    category: "Do'a Pendek",
    title: "Doa Pengampunan Orang Tua",
    arabic: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    latin: "Rabbighfir lii wa liwaalidayya warhamhumaa kamaa rabbayaanii shaghiira",
    translate: "Ya Tuhanku, ampunilah aku dan kedua orang tuaku, dan sayangilah keduanya sebagaimana mereka menyayangiku di waktu kecil."
  },

  // Surat Pendek
  {
    type: "surah",
    category: "Surah Pendek",
    title: "QS. Al-Fatihah",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    latin: "Bismillahir-rahmanir-rahim. Alhamdu lillahi rabbil-'alamin. Ar-rahmanir-rahim. Maliki yawmid-din. Iyyaka na'budu wa iyyaka nasta'in. Ihdinas-siratal-mustaqim. Siratal-ladzina an'amta 'alayhim ghayril-maghdhubi 'alayhim wa lad-dallin.",
    translate: "Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang. Segala puji bagi Allah, Tuhan semesta alam. Maha Pemurah lagi Maha Penyayang. Yang menguasai di Hari Pembalasan. Hanya Engkaulah yang kami sembah, dan hanya kepada Engkaulah kami meminta pertolongan. Tunjukilah kami jalan yang lurus, (yaitu) jalan orang-orang yang telah Engkau beri nikmat kepada mereka; bukan (jalan) mereka yang dimurkai dan bukan (pula jalan) mereka yang sesat."
  },
  {
    type: "surah",
    category: "Surah Pendek",
    title: "QS. At-Tin",
    arabic: "وَالتِّينِ وَالزَّيْتُونِ ۝ وَطُورِ سِينِينَ ۝ وَهَٰذَا الْبَلَدِ الْأَمِينِ ۝ لَقَدْ خَلَقْنَا الْإِنسَانَ فِي أَحْسَنِ تَقْوِيمٍ ۝ ثُمَّ رَدَدْنَاهُ أَسْفَلَ سَافِلِينَ ۝ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ فَلَهُمْ أَجْرٌ غَيْرُ مَمْنُونٍ ۝ فَمَا يُكَذِّبُكَ بَعْدُ بِالدِّينِ ۝ أَلَيْسَ اللَّهُ بِأَحْكَمِ الْحَاكِمِينَ",
    latin: "Wat-tiini waz-zaituun. Wa tuuri siiniin. Wa haazal-baladil-amiin. Laqad khalaqnal-insaana fii ahsani taqwiim. Thumma radadnaahu asfala saafiliin. Illalladziina aamanuu wa 'amilus-saalihaati falahum ajrun ghairu mamnuun. Famaa yukadh-dhibuka ba'du bid-diin. Alaisallaahu bi'ahkamil-haakimiin.",
    translate: "Demi (buah) Tin dan (buah) Zaitun, dan demi bukit Sinai, dan demi kota (Mekah) ini yang aman, sesungguhnya Kami telah menciptakan manusia dalam bentuk yang sebaik-baiknya. Kemudian Kami kembalikan dia ke tempat yang serendah-rendahnya (neraka), kecuali orang-orang yang beriman dan mengerjakan amal saleh; maka bagi mereka pahala yang tiada putus-putusnya. Maka apakah yang menyebabkan kamu mendustakan (hari) pembalasan sesudah (adanya keterangan-keterangan) itu? Bukankah Allah Hakim yang seadil-adilnya?"
  },
  {
    type: "surah",
    category: "Surah Pendek",
    title: "QS. Al-Qadr",
    arabic: "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ ۝ وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ ۝ لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ ۝ تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ ۝ سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ",
    latin: "Innaa anzalnaahu fii lailatil-qadr. Wa maa adraaka maa lailatul-qadr. Lailatul-qadri khairum min alfi syahr. Tanazzalul-malaa'ikatu war-ruuhu fiihaa bi'idhni rabbihim min kulli amr. Salaamun hiya hattaa mathla'il-fajr.",
    translate: "Sesungguhnya Kami telah menurunkannya (Al Quran) pada malam kemuliaan. Dan tahukah kamu apakah malam kemuliaan itu? Malam kemuliaan itu lebih baik dari seribu bulan. Pada malam itu turun malaikat-malaikat dan malaikat Jibril dengan izin Tuhannya untuk mengatur segala urusan. Malam itu (penuh) kesejahteraan sampai terbit fajar."
  },
  {
    type: "surah",
    category: "Surah Pendek",
    title: "QS. Al-Ma'un",
    arabic: "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ ۝ فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ ۝ وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ ۝ فَوَيْلٌ لِّلْمُصَلِّينَ ۝ الَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ ۝ الَّذِينَ هُمْ يُرَاءُونَ ۝ وَيَمْنَعُونَ الْمَاعُونَ",
    latin: "Ara'aital-ladzi yukadh-dhibu bid-diin. Fadzaalikal-ladzii yadu'ul-yatiim. Walaa yahuddu 'alaa tha'aamil-miskiin. Fawailul-lil-musalliin. Alladziina hum 'an shalaatihim saahuun. Alladziina hum yuraa'uun. Wayamna'uunal-maa'uun.",
    translate: "Tahukah kamu (orang) yang mendustakan agama? Itulah orang yang menghardik anak yatim, dan tidak menganjurkan memberi makan orang miskin. Maka kecelakaanlah bagi orang-orang yang shalat, (yaitu) orang-orang yang lalai dari shalatnya, orang-orang yang berbuat riya, dan enggan (menolong dengan) barang berguna."
  },
  {
    type: "surah",
    category: "Surah Pendek",
    title: "QS. Quraisy",
    arabic: "لِإِيلَافِ قُرَيْشٍ ۝ إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ ۝ فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ ۝ الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ",
    latin: "Li iilaafi quraiisy. Iilaafihim rihlatash-shitaa'i wash-shaiif. Falya'buduu rabba haadzal-baiit. Alladzii ath'amahum min juu'iw-wa aamanahum min khauuf.",
    translate: "Karena kebiasaan orang-orang Quraisy, (yaitu) kebiasaan mereka bepergian pada musim dingin dan musim panas. Maka hendaklah mereka menyembah Tuhan Pemilik rumah ini (Ka'bah). Yang telah memberi makanan kepada mereka untuk menghilangkan lapar dan mengamankan mereka dari ketakutan."
  },
  {
    type: "surah",
    category: "Surah Pendek",
    title: "QS. Al-Asr",
    arabic: "وَالْعَصْرِ ۝ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ ۝ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
    latin: "Wal 'ashr. Innal insaana lafii khusr. Illalladziina aamanuu wa 'amilus-shaalihaati wa tawaashau bil-haqqi wa tawaashau bish-shabr.",
    translate: "Demi masa. Sesungguhnya manusia itu benar-benar dalam kerugian, kecuali orang-orang yang beriman dan mengerjakan amal saleh dan nasehat menasehati supaya mentaati kebenaran dan nasehat menasehati supaya menetapi kesabaran."
  },
  {
    type: "surah",
    category: "Surah Pendek",
    title: "QS. Al-Kautsar",
    arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ۝ فَصَلِّ لِرَبِّكَ وَانْحَرْ ۝ إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ",
    latin: "Inna a'tainakal-kauthar. Fasalli lirabbika wanhar. Inna shani'aka huwal-abtar.",
    translate: "Sesungguhnya Kami telah memberikan kepadamu nikmat yang banyak. Maka dirikanlah shalat karena Tuhanmu dan berkorbanlah. Sesungguhnya orang-orang yang membenci kamu dialah yang terputus."
  },
  {
    type: "surah",
    category: "Surah Pendek",
    title: "QS. Al-Kafirun",
    arabic: "قُلْ يَا أَيُّهَا الْكَافِرُونَ ۝ لَا أَعْبُدُ مَا تَعْبُدُونَ ۝ وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ ۝ وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ ۝ وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ ۝ لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
    latin: "Qul yaa ayyuhal-kaafiruun. Laa a'budu maa ta'buduun. Wa laa antum 'aabiduuna maa a'bud. Wa laa anaa 'aabidum-maa 'abadtum. Wa laa antum 'aabiduuna maa a'bud. Lakum diinukum waliya diin.",
    translate: "Katakanlah: Hai orang-orang kafir, Aku tidak akan menyembah apa yang kamu sembah. Dan kamu bukan penyembah Tuhan yang aku sembah. Dan aku tidak pernah menjadi penyembah apa yang kamu sembah, dan kamu tidak pernah (pula) menjadi penyembah Tuhan yang aku sembah. Untukmu agamamu, dan untukkula, agamaku."
  },
  {
    type: "surah",
    category: "Surah Pendek",
    title: "QS. An-Nasr",
    arabic: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ ۝ وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا ۝ فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا",
    latin: "Idzaa jaa'a nashrullahi wal fat-h. Wa ra'aitan-naasa yadkhuluuna fii diinillahi afwaajaa. Fasabbih bihamdi rabbika wastaghfirh, innahuu kaana tawwaabaa.",
    translate: "Apabila telah datang pertolongan Allah dan kemenangan, dan kamu lihat manusia masuk agama Allah dengan berbondong-bondong, maka bertasbihlah dengan memuji Tuhanmu dan mohonlah ampun kepada-Nya. Sesungguhnya Dia adalah Maha Penerima taubat."
  },
  {
    type: "surah",
    category: "Surah Pendek",
    title: "QS. Al-Ikhlas",
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    latin: "Qul huwallahu ahad. Allahus-samad. Lam yalid wa lam yulad. Walam yakul-lahu kufuwan ahad.",
    translate: "Katakanlah: Dia-lah Allah, Yang Maha Esa. Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu. Dia tiada beranak dan tidak pula diperanakkan. Dan tidak ada seorangpun yang setara dengan Dia."
  },
  {
    type: "surah",
    category: "Surah Pendek",
    title: "QS. Al-Falaq",
    arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    latin: "Qul a'uudzu birabbil falaq. Min syarri maa khalaq. Wa min syarri ghaasiqin idzaa waqab. Wa min syarrin naffaatsaati fil 'uqad. Wa min syarri haasidin idzaa hasad.",
    translate: "Katakanlah: Aku berlindung kepada Tuhan Yang Menguasai subuh, dari kejahatan makhluk-Nya, dan dari kejahatan malam apabila telah gelap gulita, dan dari kejahatan wanita-wanita tukang sihir yang menghembus pada buhul-buhul, dan dari kejahatan pendengki bila ia dengki."
  },
  {
    type: "surah",
    category: "Surah Pendek",
    title: "QS. An-Nas",
    arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ",
    latin: "Qul a'udzu birabbin-nas. Malikin-nas. Ilahin-nas. Min sharril-waswasil-khannas. Alladzi yuwaswisu fi sudurin-nas. Minal-jinnati wan-nas.",
    translate: "Katakanlah: Aku berlindung kepada Tuhannya manusia. Raja manusia. Sembahan manusia. Dari kejahatan (bisikan) syaitan yang biasa bersembunyi. Yang membisikkan (kejahatan) ke dalam dada manusia. Dari (golongan) jin dan manusia."
  }
];

let activeDoaType = 'doa';

function renderDoaList() {
  const doaListEl = document.getElementById('doa-list');
  doaListEl.innerHTML = ''; // Bersihkan list
  
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
  
  // Render pertama kali
  renderDoaList();
}


// Init when App opens
initQibla();
initDoa();
