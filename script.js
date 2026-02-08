const chat = document.getElementById("chat");
const splash = document.getElementById("splash");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const clearChat = document.getElementById("clearChat");
const modelToggle = document.getElementById("modelToggle");
const modelMenu = document.getElementById("modelMenu");
const modelOptions = document.querySelectorAll(".model-option");
const currentModelBadge = document.getElementById("currentModelBadge");
const memoryToggle = document.getElementById("memoryToggle");
const memoryPanel = document.getElementById("memoryPanel");
const memoryList = document.getElementById("memoryList");
const clearMemory = document.getElementById("clearMemory");
const memoryToast = document.getElementById("memoryToast");
const introGate = document.getElementById("introGate");
const appRoot = document.getElementById("appRoot");
const enterAppBtn = document.getElementById("enterAppBtn");
const enterTransition = document.getElementById("enterTransition");
const plusToggle = document.getElementById("plusToggle");
const plusMenu = document.getElementById("plusMenu");
const advancedMathMode = document.getElementById("advancedMathMode");
const mathStudioToggle = document.getElementById("mathStudioToggle");
const mathStudioPanel = document.getElementById("mathStudioPanel");
const mathStudioInput = document.getElementById("mathStudioInput");
const mathStudioOutput = document.getElementById("mathStudioOutput");
const profanityLock = document.getElementById("profanityLock");
const banTimer = document.getElementById("banTimer");
const banPassword = document.getElementById("banPassword");
const banUnlockBtn = document.getElementById("banUnlockBtn");

let currentModel = "baluk-1.6";
let hasStartedChat = false;
let memoryToastTimer = null;
let lastBotResponse = "";
let introAudioCtx = null;
let introAudioNodes = [];
let introAmbientNodes = [];
let advancedMathEnabled = false;
let banUntil = 0;
let banInterval = null;
let lastStudioExplained = "";

const convoState = {
  awaitingMoodReply: false,
  awaitingGoalPlan: false,
  awaitingGeneralAnswer: false,
  awaitingEpsteinList: false,
  awaitingCreativeTheme: false,
  creativeMode: null,
  awaitingActivityChoice: false
};

const userMemory = JSON.parse(localStorage.getItem("balukMemory") || "{}");

const merhabaResponses = [
  "Selam dostum 😄 Buradayım ve yardıma hazırım. Sen nasılsın?",
  "Merhaba kanka 🌟 Baluk yanında. Sen nasılsın?",
  "Heyy, hoş geldin 🐟 Güzel bir sohbete var mısın? Sen nasılsın?",
  "Merhabaaa ✨ Enerjim yüksek, senden de iyi haber bekliyorum. Sen nasılsın?",
  "Selamlar 🤝 İstersen birlikte üretelim. Sen nasılsın?",
  "Merhaba dost 💙 Bugün nasıl hissediyorsun, sen nasılsın?",
  "Selam! Hazırım 🚀 Önce bir yoklama: sen nasılsın?",
  "Merhaba kankam 😎 Ben buradayım, sen nasılsın?",
  "Ahooy 🧭 Baluk aktif! Sen nasılsın?",
  "Selammm 🌈 Sohbete başlayalım, sen nasılsın?"
];

const nasilsinResponses = [
  "Ben iyiyim kanka 😄 Sen nasılsın?",
  "Gayet iyiyim dostum 🌟 Sen nasılsın?",
  "Harikayım, enerji full ⚡ Sen nasılsın?",
  "İyiyim ve buradayım 🐟 Sen nasılsın?",
  "Süperim, bugün çok motiveyim 🚀 Sen nasılsın?",
  "Baya iyiyim, sohbet modum açık 💙 Sen nasılsın?",
  "İyiyim vallahi, keyfim yerinde 😎 Sen nasılsın?",
  "Şu an çok iyiyim, birlikte üretmeye hazırım ✨ Sen nasılsın?",
  "İyiyim dost, sana da iyi gelmek isterim 🤝 Sen nasılsın?",
  "İyiyim, teşekkürler! Bugün çok canlıyım 🌈 Sen nasılsın?"
];

const saKeywords = [
  "sa", "selamün aleyküm", "selamun aleyküm", "selamünaleyküm", "selamunaleykum",
  "aleyküm selam", "aleykum selam", "selamun aleykum", "s.a", "a.s", "esselamu aleykum",
  "esselamün aleyküm", "hayırlı sabahlar", "hayırlı akşamlar", "hayırlı geceler", "cümleten selam", "selamlar", "selam", "merhaba"
];

const saResponses = [
  "Aleyküm selam canım dostum 🌙✨ Hoş geldin, nasılsın bugün?",
  "Ve aleyküm selam 🤍 Buradayım, birlikte harika işler çıkaralım!",
  "Selamün aleykümün alındı 🌟 Ruhun sakin, günün bereketli olsun!",
  "Aleyküm selam kankam 😄 İyi ki geldin, sana nasıl yardımcı olayım?",
  "Selam dostum 🐟 Kalpten bir selam da benden, keyifler nasıl?",
  "Aleyküm selam ✨ Modun yüksek olsun, bugün ne üretelim?",
  "Hoş geldin! 🤝 Selamını aldım, enerjin çok güzel geldi.",
  "Selamlarrr 🌈 Buradayım ve hazırım, hadi başlayalım!",
  "Aleyküm selam güzel insan 💙 İstersen sohbet, istersen çözüm modu açalım.",
  "Selamın başım üstüne 🙌 Bugün yanında Baluk var, birlikte hallederiz."
];

const profanityKeywords = [
  "amk", "aq", "ananı", "bacını", "siktir", "sik", "mk", "oç", "orospu", "piç", "yarrak", "göt", "ibne", "pezevenk", "mal"
];
const iyiyimFollowUpResponses = [
  "İyi olmana çooook sevindim canım dostum 💙 Bu enerjin gerçekten bana da geçti; istersen bu güzel modu korumak için birlikte minik bir plan da yapabiliriz ✨",
  "Harika haber bu! 🌟 İyi hissetmen şahane; bugün böyle devam etmen için sana kısa ama etkili bir motivasyon akışı çıkarabilirim 🚀",
  "Ayyy süper dedin ya içim açıldı 😄 İyi olman çok değerli; istersen şimdi bu güzel hâli bir hedefe dönüştürelim mi? 🎯",
  "Ne güzel söyledin, gerçekten mutlu oldum 🫶 İyi hissettiğin günlerde küçük bir üretim adımı atmak çok güçlü olur; birlikte başlatabiliriz 💫",
  "Mükemmel! Moralinin yüksek olması efsane bir başlangıç ⚡ İstersen şimdi mini bir challenge yapalım ve bunu daha da güzel pekiştirelim 🧠",
  "Bunu duymak bana çok iyi geldi kankam 🤝 İyi olman harika; istersen kısa bir odak planı yazayım, günü çok verimli kapatırsın 🌈",
  "Süpersin! 💙 İyi olman gerçekten kıymetli; şimdi bu enerjiyle ister şiir yazalım ister küçük bir matematik challenge yapalım 🐟",
  "Çok sevindim, içten söylüyorum 💐 Böyle hissettiğinde kendine minik bir ödül de ver, hak ettin; istersen beraber yaratıcı bir şey üretelim ✍️",
  "Valla bunu duyunca gülümsedim 😎 İyi olman çok iyi haber; istersen 10 dakikalık mini bir gelişim planı çıkarayım, tam gaz devam edersin 🚀",
  "Harikasın dostum, iyi hissetmen en güzel haberlerden biri 🎉 İstersen bu pozitif havayı korumak için sana kişisel mini rutin önerisi vereyim 🌿"
];

const goalPlanResponses = [
  "1) Su iç 2) 10 dk tek görev 3) Sonucu bana yaz 🎯",
  "Mini plan: nefes al, küçük hedef seç, hemen başla ✨",
  "Adım adım: ortamı düzenle, tek işe odaklan, bitince kutla 🎉",
  "Sakin plan: 5 dk mola + 10 dk odak + kontrol ✅",
  "Yormayan plan: hedefi küçült, zaman koy, başlat 🚀",
  "Plan: duyguyu yaz, ilk adımı seç, uygula 🌿",
  "Hedef planı: dikkat dağıtanı kapat, tek görev, kısa geri bildirim 🧠",
  "Toparlanma planı: nefes, su, mikro görev 💙",
  "Önce kolay görevi bitirelim, sonra ikinci adıma geçelim 🐟",
  "Kısa plan: şimdi başla, sonra bana 'tamamladım' yaz ✍️"
];

const neYapalimResponses = [
  "Mini matematik challenge yapalım: bana bir işlem yaz 📘",
  "Şiir yazalım; önce tema seçelim mi? ✨",
  "Hikâye yazalım; bana tema ver 📖",
  "Dertleşme + toparlanma modu yapalım 💙",
  "Slogan/metin üretelim 🚀",
  "3 kelime ver, mini metin yazayım 🎨",
  "Kısa hedef koyup bitirelim 🎯",
  "Bilmece turu yapalım 😄",
  "Özetleme modu açalım 🧠",
  "Sen seç: matematik / şiir / hikâye 🐟",
  "İstersen doğa temalı kısa bir şiir yazayım 🌿",
  "Aşk temalı mini hikâye deneyelim mi? 💞",
  "Duygu temalı bir anlatı çıkaralım 🎭",
  "Macera hikâyesi yazalım: tema sende 🧭",
  "Bilim kurgu şiiri yazalım mı? 🚀"
];

const memorySavedResponses = [
  "Belleğe kaydettim 🧠 Artık bunu hatırlayacağım.",
  "Not aldım ✍️ Bu bilgi artık belleğimde.",
  "Harika, belleğimi güncelledim 💾 İstersen kontrol edebilirsin.",
  "Kaydettim dostum 🌟 Bu detayı unutmayacağım.",
  "Tamamdır, bilgi belleğe işlendi ✅",
  "Süper! Bunu kalıcı hafızama ekledim 🐟",
  "Kayıt başarılı 🎯 İstediğin zaman 'belleğimde ne var' diyebilirsin.",
  "Oldu bu iş 😄 Belleğim güncellendi.",
  "Bilgiyi yakaladım ve sakladım 🧩",
  "Hafızama attım 🚀 Gerekince hemen kullanırım."
];

const generalYesResponses = [
  "Harika, o zaman devam ediyoruz 🚀",
  "Süper, hemen başlayalım 💙",
  "Mükemmel, bir sonraki adıma geçiyorum ✅",
  "Anlaştık, adım adım ilerleyelim 🌟",
  "Tamamdır, planı uygulamaya alıyorum 🎯"
];

const generalNoResponses = [
  "Sorun değil, istersen başka bir yoldan gidelim 🤝",
  "Tamam, o zaman farklı bir seçenek deneyelim ✨",
  "Anladım, planı buna göre revize edebilirim 🧠",
  "Peki, başka bir konuda destek olayım mı? 🐟",
  "Olur, daha sade bir versiyon hazırlayabilirim 💡"
];

