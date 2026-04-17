// REGISTER SERVICE WORKER
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

// ── FONT SCALING ──
function applyFontScale(scale) {
  document.documentElement.style.setProperty('--font-scale', scale);
  const el = document.getElementById('font-size-val');
  if (el) el.textContent = Math.round(scale * 100) + '%';
  localStorage.setItem('fivetimes-font-scale', scale);
}
const savedScale = parseFloat(localStorage.getItem('fivetimes-font-scale') || '1.1');
applyFontScale(savedScale);
const fontSlider = document.getElementById('font-size-slider');
if (fontSlider) {
  fontSlider.value = savedScale;
  fontSlider.addEventListener('input', e => applyFontScale(e.target.value));
}

// ── NAVIGATION ──
const navItems    = document.querySelectorAll('.nav-item');
const viewSections = document.querySelectorAll('.view-section');
const TITLES = { tasbeh:'FiveTimes', qibla:'Arah Kiblat', jadwal:'Waktu Shalat', doa:"Do'a & Surah", settings:'Setelan' };

navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    const target = item.getAttribute('data-target');
    viewSections.forEach(s => s.classList.remove('active'));
    const sec = document.getElementById('section-' + target);
    if (sec) sec.classList.add('active');
    const title = document.getElementById('app-title');
    if (title) title.textContent = TITLES[target] || 'FiveTimes';
    const fab = document.getElementById('floating-tasbeh');
    if (fab) fab.classList.toggle('hidden', target === 'tasbeh');
    if (target === 'jadwal') setTimeout(renderInfinityClock, 100);
  });
});

// Jadwal sub-tabs
document.querySelectorAll('.section-tab-btn').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.section-tab-btn').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.getAttribute('data-tab');
    document.querySelectorAll('.subview').forEach(v => v.classList.remove('active'));
    const sv = document.getElementById('subview-' + target);
    if (sv) sv.classList.add('active');
    if (target === 'jadwal-main') setTimeout(renderInfinityClock, 100);
  });
});

// Guide tabs
function initGuideTabs() {
  document.querySelectorAll('.guide-tab-btn').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.guide-tab-btn').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderGuideContent(tab.getAttribute('data-guide'));
    });
  });
}

// Doa sub-tabs
document.querySelectorAll('.subtab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.subtab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderDoaList();
  });
});

// ── NIAT DATA ──
const niatData = {
  Subuh:   { arabic: 'أُصَلِّيْ فَرْضَ الصُّبْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى', latin: "Ushallii fardhash-shubhi rak'ataini mustaqbilal qiblati adaa-an lillaahi ta'aalaa.", translate: 'Niat shalat fardu Subuh 2 rakaat, menghadap kiblat, tunai karena Allah Ta\'ala.' },
  Dzuhur:  { arabic: 'أُصَلِّيْ فَرْضَ الظُّهْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى', latin: "Ushallii fardhazh-zhuhri arba'a raka'aatin mustaqbilal qiblati adaa-an lillaahi ta'aalaa.", translate: 'Niat shalat fardu Zuhur 4 rakaat, menghadap kiblat, tunai karena Allah Ta\'ala.' },
  Ashar:   { arabic: 'أُصَلِّيْ فَرْضَ الْعَصْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى', latin: "Ushallii fardhal 'ashri arba'a raka'aatin mustaqbilal qiblati adaa-an lillaahi ta'aalaa.", translate: 'Niat shalat fardu Ashar 4 rakaat, menghadap kiblat, tunai karena Allah Ta\'ala.' },
  Maghrib: { arabic: 'أُصَلِّيْ فَرْضَ الْمَغْرِبِ ثَلَاثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى', latin: "Ushallii fardhal maghribi tsalaatha raka'aatin mustaqbilal qiblati adaa-an lillaahi ta'aalaa.", translate: 'Niat shalat fardu Maghrib 3 rakaat, menghadap kiblat, tunai karena Allah Ta\'ala.' },
  Isya:    { arabic: 'أُصَلِّيْ فَرْضَ الْعِشَاءِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى', latin: "Ushallii fardhal 'isyaa-i arba'a raka'aatin mustaqbilal qiblati adaa-an lillaahi ta'aalaa.", translate: 'Niat shalat fardu Isya 4 rakaat, menghadap kiblat, tunai karena Allah Ta\'ala.' }
};

