// REGISTER SERVICE WORKER
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => console.warn('SW error', err));
  });
}

// ----------------------------------------
// FONT SCALING
// ----------------------------------------
function applyFontScale(scale) {
  document.documentElement.style.setProperty('--font-scale', scale);
  const el = document.getElementById('font-size-val');
  if (el) el.textContent = Math.round(scale * 100) + '%';
  localStorage.setItem('fivetimes-font-scale', scale);
}
const savedScale = parseFloat(localStorage.getItem('fivetimes-font-scale') || 1.1);
applyFontScale(savedScale);
const fontSlider = document.getElementById('font-size-slider');
if (fontSlider) { fontSlider.value = savedScale; fontSlider.addEventListener('input', e => applyFontScale(e.target.value)); }

// ----------------------------------------
// NAVIGATION
// ----------------------------------------
const navItems = document.querySelectorAll('.nav-item');
const viewSections = document.querySelectorAll('.view-section');
const appTitle = document.getElementById('app-title');
const TITLES = { tasbeh: 'FiveTimes', qibla: 'Arah Kiblat', jadwal: 'Waktu Shalat', doa: "Do'a & Surah", settings: 'Setelan' };

navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    const target = item.getAttribute('data-target');
    viewSections.forEach(s => s.classList.remove('active'));
    const sec = document.getElementById('section-' + target);
    if (sec) sec.classList.add('active');
    if (appTitle) appTitle.textContent = TITLES[target] || 'FiveTimes';
    const fab = document.getElementById('floating-tasbeh');
    if (fab) fab.classList.toggle('hidden', target === 'tasbeh');
    if (target === 'jadwal') setTimeout(updateInfinityClock, 80);
  });
});

// Sub-tabs (Jadwal/Panduan)
document.querySelectorAll('.section-tab-btn').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.section-tab-btn').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.getAttribute('data-tab');
    document.querySelectorAll('.subview').forEach(v => v.classList.remove('active'));
    const sv = document.getElementById('subview-' + target);
    if (sv) sv.classList.add('active');
    if (target === 'jadwal-main') setTimeout(updateInfinityClock, 80);
  });
});

// Guide tabs (Wudhu/Shalat)
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

// ----------------------------------------
// DATA: NIAT SHALAT
// ----------------------------------------
const niatData = {
  Subuh:   { arabic: "أُصَلِّيْ فَرْضَ الصُّبْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى", latin: "Ushallii fardhash-shubhi rak'ataini mustaqbilal qiblati adaa-an lillaahi ta'aalaa.", translate: "Saya niat shalat fardu Subuh 2 rakaat, menghadap kiblat, tunai karena Allah Ta'ala." },
  Dzuhur:  { arabic: "أُصَلِّيْ فَرْضَ الظُّهْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى", latin: "Ushallii fardhazh-zhuhri arba'a raka'aatin mustaqbilal qiblati adaa-an lillaahi ta'aalaa.", translate: "Saya niat shalat fardu Zuhur 4 rakaat, menghadap kiblat, tunai karena Allah Ta'ala." },
  Ashar:   { arabic: "أُصَلِّيْ فَرْضَ الْعَصْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى", latin: "Ushallii fardhal 'ashri arba'a raka'aatin mustaqbilal qiblati adaa-an lillaahi ta'aalaa.", translate: "Saya niat shalat fardu Ashar 4 rakaat, menghadap kiblat, tunai karena Allah Ta'ala." },
  Maghrib: { arabic: "أُصَلِّيْ فَرْضَ الْمَغْرِبِ ثَلَاثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى", latin: "Ushallii fardhal maghribi tsalaatha raka'aatin mustaqbilal qiblati adaa-an lillaahi ta'aalaa.", translate: "Saya niat shalat fardu Maghrib 3 rakaat, menghadap kiblat, tunai karena Allah Ta'ala." },
  Isya:    { arabic: "أُصَلِّيْ فَرْضَ الْعِشَاءِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى", latin: "Ushallii fardhal 'isyaa-i arba'a raka'aatin mustaqbilal qiblati adaa-an lillaahi ta'aalaa.", translate: "Saya niat shalat fardu Isya 4 rakaat, menghadap kiblat, tunai karena Allah Ta'ala." }
};