const creativeThemes = [
  "doğa", "aşk", "duygu", "umut", "dostluk", "yağmur", "deniz", "gece", "şehir", "köy",
  "yalnızlık", "mutluluk", "özlem", "macera", "bilim kurgu", "fantastik", "uzay", "okul", "aile", "bahar"
];

const storyTemplates = [
  `{theme} rüzgârı sabah penceresinden içeri doldu.
Kahramanımız çantasına küçük bir defter koydu.
Sokağın başındaki eski saat tam 07:10’u gösterdi.
Bir martı üç kez dönüp aynı yere kondu.
Bu, büyük bir yolculuğun sessiz işaretiydi.
İlk adımda korktu ama geri dönmedi.
İkinci adımda bir dost buldu, adı Umut’tu.
Üçüncü adımda kayıp haritanın kenarı parladı.
Akşam olduğunda herkes onun değiştiğini fark etti.
Çünkü o gün {theme}, bir kelime değil; bir yön oldu.`,
  `{theme} gecesi köy meydanında ışıklar erken söndü.
Ninenin anlattığı efsane yine aynı cümleyle başladı.
“Kalbin temizse kapı kendiliğinden açılır.”
Çocuk, avucunda sakladığı anahtarı sıktı.
Yağmur ince ince inerken taş yol parladı.
Kapının ardında tozlu bir kütüphane uzanıyordu.
Her rafta farklı bir hayatın kokusu vardı.
En üst raftaki defterde kendi adını gördü.
Son sayfada tek bir not yazıyordu:
“{theme} seçtiğin an kaderin değişir.”`,
  `{theme} sabahında tren istasyona bir dakika erken geldi.
Vagonda yalnızca üç yolcu ve siyah bir kutu vardı.
Görevli, “Bunu son durakta teslim et,” dedi.
Kutunun üstünde ne isim ne de adres yazıyordu.
Yol boyunca camdan geçen manzaralar soldu.
Sanki şehir, nefesini tutmuş bekliyordu.
Son durakta kutu birdenbire ısındı.
Açınca içinden çocukluk fotoğrafı çıktı.
Arkasında şu cümle vardı:
“{theme} bazen eve dönmenin en kısa yoludur.”`,
  `{theme} akşamı deniz kıyısında bir şişe kıyıya vurdu.
Şişenin içinde mavi mürekkeple yazılmış bir mektup vardı.
“Bu satırları okuyan, yarım kalan şarkımı tamamlasın.”
Genç müzisyen hemen notaları karalamaya başladı.
İlk melodi dalga sesine karıştı.
İkinci melodi kalbinin titrek yerine dokundu.
Üçüncü melodi sahildeki insanları susturdu.
Gece yarısı şarkı bittiğinde rüzgâr yön değiştirdi.
Uzakta bir fener üç kez yanıp söndü.
Ve herkes, {theme}nin sesini aynı anda duydu.`,
  `{theme} vakti okulun çatı katı nihayet açıldı.
Tozlu kutuların arasında kırık bir pusula parlıyordu.
Pusula kuzeyi değil kalbi gösteriyordu.
Üç arkadaş sırayla tutup yön denedi.
Her birinde iğne başka yere döndü.
Sonra hepsi elini aynı anda koydu.
İğne birden sabitlendi, eski parka işaret etti.
Parkın ortasında gömülü teneke bir sandık bulundu.
Sandığın kapağında kabartma bir yazı vardı:
“Birlikte yürürseniz {theme} sizi asla yarı yolda bırakmaz.”`,
  `{theme} öğlesinde şehirdeki bütün saatler durdu.
İnsanlar önce şaka sandı, sonra panik başladı.
Sadece küçük bir tamirci dükkânı açıktı.
Usta, “Saatler değil, niyetler bozuldu,” dedi.
Çırak, eski bir zembereği yerine taktı.
Dükkânın duvarındaki saat yeniden tik tak dedi.
Bu ses dalga dalga sokaklara yayıldı.
Bir market, bir kafe, bir okul aynı anda canlandı.
Akşamüstü belediye hoparlöründen tek cümle duyuldu:
“Bugün {theme} sayesinde zaman yeniden yürümeye başladı.”`,
  `{theme} gecesi lunaparkın paslı kapısı aralandı.
Elektrikler yoktu ama dönme dolap kendi kendine döndü.
Kahramanımız cebindeki bozuk parayı sıkıca tuttu.
Her kabinin camında farklı bir anı belirdi.
Birinde çocukluğu, birinde kaybettiği dostu vardı.
En üst kabinde korkusu karşısına çıktı.
Aşağı inerken artık dizleri titremiyordu.
Kapıdan çıkarken görevli sessizce gülümsedi.
Biletin arkasında şu not yazılıydı:
“{theme}, korkunun içinden geçebilenlere görünür.”`,
  `{theme} sabahı postacı yanlış adrese bir zarf bıraktı.
Zarfın üstünde yalnızca “Doğru kişiye” yazıyordu.
Genç kız merakla açınca içinden bir harita çıktı.
Harita, şehrin hiç bilmediği ara sokaklarını gösteriyordu.
Her köşede küçük bir görev yazılıydı.
“Bir yabancıya selam ver, bir çiçeği sula, affet.”
Görevler tamamlandıkça harita aydınlandı.
Son durağa geldiğinde aynalı bir kapı buldu.
Kapıda tek cümle parlıyordu:
“{theme}, dışarıda aradığın değil; içeride büyüttüğündür.”`,
  `{theme} ikindisinde çölde tek ağaç gölge verdi.
Yolcular suyu azaldığı için durmak zorundaydı.
Ağacın kovuğunda cam bir tüp bulundu.
Tüpün içinde rulo yapılmış ince bir kâğıt vardı.
Kâğıtta eski bir dilde yön tarifleri yazıyordu.
Rehber kelimeleri çözerken güneş batmaya başladı.
Gece olunca yıldızlar tarifle aynı şekli aldı.
Onları izleyerek gizli vahayı buldular.
Vahanın giriş taşında şu ibare vardı:
“{theme} paylaşılınca çoğalan tek sudur.”`,
  `{theme} mevsiminde dağın eteğinde sis hiç dağılmadı.
Köylüler oradan geçmeye cesaret edemiyordu.
Bir gün küçük çoban kayıp keçisini aramak için girdi.
Sis içinde mırıldanan bir melodi duydu.
Ses onu dar bir patikaya yönlendirdi.
Patikanın sonunda sıcak bir mağara vardı.
Mağaranın duvarları yıldız gibi parlıyordu.
Ortada yanan ateşin etrafında eski resimler çiziliydi.
Son resimde aynı çocuk, elinde fenerle görünüyordu.
Altına tek kelime yazılmıştı: “{theme}.”`,
  `{theme} günü kütüphane kapanıştan sonra nefes aldı.
Rafların arasından ince bir ışık süzüldü.
Nöbetçi öğrenci ışığı takip etti.
Işık, yasaklı bölümdeki kırmızı kitaba indi.
Kitabın ilk sayfası boştur diye biliniyordu.
Ama bu kez sayfada taze bir cümle vardı.
“Bugün okuyan kişi, yarını değiştirecek.”
Öğrenci gece boyunca notlar çıkardı.
Sabah olduğunda okulun ilan panosunda yeni proje asılıydı.
Ve herkes bu değişimi {theme} ile anmaya başladı.`,
  `{theme} akşamüstü limandaki fener birden söndü.
Gemiler açıkta beklemeye başladı.
Yaşlı kaptan, “Bu işaret iyi değil,” dedi.
Genç tayfa korksa da fener odasına çıktı.
Odada kırık mercek ve paslı bir vida buldu.
Aşağıdan gelen dalga sesi ritim tutuyordu.
Tornavida döndükçe ışık güçlendi.
Tam o anda sis ikiye ayrıldı.
Uzakta kayıp tekne limana yöneldi.
Kaptan gülerek fısıldadı: “{theme} yol gösterir.”`,
  `{theme} sabahı müzede alarm çalmadan vitrin açıldı.
Camın içindeki puslu tablo canlanır gibi oldu.
Güvenlik görevlisi yaklaşınca renkler akmaya başladı.
Tablodaki köprü gerçek bir köprüye dönüştü.
Görevli cesaret edip içeri adım attı.
Karşı kıyıda çocukluk mahallesi onu bekliyordu.
Eski arkadaşları tek tek karşısına çıktı.
Hepsi tek bir soruyu aynı anda sordu:
“Bugün kimi affedeceksin?”
Döndüğünde vitrinin altında tek kelime parlıyordu: “{theme}.”`,
  `{theme} gecesinde apartmanın asansörü 13’e takıldı.
Oysa binada 13. kat yoktu.
İki komşu merak edip tuşa birlikte bastı.
Kapı açıldığında uzun bir koridor belirdi.
Duvarlarda binanın eski sakinlerinin fotoğrafları vardı.
Her fotoğrafın altında yarım bir cümle duruyordu.
Koridor sonunda yuvarlak bir oda çıktı.
Ortadaki masada boş bir defter bekliyordu.
İlk satıra adlarını yazınca ışıklar yandı.
Defter kendiliğinden tamamladı: “{theme} ile yeni başlangıç.”`,
  `{theme} sabahında pazar yerinde tüm sesler yankılandı.
Satıcıların bağırışı aynı notaya dönüştü.
Küçük kemancı bu notayı takip etti.
Yankı onu kapalı dükkânların arkasına götürdü.
Orada yıllardır çalınmayan bir piyano vardı.
Tuşlara dokununca yağmur başladı.
İnsanlar şemsiyesiz halde ama gülerek toplandı.
Sokak bir anda açık hava konserine dönüştü.
Son parça bittiğinde gökkuşağı göründü.
Herkes bu günü “{theme} konseri” diye hatırladı.`,
  `{theme} öğleden sonrası eski sinema yeniden açıldı.
Afişte gösterimde olmayan bir filmin adı yazıyordu.
Salon bomboştu, sadece bir seyirci vardı.
Film başlayınca perdeye kendi hayatı yansıdı.
Ama sahneler hiç yaşamadığı ihtimallerdi.
Birinde cesur, birinde sabırlı, birinde neşeliydi.
Ara verildiğinde projeksiyon odasından bir ses geldi.
“İstediğin sonu seçme hakkın var.”
Seyirci koltuğuna geri döndü ve gözlerini kapattı.
Perde açıldığında cevap tek kelimeydi: “{theme}.”`,
  `{theme} sabahı dağ kasabasına beklenmedik bir kar düştü.
Yollar kapandı, okul tatil edildi.
Çocuklar sevinirken fırındaki un azaldı.
Genç öğretmen gönüllü ekip kurdu.
Herkes evindeki unu, sütü, odunu paylaştı.
Meydanda büyük bir taş fırın yakıldı.
Sıcak ekmek kokusu bütün sokaklara yayıldı.
Yaşlılar dua etti, çocuklar şarkı söyledi.
Akşama doğru yollar açıldığında kimse acele etmedi.
Çünkü o gün kasaba {theme} ile ısınmıştı.`,
  `{theme} gecesi bilgisayar laboratuvarında ekranlar açıldı.
Öğrenciler çıkmış, bina sessizleşmişti.
Bir monitörde tek bir satır kod yanıp sönüyordu.
“if (heart == true) { world.change(); }”
Nöbetçi öğrenci kodu şaka sandı.
Derleyip çalıştırınca şehir haritası canlandı.
Kırmızı alanlar birer birer maviye döndü.
Hava kalitesi, trafik, enerji grafikleri iyileşti.
Ekranın altında sistem mesajı belirdi:
“{theme} olmadan hiçbir algoritma tamamlanmaz.”`,
  `{theme} ikindisinde nehir kenarında köprü sallandı.
Mühendis ekip acil onarım için çağrıldı.
En genç mühendis projeyi ilk kez yönetiyordu.
Rüzgâr sert, akıntı güçlü, ekip yorgundu.
O, panik yerine görevleri küçük parçalara böldü.
Herkes sırayla en iyi bildiğini yaptı.
Gece yarısı son cıvata yerine oturdu.
Köprü yeniden açıldığında ilk geçen bir ambulans oldu.
Telsizden gelen teşekkür sesi herkesi susturdu.
Ve genç mühendis o an {theme}nin gücünü anladı.`,
  `{theme} sabahında sahaf dükkânına adsız bir kitap geldi.
Kapakta ne başlık ne yazar vardı.
İlk sayfada yalnızca bir tarih yazıyordu: yarın.
Müşteri merakla ikinci sayfayı çevirdi.
Orada gün içinde yaşayacağı küçük olaylar sıralıydı.
Kahve dökülecek, telefon çalacak, biri yardım isteyecek.
Gün ilerledikçe her şey birebir gerçekleşti.
Son maddeye gelince durdu: “Akşam 19:40’ta karar ver.”
Saat gelince kapıda bekleyen çocuğa kitap hediye etti.
Kitabın son satırı kendiliğinden tamamlandı: “{theme} seçildi.”`,
  `{theme} öğlesinde tersanedeki eski gemi suya indirildi.
Kimse bu geminin yüzmeyeceğine inanıyordu.
Usta kadın mühendis planı yıllarca saklamıştı.
Her parça geri dönüştürülmüş metalden yapılmıştı.
Motor sessiz, gövde hafif, rota netti.
Deneme sürüşünde dalgalar gemiyi zorladı.
Kaptan kısa bir an tereddüt etti.
Mühendis köprüüstüne çıkıp sadece gülümsedi.
Gemi dalgayı yarıp ufka doğru aktı.
Liman defterine tek not düşüldü: “{theme} başardı.”`,
  `{theme} akşamı tiyatro sahnesinde perde açılmadı.
Oyuncular kuliste birbirine bakıp sustu.
Başrol oyuncusu sesini tamamen kaybetmişti.
Yönetmen oyunu iptal etmeyi düşündü.
Tam o sırada suflör yeni bir fikir sundu.
Sözsüz bir anlatı, ışık ve beden diliyle oynayacaklardı.
Müzik başladı, seyirci nefesini tuttu.
Hiçbir kelime olmadan hikâye kalplere ulaştı.
Finalde salon dakikalarca ayakta alkışladı.
Ve ekip, {theme}nin bazen sessizlikte büyüdüğünü gördü.`,
  `{theme} sabahında köprü altına renkli bir grafiti yapıldı.
Çizimde dev bir balık, elinde fener taşıyordu.
Mahalleli önce şaşırdı, sonra yanına notlar bırakmaya başladı.
Her not bir dilek, bir özür, bir teşekkürdü.
Duvar gün geçtikçe yaşayan bir mektuba dönüştü.
Belediye silmek yerine etrafını düzenledi.
Hafta sonu herkes boya kutusuyla geldi.
Çocuklar yıldızlar, büyükler yollar çizdi.
Sonunda duvarın ortasına ortak bir cümle yazıldı:
“Bu mahalle {theme} ile nefes alır.”`,
  `{theme} gecesinde dağ evine elektrik gelmedi.
Aile mum ışığında yemek yemeye oturdu.
Telefonlar çekmediği için kimse ekrana bakamadı.
Dede eski bir kutu çıkarıp masa ortasına koydu.
Kutunun içinde yıllardır saklanan mektuplar vardı.
Herkes sırayla bir mektup okudu.
Kimi güldü, kimi ağladı, kimi sarıldı.
Gece uzadıkça odanın soğuğu kayboldu.
Sabah elektrik geldiğinde kimse acele etmedi.
Çünkü o gece {theme}, evi gerçek yuva yaptı.`,
  `{theme} öğleden sonrası bilim merkezinde deney patladı.
Alarm çalınca herkes güvenli alana geçti.
Genç araştırmacı veri kaybından korkuyordu.
Sunucuların biri hâlâ sıcaklık veriyordu.
Ekip lideri sakin kalıp görev dağıttı.
Bir grup sistemi soğuttu, bir grup yedek aldı.
Yirmi dakika sonra risk tamamen bitti.
Verilerin çoğu kurtarıldı, rapor tamamlandı.
Toplantı sonunda tek bir ders çıkarıldı:
“{theme}, kriz anında en iyi protokoldür.”`,
  `{theme} sabahı köy okuluna yeni bir öğretmen geldi.
Sınıfta farklı yaşlardan on iki çocuk vardı.
Kitap azdı ama merak çoktu.
Öğretmen derse bir soru ile başladı:
“Bugün dünyayı nasıl daha iyi yaparız?”
Her çocuk küçük bir fikir söyledi.
Biri ağaç dikmek, biri yaşlıya yardım etmek dedi.
Fikirler bir panoda toplanıp görevlere dönüştü.
Ay sonunda okulun bahçesi mini ormana benzedi.
Köy takvimine bu ayın adı yazıldı: “{theme} ayı.”`,
  `{theme} gecesi radyoda unutulmuş bir frekans açıldı.
Sunucu yoktu ama yayın sürüyordu.
Mikrofondan yalnızca gerçek hikâyeler okunuyordu.
Dinleyenler mesaj atıp devamını istedi.
Her gece yeni bir ses, yeni bir anı geldi.
Kimi barıştı, kimi cesaret buldu, kimi teşekkür etti.
Şehirde insanlar bu saatte sessizleşmeye başladı.
Çünkü herkes aynı frekansta buluşuyordu.
Bir ay sonra frekans yeniden kayboldu.
Geriye tek slogan kaldı: “{theme} duyan kulaklar içindir.”`,
  `{theme} sabahında belediye binasına eski bir saat asıldı.
Saatin akrebi bazen ileri, bazen geri gidiyordu.
Başkan bunu söktürmek istedi.
Ama yaşlı bir saatçi “Bir hafta bekleyin,” dedi.
Hafta boyunca insanlar saate bakıp yavaşlamayı öğrendi.
Kimse kırmızı ışıkta acele etmedi.
Komşular kapıda iki dakika daha konuştu.
Esnaf müşteriyi dinlemek için tezgâhı bıraktı.
Yedinci gün saat normal ritme döndü.
Meydandaki tabela güncellendi: “Şehrin yeni zamanı: {theme}.”`,
  `{theme} akşamüstü kıyıda küçük bir tekne ters döndü.
Sahildeki gençler tereddüt etmeden suya girdi.
Biri can simidi attı, biri telefonla yardım çağırdı.
Biri ıslanan çocuğu battaniyeye sardı.
Dakikalar içinde herkes bir iş üstlendi.
Kurtarma ekibi geldiğinde tehlike azalmıştı.
Kıyıda sessiz bir alkış yükseldi.
Çocuk gözlerini açıp ilk kez gülümsedi.
Gün batımında deniz sakinleşti.
Ve sahil halkı, {theme}nin en gerçek hâlini yaşadı.`,
  `{theme} gecesinde gökyüzünde beklenmedik bir yıldız kaydı.
Kasaba halkı aynı anda dilek tuttu.
Küçük kız dileğini kimseye söylemedi.
Ertesi sabah meydanda ücretsiz kitap standı kuruldu.
Bir öğretmen, bir bakkal, bir berber destek verdi.
Gün boyu çocuklar sıra olup kitap aldı.
Akşam kız, annesine usulca fısıldadı:
“Dün gece kitap isteyen herkes için dilek tuttum.”
Annesi gülümseyip onu kucakladı.
Kasaba o günü deftere şöyle yazdı: “{theme} yıldızı.”`,
  `{theme} sabahında balıkçı ağı beklenmedik şekilde ağırlaştı.
Herkes büyük bir balık yakalandı sandı.
Ağdan paslı bir sandık çıktı.
Sandığın içinde bozuk paralar değil, çocuk mektupları vardı.
Mektuplar yıllar önce denize bırakılan hayallerdi.
Köy halkı mektupları tek tek okudu.
Kiminde doktor olma, kiminde geziye çıkma hayali vardı.
Muhtar, meydanda “hayal fonu” kurdu.
İlk burs bir balıkçı çocuğuna verildi.
Ve deniz o gün {theme} ile geri konuştu.`,
  `{theme} ikindisinde şehrin üstüne ince bir sis çöktü.
Navigasyonlar hata verdi, yollar karıştı.
Trafik polisi kavşakta tek başına kaldı.
Yakındaki öğrenciler gönüllü olup yönlendirme yaptı.
Bir kafe ücretsiz sıcak su dağıttı.
Eczane maskeleri kapıya bıraktı.
Otobüs şoförleri rota bilgisini anonsla paylaştı.
İki saat sonra sis açıldığında kimse birbirini tanımıyordu ama herkes yardım etmişti.
Akşam haberlerinde tek cümle geçti.
“Bugün şehri {theme} ayakta tuttu.”`
];