// ── DOA DATA ──
const doaData = [
  {
    title: 'Hasbunallah wa Ni\'mal Wakeel',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    latin:  "Hasbunallaahu wa ni'mal wakiil.",
    translate: 'Cukuplah Allah menjadi Penolong kami, dan Allah adalah sebaik-baik Pelindung.'
  },
  {
    title: 'Doa Kelancaran Rezeki',
    arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
    latin:  "Allahummak-finii bihalaaliika 'an haramiika wa aghninii bifadlika 'amman siwaak.",
    translate: 'Ya Allah, cukupkanlah aku dengan yang halal dari yang haram-Mu, dan kayakanlah aku dengan karunia-Mu dari selain-Mu.'
  },
  {
    title: 'Doa Dimudahkan Urusan',
    arabic: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا',
    latin:  "Allaahumma laa sahla illaa maa ja'altahu sahlaa, wa anta taj'alul-hazna idzaa syi'ta sahlaa.",
    translate: 'Ya Allah, tidak ada kemudahan kecuali apa yang Engkau jadikan mudah, dan Engkau menjadikan kesedihan itu mudah jika Engkau menghendaki.'
  },
  {
    title: 'Doa Sapu Jagat',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    latin:  "Rabbana aatinaa fid-dunya hasanatan wa fil-aakhirati hasanatan wa qinaa 'adzaaban-naar.",
    translate: 'Ya Tuhan kami, berikanlah kami kebaikan di dunia dan kebaikan di akhirat, serta lindungilah kami dari siksa neraka.'
  },
  {
    title: 'Doa untuk Kedua Orang Tua',
    arabic: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    latin:  'Rabbighfir lii wa liwaalidayya warhamhumaa kamaa rabbayaanii shaghiiraa.',
    translate: 'Ya Tuhanku, ampunilah aku dan kedua orang tuaku, dan kasihilah mereka sebagaimana mereka mendidikku sewaktu kecil.'
  },
  {
    title: 'Doa Lapangkan Dada',
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي',
    latin:  "Rabbisyrahli shadrii wa yassirli amrii wahlul 'uqdatam-mil-lisaanii.",
    translate: 'Ya Tuhanku, lapangkanlah dadaku, mudahkanlah urusanku, dan lepaskanlah kekakuan dari lidahku.'
  },
  {
    title: 'Doa Keluar Rumah',
    arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    latin:  "Bismillaahi tawakkaltu 'alallaahi wa laa hawla wa laa quwwata illaa billaah.",
    translate: 'Dengan nama Allah, aku bertawakal kepada Allah, tiada daya dan kekuatan kecuali dengan Allah.'
  },
  {
    title: 'Istighfar',
    arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
    latin:  "Astaghfirullaahal-'azhiimal-ladzii laa ilaaha illaa huwal-hayyul-qayyuum wa atuubu ilayh.",
    translate: 'Aku memohon ampun kepada Allah Yang Maha Agung yang tiada Tuhan selain Dia, Yang Maha Hidup lagi Maha Berdiri sendiri, dan aku bertaubat kepada-Nya.'
  }
];

