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
const mathModeFlash = document.getElementById("mathModeFlash");
const mathTutorOverlay = document.getElementById("mathTutorOverlay");
const mathTutorDone = document.getElementById("mathTutorDone");
const profanityLock = document.getElementById("profanityLock");
const banTimer = document.getElementById("banTimer");
const banPassword = document.getElementById("banPassword");
const banUnlockBtn = document.getElementById("banUnlockBtn");

const geometryToolbar = document.getElementById("geometryToolbar");
const geometrySketch = document.getElementById("geometrySketch");
const solveGeometryBtn = document.getElementById("solveGeometryBtn");
const geometryWarn = document.getElementById("geometryWarn");


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
let mathFlashTimer = null;
let selectedGeometryShape = "square";

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

const geometryShapeMeta = {
  square: { label: "Kare", sides: ["a", "b", "c", "d"], vertexCount: 4 },
  rectangle: { label: "Dikdörtgen", sides: ["uzun", "kısa", "uzun", "kısa"], vertexCount: 4 },
  triangle: { label: "Üçgen", sides: ["a", "b", "c"], vertexCount: 3 },
  circle: { label: "Daire", sides: ["r"], vertexCount: 0 },
  parallelogram: { label: "Paralelkenar", sides: ["a", "b", "a", "b"], vertexCount: 4 },
  trapezoid: { label: "Yamuk", sides: ["a", "b", "c", "d"], vertexCount: 4 },
  pentagon: { label: "Beşgen", sides: ["a", "b", "c", "d", "e"], vertexCount: 5 },
  hexagon: { label: "Altıgen", sides: ["a", "b", "c", "d", "e", "f"], vertexCount: 6 }
};

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
  "amk", "aq", "ananı", "bacını", "siktir", "sik", "mk", "oç", "orospu", "piç", "yarrak", "göt", "ibne", "pezevenk"
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
  "{theme} kokan bir sabah, kahramanımız eski bir pusulanın peşine düştü.",
  "Kasabanın saat kulesi her gece {theme} fısıldıyordu.",
  "Bir gün herkes susunca, sadece {theme} konuşmaya başladı.",
  "Çocuk, cebindeki haritada yalnızca {theme} yazdığını fark etti.",
  "Yağmur dindiğinde yerde {theme} ile ilgili bir mektup vardı.",
  "Kütüphanedeki gizli kapı, {theme} hakkında unutulmuş bir dünyaya açıldı.",
  "Tren son durağa geldiğinde tabelada tek kelime vardı: {theme}.",
  "Yaşlı balıkçı, denizin dibinde {theme} taşıyan bir şişe buldu.",
  "Kayıp defterin ilk sayfasında sadece {theme} yazıyordu.",
  "Her doğum gününde aynı rüya geliyordu: {theme} ve mavi bir kuş.",
  "Okulun çatı katında saklanan kutu, {theme} sırrını saklıyordu.",
  "Bir robot, ilk kez {theme} hissedince kuralları değiştirdi.",
  "Fener söndüğünde liman {theme} hikâyesine teslim oldu.",
  "Çöldeki tek ağaç, gölgesinde {theme} anlatan bir harita saklıyordu.",
  "Müzisyen sahneye çıktığında notalar {theme} çizdi.",
  "Bir fotoğraf, geçmişte kalmış {theme} kapısını yeniden açtı.",
  "Kayıp anahtar yalnızca {theme} sözcüğü söylenince parladı.",
  "Ay tutulmasında köy halkı {theme} yemini etti.",
  "Terk edilmiş lunaparkta en çok {theme} dönme dolabı ışıldıyordu.",
  "Postacı, adrese değil {theme}ye teslim edilen bir zarf getirdi.",
  "Bir balina şarkısı, kıyıya {theme} masalı bıraktı.",
  "Saat 03:03 olduğunda pencerede {theme} izleri belirirdi.",
  "Aynadaki yansıma bu kez farklıydı: içinde {theme} yaşayan biri vardı.",
  "Küçük kardeş, yıldızlara bakıp {theme} için dilek tuttu.",
  "Üç arkadaş, haritada işaretli {theme} adasına doğru yola çıktı.",
  "Şehir ışıkları sönerken çatılarda {theme} koşuyordu.",
  "Son mektup açıldığında herkesin aradığı şeyin {theme} olduğu anlaşıldı.",
  "Müze bekçisi, gece vitrinlerde {theme} canlandığını gördü.",
  "Kırık bir saat, zamanı değil {theme}yi onarıyordu.",
  "Hikâyenin sonunda kahraman, en büyük gücünün {theme} olduğunu keşfetti."
];