const poemTemplates = [
  `Geceye usulca eğilen bir dal gibiyim,
şehrin gürültüsünde seni duyar gibiyim,
bir adım atsak dünya yumuşar sanki,
çünkü kalbimde çoğalan şey hep {theme}.

Pencereme vuran yağmur adını heceler,
yol kenarında bekleyen umut beni sezer,
uzak sandığım sabah bir anda yakına iner,
çünkü her karanlığı delen ışık {theme}.

Bir fincan çayda dinlenen eski hikâyeler,
yorgun omuzlarda çoğalan sessiz emekler,
bir merhaba ile açılan paslı kapılar,
hepsi aynı kıyıya varır: {theme}.

Son dizede söyleyecek tek sözüm kalır,
ne eksik ne fazla, tam yerini bulur,
beni bana geri veren o ince köprü,
adını sorarsan cevabı bellidir: {theme}.`,
  `Sabahın ilk kuşu çatımda bir not bıraktı,
“acele etme” dedi, “zaman sana da akacak.”
Kırık saatimi avucuma alıp sustum,
içimde bir kapı aralandı: {theme}.

Sokak lambaları tek tek sönerken,
dün dargın olduğum yüzler yumuşadı,
bir tebessüm bazen büyük bir devrimdir,
ben bunu en çok {theme} ile anladım.

Rüzgâr saçlarıma çocukluğumu üfledi,
annemin sesinde kalan sıcaklığı,
babamın omzunda öğrendiğim güveni,
aynı heceye topladım: {theme}.

Şimdi geceye bakıp korkmuyorum,
yıldızlar susunca bile yol buluyorum,
çünkü içimde yanan küçük fenerin
yakıtı tek kelime: {theme}.`,
  `Bir taş köprüden geçerken adımlarım çoğaldı,
her yankı bana başka bir cesaret anlattı,
düşmekten değil denememekten korktum,
ve ilk sıçrayışımın adı oldu {theme}.

Deniz kıyısında oturup ellerimi ısıttım,
soğuk dalgalar bile kalbe iyi gelir bazen,
çünkü kabuğunu kıran her dalga
insana yeniden başlamayı öğretir.

Bir çocuk bana gülümseyip geçti,
ceplerimdeki keder hafifledi,
anladım ki iyilik bulaşıcıdır,
ve en hızlı yayılanı {theme}.

Yarın ne getirir bilmem ama
bugün elimde sağlam bir pusula var,
kuzeyi göstermese de olur,
yeter ki iğnesi {theme}ye dönsün.`,
  `Ay ışığı balkonuma beyaz bir örtü serdi,
şehrin yorgun nefesi bir anlığına durdu,
ben de sustum, çünkü bazen susmak
en doğru kelimeyi büyütür: {theme}.

İnce bir kahve kokusu odada dolaştı,
uzun zamandır aramadığım dostu andım,
bazı yollar telefon kadar yakındır,
numarayı çevirmeye cesaret gerekir.

Bir cümle yarım kaldı defterimde,
onu tamamlayan el benim değildi,
sanki görünmeyen bir öğretmen
“devam et” diye omzuma dokundu.

Şimdi dize dize toparlıyorum kendimi,
parçaları birleştiren görünmez ip
ne kader ne tesadüf ne de mucize,
bence sadece {theme}.`,
  `Kış sabahı camda buğudan bir yol çizdim,
parmağım titredi ama geri çekmedim,
insan bazen kendine söz verir,
o sözün tanığı olur {theme}.

Dışarıda rüzgâr tabelaları salladı,
içeride soba çıtırdayıp türkü söyledi,
aynı evde farklı yaralar taşısak da
aynı şifaya yürür adımlar.

Bir mektup buldum eski kitapta,
mürekkebi solmuş ama niyeti diri,
“kırıl ama katılaşma” yazıyordu,
uzun uzun düşündüm bu öğüdü.

Akşam olunca aynaya gülümsedim,
çok değil, sadece biraz daha gerçek,
çünkü insanı insana yaklaştıran
en kısa yol hep {theme}.`,
  `Göl kıyısında duran söğüt eğildi,
yaprakları suya dua gibi değdi,
ben de içimdeki taşları bıraktım,
dibe çöken her şey hafifledi.

Gökyüzü griydi ama kötü değildi,
bazen renkler değil niyet belirler günü,
bazen küçük bir “nasılsın?” sorusu
büyük bir fırtınayı dindirir.

Ayakkabım çamura battı, güldüm,
kusursuzluk aramaktan yorulmuşum,
lekeler de hikâyenin parçasıymış,
tertemiz sandığım sayfalar boşmuş.

Şimdi avucumda ılık bir rüzgâr,
adı yok sanırdım, varmış meğer,
beni benden alan o yumuşak güç
tek kelimeyle söylenir: {theme}.`,
  `Bir istasyon bankında beklerken
yanıma oturan yaşlı adam sustu,
suskunluğunda bin cümle saklıydı,
ben dinlemeyi o gün öğrendim.

Tren gecikti, saat uzadı,
ama acele eden yalnızca zihnimdi,
kalbim ilk kez yavaş yürüdü,
adımlarım kendine yetişti.

Çantamda kırık bir kalem vardı,
yazmaz sanmıştım, yine yazdı,
demek ki bazı şeyler bitmez,
biraz inat, biraz inanç yeter.

Vagon gelirken içim netti,
nereye gideceğimi biliyordum,
çünkü varış noktasından önce
insana gereken şey {theme}.`,
  `Raflarda tozlanan anılarımı indirdim,
her birini silip yerine koydum,
unutmak değil düzenlemekmiş mesele,
içimde yer açtıkça nefesim çoğaldı.

Kapı eşiğinde duran tereddüt,
bir adım ötede kaldı bu kez,
çünkü korku da konuşur ama
son sözü ona bırakmamak gerek.

Bir dost ses oldu geceme,
“buradayım” dedi, o kadar,
bazen büyük çözümler değil,
küçük varlıklar iyileştirir.

Defterimin sonuna çizdiğim nokta
aslında bir başlangıç halkası,
adını altına titremeden yazdım:
{theme}.`,
  `Dağın doruğunda ince bir kar,
aşağıda köyde sıcak bir çorba,
iki uç arasında kurulan köprü
insanın içindeki denge gibi.

Rüzgâr yüzümü sertçe yokladı,
“dayanır mısın?” diye sordu,
ben de “yalnız değilsem evet” dedim,
cevap yankı olup geri döndü.

Bir çocuğun eldiveni düştü,
eğilip aldım, gülümsedi,
bütün günün en parlak anı
o küçücük teşekkür oldu.

Akşam dağ mora çalarken
içimde bir ateş sabit kaldı,
adını bilmesem de tanırdım,
şimdi biliyorum: {theme}.`,
  `Yol kenarında bir taşa oturdum,
uzaktan gelen ezanla kuş sesi karıştı,
şehir ve kır aynı cümlede buluştu,
kalbim iki ritme birden uydu.

Cep telefonum sustu bir an,
sessizlik sandığım şey müzikmiş,
nefesimin iniş çıkışında bile
saklı bir şiir varmış meğer.

Bir çift göz bana umutla baktı,
sormadı, istemedi, sadece baktı,
anladım: güven bazen kelimesizdir,
ve en doğru dil bakıştır.

Eve dönerken hava serindi,
ama içim üşümedi hiç,
çünkü omzuma görünmeden konan
şeyin adı {theme}.`,
  `Gecikmiş bir otobüs durağında
iki yabancı aynı hikâyeyi taşıdı,
biri kaybettiğini anlattı,
diğeri bulduklarını paylaştı.

Gökyüzü kurşuni, yol ıslak,
ama konuşma ilerledikçe
bulutun rengi açılır gibi oldu,
insan insana hava olurmuş.

Cebimdeki son bozuklukla
sıcak bir simit aldım,
yarısını yanımdakiyle böldüm,
karın doyunca kalp de yumuşar.

Otobüs geldiğinde vedalaştık,
isim bile sormadık birbirimize,
ama ikimiz de aynı şeyi aldık:
{theme}.`,
  `Bir pazar sabahı balkon demirine
serçe kondu, başını eğdi,
sanki bana bir haber getirdi:
“bugün yavaş yaşa.”

Çamaşır ipinde sallanan gömlek
geçmiş günlerin kokusunu taşıdı,
her kırışıkta bir emek izi,
her düğmede bir sabır vardı.

Mutfağın ışığına dolan buhar
camda kısa bir bulut çizdi,
elimi uzatıp adını yazdım,
harflerim bile ısındı.

Öğleden sonra gölgem uzarken
içimdeki telaş kısaldı,
çünkü günü tamamlayan mühür
hep aynı: {theme}.`,
  `Bir mevsim değişti fark etmeden,
ağaçlar giysisini sessizce bıraktı,
ben de bazı sözlerimi bıraktım,
daha hafif bir dil seçtim.

Kırgınlık bir taş gibi ağırdı,
avucumda taşıdım, yoruldum,
sonra suya bıraktım usulca,
dalgalar benden iyi taşıdı.

Bir kapı çaldı akşamüstü,
gelene sarılınca çözüldüm,
insan bazen tek bir temasla
yılların yükünü indirir.

Şimdi pencereyi açık bıraktım,
rüzgâr içeri rahatça girsin diye,
çünkü içerde çoğalsın istediğim
şeyin adı {theme}.`,
  `Sahilde yürürken ayakkabım ıslandı,
her dalga ayrı bir ders getirdi,
“geri çekilmek yenilmek değildir”
dedi su, “yeniden gelmek içindir.”

Ufuk çizgisi düz görünür,
ama içinde bin ihtimal saklar,
insan da dışarıdan sakin durur,
içinde koca deniz taşır.

Yakamoz geceye küçük kıvılcım,
karanlığa “buradayım” diyen işaret,
ben de kendi payıma düşeni
ufacık da olsa yakmaya niyet ettim.

Sabaha karşı eve dönerken
ceplerimde kum ve gülüş vardı,
ve kalbimde net bir cümle:
{theme} ile yol bulunur.`,
  `Eski bir radyoda cızırtı arasında
çocukluğumun şarkısı yakalandı,
notalar kırık ama tanıdıktı,
içimde bir pencere açıldı.

Annemin mutfakta söylediği ezgi,
babamın kapıda bıraktığı dua,
aynı melodiye bağlanıp
yorgun günümü sardı.

Bir anda anladım, iyileşmek
hep büyük olaylarla gelmiyor,
bazen tanıdık bir ses
insanı köküne bağlıyor.

Radyoyu kapatmadım o gece,
arkada usulca çalsın istedim,
çünkü evin nabzını düzenleyen
ritmin adı {theme}.`,
  `Kalabalık caddede yürürken
kendimi kaybettim sandım,
sonra vitrine yansıyan yüzümde
eski bir cesaret gördüm.

İşaretler kırmızıdan yeşile döndü,
ben de içimdeki ışığı değiştirdim,
“yapamam” cümlesini silip
“denerim” yazdım yerine.

Bir yabancı yolu sordu,
bildiğim kadar tarif ettim,
kısa bir teşekkür aldı gözüm,
günün ödülü buydu.

Akşam defterime not düştüm:
bugün biraz daha bendim,
beni ben yapan omurga
şüphesiz {theme}.`,
  `Çatıya çıktım gece yarısı,
şehir yıldızlara benzemeye çalışıyordu,
her pencerede başka bir hikâye,
her hikâyede ortak bir arayış.

Soğuk demire yaslanıp
uzun zamandır ertelediğim soruyu sordum,
“ne istiyorum gerçekten?”
cevap hemen gelmedi.

Ama bir kuş geçti karanlığı yarıp,
kanadının sesi bile yeter dedi,
her şeyin net olması gerekmez,
yol bazen yürürken görünür.

Merdivenden inerken içim sakindi,
çünkü belirsizlikle dost olunca
yanında kalan tek sağlam arkadaş
{theme} oluyor.`,
  `Bir dere kenarında taş sektirdim,
ilki battı, ikincisi de,
üçüncü taş suyun üstünde
uzun bir çizgi bıraktı.

Başarısızlıkların toplamı
insanı eksiltmek zorunda değil,
aksine doğru açıyı öğretir,
elin ağırlığını ayarlar.

Bir çocuk “bir daha at” dedi,
attım, bu kez daha uzağa gitti,
sevinci benden çoktu,
amma ikimize de yetti.

Gün biterken cebimde taşlar,
aklımda o küçük ders kaldı:
ısrarın kalbe dönüşmüş hâli
{theme}.`,
  `Kütüphanede en arka masada
kimsenin dokunmadığı bir kitap,
kapakta silik bir kelime,
içeride parlak bir yol vardı.

Sayfalar arasında yürür gibi
kendi geçmişime uğradım,
pişmanlıkla şefkat aynı rafta,
ikisinin de yeri varmış.

Bir cümlenin altını çizdim:
“insan değişir, yeter ki izin versin,”
kalemin ucu titremedi,
çünkü bu kez hazırdım.

Kitabı kapatırken içimde
sessiz bir alkış duyuldu,
öğrendiğim şeyin özeti
tek sözcükte toplandı: {theme}.`,
  `Yağmurdan sonra asfalt parlar,
şehrin yorgun yüzü yıkanır,
ben de içimde biriken tozu
iki damla gözyaşıyla sildim.

Ağlamak zayıflık değilmiş,
aksine bir temizlenme dili,
katılaşan yerleri yumuşatır,
nefese alan açar.

Pencereden dışarı bakarken
komşu çocuk şemsiyeyle döndü,
bir su birikintisine basıp güldü,
bütün dünya o an hafifledi.

Akşam çayını içerken
kendime nazik bir söz verdim:
sertliğe değil hayata yaslan,
çünkü kök saldıran şey {theme}.`,
  `Bir turna kuşu geçti üstümüzden,
kanadında uzak bir ülke sesi,
ben de içimdeki göçü fark ettim,
eski ben yeni bene taşınıyordu.

Valizime ne koyacağımı düşündüm,
kırgınlık ağır geldi, bıraktım,
şükrü aldım, merakı aldım,
biraz da cesaret kattım yanına.

Yol uzun, gece serin,
ama adımlarım geri saymıyor,
çünkü varış kadar yürüyüş de
insanı dönüştüren bir ev.

Sabah sınırı geçerken
pasaporttan önce kalbim damgalandı,
üzerinde tek mühür vardı:
{theme}.`,
  `Eski bir parkta salıncak gıcırdadı,
çocukluğum döndü bir an,
ayağımı yerden kesip
göğe küçük bir not bıraktım.

“Büyümek unutmak değildir,”
dedim içimden usulca,
oyun da dua kadar ciddidir,
gülmek de emek ister.

Yan bankta oturan teyze
elindeki örgüyü bana gösterdi,
“ilmek ilmek sabır” dedi,
bu cümleyi kalbime astım.

Akşam eve yürürken
adımlarım daha ritimliydi,
çünkü günü birleştiren ip
başından sonuna {theme}.`,
  `Bir kavşakta kırmızı ışıkta
yan yana durduk onlarca kişi,
kimse birbirini tanımıyordu,
ama aynı bekleyişte birleşti.

Bir motor sesi uzaklaştı,
bir bebek arabası geçti,
bir genç yaşlıya yol verdi,
küçük anlar büyüdü.

Yeşil yandığında herkes
ayrı yönlere dağıldı,
ben geriye dönüp baktım,
kavşak hâlâ ders veriyordu.

Hayat da böyle dedim,
kısa kesişmeler, uzun etkiler,
insanı insan yapan bağın
adı her zaman {theme}.`,
  `Dağ yolu sisliydi, önümü zor gördüm,
farları yaktım ama kalbim kararsızdı,
sonra yan koltuktan bir ses,
“yavaş git, yeter” dedi.

Bazen hız değil istikrar,
bazen cevap değil soru taşırız,
bazen de sadece birlikte olmak
bütün problemi yarıya indirir.

Virajları tek tek geçtik,
her dönüşte korku biraz azaldı,
zirveye vardığımızda
manzara kadar içim de açıldı.

Aşağı inerken anladım,
insana yolu sevdiren şey
yalnızca manzara değil,
yanındaki {theme}.`,
  `Bir akşamüstü terasta
çay bardakları buğu tuttu,
konuşmalar yavaşladı,
kalpler aynı ritme indi.

Kimi işini anlattı,
kimi derdini saklamadan döktü,
kimse çözüm satmadı,
herkes önce dinledi.

Güneş apartmanların ardına inerken
sözler daha sadeleşti,
“beraberiz” cümlesi
bütün ışıklardan parlaktı.

Gece dağıldığında geriye
boş bardaklar ve dolu içler kaldı,
masanın ortasında görünmeyen
ama hissedilen şey: {theme}.`,
  `Bir tohum avucumda minicik,
ama içinde koca orman,
toprağa bırakırken düşündüm,
inanç da böyle görünmez büyür.

İlk gün hiçbir şey olmadı,
iki, üç, dört yine sessizlik,
beşinci gün ince bir yeşil
“buradayım” dedi.

Her sabah su verdim,
her akşam selam söyledim,
bitki uzadıkça ben de
sabırla birlikte uzadım.

Ay sonunda ilk yaprak
rüzgârla bana el salladı,
üzerinde okunur gibiydi
tek sözcük: {theme}.`,
  `Bir mehtap gecesinde kıyıda
taşların üstüne oturduk,
kimse büyük laflar etmedi,
dalgalar konuştu bizim yerimize.

Uzak bir tekneden ışık geldi,
karanlığa ince bir çizik attı,
aynı anda içimizde de
küçük bir umut yandı.

Bir arkadaş eski bir şarkı mırıldandı,
diğeri ritim tuttu usulca,
ben gözlerimi kapatıp
an’ın içine yerleştim.

Gece biterken fark ettim,
hatırlayacağım şey manzara değil,
yan yana oluşumuzun bıraktığı
sıcak isim: {theme}.`,
  `Sabah koşusunda nefesim kesildi,
durup ellerimi dizime koydum,
vazgeçmekle dinlenmek arasındaki
ince çizgiyi o an gördüm.

Bir yudum su, kısa bir mola,
sonra yeniden adım,
kendi ritmime sadık kalınca
yol da bana uydu.

Yanımdan geçen biri “hadi” dedi,
rekabet değil destekti sesi,
küçük bir teşvik bazen
büyük bir duvarı yıkar.

Parkuru bitirdiğimde
madalya yoktu boynumda,
ama içimde sağlam bir cümle:
{theme} ile devam edilir.`,
  `Bir gece ansızın elektrik gitti,
ode karardı, saat sustu,
telefon ışığı yerine
mum yaktım bu kez.

Alevin küçük dili
duvarlarda dans etti,
gölge bile yumuşadı,
içim sakinledi.

Defterimi açıp
uzun zamandır ertelediğim
teşekkür listesini yazdım,
hayatın artılarını saydım.

Işık geldiğinde hemen açmadım,
biraz daha mumla kaldım,
çünkü karanlıkta belirginleşen
şeyin adı {theme}.`,
  `Bir bahar akşamı pencereme
leylak kokusu doldu,
geçmişten bir an geldi,
gözümde gülümseyerek durdu.

Zaman düz bir çizgi değil,
bazen halka olur döner,
yaralı yerin üstüne
yeni çiçek eker.

Kendime kızdığım günleri
teker teker uğurladım,
şefkatle konuşmayı
yeniden öğrendim.

Şimdi aynaya bakınca
hata değil insan görüyorum,
bunu mümkün kılan sessiz güç
elbette {theme}.`,
  `Bir okul koridorunda zil çaldı,
çocuklar nehir gibi aktı,
bir öğretmen kapıda durup
her birine tek tek baktı.

O bakışta not yoktu,
karşılaştırma hiç yoktu,
sadece “sen değerlisin” diyen
sade bir güven vardı.

Ders bittiğinde sınıfta
tahtada tek cümle kaldı:
“Bilgi aklı büyütür,
kalbi {theme} büyütür.”

Çıkışta yağmur başladı,
çocuklar şen şakrak dağıldı,
koridorun duvarlarında
o cümlenin izi kaldı.`,
  `Sonbahar rüzgârı kapıyı vurdu,
içeri serin bir haber getirdi,
“bırakman gerekenleri bırak,”
dedi kulağıma usulca.

Dolabı açtım, yılların yükü,
giyilmeyen ceketler, kırık niyetler,
hepsini ayırdım bir kenara,
ihtiyacı olana verdim.

Evde yer açıldıkça
zihnim de ferahladı,
boş raflar bile bazen
umut kadar güzel görünür.

Gece uyurken içim rahattı,
çünkü tutunmak kadar
bırakmak da bir sanattır,
ustasının adı {theme}.`,
  `Bir şehir sabahı siren sesleri,
korna, adım, telaş,
ama ben kulaklığımı çıkarıp
gerçek sesi dinledim.

Kaldırım taşı, kuş kanadı,
uzaktan gelen satıcı çağrısı,
hepsi aynı orkestranın
farklı enstrümanıydı.

Ritmi yakalayınca
kalbim koşmayı bıraktı,
yürümek de yetişmekmiş,
acele etmeyince anladım.

İş yerine vardığımda
yüzümde hafif bir gülüş,
günün anahtarı cebimdeydi:
{theme}.`,
  `Gecenin en geç saatinde
masamda tek bir lamba,
yarım kalan cümlelerim
beni bekliyordu sabırla.

İlk satır zor geldi,
ikinci satır biraz daha,
üçüncüde akış başladı,
kelimeler yerini buldu.

Yazdıkça içimdeki düğüm
yavaşça çözüldü,
her paragraf bir nefes,
her nokta küçük bir dinlenme.

Dosyayı kaydedip kapattım,
pencerede sabah belirmişti,
o uzun gecenin ödülü
tek isimde saklı: {theme}.`
];