// ── SURAH DATA ──
const surahData = [
  {
    title: 'QS. Al-Fatihah (1)',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾ الرَّحْمَٰنِ الرَّحِيمِ ﴿٣﴾ مَالِكِ يَوْمِ الدِّينِ ﴿٤﴾ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٥﴾ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴿٦﴾ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴿٧﴾',
    latin: 'Bismillaahir-rahmaanir-rahiim. Al-hamdu lillaahi rabbil-\'aalamiinn. Ar-rahmaanir-rahiim. Maaliki yawmid-diin. Iyyaaka na\'budu wa iyyaaka nasta\'iin. Ihdinash-shiraathal-mustaqiim. Shiraathalladziina an\'amta \'alayhim ghayril-maghdhuubi \'alayhim wa ladh-dhaalliin.',
    translate: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang. Segala puji bagi Allah, Tuhan seluruh alam, Yang Maha Pengasih, Maha Penyayang, Pemilik hari pembalasan. Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami mohon pertolongan. Tunjukilah kami jalan yang lurus...'
  },
  {
    title: 'QS. Al-Ikhlas (112)',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ ﴿٤﴾',
    latin: "Qul huwallaaahu ahad. Allaaahush-shamad. Lam yalid wa lam yuulad. Wa lam yakul-lahuu kufuwan ahad.",
    translate: 'Katakanlah: Dialah Allah, Yang Maha Esa. Allah tempat meminta segala sesuatu. Dia tidak beranak dan tidak pula diperanakkan. Dan tidak ada sesuatu pun yang setara dengan Dia.'
  },
  {
    title: 'QS. Al-Falaq (113)',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴿١﴾ مِنْ شَرِّ مَا خَلَقَ ﴿٢﴾ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴿٣﴾ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ﴿٤﴾ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴿٥﴾',
    latin: "Qul a'uudzu birabbil-falaq. Min shar-ri maa khalaq. Wa min shar-ri ghaasiqin idzaa waqab. Wa min shar-rin-naffaatsaati fil-'uqad. Wa min shar-ri haasidin idzaa hasad.",
    translate: 'Katakanlah: Aku berlindung kepada Tuhan yang menguasai subuh, dari kejahatan makhluk-Nya, dari kejahatan malam apabila telah gelap gulita, dari kejahatan perempuan-perempuan tukang sihir yang meniup pada buhul-buhul, dan dari kejahatan orang yang dengki apabila ia dengki.'
  },
  {
    title: 'QS. An-Nas (114)',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ قُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿١﴾ مَلِكِ النَّاسِ ﴿٢﴾ إِلَٰهِ النَّاسِ ﴿٣﴾ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ﴿٤﴾ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ﴿٥﴾ مِنَ الْجِنَّةِ وَالنَّاسِ ﴿٦﴾',
    latin: "Qul a'uudzu birabbin-naas. Malikin-naas. Ilaahin-naas. Min shar-ril-waswaasil-khannaas. Alladzii yuwaswisu fii shuduurin-naas. Minal-jinnati wan-naas.",
    translate: 'Katakanlah: Aku berlindung kepada Tuhannya manusia, Raja manusia, Sembahan manusia, dari kejahatan bisikan setan yang tersembunyi, yang membisikkan kejahatan ke dalam dada manusia, dari golongan jin dan manusia.'
  },
  {
    title: 'QS. Al-Kautsar (108)',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ﴿١﴾ فَصَلِّ لِرَبِّكَ وَانْحَرْ ﴿٢﴾ إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ ﴿٣﴾',
    latin: "Innaa a'thaynaak al-kawthar. Fasalli lirabbika wanhar. Inna syaani'aka huwal-abtar.",
    translate: 'Sungguh, Kami telah memberimu (Muhammad) nikmat yang banyak. Maka laksanakanlah shalat karena Tuhanmu, dan berkurbanlah. Sungguh, orang-orang yang membencimu dialah yang terputus (dari rahmat Allah).'
  },
  {
    title: 'QS. Al-Kafirun (109)',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ قُلْ يَا أَيُّهَا الْكَافِرُونَ ﴿١﴾ لَا أَعْبُدُ مَا تَعْبُدُونَ ﴿٢﴾ وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ ﴿٣﴾ وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ ﴿٤﴾ وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ ﴿٥﴾ لَكُمْ دِينُكُمْ وَلِيَ دِينِ ﴿٦﴾',
    latin: "Qul yaa ayyuhal-kaafiruum. Laa a'budu maa ta'buduun. Wa laa antum 'aabiduuna maa a'bud. Wa laa anaa 'aabidum maa 'abadttum. Wa laa antum 'aabiduuna maa a'bud. Lakum diinukum wa liya diin.",
    translate: 'Katakanlah: Wahai orang-orang kafir! Aku tidak akan menyembah apa yang kamu sembah, dan kamu bukan penyembah apa yang aku sembah, dan aku tidak pernah menjadi penyembah apa yang kamu sembah, dan kamu tidak pernah menjadi penyembah apa yang aku sembah. Untukmu agamamu, dan untukku agamaku.'
  },
  {
    title: 'QS. An-Nasr (110)',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ ﴿١﴾ وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا ﴿٢﴾ فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا ﴿٣﴾',
    latin: "Idzaa jaaa'a nashrullaahi wal-fath. Wa ra'aytan-naasa yadkhuluuna fii diinillaahi afwaajaa. Fasabbih bihamdi rabbika wastaghfirh, innahuu kaana tawwaabaa.",
    translate: 'Apabila telah datang pertolongan Allah dan kemenangan, dan engkau melihat manusia berbondong-bondong masuk agama Allah, maka bertasbihlah dengan memuji Tuhanmu dan mohonlah ampunan kepada-Nya. Sungguh, Dia Maha Penerima tobat.'
  },
  {
    title: 'QS. Al-\'Asr (103)',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ وَالْعَصْرِ ﴿١﴾ إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ ﴿٢﴾ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ ﴿٣﴾',
    latin: "Wal-'ashr. Innal-insaana lafii khusr. Illalladziina aamanuu wa 'amilush-shaalihaati wa tawaashaw bil-haqqi wa tawaashaw bish-shabr.",
    translate: 'Demi masa. Sungguh, manusia berada dalam kerugian, kecuali orang-orang yang beriman dan mengerjakan kebajikan serta saling menasihati untuk kebenaran dan saling menasihati untuk kesabaran.'
  },
  {
    title: 'QS. Al-Ma\'un (107)',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ ﴿١﴾ فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ ﴿٢﴾ وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ ﴿٣﴾ فَوَيْلٌ لِلْمُصَلِّينَ ﴿٤﴾ الَّذِينَ هُمْ عَنْ صَلَاتِهِمْ سَاهُونَ ﴿٥﴾ الَّذِينَ هُمْ يُرَاءُونَ ﴿٦﴾ وَيَمْنَعُونَ الْمَاعُونَ ﴿٧﴾',
    latin: "Ara'aytalladhii yukadhdhibu bid-diin. Fadzaalikal-ladhii yadu''ul-yatiim. Wa laa yahuddu 'alaa tha'aamil-miskiin. Fawaylul-lil-mushalliim. Alladziina hum 'an shaalaatihim saahuum. Alladziina hum yuraa'uun. Wa yamna'uunal-maa'uun.",
    translate: 'Tahukah kamu orang yang mendustakan agama? Itulah orang yang menghardik anak yatim, dan tidak mendorong memberi makan orang miskin. Maka celakalah orang yang shalat, yang lalai dari shalatnya, yang berbuat riya, dan enggan memberikan bantuan.'
  }
];