const poemTemplates = [
  `Rüzgârın sesinde {theme} var,
kalbimde usul bir şarkı.`,
  `Bir damla geceye düştü,
adalıma {theme} yağdı.`,
  `Sessiz sokaklarda yürürken
ayak izlerim {theme} dedi.`,
  `Denizin kıyısında bir taş,
üstünde yazılı: {theme}.`,
  `Gözlerin değince dünyaya
her renk {theme} olur.`,
  `Kırık bir saat gibi kalbim,
her tikte {theme} çalar.`,
  `Pencereye vuran yağmur
hece hece {theme} okur.`,
  `Bir kuş geçer gökyüzünden,
kanadında {theme} taşır.`,
  `Sustum, ama içimde
uzun bir {theme} konuştu.`,
  `Gece lambası sönünce
oda {theme} ile aydınlandı.`,
  `Uzak bir tren sesi gibi
içime {theme} gelir.`,
  `Toprağın kokusunda saklı
çocukluğum ve {theme}.`,
  `Ay ışığı omzuma kondu,
"korkma" dedi, "{theme}".`,
  `Bir mektup açtım bugün,
her satırda {theme} vardı.`,
  `Kıyıya vuran dalgalar
{theme}yi tekrar etti.`,
  `Yıldızları sayarken
eksik kalan hep {theme} oldu.`,
  `İnce bir sızı gibi
sabahıma {theme} doğdu.`,
  `Karanlık bir koridorda
elimde tek fener: {theme}.`,
  `Sesin değdi kalbime,
çınlayan kelime: {theme}.`,
  `Baharın ilk gününde
kapımı {theme} çaldı.`,
  `Bir yaprak düştü avucuma,
üzerinde {theme} yazıyordu.`,
  `Uykumun kıyısında
ince bir {theme} salındı.`,
  `Gölgem bile bugün
benimle {theme} yürüdü.`,
  `Bir çocuk gülüşünde
şehrin bütün {theme}si var.`,
  `Yarım kalan cümlelerimde
en çok {theme} eksikti.`,
  `Kül rengi bulutların altında
içimde {theme} yeşerdi.`,
  `Ellerin üşürken bile
parmaklarında {theme} ısısı vardı.`,
  `Gecenin en sessiz yerinde
kalbim {theme} diye attı.`,
  `Bir adım daha attım hayata,
ayağımın altında {theme}.`,
  `Son dizede fark ettim: bütün yollar
dönüp dolaşıp {theme}ye çıkıyor.`
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

function hasSalutation(text, list) {
  return list.some((kw) => {
    const token = kw.trim().toLowerCase();
    if (!token) return false;
    if (token.length <= 3 || !token.includes(" ")) {
      const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`(^|\\s)${escaped}(\\s|$|[?.!,])`, "i").test(text);
    }
    return text.includes(token);
  });
}

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
  return profanityKeywords.some((w) => textLower.includes(w));
}

function setAdvancedMathMode(enabled) {
  const justEnabled = enabled && !advancedMathEnabled;
  advancedMathEnabled = enabled;
  appRoot.classList.toggle("math-mode", enabled);
  if (memoryToggle) memoryToggle.classList.toggle("hidden", enabled);
  if (mathStudioToggle) mathStudioToggle.classList.toggle("hidden", !enabled);
  if (mathStudioPanel && !enabled) mathStudioPanel.classList.add("hidden");
  if (currentModelBadge) currentModelBadge.textContent = enabled ? "matematik modu" : currentModel;
  if (justEnabled) {
    showMathModeFlash();
    maybeShowMathTutor();
  }
}