const epsteinResponses = [
  `Bu dosya neden bu kadar konuşuluyor, onu katman katman anlatmak daha doğru olur:

- Önce hukuki boyut: ağır suç iddiaları, farklı dönemlerde açılan süreçler ve kamuoyunda adaletin eşit uygulanıp uygulanmadığına dair güçlü bir tartışma var.
- Sonra mağdur boyutu: birçok insan için asıl mesele, mağdur anlatılarının yeterince ciddiye alınıp alınmadığı ve süreçlerin ne kadar koruyucu olduğu.
- Bir de sistem boyutu var: güç, çevre ilişkileri, medya etkisi ve şeffaflık beklentisi dosyayı tek bir kişiden daha büyük bir sembole dönüştürüyor.

Bu yüzden konu sadece “ne oldu” sorusuyla bitmiyor; “sistem nasıl işledi, nerede aksadı” sorusuyla devam ediyor. İstersen kısa 5 maddeye ayırayım.`,
  `Bu başlığı sade ama doğru çerçevede okumak için üç şeyi ayırmak gerekiyor:

1) İddiaların ciddiyeti ve hukuki süreçler.
2) Mağdur hakları, güvenlik ve görünürlük meselesi.
3) Kurumsal güven: kamuoyunun “hesap verebilirlik var mı?” sorusu.

İnsanların bu dosyaya tepkisi, sadece geçmişte olanlara değil, benzer durumlarda sistemin gelecekte nasıl davranacağına dair kaygılara da dayanıyor. O yüzden etik, hukuk ve toplumsal vicdan aynı anda konuşuluyor. İstersen kısa 5 maddeye ayırayım.`,
  `Karmaşık görünmesinin sebebi bilgi fazlalığı değil sadece; farklı katmanların üst üste binmesi:

• Hukuk: dosya süreçlerinin niteliği ve kararların etkisi
• Toplum: güven kaybı ve adalet algısı
• Medya: gündem yoğunluğu ve bilgi kirliliği
• Mağdur perspektifi: korunma ve duyulma ihtiyacı

Bu yüzden tek bir cümlelik özet çoğu zaman yetersiz kalıyor. En sağlıklı yaklaşım, doğrulanmış ana başlıklarla ilerlemek. İstersen kısa 5 maddeye ayırayım.`,
  `Bu konuda dengeli bir özet şöyle olur:

- Evet, dosya uzun süredir tartışılıyor çünkü iddialar çok ciddi.
- Evet, süreçlerin bazı kısımları kamuoyunda “yeterli mi?” sorusu doğurdu.
- Evet, konu bireysel bir vakadan çıkıp adalet ve şeffaflık tartışmasına dönüştü.

Dolayısıyla mesele yalnızca bir olayın kronolojisi değil; kurumların güvenilirliği, mağdur odaklı yaklaşım ve hesap verebilirlik standardı ile ilgili. İstersen kısa 5 maddeye ayırayım.`,
  `Özetin özü şu: bu dosya, modern kamu tartışmalarında “güç karşısında hukuk nasıl çalışmalı?” sorusunun simgelerinden biri haline geldi.

Burada insanlar üç sonuca bakıyor:
- Adalet gerçekten eşit mi?
- Mağdur hakları gerçekten korunuyor mu?
- Süreçler gerçekten şeffaf mı?

Bu üç soruya verilen yanıtlar netleşmediğinde, konu yıllar sonra bile gündemde kalmaya devam ediyor. İstersen kısa 5 maddeye ayırayım.`
];