// ----------------------------------------
// DATA: DOA PILIHAN (no wudhu here)
// ----------------------------------------
const doaData = [
  { title: "Doa Sapu Jagat", arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", latin: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adzaban-nar.", translate: "Ya Tuhan kami, berikanlah kami kebaikan di dunia dan kebaikan di akhirat, serta lindungilah kami dari siksa neraka." },
  { title: "Doa untuk Orang Tua", arabic: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا", latin: "Rabbighfir lii wa liwaalidayya warhamhumaa kamaa rabbayaanii shaghiiraa.", translate: "Ya Tuhanku, ampunilah aku dan kedua orang tuaku, dan kasihilah mereka sebagaimana mereka mendidikku sewaktu kecil." },
  { title: "Doa Lapangkan Dada", arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي", latin: "Rabbisyrahli shadrii wa yassirli amrii wahlul 'uqdatam-mil-lisaanii.", translate: "Ya Tuhanku, lapangkanlah dadaku, mudahkanlah urusanku, dan lepaskanlah kekakuan dari lidahku." },
  { title: "Doa Keluar Rumah", arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", latin: "Bismillaahi tawakkaltu 'alallaahi wa laa hawla wa laa quwwata illaa billaah.", translate: "Dengan nama Allah, aku bertawakal kepada Allah, tiada daya dan kekuatan kecuali dengan Allah." },
  { title: "Doa Masuk Masjid", arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ", latin: "Allahummaf-tahlii abwaaba rahmatik.", translate: "Ya Allah, bukakanlah bagiku pintu-pintu rahmat-Mu." },
  { title: "Doa Setelah Makan", arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ", latin: "Alhamdulillahil-ladzii ath'amanaa wa saqaanaa wa ja'alanaa muslimiin.", translate: "Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami orang Islam." }
];

// ----------------------------------------
// DATA: SURAT PENDEK
// ----------------------------------------
const surahData = [
  { title: "QS. Al-Fatihah (1)", arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾ الرَّحْمَٰنِ الرَّحِيمِ ﴿٣﴾ مَالِكِ يَوْمِ الدِّينِ ﴿٤﴾ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٥﴾ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴿٦﴾ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴿٧﴾", latin: "Bismillāhir-rahmānir-rahīm. Al-hamdu lillāhi rabbil-'ālamīn. Ar-rahmānir-rahīm. Māliki yawmid-dīn. Iyyāka na'budu wa iyyāka nasta'īn. Ihdinaṣ-ṣirāṭal-mustaqīm. Ṣirāṭalladzīna an'amta 'alayhim ghayril-maghḍūbi 'alayhim wa laḍ-ḍāllīn.", translate: "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Segala puji bagi Allah, Tuhan semesta alam..." },
  { title: "QS. Al-Ikhlas (112)", arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ ﴿٤﴾", latin: "Qul huwallāhu ahad. Allāhus-samad. Lam yalid wa lam yūlad. Wa lam yakul-lahū kufuwan ahad.", translate: "Katakanlah: Dialah Allah, Yang Maha Esa. Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu. Dia tidak beranak dan tidak pula diperanakkan. Dan tidak ada seorangpun yang setara dengan-Nya." },
  { title: "QS. Al-Falaq (113)", arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴿١﴾ مِنْ شَرِّ مَا خَلَقَ ﴿٢﴾ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴿٣﴾ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ﴿٤﴾ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴿٥﴾", latin: "Qul a'ūdzu birabbil-falaq. Min syarri mā khalaq. Wa min syarri ghāsiqin idzā waqab. Wa min syarrin-naffātsāti fil-'uqad. Wa min syarri hāsidin idzā hasad.", translate: "Katakanlah: Aku berlindung kepada Tuhan Yang Menguasai Subuh, dari kejahatan makhluk-Nya, dari kejahatan malam apabila telah gelap gulita, dari kejahatan wanita-wanita tukang sihir yang menghembus pada buhul-buhul, dan dari kejahatan pendengki bila ia dengki." },
  { title: "QS. An-Nas (114)", arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ قُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿١﴾ مَلِكِ النَّاسِ ﴿٢﴾ إِلَٰهِ النَّاسِ ﴿٣﴾ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ﴿٤﴾ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ﴿٥﴾ مِنَ الْجِنَّةِ وَالنَّاسِ ﴿٦﴾", latin: "Qul a'ūdzu birabbin-nās. Malikin-nās. Ilāhin-nās. Min syarril-waswāsil-khannās. Alladzī yuwaswisu fī shudūrin-nās. Minal-jinnati wan-nās.", translate: "Katakanlah: Aku berlindung kepada Tuhannya manusia, Raja manusia, Sembahan manusia, dari kejahatan bisikan setan yang bersembunyi, yang membisikkan kejahatan ke dalam dada manusia, dari golongan jin dan manusia." },
  { title: "QS. Al-Kautsar (108)", arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ﴿١﴾ فَصَلِّ لِرَبِّكَ وَانْحَرْ ﴿٢﴾ إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ ﴿٣﴾", latin: "Innā a'thaynākal-kawsar. Fasalli lirabbika wanhar. Inna syāni'aka huwal-abtar.", translate: "Sesungguhnya Kami telah memberikan kepadamu (Muhammad) nikmat yang banyak. Maka dirikanlah shalat karena Tuhanmu, dan berkurbanlah. Sesungguhnya orang-orang yang membenci kamu dialah yang terputus." },
  { title: "QS. Al-Kafirun (109)", arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ قُلْ يَا أَيُّهَا الْكَافِرُونَ ﴿١﴾ لَا أَعْبُدُ مَا تَعْبُدُونَ ﴿٢﴾ وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ ﴿٣﴾ وَلَا أَنَا عَابِدٌ مَا عَبَدتُّمْ ﴿٤﴾ وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ ﴿٥﴾ لَكُمْ دِينُكُمْ وَلِيَ دِينِ ﴿٦﴾", latin: "Qul yā ayyuhal-kāfirūn. Lā a'budu mā ta'budūn. Wa lā antum 'ābidūna mā a'bud. Wa lā ana 'ābidum mā 'abadtum. Wa lā antum 'ābidūna mā a'bud. Lakum dīnukum wa liya dīn.", translate: "Katakanlah: Hai orang-orang kafir, aku tidak akan menyembah apa yang kamu sembah... Untukmu agamamu, dan untukkulah agamaku." },
  { title: "QS. An-Nasr (110)", arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ ﴿١﴾ وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا ﴿٢﴾ فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا ﴿٣﴾", latin: "Idzā jā'a nasrullāhi wal-fath. Wa ra'aytan-nāsa yadkhulūna fī dīnillāhi afwājā. Fasabbih bihamdi rabbika wastaghfirh, innahū kāna tawwābā.", translate: "Apabila telah datang pertolongan Allah dan kemenangan, dan kamu lihat manusia masuk agama Allah dengan berbondong-bondong, maka bertasbihlah dengan memuji Tuhanmu dan mohonlah ampun kepada-Nya. Sesungguhnya Dia adalah Maha Penerima taubat." },
  { title: "QS. Al-Masad (111)", arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ ﴿١﴾ مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ ﴿٢﴾ سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ ﴿٣﴾ وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ ﴿٤﴾ فِي جِيدِهَا حَبْلٌ مِنْ مَسَدٍ ﴿٥﴾", latin: "Tabbat yadā abī lahabiw wa tabb. Mā aghnā 'anhu māluhu wa mā kasab. Sayashlā nāran dzāta lahab. Wamra'atuhū hammālatale-hatab. Fī jīdihā hablum-min masad.", translate: "Binasalah kedua tangan Abu Lahab dan sesungguhnya dia akan binasa. Tidaklah bermanfaat baginya hartanya dan apa yang ia usahakan. Kelak dia akan masuk ke dalam api yang bergejolak..." },
  { title: "QS. Al-Ma'un (107)", arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ ﴿١﴾ فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ ﴿٢﴾ وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ ﴿٣﴾ فَوَيْلٌ لِلْمُصَلِّينَ ﴿٤﴾ الَّذِينَ هُمْ عَنْ صَلَاتِهِمْ سَاهُونَ ﴿٥﴾ الَّذِينَ هُمْ يُرَاءُونَ ﴿٦﴾ وَيَمْنَعُونَ الْمَاعُونَ ﴿٧﴾", latin: "Ara'aytalladzī yukadzdzibu bid-dīn. Fadzālikal-ladzī yadu''ul-yatīm. Wa lā yahuddu 'alā tha'āmil-miskīn. Fawaylul-lil-mushallīn. Alladzīna hum 'an shalātihim sāhūn. Alladzīna hum yurā'ūn. Wa yamna'ūnal-mā'ūn.", translate: "Tahukah kamu orang yang mendustakan agama? Itulah orang yang menghardik anak yatim, dan tidak menganjurkan memberi makan orang miskin..." },
  { title: "QS. Quraisy (106)", arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ لِإِيلَافِ قُرَيْشٍ ﴿١﴾ إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ ﴿٢﴾ فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ ﴿٣﴾ الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ ﴿٤﴾", latin: "Li'īlāfi quraisy. Īlāfihim rihlatas-syitā'i was-sayf. Falya'budū rabba hādzal-bayt. Alladzī ath'amahum min jū'iw wa āmanahum min khawf.", translate: "Karena kebiasaan orang-orang Quraisy, (yaitu) kebiasaan mereka bepergian pada musim dingin dan musim panas. Maka hendaklah mereka menyembah Tuhan Pemilik rumah ini (Ka'bah). Yang telah memberi makanan kepada mereka untuk menghilangkan lapar dan mengamankan mereka dari ketakutan." },
  { title: "QS. Al-Fil (105)", arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ ﴿١﴾ أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ ﴿٢﴾ وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ ﴿٣﴾ تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ ﴿٤﴾ فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍ ﴿٥﴾", latin: "Alam tara kayfa fa'ala rabbuka bi'ashābil-fīl. Alam yaj'al kaydahum fī tadhlīl. Wa arsala 'alayhim thayran abābīl. Tarmīhim bihijāratim-min sijjīl. Faja'alahum ka'ashfim-ma'kūl.", translate: "Apakah kamu tidak memperhatikan bagaimana Tuhanmu telah bertindak terhadap tentara bergajah? Bukankah Dia telah menjadikan tipu daya mereka sia-sia? Dan Dia mengirimkan kepada mereka burung yang berbondong-bondong, yang melempari mereka dengan batu dari tanah liat yang dibakar. Lalu Dia menjadikan mereka seperti daun-daun yang dimakan ulat." },
  { title: "QS. Al-Humazah (104)", arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ وَيْلٌ لِكُلِّ هُمَزَةٍ لُمَزَةٍ ﴿١﴾ الَّذِي جَمَعَ مَالًا وَعَدَّدَهُ ﴿٢﴾ يَحْسَبُ أَنَّ مَالَهُ أَخْلَدَهُ ﴿٣﴾ كَلَّا لَيُنْبَذَنَّ فِي الْحُطَمَةِ ﴿٤﴾ وَمَا أَدْرَاكَ مَا الْحُطَمَةُ ﴿٥﴾ نَارُ اللَّهِ الْمُوقَدَةُ ﴿٦﴾ الَّتِي تَطَّلِعُ عَلَى الْأَفْئِدَةِ ﴿٧﴾ إِنَّهَا عَلَيْهِم مُّؤْصَدَةٌ ﴿٨﴾ فِي عَمَدٍ مُّمَدَّدَةٍ ﴿٩﴾", latin: "Waylul-likulli humazatil-lumazah. Alladzī jama'a mālaw-wa 'addadah. Yahsabu anna mālahuū akhladah. Kallā layumbadzianna fil-huthamah. Wa mā adrāka mal-huthamah. Nārullāhil-mūqadah. Allatī tattali'u 'alal-af'idah. Innahā 'alayhim mu'shadah. Fī 'amadim-mumaddadah.", translate: "Kecelakaanlah bagi setiap pengumpat lagi pencela, yang mengumpulkan harta dan menghitung-hitungnya, dia mengira bahwa hartanya itu dapat mengekalkannya. Sekali-kali tidak! Sesungguhnya dia benar-benar akan dilemparkan ke dalam Huthamah..." },
  { title: "QS. Al-'Asr (103)", arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ وَالْعَصْرِ ﴿١﴾ إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ ﴿٢﴾ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ ﴿٣﴾", latin: "Wal-'ashr. Innal-insāna lafī khusr. Illalladzīna āmanū wa 'amilush-shālihāti wa tawāshaw bil-haqqi wa tawāshaw bis-shabr.", translate: "Demi masa. Sungguh, manusia berada dalam kerugian, kecuali orang-orang yang beriman dan mengerjakan kebajikan serta saling menasihati untuk kebenaran dan saling menasihati untuk kesabaran." }
];

// ----------------------------------------
// RENDER DOA LIST
// ----------------------------------------
function renderDoaList() {
  const container = document.getElementById('doa-list');
  if (!container) return;
  const activeBtn = document.querySelector('.subtab-btn.active');
  const activeType = activeBtn ? activeBtn.getAttribute('data-doatype') : 'doa';
  const data = activeType === 'doa' ? doaData : surahData;
  container.innerHTML = '';
  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'doa-card';
    card.innerHTML = `
      <div class="doa-title">${item.title}</div>
      <div class="doa-arabic">${item.arabic}</div>
      <div class="doa-latin">${item.latin}</div>
      <div class="doa-translate">${item.translate}</div>
    `;
    container.appendChild(card);
  });
}

// ----------------------------------------
// TASBEH
// ----------------------------------------
let currentCount = parseInt(localStorage.getItem('tasbehCount') || '0');
const MAX_COUNT = 33;
const CIRCUMFERENCE = 565.48;

function updateTasbehUI() {
  let displayNum = currentCount % MAX_COUNT || (currentCount > 0 ? MAX_COUNT : 0);
  let cycle = Math.floor(currentCount / MAX_COUNT);
  if (currentCount > 0 && currentCount % MAX_COUNT === 0) { displayNum = MAX_COUNT; cycle = Math.floor(currentCount / MAX_COUNT) - 1; }
  const el = n => document.getElementById(n);
  if (el('tasbeh-count')) el('tasbeh-count').textContent = displayNum;
  if (el('floating-count')) el('floating-count').textContent = displayNum;
  if (el('tasbeh-cycle')) el('tasbeh-cycle').textContent = `Putaran: ${cycle}`;
  if (el('floating-cycle')) el('floating-cycle').textContent = cycle;
  if (el('tasbeh-total')) el('tasbeh-total').textContent = `Total: ${currentCount}`;
  const ring = el('ring-progress');
  if (ring) ring.style.strokeDashoffset = CIRCUMFERENCE - (displayNum / MAX_COUNT) * CIRCUMFERENCE;
}

const btnTap = document.getElementById('btn-tap');
const btnReset = document.getElementById('btn-reset');
if (btnTap) btnTap.addEventListener('click', () => {
  currentCount++;
  localStorage.setItem('tasbehCount', currentCount);
  updateTasbehUI();
  if (navigator.vibrate) navigator.vibrate(currentCount % 33 === 0 ? [100, 50, 100] : 30);
});
if (btnReset) btnReset.addEventListener('click', () => {
  if (confirm('Reset penghitung?')) { currentCount = 0; localStorage.setItem('tasbehCount', 0); updateTasbehUI(); }
});

// ----------------------------------------
// INFINITY CLOCK
// ----------------------------------------
const infinityPath = document.querySelector('.infinity-path-bg');
let prayerTimesData = null;

function updateInfinityClock() {
  if (!infinityPath || !infinityPath.isConnected) return;
  try {
    const totalLength = infinityPath.getTotalLength();
    if (!totalLength) return;
    const now = new Date();
    const t = (now.getHours() + now.getMinutes() / 60) / 24;
    const pt = infinityPath.getPointAtLength(t * totalLength);
    const ti = document.getElementById('time-indicator');
    if (ti) { ti.setAttribute('cx', pt.x); ti.setAttribute('cy', pt.y); }
    const ip = document.getElementById('infinity-progress');
    if (ip) { ip.style.strokeDasharray = totalLength; ip.style.strokeDashoffset = totalLength - (t * totalLength); }
    const ng = document.getElementById('prayer-nodes');
    if (ng && prayerTimesData) {
      ng.innerHTML = '';
      Object.values(prayerTimesData).forEach(time => {
        const [h, m] = time.split(':').map(Number);
        const p = infinityPath.getPointAtLength(((h + m / 60) / 24) * totalLength);
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('cx', p.x); c.setAttribute('cy', p.y); c.setAttribute('r', '3.5');
        c.classList.add('prayer-node');
        ng.appendChild(c);
      });
    }
  } catch (e) {}
}

// ----------------------------------------
// PRAYER TIMES & COUNTDOWN
// ----------------------------------------
function fetchPrayerTimes(lat, lng) {
  fetch(`https://api.aladhan.com/v1/timings/${Math.floor(Date.now()/1000)}?latitude=${lat}&longitude=${lng}&method=20`)
    .then(r => r.json()).then(data => {
      const t = data.data.timings;
      prayerTimesData = { Subuh: t.Fajr, Dzuhur: t.Dhuhr, Ashar: t.Asr, Maghrib: t.Maghrib, Isya: t.Isha };
      const ln = document.getElementById('location-name');
      if (ln) ln.textContent = `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;
      const hd = document.getElementById('hijri-date');
      if (hd) { const h = data.data.date.hijri; hd.textContent = `${h.day} ${h.month.en} ${h.year} H`; }
      renderPrayerList();
      startCountdown();
      setTimeout(updateInfinityClock, 200);
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
    for (const [name, time] of Object.entries(prayerTimesData)) {
      const [h, m] = time.split(':').map(Number);
      if (h * 60 + m > curM) { next = { name, totalMins: h * 60 + m }; break; }
    }
    if (!next) next = { name: 'Subuh', totalMins: 0 };
    const el = n => document.getElementById(n);
    if (el('next-prayer-name')) el('next-prayer-name').textContent = next.name;
    const diffMs = (next.totalMins - curM) * 60000 - now.getSeconds() * 1000;
    const hh = Math.floor(diffMs / 3600000), mm = Math.floor((diffMs % 3600000) / 60000), ss = Math.floor((diffMs % 60000) / 1000);
    if (el('countdown-timer')) el('countdown-timer').textContent = [hh, mm, ss].map(x => String(x).padStart(2, '0')).join(':');
    const nd = niatData[next.name];
    if (nd) {
      if (el('niat-arabic')) el('niat-arabic').textContent = nd.arabic;
      if (el('niat-latin')) el('niat-latin').textContent = nd.latin;
      if (el('niat-translate')) el('niat-translate').textContent = nd.translate;
      if (el('contextual-niat')) el('contextual-niat').classList.remove('hidden');
    }
  }, 1000);
}

function initQibla() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(pos => {
    fetchPrayerTimes(pos.coords.latitude, pos.coords.longitude);
  });
}

// ----------------------------------------
// GUIDE CONTENT
// ----------------------------------------
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
          <li>Niat dalam hati</li><li>Basuh kedua telapak tangan 3×</li><li>Berkumur 3×</li>
          <li>Bersihkan hidung 3×</li><li>Basuh wajah 3×</li><li>Basuh tangan s/d siku kanan 3×, lalu kiri 3×</li>
          <li>Usap sebagian kepala 1×</li><li>Usap kedua telinga 1×</li><li>Basuh kaki kanan s/d mata kaki 3×, lalu kiri 3×</li>
        </ol>
      </div>
      <div class="doa-card">
        <div class="doa-title">Doa Sesudah Wudhu</div>
        <div class="doa-arabic">أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ</div>
        <div class="doa-latin">Asyhadu allaa ilaaha illallaahu wahdahu laa syariika lahu wa asyhadu anna muhammadan 'abduhu wa rasuuluh.</div>
        <div class="doa-translate">Aku bersaksi bahwa tidak ada Tuhan selain Allah, yang Maha Esa, tiada sekutu bagi-Nya, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya.</div>
      </div>`;
  } else {
    content.innerHTML = `
      <div class="doa-card">
        <div class="doa-title">Rukun Shalat</div>
        <ol class="guide-list">
          <li>Niat</li><li>Berdiri tegak (bagi yang mampu)</li><li>Takbiratul ihram (Allahu Akbar)</li>
          <li>Membaca Al-Fatihah</li><li>Ruku' dengan tuma'ninah</li><li>I'tidal dengan tuma'ninah</li>
          <li>Sujud 2× dengan tuma'ninah</li><li>Duduk di antara dua sujud</li>
          <li>Duduk tahiyat akhir</li><li>Membaca tasyahud akhir</li><li>Membaca shalawat Nabi</li>
          <li>Salam pertama</li><li>Tertib (berurutan)</li>
        </ol>
      </div>
      <div class="doa-card">
        <div class="doa-title">Bacaan Takbiratul Ihram</div>
        <div class="doa-arabic">اللَّهُ أَكْبَرُ</div>
        <div class="doa-latin">Allaahu Akbar.</div>
        <div class="doa-translate">Allah Maha Besar.</div>
      </div>
      <div class="doa-card">
        <div class="doa-title">Bacaan Ruku'</div>
        <div class="doa-arabic">سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ</div>
        <div class="doa-latin">Subhaana rabbiyal 'adzimi wa bihamdih.</div>
        <div class="doa-translate">Maha Suci Tuhanku Yang Maha Agung, dan dengan memuji-Nya.</div>
      </div>
      <div class="doa-card">
        <div class="doa-title">Bacaan Sujud</div>
        <div class="doa-arabic">سُبْحَانَ رَبِّيَ الْأَعْلَى وَبِحَمْدِهِ</div>
        <div class="doa-latin">Subhaana rabbiyal a'laa wa bihamdih.</div>
        <div class="doa-translate">Maha Suci Tuhanku Yang Maha Tinggi, dan dengan memuji-Nya.</div>
      </div>`;
  }
}

// ----------------------------------------
// INIT
// ----------------------------------------
initQibla();
updateTasbehUI();
renderDoaList();
renderGuideContent('wudhu');
initGuideTabs();
setInterval(updateInfinityClock, 15000);