function solveMathStudioLine(line) {
  const raw = line.trim();
  if (!raw) return null;

  const wordProblem = solveWordProblemValue(raw);
  if (wordProblem !== null) return String(wordProblem);

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
  if (!mathStudioInput) return;
  const raw = mathStudioInput.innerText.trim();
  if (!raw) return;
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  const line = lines[lines.length - 1];
  const result = solveMathStudioLine(line);
  if (!result || result === "Çözüm yok") return;

  mathStudioInput.innerHTML = `<span class="calc-answer">${line} = ${result}</span>`;

  const selection = window.getSelection();
  if (selection) {
    const range = document.createRange();
    range.selectNodeContents(mathStudioInput);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  if (line !== lastStudioExplained) {
    startChatIfNeeded();
    addMessage(explainMath(line, result), "bot");
    lastStudioExplained = line;
  }
}

function showMathModeFlash() {
  if (!mathModeFlash) return;
  mathModeFlash.classList.remove("hidden");
  clearTimeout(mathFlashTimer);
  mathFlashTimer = setTimeout(() => mathModeFlash.classList.add("hidden"), 1050);
  playMathModeFlashAudio();
}

function playMathModeFlashAudio() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();
  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.08, now + 0.08);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);
  master.connect(ctx.destination);

  const osc = ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.exponentialRampToValueAtTime(640, now + 0.46);

  const shimmer = ctx.createOscillator();
  shimmer.type = "sine";
  shimmer.frequency.value = 11;
  const shimmerGain = ctx.createGain();
  shimmerGain.gain.value = 22;

  shimmer.connect(shimmerGain);
  shimmerGain.connect(osc.frequency);
  osc.connect(master);

  osc.start(now);
  shimmer.start(now);
  osc.stop(now + 1.05);
  shimmer.stop(now + 1.05);

  setTimeout(() => ctx.close().catch(() => {}), 1200);
}

function maybeShowMathTutor() {
  if (!mathTutorOverlay || !mathStudioToggle) return;
  if (localStorage.getItem("balukMathTutorDone") === "1") return;
  mathTutorOverlay.classList.remove("hidden");
  mathStudioToggle.classList.add("math-spotlight");
}

function clearGeometryWarn() {
  if (geometryWarn) geometryWarn.textContent = "";
}

function showGeometryWarn(message) {
  if (!geometryWarn) return;
  geometryWarn.textContent = message;
}