const epsteinListResponses = [
  "1) Epstein finans çevrelerinde bilinen bir isimdi.\n2) Ciddi suçlamalarla gündeme geldi.\n3) Farklı dönemlerde yargı süreçleri yaşandı.\n4) Yüksek profilli bağlantılar tartışmayı büyüttü.\n5) Dosya adalet/şeffaflık tartışmalarını artırdı.",
  "1) Dosya cinsel suç iddialarıyla küresel gündeme taşındı.\n2) İlk süreçler yoğun eleştiri aldı.\n3) Yeni mağdur anlatıları dikkat çekti.\n4) Medya görünürlüğü etkiyi artırdı.\n5) Konu, kurumsal güven başlığında sembolleşti.",
  "1) Birden fazla soruşturma dönemi yaşandı.\n2) Mağdur odaklı adalet talebi büyüdü.\n3) Süreçlerin şeffaflığı sorgulandı.\n4) Güç ilişkileri tartışmayı derinleştirdi.\n5) Olay, hukuk-etik dengesi açısından örnek vaka oldu."
];

const emotionalKeywords = [
  "mutsuzum","üzgünüm","kötüyüm","moralim bozuk","canım sıkkın","bunaldım","yalnızım","kaygılıyım","endişeliyim","yorgunum",
  "bitkinim","tükendim","stresliyim","kırıldım","incindim","yoruldum","kafam dolu","hevesim yok","odaklanamıyorum","depresifim",
  "yalnız hissediyorum","boşluktayım","çok kötüyüm","iyi değilim","içim sıkıldı","darıldım","tripteyim","anlaşılmıyorum","desteksizim","çaresizim",
  "umudum azaldı","huzursuzum","rahat değilim","zorlanıyorum","zor dönem","dertliyim","dayanamıyorum","boğuluyorum","baskı altındayım","içim daraldı",
  "kafam karışık","gücüm yok","enerjim yok","modum düşük","ağlamak istiyorum","yalpalıyorum","yıprandım","pişmanım","mahvoldum","zor bir gün"
];