// ── RENDER DOA/SURAH LIST ──
function renderDoaList() {
  const container = document.getElementById('doa-list');
  if (!container) return;
  const activeBtn = document.querySelector('.subtab-btn.active');
  const type = activeBtn ? activeBtn.getAttribute('data-doatype') : 'doa';
  const data = type === 'doa' ? doaData : surahData;
  container.innerHTML = data.map(item => `
    <div class="doa-card">
      <div class="doa-title">${item.title}</div>
      <div class="doa-arabic">${item.arabic}</div>
      <div class="doa-latin">${item.latin}</div>
      <div class="doa-translate">${item.translate}</div>
    </div>
  `).join('');
}

// ── TASBEH ──
let currentCount = parseInt(localStorage.getItem('tasbehCount') || '0');
const MAX_COUNT   = 33;
const CIRCUMFERENCE = 565.48;

function updateTasbehUI() {
  const raw = currentCount % MAX_COUNT;
  const displayNum = (currentCount > 0 && raw === 0) ? MAX_COUNT : raw;
  const cycle = Math.floor(currentCount / MAX_COUNT) - (currentCount > 0 && raw === 0 ? 1 : 0);
  const $ = id => document.getElementById(id);
  if ($('tasbeh-count'))   $('tasbeh-count').textContent   = displayNum;
  if ($('floating-count')) $('floating-count').textContent = displayNum;
  if ($('tasbeh-cycle'))   $('tasbeh-cycle').textContent   = `Putaran: ${cycle}`;
  if ($('floating-cycle')) $('floating-cycle').textContent = cycle;
  if ($('tasbeh-total'))   $('tasbeh-total').textContent   = `Total: ${currentCount}`;
  const ring = $('ring-progress');
  if (ring) ring.style.strokeDashoffset = CIRCUMFERENCE - (displayNum / MAX_COUNT) * CIRCUMFERENCE;
}