function parsePositive(value) {
  const n = Number(String(value || "").replace(",", "."));
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

function createGeometryInput(index, label) {
  return `<label class="geo-edge edge-${index}"><span>${label}</span><input type="number" min="0" step="any" data-edge-index="${index}" placeholder="cm"></label>`;
}

function renderGeometrySketch(shape) {
  if (!geometrySketch || !geometryShapeMeta[shape]) return;
  const meta = geometryShapeMeta[shape];
  const edges = meta.sides.map((label, idx) => createGeometryInput(idx + 1, label)).join("");
  const corners = meta.vertexCount > 0 ? `<div class="geo-corners">Köşe: ${meta.vertexCount}</div>` : `<div class="geo-corners">Köşe: ∞</div>`;
  geometrySketch.innerHTML = `
    <div class="geo-title">${meta.label}</div>
    <div class="geo-edge-grid shape-${shape}">${edges}</div>
    <div class="geo-center-box"><input id="geoGoalInput" type="text" placeholder="alan / çevre"></div>
    ${corners}
  `;
  wireGeometryInputRules(shape);
}

function normalizeGoal(v) {
  const val = String(v || "").toLowerCase().trim();
  if (hasAny(val, ["alan", "a"])) return "alan";
  if (hasAny(val, ["cevre", "çevre", "c"])) return "çevre";
  return null;
}

function getShapeEdges(shape) {
  if (!geometrySketch) return [];
  const inputs = [...geometrySketch.querySelectorAll("input[data-edge-index]")];
  return inputs.map((i) => parsePositive(i.value));
}

function wireGeometryInputRules(shape) {
  if (!geometrySketch) return;
  const inputs = [...geometrySketch.querySelectorAll("input[data-edge-index]")];
  if (!inputs.length) return;

  inputs.forEach((input, idx) => {
    input.addEventListener("input", () => {
      clearGeometryWarn();
      const v = input.value;
      if (!v) return;
      if (shape === "square" && idx === 0) {
        inputs.forEach((i) => { i.value = v; });
      }
      if (shape === "rectangle") {
        if (idx === 0 || idx === 2) {
          if (inputs[0].value) inputs[2].value = inputs[0].value;
        }
        if (idx === 1 || idx === 3) {
          if (inputs[1].value) inputs[3].value = inputs[1].value;
        }
      }
    });
  });
}

function computeGeometry(shape) {
  const edges = getShapeEdges(shape);
  const goalInput = document.getElementById("geoGoalInput");
  const goal = normalizeGoal(goalInput ? goalInput.value : "");

  if (!goal) return { error: "Ortadaki kutuya alan veya çevre yaz." };
  if (edges.some((v) => v === null)) return { error: "Tüm gerekli kenar/r değerlerini pozitif cm olarak gir." };

  if (shape === "square") {
    const a = edges[0];
    const area = a * a;
    const perimeter = 4 * a;
    return goal === "alan"
      ? { value: area, formula: `${a} x ${a} = ${area}`, unit: "cm²", label: "Alan" }
      : { value: perimeter, formula: `${a} x 4 = ${perimeter}`, unit: "cm", label: "Çevre" };
  }

  if (shape === "rectangle") {
    const long = edges[0];
    const short = edges[1];
    if (!(long > short)) return { error: "Dikdörtgende uzun kenar kısa kenardan büyük olmalı." };
    const area = long * short;
    const perimeter = 2 * (long + short);
    return goal === "alan"
      ? { value: area, formula: `${long} x ${short} = ${area}`, unit: "cm²", label: "Alan" }
      : { value: perimeter, formula: `2 x (${long} + ${short}) = ${perimeter}`, unit: "cm", label: "Çevre" };
  }

  if (shape === "triangle") {
    const [a, b, c] = edges;
    const p = a + b + c;
    if (goal === "çevre") return { value: p, formula: `${a}+${b}+${c} = ${p}`, unit: "cm", label: "Çevre" };
    const s = p / 2;
    const area2 = s * (s - a) * (s - b) * (s - c);
    if (area2 <= 0) return { error: "Bu kenarlarla geçerli üçgen oluşmuyor." };
    const area = Number(Math.sqrt(area2).toFixed(2));
    return { value: area, formula: `√(s(s-a)(s-b)(s-c)) = ${area}`, unit: "cm²", label: "Alan" };
  }

  if (shape === "circle") {
    const r = edges[0];
    const area = Number((Math.PI * r * r).toFixed(2));
    const perimeter = Number((2 * Math.PI * r).toFixed(2));
    return goal === "alan"
      ? { value: area, formula: `π x ${r}² = ${area}`, unit: "cm²", label: "Alan" }
      : { value: perimeter, formula: `2π x ${r} = ${perimeter}`, unit: "cm", label: "Çevre" };
  }

  if (shape === "parallelogram") {
    const a = edges[0];
    const b = edges[1];
    const area = a * b;
    const perimeter = 2 * (a + b);
    return goal === "alan"
      ? { value: area, formula: `${a} x ${b} = ${area}`, unit: "cm²", label: "Alan" }
      : { value: perimeter, formula: `2 x (${a}+${b}) = ${perimeter}`, unit: "cm", label: "Çevre" };
  }

  if (shape === "trapezoid") {
    const [a, b, c, d] = edges;
    const perimeter = a + b + c + d;
    if (goal === "çevre") return { value: perimeter, formula: `${a}+${b}+${c}+${d} = ${perimeter}`, unit: "cm", label: "Çevre" };
    const h = Number(Math.abs(a - b).toFixed(2));
    const area = Number((((a + b) / 2) * h).toFixed(2));
    return { value: area, formula: `((${a}+${b})/2) x ${h} = ${area}`, unit: "cm²", label: "Alan" };
  }

  if (shape === "pentagon" || shape === "hexagon") {
    const n = shape === "pentagon" ? 5 : 6;
    const side = edges[0];
    const perimeter = n * side;
    if (goal === "çevre") return { value: perimeter, formula: `${side} x ${n} = ${perimeter}`, unit: "cm", label: "Çevre" };
    const area = Number(((n * side * side) / (4 * Math.tan(Math.PI / n))).toFixed(2));
    return { value: area, formula: `düzgün ${n}gen alan formülü = ${area}`, unit: "cm²", label: "Alan" };
  }

  return { error: "Bu şekil için hesaplama tanımlanamadı." };
}

function solveGeometryCard() {
  clearGeometryWarn();
  const result = computeGeometry(selectedGeometryShape);
  if (result.error) {
    showGeometryWarn(result.error);
    return;
  }

  const shapeLabel = geometryShapeMeta[selectedGeometryShape].label;
  const userMsg = `Geometri: ${shapeLabel} (${result.label})`;
  const botMsg = `🧩 ${shapeLabel} ${result.label} = ${result.value} ${result.unit}
Adım: ${result.formula}`;

  startChatIfNeeded();
  addMessage(userMsg, "user");
  const thinking = addThinkingBubble("math");
  setTimeout(() => fillThinkingBubble(thinking, botMsg), 3000);
}

function initGeometryLab() {
  if (!geometryToolbar || !geometrySketch) return;
  renderGeometrySketch(selectedGeometryShape);

  const buttons = [...geometryToolbar.querySelectorAll(".geo-btn")];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedGeometryShape = btn.dataset.shape;
      renderGeometrySketch(selectedGeometryShape);
      clearGeometryWarn();
    });
  });

  if (solveGeometryBtn) {
    solveGeometryBtn.addEventListener("click", solveGeometryCard);
  }
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

