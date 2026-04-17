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
    title: "Tolak Bala & Kejahatan (Santet)",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    latin: "Bismillahilladzi la yadhurru ma'asmihi syai'un fil ardhi wa laa fis-samaa'i wahuwas-samii'ul 'aliim",
    translate: "Dengan menyebut nama Allah yang dengan nama-Nya tidak ada satupun yang membahayakan di bumi maupun di langit. Dan Dialah Yang Maha Mendengar lagi Maha Mengetahui."
  },
  {
    type: "doa",
    category: "Do'a Pendek",
    title: "Keberanian & Perlindungan Musuh",
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
  {
    type: "doa",
    category: "Do'a Khusus",
    title: "Terhindar dari Penyakit & Wabah",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْبَرَصِ وَالْجُنُونِ وَالْجُذَامِ وَمِنْ سَيِّئِ الْأَسْقَامِ",
    latin: "Allahumma inni a'udzu bika minal barashi wal jununi wal judzami wa min sayyi'il asqami",
    translate: "Ya Allah, aku berlindung kepada-Mu dari penyakit kulit, gila, kusta, dan dari segala penyakit yang buruk."
  },
  {
    type: "doa",
    category: "Do'a Khusus",
    title: "Perlindungan dari Kesyirikan",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ أَنْ أُشْرِكَ بِكَ وَأَنَا أَعْلَمُ وَأَسْتَغْفِرُكَ لِمَا لَا أَعْلَمُ",
    latin: "Allahumma inni a'udzu bika an usyrika bika wa ana a'lamu wa astaghfiruka lima laa a'lamu",
    translate: "Ya Allah, aku berlindung kepada-Mu dari perbuatan syirik yang aku ketahui, dan aku memohon ampunan-Mu atas apa yang tidak aku ketahui."
  },

  // --- SURAT PENDEK (JUZ AMMA ORDER) ---
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
    arabic: "وَالتِّينِ وَالزَّيْتُونِ ۝ وَطُورِ سِينِينَ ۝ وَهَٰذَا الْبَلَدِ الْأَمِينِ ۝ لَقَدْ خَلَقْنَا الْإِنسَانَ فِي أَحْسَنِ تَقْوِيمٍ ۝ ثُمَّ رَدَدْنَاهُ أَسْفَلَ سَافِلِينَ ۝ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ فَلَهُمْ أَجْرٌ غَيْرُ مَمْنُونٍ ۝ fَمَا يُكَذِّبُكَ بَعْدُ بِالدِّينِ ۝ أَلَيْسَ اللَّهُ بِأَحْكَمِ الْحَاكِمِينَ",
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
    title: "QS. Al-Asr",
    arabic: "وَالْعَصْرِ ۝ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ ۝ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
    latin: "Wal 'ashr. Innal insaana lafii khusr. Illalladziina aamanuu wa 'amilus-shaalihaati wa tawaashau bil-haqqi wa tawaashau bish-shabr.",
    translate: "Demi masa. Sesungguhnya manusia itu benar-benar dalam kerugian, kecuali orang-orang yang beriman dan mengerjakan amal saleh dan nasehat menasehati supaya mentaati kebenaran dan nasehat menasehati supaya menetapi kesabaran."
  },
  {
    type: "surah",
    category: "Surah Pendek",
    title: "QS. Al-Humazah",
    arabic: "وَيْلٌ لِّكُلِّ هُمَزَةٍ لُّمَزَةٍ ۝ الَّذِي جَمَعَ مَالًا وَعَدَّدَهُ ۝ يَحْسَبُ أَنَّ مَالَهُ أَخْلَدَهُ ۝ كَلَّا لَيُنبَذَنَّ فِي الْحُطَمَةِ ۝ وَمَا أَدْرَاكَ مَا الْحُطَمَةُ ۝ نَارُ اللَّهِ الْمُوقَدَةُ ۝ الَّتِي تَطَّلِعُ عَلَى الْأَفْئِدَةِ ۝ إِنَّهَا عَلَيْهِم مُّؤْصَدَةٌ ۝ فِي عَمَدٍ مُّمَدَّدَةٍ",
    latin: "Wailul-likulli humazatil-lumazah. Alladzi jama'a maalaw-wa 'addadah. Yahsabu anna maalahuu akhladah. Kalla layunbadzanna fil-huthamah. Wa maa adraaka mal-huthamah. Naarullaahil-muuqadah. Allatii tath-thali'u 'alal-af-idah. Innaha 'alaihim mu'shadah. Fii 'amadim-mumaddadah.",
    translate: "Kecelakaanlah bagi setiap pengumpat lagi pencela, yang mengumpulkan harta dan menghitung-hitungnya, dia mengira bahwa hartanya itu dapat mengekalkannya, sekali-kali tidak! Sesungguhnya dia benar-benar akan dilemparkan ke dalam Huthamah. Dan tahukah kamu apa Huthamah itu? (yaitu) api (yang disediakan) Allah yang dinyalakan, yang (membakar) sampai ke hati. Sesungguhnya api itu ditutup rapat atas mereka, (sedang mereka itu) diikat pada tiang-tiang yang panjang."
  },
  {
    type: "surah",
    category: "Surah Pendek",
    title: "QS. Al-Fil",
    arabic: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ ۝ أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ ۝ وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ ۝ تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ ۝ فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍ",
    latin: "Alam tara kaifa fa'ala rabbuka bi ashhaabil-fiil. Alam yaj'al kaidahum fii tadhliil. Wa arsala 'alaihim thairan abaabiil. Tarmiihim bihijaaratim-min sijjiil. Faja'alahum ka'asfim-ma'kuul.",
    translate: "Apakah kamu tidak memperhatikan bagaimana Tuhanmu telah bertindak terhadap tentara bergajah? Bukankah Dia telah menjadikan tipu daya mereka (untuk menghancurkan Ka'bah) itu sia-sia? dan Dia mengirimkan kapada mereka burung yang berbondong-bondong, yang melempari mereka dengan batu (berasal) dari tanah yang terbakar, lalu Dia menjadikan mereka seperti daun-daun yang dimakan (ulat)."
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
    title: "QS. Al-Ma'un",
    arabic: "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ ۝ فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ ۝ وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ ۝ فَوَيْلٌ Lِّلْمُصَلِّينَ ۝ الَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ ۝ الَّذِينَ هُمْ يُرَاءُونَ ۝ وَيَمْنَعُونَ الْمَاعُونَ",
    latin: "Ara'aital-ladzi yukadh-dhibu bid-diin. Fadzaalikal-ladzii yadu'ul-yatiim. Walaa yahuddu 'alaa tha'aamil-miskiin. Fawailul-lil-musalliin. Alladziina hum 'an shalaatihim saahuun. Alladziina hum yuraa'uun. Wayamna'uunal-maa'uun.",
    translate: "Tahukah kamu (orang) yang mendustakan agama? Itulah orang yang menghardik anak yatim, dan tidak menganjurkan memberi makan orang miskin. Maka kecelakaanlah bagi orang-orang yang shalat, (yaitu) orang-orang yang lalai dari shalatnya, orang-orang yang berbuat riya, dan enggan (menolong dengan) barang berguna."
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
    arabic: "قُلْ يَا أَيُّهَا الْكَافِرُونَ ۝ لَا أَعْبُدُ مَا تَعْبُدُونَ ۝ وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ ۝ وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ ۝ وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُDُ ۝ لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
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
    title: "QS. Al-Lahab",
    arabic: "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ ۝ مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ ۝ سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ ۝ وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ ۝ فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ",
    latin: "Tabbat yadaa abii lahabiw-watabb. Maa aghnaa 'anhu maaluhuu wa maa kasab. Sayashlaa naaran dzaata lahab. Wamra'atuhuu hammaalatal-hatab. Fii jiidihaa hablum-mim-masad.",
    translate: "Binasalah kedua tangan Abu Lahab dan sesungguhnya dia akan binasa. Tidaklah berguna baginya hartanya dan apa yang ia usahakan. Kelak dia akan masuk ke dalam api yang bergejolak. Dan (begitu pula) istrinya, pembawa kayu bakar. Yang di lehernya ada tali dari sabu."
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
    arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ הנَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
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

// Init when App opens
initQibla();
initDoa();