const emotionalPromptBank = [
  "Canının sıkkın olduğunu duyduğuma üzüldüm 💙 İstersen birlikte mini bir toparlanma planı yapalım.",
  "Yalnız değilsin 🤝 Buradayım, istersen adım adım rahatlayacak bir yol çıkaralım.",
  "Bu hislerin çok gerçek ve anlaşılır 🌿 Önce kendine nazik olalım, sonra küçük bir hedef belirleyelim.",
  "Bence çok güçlüsün; paylaşman bile önemli bir adım ✨ İstersen devamını beraber toparlarız.",
  "Sana yük olmuş olabilir, bunu hissediyorum 🫶 Gel bunu daha yönetilebilir parçalara bölelim.",
  "Kısa bir reset iyi gelebilir: nefes, su, küçük görev 🧠 İstersen beraber başlatalım.",
  "Bugün zor olabilir ama geçici 💫 Ben buradayım, tek bir küçük adımla başlayabiliriz.",
  "İstersen konuşalım, istersen çözüm planı çıkaralım 🎯 Kontrol sende, destek bende.",
  "Bu duyguyu bastırma; anlatman kıymetli 💙 Sonra birlikte net bir yol seçeriz.",
  "Sana iyi gelecek mini bir akış yapalım mı? 5 dk mola + 10 dk odak + geri bildirim 🚀"
];

const memoryPatterns = [
  { key: "ad", regex: /(?:benim ad[ıi]m|ad[ıi]m)\s+([a-zA-ZçğıöşüÇĞİÖŞÜ\s]+)/i, label: "Ad" },
  { key: "yas", regex: /(?:benim ya[şs][ıi]m|ya[şs][ıi]m)\s+(\d{1,2})/i, label: "Yaş" },
  { key: "boy", regex: /(?:benim boyum|boyum)\s+([\d.,]+\s*(?:cm|m)?)/i, label: "Boy" },
  { key: "kilo", regex: /(?:benim kilom|kilom)\s+([\d.,]+\s*(?:kg)?)/i, label: "Kilo" },
  { key: "hobi", regex: /(?:benim hobilerim|hobilerim)\s+(.+)/i, label: "Hobiler" },
  { key: "meslek", regex: /(?:benim mesleğim|mesleğim)\s+(.+)/i, label: "Meslek" }
];


const memoryQuestionPatterns = [
  { labels: ["Ad"], checks: ["adım kaç", "adim kac", "benim adım ne", "benim adim ne", "adım ne", "adim ne", "adım nedir", "adim nedir"] },
  { labels: ["Yaş"], checks: ["yaşım kaç", "yasim kac", "benim yaşım kaç", "benim yasim kac", "yaşım ne", "yasim ne"] },
  { labels: ["Boy"], checks: ["boyum kaç", "boyum kac", "boyum ne", "benim boyum kaç", "benim boyum kac"] },
  { labels: ["Kilo"], checks: ["kilom kaç", "kilom kac", "kilom ne", "benim kilom kaç", "benim kilom kac"] },
  { labels: ["Hobiler"], checks: ["hobilerim ne", "hobilerim neler", "hobim ne", "hobim neydi"] },
  { labels: ["Meslek"], checks: ["mesleğim ne", "meslegim ne", "mesleğim neydi", "benim mesleğim ne", "benim meslegim ne"] },
  { labels: ["Ad", "Yaş", "Boy", "Kilo", "Hobiler", "Meslek"], checks: ["bende ne var", "bende ne kayıtlı", "belleğimde ne var", "bellekte ne var", "kayıtlarım", "beni hatırla", "beni hatırla baluk"] }
];

function supportsContextModel() {
  return currentModel === "baluk-1.5" || currentModel === "baluk-1.6";
}

function supportsMemoryModel() {
  return currentModel === "baluk-1.6";
}

function chooseRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function hasAny(text, list) { return list.some((i) => text.includes(i)); }
function escapeRegex(text) { return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function hasKeyword(text, keyword) {
  if (keyword.length <= 3 || /^[\wçğıöşü]+$/i.test(keyword)) {
    const re = new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegex(keyword)}([^\\p{L}\\p{N}]|$)`, "iu");
    return re.test(text);
  }
  return text.includes(keyword);
}
function hasAnyKeyword(text, list) { return list.some((k) => hasKeyword(text, k)); }

function isBannedNow() {
  return Date.now() < banUntil;
}

function formatBanLeft(ms) {
  const sec = Math.max(0, Math.ceil(ms / 1000));
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function stopBan() {
  banUntil = 0;
  if (banInterval) clearInterval(banInterval);
  banInterval = null;
  if (profanityLock) profanityLock.classList.add("hidden");
}

function startBan() {
  banUntil = Date.now() + 10 * 60 * 1000;
  if (profanityLock) profanityLock.classList.remove("hidden");
  if (banInterval) clearInterval(banInterval);
  banInterval = setInterval(() => {
    const left = banUntil - Date.now();
    if (banTimer) banTimer.textContent = formatBanLeft(left);
    if (left <= 0) stopBan();
  }, 250);
}

function isProfanity(textLower) {
  return hasAnyKeyword(textLower, profanityKeywords);
}

function setAdvancedMathMode(enabled) {
  advancedMathEnabled = enabled;
  appRoot.classList.toggle("math-mode", enabled);
  if (memoryToggle) memoryToggle.classList.toggle("hidden", enabled);
  if (mathStudioToggle) mathStudioToggle.classList.toggle("hidden", !enabled);
  if (mathStudioPanel && !enabled) mathStudioPanel.classList.add("hidden");
  if (currentModelBadge) currentModelBadge.textContent = enabled ? "matematik modu" : currentModel;
}

function solveMathStudioLine(line) {
  const raw = line.trim();
  if (!raw) return null;
  const eq = solveLinearEquation(raw);
  if (eq) return eq.replace("Denklem çözümü: ", "");
  const expr = solveSimpleExpression(raw.replaceAll("^", "**"));
  if (expr) return expr.replace("Sonuç: ", "").replace(" ✅", "");
  return "Çözüm yok";
}

function explainMath(line, result) {
  return `🧠 Matematik stüdyosu açıklaması:

${line} ifadesini adım adım çözünce ${result} sonucuna ulaşıyorum. Burada denklem dengesini koruyup bilinmeyeni yalnız bırakıyorum; aritmetik ifadede ise işlem önceliğine göre hesaplıyorum.`;
}

function renderMathStudio() {
  if (!mathStudioInput || !mathStudioOutput) return;
  const lines = mathStudioInput.innerText.split("\n").map((l) => l.trim()).filter(Boolean);
  mathStudioOutput.innerHTML = "";
  if (!lines.length) return;

  lines.slice(-20).forEach((line) => {
    const result = solveMathStudioLine(line);
    const row = document.createElement("div");
    row.className = "math-result";
    row.textContent = `${line} = ${result}`;
    mathStudioOutput.appendChild(row);

    if (result && result !== "Çözüm yok" && line !== lastStudioExplained) {
      startChatIfNeeded();
      addMessage(explainMath(line, result), "bot");
      lastStudioExplained = line;
    }
  });
}

function showMemoryToast() {
  if (!memoryToast) return;
  memoryToast.classList.remove("hidden");
  if (memoryToastTimer) clearTimeout(memoryToastTimer);
  memoryToastTimer = setTimeout(() => memoryToast.classList.add("hidden"), 2200);
}

function buildGeneralAnswerReply(input) {
  const cleaned = input.trim();
  const starter = chooseRandom([
    "Anladım, güzel noktaya değindin.",
    "Söylediğini net aldım.",
    "Bu cevabın iyi bir yön veriyor.",
    "Gayet mantıklı bir cevap oldu."
  ]);
  return `${starter} '${cleaned}' üzerinden devam edebilirim; istersen bunu adım adım plana çevireyim.`;
}

function shouldExpectFollowUp(answer) {
  const a = answer.toLowerCase();
  const yesNoPrompt = /(?:\s|^)(m[ıi]|mi)(?:\s|$|[?.!,])/i.test(a);
  return answer.includes("?") || yesNoPrompt || hasAny(a, [
    "sen seç:", "bana tema ver", "tema seç", "yazayım mı", "istersen"
  ]);
}

function resolveActivityChoice(inputLower) {
  if (hasAny(inputLower, ["matematik", "işlem", "hesap"])) {
    return "Süper, matematik modundayız 🧮 Bana bir işlem (örn: 12*7) ya da denklem (örn: 2x+4=18) yaz.";
  }
  if (hasAny(inputLower, ["hikaye", "hikâye"])) {
    return askThemeFor("story");
  }
  if (hasAny(inputLower, ["şiir", "siir"])) {
    return askThemeFor("poem");
  }
  if (hasAny(inputLower, ["aşk", "ask"])) {
    return generateCreativeText("poem", "aşk");
  }
  return null;
}

function resolveYesNoFromLastPrompt(inputLower) {
  const last = (lastBotResponse || "").toLowerCase();
  const yes = hasAny(inputLower, ["evet", "olur", "tamam", "yapalım", "hadi"]);
  const no = hasAny(inputLower, ["hayır", "hayir", "istemiyorum", "yok"]);
  if (!yes && !no) return null;
  if (no) return chooseRandom(generalNoResponses);

  const detectedTheme = detectTheme(last) || (last.match(/([a-zçğıöşü\s]+)\s+temalı/i)?.[1]?.trim() ?? null);
  const theme = detectedTheme || "doğa";

  if (hasAny(last, ["hikâye", "hikaye"])) {
    if (hasAny(last, ["tema ver", "tema seç"])) return askThemeFor("story");
    if (hasAny(last, ["yazayım", "yazalım", "mini hikâye", "mini hikaye"])) return generateCreativeText("story", theme);
  }
  if (hasAny(last, ["şiir", "siir"])) {
    if (hasAny(last, ["tema seç", "tema ver"])) return askThemeFor("poem");
    if (hasAny(last, ["yazayım", "yazalım", "kısa şiir", "temalı"])) return generateCreativeText("poem", theme);
  }
  if (hasAny(last, ["matematik", "işlem", "denklem"])) {
    return "Harika, matematikte devam edelim 🧠 Bana çözmemi istediğin işlemi yaz.";
  }
  return chooseRandom(generalYesResponses);
}

function detectTheme(inputLower) {
  const theme = creativeThemes.find((t) => inputLower.includes(t));
  if (theme) return theme;
  const cleaned = inputLower.replace(/tema(?:m)?\s*(?:=|:)?\s*/g, "").trim();
  if (!cleaned) return null;
  const shortTheme = cleaned.split(/[,.;!?]/)[0].trim();
  return shortTheme && shortTheme.length <= 40 ? shortTheme : null;
}

function askThemeFor(mode) {
  convoState.awaitingCreativeTheme = true;
  convoState.creativeMode = mode;
  return `Harika, ${mode === "story" ? "hikâye" : "şiir"} yazalım ✍️ Önce bir tema seç: ${creativeThemes.join(", ")}.`;
}

function generateCreativeText(mode, theme) {
  const normalizedTheme = theme.charAt(0).toUpperCase() + theme.slice(1);
  const template = mode === "story" ? chooseRandom(storyTemplates) : chooseRandom(poemTemplates);
  const title = mode === "story" ? `📖 ${normalizedTheme} Temalı Mini Hikâye` : `📝 ${normalizedTheme} Temalı Şiir`;
  const themedText = template
    .replaceAll("{theme}yi", `${theme}'yi`)
    .replaceAll("{theme}ye", `${theme}'ye`)
    .replaceAll("{theme}si", `${theme}'si`)
    .replaceAll("{theme}", theme);
  return `${title}
${themedText}`;
}

function saveMemory() {
  localStorage.setItem("balukMemory", JSON.stringify(userMemory));
}

function renderMemoryList() {
  memoryList.innerHTML = "";

  if (!supportsMemoryModel()) {
    const li = document.createElement("li");
    li.textContent = "Bellek yalnızca baluk-1.6 modelinde aktif.";
    memoryList.appendChild(li);
    return;
  }

  const entries = Object.entries(userMemory);
  if (!entries.length) {
    const li = document.createElement("li");
    li.textContent = "Henüz kayıt yok.";
    memoryList.appendChild(li);
    return;
  }

  entries.forEach(([k, v]) => {
    const li = document.createElement("li");
    li.textContent = `${k}: ${v}`;
    memoryList.appendChild(li);
  });
}

function parseMemory(input) {
  if (!supportsMemoryModel()) return null;

  const lower = input.toLowerCase();
  if (isMemoryQuestion(lower)) return null;

  let changed = false;
  memoryPatterns.forEach((p) => {
    const m = input.match(p.regex);
    if (m && m[1]) {
      userMemory[p.label] = m[1].trim();
      changed = true;
    }
  });
  if (changed) {
    saveMemory();
    renderMemoryList();
    showMemoryToast();
    return chooseRandom(memorySavedResponses);
  }
  return null;
}

function getMemoryAnswer(inputLower) {
  if (!supportsMemoryModel()) return null;

  for (const rule of memoryQuestionPatterns) {
    if (!hasAny(inputLower, rule.checks)) continue;
    const known = rule.labels.filter((label) => userMemory[label]);
    if (!known.length) {
      return "Bu bilgi belleğimde henüz yok 🤔 Bana 'Benim adım ...', 'yaşım ...' gibi yazarsan kaydederim.";
    }
    if (rule.labels.length === 1) {
      const label = rule.labels[0];
      return `${label} bilgin: ${userMemory[label]}`;
    }
    const summary = known.map((label) => `${label}: ${userMemory[label]}`).join("\n");
    return `Belleğinde şunlar var:
${summary}`;
  }
  return null;
}

function isMemoryQuestion(inputLower) {
  return memoryQuestionPatterns.some((rule) => hasAny(inputLower, rule.checks));
}

function startIntroAmbientHum() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  if (!introAudioCtx) introAudioCtx = new AudioCtx();
  const now = introAudioCtx.currentTime;

  if (introAudioCtx.state === "suspended") {
    introAudioCtx.resume().catch(() => {});
  }

  if (introAmbientNodes.length) return;

  const master = introAudioCtx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.018, now + 1.6);
  master.connect(introAudioCtx.destination);

  const oscA = introAudioCtx.createOscillator();
  oscA.type = "sine";
  oscA.frequency.setValueAtTime(72, now);

  const oscB = introAudioCtx.createOscillator();
  oscB.type = "triangle";
  oscB.frequency.setValueAtTime(108, now);

  const wobble = introAudioCtx.createOscillator();
  wobble.type = "sine";
  wobble.frequency.value = 0.12;
  const wobbleGain = introAudioCtx.createGain();
  wobbleGain.gain.value = 5;

  const filter = introAudioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 260;
  filter.Q.value = 0.6;

  wobble.connect(wobbleGain);
  wobbleGain.connect(filter.frequency);

  oscA.connect(filter);
  oscB.connect(filter);
  filter.connect(master);

  oscA.start(now);
  oscB.start(now);
  wobble.start(now);

  introAmbientNodes = [oscA, oscB, wobble, wobbleGain, filter, master];
}

function stopIntroAmbientHum(fast = false) {
  if (!introAudioCtx || !introAmbientNodes.length) return;
  const now = introAudioCtx.currentTime;
  const master = introAmbientNodes[introAmbientNodes.length - 1];

  if (master && master.gain) {
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
    master.gain.exponentialRampToValueAtTime(0.0001, now + (fast ? 0.25 : 0.7));
  }

  setTimeout(() => {
    try {
      introAmbientNodes.forEach((n) => {
        if (n && typeof n.stop === "function") n.stop();
      });
    } catch {}
    introAmbientNodes = [];
  }, fast ? 320 : 760);
}

function startIntroWhooshAudio() {
  stopIntroWhooshAudio();
  stopIntroAmbientHum(true);

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  if (!introAudioCtx) introAudioCtx = new AudioCtx();
  const now = introAudioCtx.currentTime;
  if (introAudioCtx.state === "suspended") introAudioCtx.resume().catch(() => {});

  const master = introAudioCtx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.08, now + 0.35);
  master.gain.exponentialRampToValueAtTime(0.12, now + 1.25);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 4.8);
  master.connect(introAudioCtx.destination);

  const osc = introAudioCtx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(170, now);
  osc.frequency.exponentialRampToValueAtTime(260, now + 1.1);
  osc.frequency.exponentialRampToValueAtTime(232, now + 1.45);
  osc.frequency.exponentialRampToValueAtTime(210, now + 4.2);

  const lfo = introAudioCtx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.42;
  const lfoGain = introAudioCtx.createGain();
  lfoGain.gain.value = 22;

  const filter = introAudioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(700, now);
  filter.frequency.exponentialRampToValueAtTime(1500, now + 1.4);
  filter.frequency.exponentialRampToValueAtTime(900, now + 2.7);

  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);
  osc.connect(filter);
  filter.connect(master);

  osc.start(now);
  lfo.start(now);
  osc.stop(now + 5.0);
  lfo.stop(now + 5.0);

  introAudioNodes = [osc, lfo, master, filter, lfoGain];
}

function stopIntroWhooshAudio() {
  try {
    introAudioNodes.forEach((n) => {
      if (n && typeof n.stop === "function") n.stop();
    });
  } catch {}
  introAudioNodes = [];

  if (introAudioCtx && !introAmbientNodes.length) {
    introAudioCtx.close().catch(() => {});
    introAudioCtx = null;
  }
}

function openAppWithTransition() {
  if (!introGate || !appRoot) return;

  introGate.classList.add("hidden");
  if (enterTransition) enterTransition.classList.remove("hidden");

  startIntroWhooshAudio();

  setTimeout(() => {
    stopIntroWhooshAudio();
    if (enterTransition) enterTransition.classList.add("hidden");
    appRoot.classList.remove("hidden");
    userInput.focus();
  }, 5600);
}

function applyPersonalization(response) {
  if (!supportsMemoryModel()) return response;
  const name = userMemory.Ad;
  if (!name) return response;

  const trimmed = String(response || "").trim();
  if (!trimmed) return response;
  if (trimmed.toLowerCase().startsWith(`${String(name).toLowerCase()},`)) return response;

  return `${name}, ${response}`;
}