document.getElementById('btn-tap')?.addEventListener('click', () => {
  currentCount++;
  localStorage.setItem('tasbehCount', currentCount);
  updateTasbehUI();
  if (navigator.vibrate) navigator.vibrate(currentCount % 33 === 0 ? [100,50,100] : 25);
});
document.getElementById('btn-reset')?.addEventListener('click', () => {
  if (confirm('Reset penghitung?')) { currentCount = 0; localStorage.setItem('tasbehCount', 0); updateTasbehUI(); }
});

// ── KIBLAT / COMPASS ──
let qiblaAzimuth = null;
const compassNeedle = document.getElementById('compass-needle');

function calcQiblaAzimuth(lat, lng) {
  const phiK = 21.4225 * Math.PI / 180;
  const lambdaK = 39.8262 * Math.PI / 180;
  const phi = lat * Math.PI / 180;
  const lambda = lng * Math.PI / 180;
  const y = Math.sin(lambdaK - lambda);
  const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

window.addEventListener('deviceorientationabsolute', handleOrientation, true);
window.addEventListener('deviceorientation', handleOrientation, true);

function handleOrientation(e) {
  if (qiblaAzimuth === null || !compassNeedle) return;
  let compass = e.webkitCompassHeading;
  if (compass === undefined || compass === null) compass = (360 - e.alpha) % 360;
  const angle = (qiblaAzimuth - compass + 360) % 360;
  compassNeedle.style.transform = `rotate(${angle}deg)`;
}

// ── PRAYER TIMES ──
let prayerTimesData = null;

const prayerOrder = ['Subuh','Dzuhur','Ashar','Maghrib','Isya'];

function fetchPrayerTimes(lat, lng) {
  fetch(`https://api.aladhan.com/v1/timings/${Math.floor(Date.now()/1000)}?latitude=${lat}&longitude=${lng}&method=20`)
    .then(r => r.json()).then(data => {
      const t = data.data.timings;
      prayerTimesData = { Subuh: t.Fajr, Dzuhur: t.Dhuhr, Ashar: t.Asr, Maghrib: t.Maghrib, Isya: t.Isha };
      const $ = id => document.getElementById(id);
      if ($('location-name')) $('location-name').textContent = `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;
      if ($('hijri-date')) {
        const h = data.data.date.hijri;
        $('hijri-date').textContent = `${h.day} ${h.month.en} ${h.year} H`;
      }
      renderPrayerList();
      startCountdown();
      setTimeout(renderInfinityClock, 200);
    }).catch(() => {});
}

function renderPrayerList() {
  const list = document.getElementById('prayer-list');
  if (!list || !prayerTimesData) return;
  list.innerHTML = Object.entries(prayerTimesData).map(([name, time]) =>
    `<li class="prayer-item"><span class="prayer-name">${name}</span><span class="prayer-time">${time}</span></li>`
  ).join('');
}

let countdownInterval = null;
function startCountdown() {
  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    if (!prayerTimesData) return;
    const now = new Date();
    const curM = now.getHours() * 60 + now.getMinutes();
    let next = null;
    for (const name of prayerOrder) {
      const [h, m] = prayerTimesData[name].split(':').map(Number);
      if (h * 60 + m > curM) { next = { name, totalM: h * 60 + m }; break; }
    }
    if (!next) { next = { name: 'Subuh', totalM: 24 * 60 }; }
    const $ = id => document.getElementById(id);
    if ($('next-prayer-name')) $('next-prayer-name').textContent = next.name;
    const diff = (next.totalM - curM) * 60000 - now.getSeconds() * 1000;
    const hh = Math.floor(diff/3600000), mm = Math.floor((diff%3600000)/60000), ss = Math.floor((diff%60000)/1000);
    if ($('countdown-timer')) $('countdown-timer').textContent = [hh,mm,ss].map(v=>String(v).padStart(2,'0')).join(':');
    const nd = niatData[next.name];
    if (nd) {
      if ($('niat-arabic'))    $('niat-arabic').textContent    = nd.arabic;
      if ($('niat-latin'))     $('niat-latin').textContent     = nd.latin;
      if ($('niat-translate')) $('niat-translate').textContent = nd.translate;
      if ($('contextual-niat')) $('contextual-niat').classList.remove('hidden');
    }
  }, 1000);
}

// ── INFINITY CLOCK ──
function renderInfinityClock() {
  const svg  = document.querySelector('.infinity-svg');
  const path = document.querySelector('.infinity-path-bg');
  if (!svg || !path || path.offsetParent === null) return;
  try {
    const totalLen = path.getTotalLength();
    if (!totalLen) return;

    // Remove previous dynamic elements
    svg.querySelectorAll('.dyn').forEach(el => el.remove());

    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();

    // Build prayer minutes array
    const prayers = prayerTimesData ? prayerOrder.map(name => {
      const [h, m] = prayerTimesData[name].split(':').map(Number);
      return { name, mins: h * 60 + m, label: name.substring(0, 3) };
    }) : [];

    // Find current period
    let currentIdx = -1;
    for (let i = prayers.length - 1; i >= 0; i--) {
      if (prayers[i].mins <= nowMins) { currentIdx = i; break; }
    }

    // Draw colored arc for current period
    if (prayers.length > 0) {
      const startIdx = currentIdx >= 0 ? currentIdx : prayers.length - 1;
      const endIdx   = (startIdx + 1) % prayers.length;
      const startMins = prayers[startIdx].mins;
      const endMins   = endIdx > 0 ? prayers[endIdx].mins : prayers[0].mins + 1440;

      // Active period arc (gold)
      const tStart = (startMins / (24 * 60)) * totalLen;
      const tEnd   = (Math.min(nowMins, endMins > 1440 ? endMins - 1440 : endMins) / (24 * 60)) * totalLen;
      const arcActive = document.createElementNS('http://www.w3.org/2000/svg','path');
      arcActive.setAttribute('d', getSubpath(path, tStart, tEnd, totalLen));
      arcActive.setAttribute('fill', 'none');
      arcActive.setAttribute('stroke', '#D4AF37');
      arcActive.setAttribute('stroke-width', '6');
      arcActive.setAttribute('stroke-linecap', 'round');
      arcActive.setAttribute('filter', 'url(#glow)');
      arcActive.classList.add('dyn');
      svg.appendChild(arcActive);

      // Remaining arc (dim)
      const tNow  = (nowMins / (24 * 60)) * totalLen;
      const tNext = (Math.min(endMins, 1440) / (24 * 60)) * totalLen;
      const arcNext = document.createElementNS('http://www.w3.org/2000/svg','path');
      arcNext.setAttribute('d', getSubpath(path, tNow, tNext, totalLen));
      arcNext.setAttribute('fill', 'none');
      arcNext.setAttribute('stroke', 'rgba(212,175,55,0.25)');
      arcNext.setAttribute('stroke-width', '4');
      arcNext.setAttribute('stroke-linecap', 'round');
      arcNext.classList.add('dyn');
      svg.appendChild(arcNext);
    }

    // Prayer nodes with labels
    prayers.forEach(({ name, mins, label }) => {
      const tPrayer = (mins / (24*60)) * totalLen;
      const pt = path.getPointAtLength(tPrayer);
      const isActive = (currentIdx >= 0 && prayers[currentIdx].name === name);
      const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
      circle.setAttribute('cx', pt.x); circle.setAttribute('cy', pt.y);
      circle.setAttribute('r', isActive ? '5' : '3.5');
      circle.setAttribute('fill', isActive ? '#D4AF37' : '#030609');
      circle.setAttribute('stroke', '#D4AF37');
      circle.setAttribute('stroke-width', isActive ? '0' : '2');
      circle.classList.add('dyn');
      svg.appendChild(circle);

      // Label offset: push label away from path center
      const cx = 100, cy = 50; // SVG viewBox center
      const dx = pt.x - cx, dy = pt.y - cy;
      const dist = Math.sqrt(dx*dx+dy*dy) || 1;
      const offset = 11;
      const lx = pt.x + (dx/dist) * offset;
      const ly = pt.y + (dy/dist) * offset + 2;

      const text = document.createElementNS('http://www.w3.org/2000/svg','text');
      text.setAttribute('x', lx); text.setAttribute('y', ly);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', isActive ? '#D4AF37' : 'rgba(212,175,55,0.6)');
      text.setAttribute('font-size', isActive ? '6.5' : '5.5');
      text.setAttribute('font-weight', isActive ? 'bold' : 'normal');
      text.setAttribute('font-family', 'Inter, sans-serif');
      text.textContent = label;
      text.classList.add('dyn');
      svg.appendChild(text);
    });

    // Current time indicator dot
    const tNow = (nowMins / (24*60)) * totalLen;
    const nowPt = path.getPointAtLength(tNow);
    const dot = document.createElementNS('http://www.w3.org/2000/svg','circle');
    dot.setAttribute('cx', nowPt.x); dot.setAttribute('cy', nowPt.y);
    dot.setAttribute('r', '4.5');
    dot.setAttribute('fill', '#ffffff');
    dot.setAttribute('stroke', '#D4AF37');
    dot.setAttribute('stroke-width', '2');
    dot.setAttribute('filter', 'url(#glow)');
    dot.classList.add('dyn');
    svg.appendChild(dot);

  } catch(e) { console.warn('InfinityClock error:', e); }
}

// Helper: approximate a sub-path between two lengths using polyline points
function getSubpath(path, tStart, tEnd, totalLen) {
  const steps = 30;
  const dt = (tEnd - tStart) / steps;
  if (dt <= 0) return 'M 0 0';
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const p = path.getPointAtLength(Math.min(tStart + i * dt, totalLen));
    points.push(`${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`);
  }
  return points.join(' ');
}

// ── INIT QIBLA ──
function initQibla() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude: lat, longitude: lng } = pos.coords;
    qiblaAzimuth = calcQiblaAzimuth(lat, lng);
    const status = document.getElementById('qibla-status');
    if (status) status.textContent = `GPS aktif — Kiblat: ${Math.round(qiblaAzimuth)}° dari Utara`;
    const deg = document.querySelector('.qibla-degree');
    if (deg) deg.textContent = `${Math.round(qiblaAzimuth)}°`;
    fetchPrayerTimes(lat, lng);
  }, () => {
    const status = document.getElementById('qibla-status');
    if (status) status.textContent = 'Izinkan akses lokasi untuk kiblat & jadwal shalat.';
  });
}

// ── GUIDE CONTENT ──
function renderGuideContent(type) {
  const content = document.getElementById('guide-content');
  if (!content) return;
  if (type === 'wudhu') {
    content.innerHTML = `
      <div class="doa-card">
        <div class="doa-title">Niat Wudhu</div>
        <div class="doa-arabic">نَوَيْتُ الْوُضُوءَ لِرَفْعِ الْحَدَثِ الْأَصْغَرِ فَرْضًا لِلَّهِ تَعَالَى</div>
        <div class="doa-latin">Nawaitul wudhuu-a liraf'il hadatsil ashghari fardhan lillaahi ta'aalaa.</div>
        <div class="doa-translate">Aku niat wudhu untuk menghilangkan hadas kecil, fardhu karena Allah Ta'ala.</div>
      </div>
      <div class="doa-card">
        <div class="doa-title">Urutan Berwudhu</div>
        <ol class="guide-list">
          <li>Niat dalam hati</li><li>Basuh kedua telapak tangan 3×</li>
          <li>Berkumur 3×</li><li>Bersihkan hidung 3×</li><li>Basuh wajah 3×</li>
          <li>Basuh tangan hingga siku (kanan dulu) 3×</li>
          <li>Usap sebagian kepala 1×</li><li>Usap kedua telinga 1×</li>
          <li>Basuh kaki hingga mata kaki (kanan dulu) 3×</li>
        </ol>
      </div>
      <div class="doa-card">
        <div class="doa-title">Doa Sesudah Wudhu</div>
        <div class="doa-arabic">أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ</div>
        <div class="doa-latin">Asyhadu allaa ilaaha illallaahu wahdahu laa syariika lahu wa asyhadu anna muhammadan 'abduhu wa rasuuluh.</div>
        <div class="doa-translate">Aku bersaksi tiada Tuhan selain Allah, Yang Maha Esa, tiada sekutu bagi-Nya, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya.</div>
      </div>`;
  } else {
    content.innerHTML = `
      <div class="doa-card">
        <div class="doa-title">Rukun Shalat (13)</div>
        <ol class="guide-list">
          <li>Niat</li><li>Berdiri tegak (jika mampu)</li><li>Takbiratul ihram</li>
          <li>Membaca Al-Fatihah</li><li>Ruku' dengan tuma'ninah</li>
          <li>I'tidal dengan tuma'ninah</li><li>Sujud 2× dengan tuma'ninah</li>
          <li>Duduk antara dua sujud</li><li>Duduk tahiyat akhir</li>
          <li>Membaca tasyahud akhir</li><li>Membaca shalawat Nabi</li>
          <li>Salam pertama</li><li>Tertib (berurutan)</li>
        </ol>
      </div>
      <div class="doa-card">
        <div class="doa-title">Bacaan Ruku'</div>
        <div class="doa-arabic">سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ</div>
        <div class="doa-latin">Subhaana rabbiyal 'azhiimi wa bihamdih.</div>
        <div class="doa-translate">Maha Suci Tuhanku Yang Maha Agung, dan dengan memuji-Nya. (3×)</div>
      </div>
      <div class="doa-card">
        <div class="doa-title">Bacaan Sujud</div>
        <div class="doa-arabic">سُبْحَانَ رَبِّيَ الْأَعْلَى وَبِحَمْدِهِ</div>
        <div class="doa-latin">Subhaana rabbiyal a'laa wa bihamdih.</div>
        <div class="doa-translate">Maha Suci Tuhanku Yang Maha Tinggi, dan dengan memuji-Nya. (3×)</div>
      </div>
      <div class="doa-card">
        <div class="doa-title">Tasyahud Akhir</div>
        <div class="doa-arabic">التَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ لِلَّهِ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ</div>
        <div class="doa-latin">At-tahiyyaatul mubaarakaatush-shalawaatuth-thayyibaatu lillaah. As-salaamu 'alayka ayyuhan-nabiyyu wa rahmatullaahi wa barakaatuh. As-salaamu 'alaynaa wa 'alaa 'ibaadillaahish-shaalihiin. Asyhadu allaa ilaaha illallaahu wa asyhadu anna muhammadan rasuulullaah.</div>
        <div class="doa-translate">Bacaan tahiyat akhir untuk rakaat terakhir sebelum salam.</div>
      </div>`;
  }
}

// ── INIT ALL ──
initQibla();
updateTasbehUI();
renderDoaList();
renderGuideContent('wudhu');
initGuideTabs();
setInterval(renderInfinityClock, 30000);