function addThinkingBubble(kind = "default") {
  const n = document.createElement("div");
  n.className = `msg bot thinking-bubble ${kind === "math" ? "thinking-math" : ""}`;
  const title = kind === "math" ? "İşlem analiz ediliyor..." : "Baluk düşünüyor...";
  n.innerHTML = `
    <div class="thinking-head">
      <svg class="fish-logo think-fish spin-fast" viewBox="0 0 520 220" fill="none" xmlns="http://www.w3.org/2000/svg"><use href="#baluk-fish"></use></svg>
      <span>${title}</span>
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

function solveWordProblemValue(input) {
  const q = input.toLowerCase();
  const nums = (q.match(/-?\d+(?:[.,]\d+)?/g) || []).map((n) => Number(n.replace(",", ".")));
  if (nums.length < 2 || nums.some((n) => !Number.isFinite(n))) return null;

  const minusVerbs = [
    "verdi", "yedi", "attı", "atti", "kaybetti", "harcadı", "harcadi", "çıkardı", "cikardi", "azaldı", "azaldi", "eksildi"
  ];
  const plusVerbs = [
    "aldı", "aldi", "buldu", "kazandı", "kazandi", "topladı", "topladi", "eklendi", "geldi", "katıldı", "katildi"
  ];

  const asksRemaining = hasAny(q, ["kaç kaldı", "kac kaldi", "ne kadar kaldı", "ne kadar kaldi", "kaç tane kaldı", "kac tane kaldi"]);
  const asksTotal = hasAny(q, ["kaç oldu", "kac oldu", "toplam", "ne kadar oldu", "kaç tane oldu", "kac tane oldu"]);

  const hasMinusVerb = hasAny(q, minusVerbs);
  const hasPlusVerb = hasAny(q, plusVerbs);

  const a = nums[0];
  const b = nums[1];

  if (hasMinusVerb || (asksRemaining && !hasPlusVerb)) return a - b;
  if (hasPlusVerb || asksTotal) return a + b;

  return null;
}

function solveWordProblem(input) {
  const value = solveWordProblemValue(input);
  if (value === null) return null;
  return `Problem sonucu: ${value} ✅`;
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

  if (hasSalutation(l, saKeywords)) return chooseRandom(saResponses);

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

  const wordProblem = solveWordProblem(input); if (wordProblem) return wordProblem;
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

  const isMathFlow = advancedMathEnabled || Boolean(solveWordProblemValue(text));
  const thinking = addThinkingBubble(isMathFlow ? "math" : "default");
  const delayMs = isMathFlow ? 3000 : 1100;

  setTimeout(() => {
    const rawResponse = buildTextResponse(text);
    const response = applyPersonalization(rawResponse);
    lastBotResponse = response;
    updateGeneralQuestionState(response);
    fillThinkingBubble(thinking, response);
  }, delayMs);
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
initGeometryLab();

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
  mathStudioInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    renderMathStudio();
  });
}

if (mathTutorDone) {
  mathTutorDone.addEventListener("click", () => {
    if (mathTutorOverlay) mathTutorOverlay.classList.add("hidden");
    if (mathStudioToggle) mathStudioToggle.classList.remove("math-spotlight");
    localStorage.setItem("balukMathTutorDone", "1");
  });
}

if (banUnlockBtn) {
  banUnlockBtn.addEventListener("click", () => {
    if (banPassword && banPassword.value.trim() === "baluk2026") {
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