function addMessage(text, role) {
  const n = document.createElement("div");
  n.className = `msg ${role}`;
  n.textContent = text;
  chat.appendChild(n);
  chat.scrollTop = chat.scrollHeight;
}

function addThinkingBubble() {
  const n = document.createElement("div");
  n.className = "msg bot thinking-bubble";
  n.innerHTML = `
    <div class="thinking-head">
      <svg class="fish-logo think-fish spin-fast" viewBox="0 0 520 220" fill="none" xmlns="http://www.w3.org/2000/svg"><use href="#baluk-fish"></use></svg>
      <span>Baluk düşünüyor...</span>
    </div>
  `;
  chat.appendChild(n);
  chat.scrollTop = chat.scrollHeight;
  return n;
}

function fillThinkingBubble(node, text) {
  const fish = node.querySelector(".think-fish");
  if (fish) fish.classList.remove("spin-fast");
  const content = document.createElement("div");
  content.className = "thinking-answer";
  content.textContent = text;
  node.appendChild(content);
}

function solveSimpleExpression(input) {
  const normalized = input.toLowerCase().replaceAll("x", "*").replaceAll("çarpı", "*").replaceAll("kere", "*").replaceAll("bölü", "/").replaceAll("artı", "+").replaceAll("eksi", "-").replace(/[^0-9+\-*/()., ]/g, "").replaceAll(",", ".").trim();
  if (!/[0-9]/.test(normalized) || !/[+\-*/]/.test(normalized)) return null;
  try {
    const value = Function(`"use strict"; return (${normalized});`)();
    if (Number.isFinite(value)) return `Sonuç: ${value} ✅`;
  } catch { return null; }
  return null;
}

function solveLinearEquation(input) {
  const compact = input.toLowerCase().replace(/\s+/g, "");
  const m = compact.match(/^([+-]?\d*)x([+-]\d+)?=([+-]?\d+)$/);
  if (!m) return null;
  const a = m[1] === "" || m[1] === "+" ? 1 : m[1] === "-" ? -1 : Number(m[1]);
  const b = Number(m[2] || "+0");
  const c = Number(m[3]);
  if (a === 0) return "Bu denklemde x katsayısı 0 olduğu için klasik çözüm yok.";
  return `Denklem çözümü: x = ${(c - b) / a}`;
}

function solveAppleProblem(input) {
  const q = input.toLowerCase();
  const nums = (q.match(/\d+/g) || []).map(Number);
  if (!q.includes("elma") || nums.length < 2) return null;
  if (q.includes("yedi") || q.includes("verdi") || q.includes("kaldı")) return `Problem sonucu: ${nums[0] - nums[1]} elma kalır.`;
  if (q.includes("aldı") || q.includes("kaç oldu") || q.includes("toplam")) return `Problem sonucu: ${nums[0] + nums[1]} elma olur.`;
  return null;
}

function updateModelVisual() {
  currentModelBadge.textContent = advancedMathEnabled ? "matematik modu" : currentModel;
}

function updateMemoryAvailability() {
  clearMemory.disabled = !supportsMemoryModel();
  clearMemory.style.opacity = supportsMemoryModel() ? "1" : ".55";
  clearMemory.style.cursor = supportsMemoryModel() ? "pointer" : "not-allowed";
  renderMemoryList();
}

function updateGeneralQuestionState(answer) {
  convoState.awaitingGeneralAnswer = supportsContextModel() && shouldExpectFollowUp(answer);
}

function resolveFollowUp(input) {
  if (!supportsContextModel()) return null;

  const l = input.toLowerCase();

  if (convoState.awaitingEpsteinList && hasAny(l, ["evet", "olur", "tamam", "5 madde", "beş madde", "5 maddeye ayır", "beş maddeye ayır"])) {
    convoState.awaitingEpsteinList = false;
    return chooseRandom(epsteinListResponses);
  }

  if (convoState.awaitingCreativeTheme && convoState.creativeMode) {
    const theme = detectTheme(l);
    if (theme) {
      const mode = convoState.creativeMode;
      convoState.awaitingCreativeTheme = false;
      convoState.creativeMode = null;
      return generateCreativeText(mode, theme);
    }
    return `Temayı yakalayamadım 🤔 Şunlardan birini yazabilirsin: ${creativeThemes.join(", ")}.`;
  }

  if (hasAny(l, ["ne yapalım", "ne yapalim", "napalım", "napalim"])) {
    convoState.awaitingActivityChoice = true;
    return "Hazırım 💙 Sen seç: matematik / şiir / hikâye. İstersen direkt tema da yazabilirsin (örn: aşk, doğa, umut).";
  }

  if (convoState.awaitingActivityChoice) {
    const picked = resolveActivityChoice(l);
    if (picked) {
      if (!hasAny(l, ["hikaye", "hikâye", "şiir", "siir"])) convoState.awaitingActivityChoice = false;
      return picked;
    }
  }

  if (convoState.awaitingMoodReply && hasAny(l, ["iyiyim", "ben de iyiyim", "bende iyiyim", "harikayım", "süperim"])) {
    convoState.awaitingMoodReply = false;
    return chooseRandom(iyiyimFollowUpResponses);
  }

  if (convoState.awaitingGoalPlan && hasAny(l, ["hedef koyalım", "tamam", "olur", "hadi"])) {
    convoState.awaitingGoalPlan = false;
    return chooseRandom(goalPlanResponses);
  }

  if (convoState.awaitingGeneralAnswer) {
    convoState.awaitingGeneralAnswer = false;
    const fromPrompt = resolveYesNoFromLastPrompt(l);
    if (fromPrompt) return fromPrompt;
    return buildGeneralAnswerReply(input);
  }

  return null;
}

function buildTextResponse(input) {
  const l = input.toLowerCase();

  if (hasAnyKeyword(l, saKeywords)) return chooseRandom(saResponses);

  const memoryAnswer = getMemoryAnswer(l);
  if (memoryAnswer) return memoryAnswer;

  const memorySaved = parseMemory(input);
  if (memorySaved) return memorySaved;

  const follow = resolveFollowUp(input);
  if (follow) return follow;

  if (supportsContextModel() && hasAny(l, ["hikaye yaz", "hikâye yaz", "hikaye yazalım", "hikâye yazalım", "hikaye", "hikâye"])) {
    return askThemeFor("story");
  }

  if (supportsContextModel() && hasAny(l, ["şiir yaz", "siir yaz", "şiir yazalım", "siir yazalım", "şiir", "siir"])) {
    return askThemeFor("poem");
  }

  if (hasAny(l, ["merhaba", "selam", "merhab", "meraba", "kanka merhaba"])) {
    if (supportsContextModel()) convoState.awaitingMoodReply = true;
    return chooseRandom(merhabaResponses);
  }

  if (hasAny(l, ["nasılsın", "nasilsin"])) {
    if (supportsContextModel()) convoState.awaitingMoodReply = true;
    return chooseRandom(nasilsinResponses);
  }

  if (hasAny(l, emotionalKeywords)) {
    if (supportsContextModel()) convoState.awaitingGoalPlan = true;
    return chooseRandom(emotionalPromptBank);
  }

  if (hasAny(l, ["epstein", "epstion", "epstien"])) {
    if (supportsContextModel()) convoState.awaitingEpsteinList = true;
    return chooseRandom(epsteinResponses);
  }

  const apple = solveAppleProblem(input); if (apple) return apple;
  const eq = solveLinearEquation(input); if (eq) return eq;
  const expr = solveSimpleExpression(input); if (expr) return expr;

  return `Mesajını aldım: "${input}"\nAktif model: ${currentModel} ✅`;
}

function startChatIfNeeded() {
  if (hasStartedChat) return;
  hasStartedChat = true;
  splash.classList.add("hidden");
  chat.classList.remove("hidden");
}

function processInput(text) {
  startChatIfNeeded();
  addMessage(text, "user");

  const thinking = addThinkingBubble();
  setTimeout(() => {
    const rawResponse = buildTextResponse(text);
    const response = applyPersonalization(rawResponse);
    lastBotResponse = response;
    updateGeneralQuestionState(response);
    fillThinkingBubble(thinking, response);
  }, 1100);
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;
  if (isBannedNow()) return;
  if (isProfanity(text.toLowerCase())) {
    startBan();
    return;
  }
  processInput(text);
  userInput.value = "";
});

clearChat.addEventListener("click", () => {
  hasStartedChat = false;
  Object.keys(convoState).forEach((k) => { convoState[k] = false; });
  chat.innerHTML = "";
  chat.classList.add("hidden");
  splash.classList.remove("hidden");
});

memoryToggle.addEventListener("click", () => {
  memoryPanel.classList.toggle("hidden");
  renderMemoryList();
});

clearMemory.addEventListener("click", () => {
  if (!supportsMemoryModel()) return;
  Object.keys(userMemory).forEach((k) => delete userMemory[k]);
  saveMemory();
  renderMemoryList();
});

modelToggle.addEventListener("click", () => { if (advancedMathEnabled) return; modelMenu.classList.toggle("hidden"); });

document.addEventListener("click", (e) => {
  if (!modelMenu.contains(e.target) && !modelToggle.contains(e.target)) modelMenu.classList.add("hidden");
});

modelOptions.forEach((opt) => {
  opt.addEventListener("click", () => {
    if (advancedMathEnabled) return;
    modelOptions.forEach((i) => i.classList.remove("active"));
    opt.classList.add("active");
    currentModel = opt.dataset.model;
    updateModelVisual();
    updateMemoryAvailability();
    modelMenu.classList.add("hidden");
  });
});

updateModelVisual();
updateMemoryAvailability();


if (plusToggle && plusMenu) {
  plusToggle.addEventListener("click", () => plusMenu.classList.toggle("hidden"));
  document.addEventListener("click", (e) => {
    if (!plusMenu.contains(e.target) && !plusToggle.contains(e.target)) plusMenu.classList.add("hidden");
  });
}

if (advancedMathMode) {
  advancedMathMode.addEventListener("change", () => {
    setAdvancedMathMode(advancedMathMode.checked);
    updateModelVisual();
  });
}

if (mathStudioToggle && mathStudioPanel) {
  mathStudioToggle.addEventListener("click", () => mathStudioPanel.classList.toggle("hidden"));
}
if (mathStudioInput) {
  mathStudioInput.addEventListener("input", renderMathStudio);
}

if (banUnlockBtn) {
  banUnlockBtn.addEventListener("click", () => {
    if (banPassword && banPassword.value.trim() === "310169") {
      stopBan();
      banPassword.value = "";
    }
  });
}

if (enterAppBtn && introGate && appRoot) {
  const tryStartAmbient = () => startIntroAmbientHum();
  ["pointermove", "keydown", "touchstart", "mousedown"].forEach((evt) => {
    window.addEventListener(evt, tryStartAmbient, { once: true, passive: true });
  });
  startIntroAmbientHum();

  enterAppBtn.addEventListener("click", openAppWithTransition);
}
