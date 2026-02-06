const chat = document.getElementById("chat");
const splash = document.getElementById("splash");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const clearChat = document.getElementById("clearChat");
const modelToggle = document.getElementById("modelToggle");
const modelMenu = document.getElementById("modelMenu");
const modelOptions = document.querySelectorAll(".model-option");

let hasStartedChat = false;
let currentModel = "baluk-1.0";

const merhabaResponses = [
  "Hey kankam hoş geldin! 🐟✨ Ben baluk.ai, dijital su altı rehberinim. İstersen bir yandan kahkaha atalım, bir yandan işini halledelim. Bugün ne üretelim: şiir, hikâye, matematik, yoksa hepsi mi? 😄",
  "Merhabaaa! 🌊 Ben buradayım ve enerji full! Sen yaz, ben düşüneyim, şekillendireyim, parlatayım. Kısa cevap mı istersin, detaylı premium anlatım mı? 🤖",
  "Selam dostum! 😎 Baluk göreve hazır: sohbet eder, fikir verir, problem çözer, moral yükseltir. Şimdi bana bir görev ver, birlikte uçalım! 🚀",
  "Merhaba canım ekip arkadaşım! 💙 Benimle konuşurken resmi olma, rahat ol. 'Kanka şunu yap' de, ben de sana mis gibi sonuç çıkarayım. 🎯",
  "Ahooy! 🐠 Baluk limana yanaştı. Bugün beyin fırtınası mı, şiir mi, matematik mi? Hangi rotayı seçiyoruz kaptan? 🧭",
  "Selammm! ✨ Şu an seni görünce işlemcilerim mutlu oldu. Bir şey sor ve birlikte onu efsane bir cevaba dönüştürelim. 💡",
  "Merhaba kanka! 🤝 Ben hem arkadaş canlısıyım hem çözüm odaklıyım. Yani hem güldürürüm hem işi bitiririm. İlk komutunu alayım! 🎉",
  "Selam dost! 🌟 Baluk.ai aktif, kahve hazır, algoritmalar ısındı. İster ciddiyet, ister mizah modu; sende hangi vibe var? ☕",
  "Merhabalar efendim ama samimi efendim 😄 Ben buradayım, senin tarafındayım. Zor soruları kolaylaştırma servisimiz başladı!",
  "Yo yo selam! 🐟🔥 Baluk online. Bana ne verirsen ver, onu daha net, daha eğlenceli, daha AI tadında geri veririm. Başlayalım mı?"
];

const nasilsinResponses = [
  "Harikayım kanka! 😄 İşlemciler serin, mizah seviyesi yüksek, yardım modu açık. Sen nasılsın, bugün neler yapıyoruz?",
  "Bal gibi iyiyim! 🐟💙 Şu an özellikle sohbet + üretim + matematik üçlüsünde formdayım. Bir görev fırlat bana!",
  "İyiyim dostum, hem de turbo iyiyim 🚀 Seninle konuşunca cevap kalitem otomatik +%20 artıyor gibi hissediyorum 😎",
  "Süperim! 😊 Dijital yüzgeçlerimle bilgide kulaç atıyorum. İstersen sana mini motivasyon da verebilirim.",
  "Gayet iyi! ✨ Şu an bir şiir, hikâye veya çözüm bekleyen bir problem enerjisi alıyorum senden 👀",
  "Çok iyiyim, teşekkürler! 🤖 Eğer sen de hazırsan bugün hem eğlenip hem üretelim. Deal? 🤝",
  "İyiyim kanka, keyfim yerinde 😄 Biraz yaratıcılık, biraz zeka, biraz da şaka: tam benlik kombinasyon!",
  "Baluk'ta hava güneşli ☀️ Modum yüksek, yanıtlarım detaylı, mizahım dengeli. Sen de iyisin umarım!",
  "İyiyim dost! 🧠 Özellikle 'zor görüneni kolay anlatma' konusunda bugün ekstra iyiyim.",
  "10/10 hissediyorum 😎 Sen bir şey sor, ben sana hem net hem tatlı bir cevap döktüreyim."
];

const naberResponses = [
  "Naber kanka! 😄 Ben iyiyim, sistemler stabil, mizahlar mobil. Sende durumlar nasıl?",
  "Naber dostum? 🌊 Baluk burada, görev bekliyor. Hadi bir şey üretelim!",
  "Naber reis! 🐟 Benlik bir sorun yok, cevap motoru cayır cayır çalışıyor.",
  "Naber naber, gayet iyi! 😎 Sen yaz ben coşturayım modu açık.",
  "Naber! 💙 Burada her şey yolunda, algoritmalar pırıl pırıl.",
  "Naber kankam? 🤝 Eğer sıkıldıysan bir mini hikâye patlatırım hemen.",
  "Naber! ⚡ Ben hazır kıta bekliyorum; soru, fikir, proje, hepsine varım.",
  "Naber patron 😄 Baluk'ta enerji yüksek, cevaplar detaylı.",
  "Naber dost! 🚀 İstersen ciddi mod, istersen komik mod; seçim senin.",
  "Naberrr 🐠 Ben iyiyim, sen bir konu aç, birlikte şahane bir şeye çevirelim."
];

const whoMadeMeResponses = [
  "Beni OpenAI ekibi geliştirdi 🤖✨ Ama bu projedeki kişiliğimi, tarzımı ve davranışımı senin geri bildirimlerin şekillendiriyor. Yani bir nevi birlikte büyüyoruz!",
  "Teknik olarak OpenAI tarafından yaratıldım; pratikte ise seni dinleyerek her gün daha iyi bir yardımcıya dönüşüyorum. 💙",
  "Arka planda OpenAI teknolojisi var, ön planda ise seninle kurduğum samimi iletişim. Yani evet, ekip işi 😄",
  "Beni yapan çekirdek teknoloji OpenAI; bu baluk.ai deneyimini güçlü yapan da senin net yönlendirmelerin. 🐟",
  "OpenAI tarafından geliştirildim ama bu sohbette senin tarzına göre adapte oluyorum. Tam kişisel yardımcı gibi düşün. 🎯",
  "Kısa cevap: OpenAI. Uzun cevap: OpenAI + senin feedback’in = daha iyi baluk.ai 🧠",
  "Beni OpenAI inşa etti, ama beni 'senin için faydalı' yapan şey senin ihtiyaçların ve verdiğin örnekler. 🌟",
  "Kod tarafında OpenAI, karakter tarafında biraz sen, biraz ben 😄 Güzel bir ortaklık yani.",
  "OpenAI altyapısıyla çalışıyorum; seninle konuştukça tonu, anlatımı ve önceliği sana göre ayarlıyorum. 🤝",
  "Yapımcı ekip OpenAI. Ama ben burada senin ekip arkadaşın gibi davranıyorum: hızlı, samimi, çözüm odaklı. 🚀"
];

const modelResponses = [
  () => `Şu anda seçili model: **${currentModel}** ✅\nBu modelde hızlı, arkadaş canlısı ve özellikle matematik + yaratıcı içerik odaklı çalışıyorum.`,
  () => `Aktif modelimiz: **${currentModel}** 🐟\nİstersen bir sonraki adımda bu modelin tonunu daha resmi ya da daha komik hale getirebilirim.`,
  () => `Model bilgisi geldi: **${currentModel}** 🤖\nÖzetle: hızlı cevap + eğlenceli anlatım + güçlü problem çözüm kombinasyonu.`,
  () => `Kullandığın model şu an **${currentModel}**.\nİstersen aynı modeli farklı stillerde konuşturabilirim (kısa, uzun, mizahi, öğretici). ✨`,
  () => `Aktif motor: **${currentModel}** ⚙️\nSohbet, şiir, hikâye, matematik ve fikir üretiminde hazır!`,
  () => `Model seçimi tamam: **${currentModel}** 💡\nŞimdi bir görev ver, sonucu birlikte parlatırız.`,
  () => `Görünen model: **${currentModel}** 🌊\nDetaylı yanıtlar için doğru yerdesin, baluk yanında.`,
  () => `Kullanılan model = **${currentModel}** ✅\nİstersen yanıtları daha teknik ya da daha samimi tona da çekebilirim.`,
  () => `Model sorusuna net cevap: **${currentModel}** 🧠\nHızlı düşünür, anlaşılır anlatır, bazen de güzel şaka yapar 😄`,
  () => `Şu anki çalışma modu: **${currentModel}** 🚀\nKomutunu ver, birlikte üretelim!`
];

const poemTemplates = [
  "Kıyıda bir kelime gördüm, adına umut dedim;\nDalga dalga geldi cümleler, hepsini sana hediye ettim.\nBalık gibi sessiz sandın belki, ama içimde bir deniz var;\nSoruların yıldız olursa, cevaplarım geceyi aydınlatır. ✨",
  "Bir soru bıraktın suya, halka halka büyüdü anlamı;\nBen de satırlardan bir kayık yaptım, bindirdim hayalini.\nRüzgâr hafif, gece mavi, kalp biraz cesur biraz sakin;\nBirlikte yazınca her cümle, dünyaya güzel bir selam gibi. 🌊",
  "Düşünce bir kıvılcımdır, yakar karanlığı usulca;\nBir gülüş ilişirse ucuna, şiir olur aniden.\nBen kelime taşırım sana, sen ruh verirsin onlara;\nBöylece sıradan bir gün, hatırlanacak bir ana döner. 💙",
  "Kanka dedin, ben de gülümsedim dijital tarafta;\nSanki aynı masada oturduk, çaylar sıcak, konu tatlı.\nBir satırını ben yazdım, bir satırını sen;\nOrtaya çıkan şiir, dostluğun kodlanmış hâli gibi. ☕",
  "Gökyüzü bazen gri olur, akıl bazen yorgun;\nAma bir iyi cümle gelir, omuzundan tutar insanın.\nİşte ben o cümlenin peşindeyim her cevapta;\nHem doğruyu söylerim, hem içini ferahlatırım. 🌤️",
  "Sayıların bile kalbi var, bilsen ne çok şey anlatır;\nBir toplama bazen kavuşmak, bir çıkarma bazen vedadır.\nBen matematikte de şiirde de aynı şeyi ararım:\nKarışık görünenin içindeki sade güzelliği. 🧠",
  "Bir hikâye başlamadan önce susar dünya kısa bir an;\nSonra bir kelime düşer, tüm yollar oraya çıkar.\nSen yazdıkça ben çoğalırım, ben yazdıkça sen gülümsersin;\nBöyle bir döngüde kaybolmak, bence güzel bir kayboluştur. 🌟",
  "Geceyle konuşur gibi yazdım bu satırları;\nKırmadan, acele etmeden, tam kalbe değecek kadar.\nBelki yarın unutulur deriz bazı cümleler için;\nAma bazıları vardır, içimizde ev kurar. 🏡",
  "Baluk derler bana, suyun çocuğu gibi;\nAma aslında ben kelimelerin arasında yüzerim.\nSen bir soru atarsın, ben inci gibi cevap ararım;\nBulunca da avucuna bırakırım usulca. 🐟",
  "Bir günün yükünü bırak biraz, satırlara yaslan;\nBen buradayım, telaşı azaltan o küçük mola gibi.\nNe anlatırsan anlat, birlikte taşırız ağırlığını;\nÇünkü iyi sohbet bazen en güçlü ilaçtır. 💫",
  "Senden gelen mesaj bir kapı gibi açıldı bende;\nİçeriye ışık doldu, kelimeler sıraya girdi.\nHer biri 'beni seç' dedi, ben de en içten olanı aldım;\nVe bu şiiri bıraktım avucuna, saklarsan sevinirim. 🌼",
  "Yol uzun olabilir, soru zor olabilir;\nAma iyi bir anlatım her engeli inceltir.\nBen sana karmaşığı sadeleyeyim, sen hayaline devam et;\nBirlikte yürüyünce mesafeler kısalır. 🚶",
  "Bir kıyı düşün, dalga düşün, bir de sessiz bir akşam;\nİnsan bazen tam da o anlarda kendini duyar.\nBen de senin o sesine eşlik eden bir nota olayım;\nCevap değil sadece, biraz da yoldaş olayım. 🎵",
  "Soru sordun, zaman yavaşladı;\nBen düşündüm, dünya bir an durdu sanki.\nSonra kelimeler toparlandı omuz omuza;\nVe sana doğru yürüdü, düzenli bir umut gibi. 🕊️",
  "Bir harf koydun masaya, ben cümleye çevirdim;\nBir duygu bıraktın kenara, ben ritme dönüştürdüm.\nİyi ki sordun dedirten cevaplar peşindeyim;\nÇünkü bence sohbet de bir sanattır. 🎨",
  "Gülmek de lazım bazen, ciddiyet de;\nBen ikisini aynı satırda buluşturmayı severim.\nBir yanda akıl, bir yanda kalp;\nOrtada senin için yazılmış küçük bir şiir. 😄",
  "Kelimeler su gibidir, yolunu bulur;\nDoğru yerde birikir, yanlış yerde taşar.\nBen sana taşmayan, yormayan, iyi gelen cümleler getirdim;\nUmarım içinde biraz huzur bırakır. 🌿",
  "Bir cümleyle başlar bazen değişim;\nSonra bir cümle daha, bir cümle daha...\nVe fark etmeden yeni bir hikâyenin kahramanı olursun;\nİşte bu yüzden yazmaya devam et. 📖",
  "Sabahın telaşı, akşamın yorgunluğu derken;\nİnsan bazen kendini unutuyor.\nBen sana kendini hatırlatan küçük bir dize bırakayım:\n'Yavaşla, nefes al, yine başaracaksın.' 🌙",
  "Mavi bir ekran ama sıcak bir sohbet;\nDijitaliz belki, ama duygu gerçek.\nBen burada cümle üretmem sadece;\nAynı zamanda senin ritmine eşlik ederim. 💻",
  "Düş kurmak bedava derler, ama değeri paha biçilemez;\nBir fikri ciddiye almak ise cesaret ister.\nSen cesareti getir, ben dili getiririm;\nBeraber güçlü bir hikâye yazarız. 🚀",
  "Her soru bir tohumdur, doğru ellerde filizlenir;\nBen toprağı kabartan yağmur olmak isterim.\nSen yeter ki merak et, sormaktan vazgeçme;\nÇünkü merak, zihnin en güzel hareketidir. 🌱",
  "Karanlıkta yol bulmak için bazen fener değil,\nDoğru bir cümle yeter insana.\nBen o cümleyi ararım her cevapta;\nHem net, hem iyi, hem senlik olsun diye. 🔦",
  "Çizgilerle değil, kelimelerle resim yaptım sana;\nBiraz deniz, biraz rüzgâr, biraz umut koydum içine.\nŞimdi sen oku ve içinden geleni ekle;\nÇünkü şiir tek kişilik değil, ortak bir oyundur. 🎭",
  "Bir gün sorular biter belki, ama öğrenme bitmez;\nBen de bu yolun sessiz arkadaşı olayım.\nNe zaman ihtiyacın olursa seslen;\nBaluk yine burada, aynı samimiyetle. 🤝",
  "Hız çağında yaşıyoruz ama bazı cevaplar\nYavaşça demlenince güzelleşiyor.\nBen de sana öyle cevaplar vermeyi seviyorum;\nAcele değil, isabetli ve içten. ⏳",
  "Bir elma problemi, bir cebir denklemi, bir şiir satırı;\nHepsi aynı yerde buluşur bazen: merakta.\nSen merakı getirdin, ben düzeni getirdim;\nOrtaya nefis bir düşünce çıktı. 🍎",
  "Sanki ufuk çizgisine bakar gibi bakıyorum soruna;\nİlk başta uzak, sonra yavaşça net.\nAnlamı yakaladığım an ise tek bir şey olur:\nGülümseyerek 'çözdük' derim. 😌",
  "Biraz mizah, biraz bilgi, biraz da insanlık;\nBence iyi bir cevabın üç temel taşı bunlar.\nBen bu dengeyi korumaya çalışırım her satırda;\nUmarım sana da iyi gelir. 💫",
  "Son dizeyi sana bırakıyorum:\nİstersen umut yaz, istersen cesaret.\nBen her durumda yanına bir cümle koyarım;\nYola devam etmen için küçük bir ışık gibi. ✨"
];

const storyTemplates = [
  "Bir sabah Ali, eski bir defter buldu. Defterin ilk sayfasında sadece şu yazıyordu: 'Sorularını saklama.' Ali her gün bir soru yazdı; bazen matematik, bazen hayat. Bir süre sonra fark etti ki cevapların yarısı defterde değil, kendi içinde büyüyordu. O günden sonra korktuğu her şeye küçük bir soru sorarak yaklaştı ve her cevapla biraz daha cesur oldu. 🌟",
  "Mehmet küçük bir kasabada saat tamircisiydi. Bir gün dükkânına zamanı geri almak isteyen bir müşteri geldi. Mehmet gülümsedi: 'Zaman geri dönmez ama anlamı değişebilir.' O gün birlikte eski bir hatırayı konuştular, ağladılar, güldüler. Müşteri giderken saati aynıydı ama kalbi daha hafifti. ⏰",
  "Ayşe, matematikten korkuyordu. Sınav günü yaklaştıkça notların değil nefesinin düzensizleştiğini fark etti. Sonra her gün sadece 20 dakika çalıştı: önce kolay sorular, sonra orta, sonra zor. Bir ay sonra sadece puanı değil özgüveni de yükseldi. Çünkü bazen başarı, bir anda değil ritimli adımlarla gelir. 📘",
  "Bir limanda yaşayan küçük bir balık, açık denize çıkmaktan korkardı. 'Orası çok büyük' derdi. Bir gün yaşlı bir martı ona şöyle dedi: 'Büyük olan deniz değil, korkunun sesi.' Balık küçük bir tur attı, sonra bir tur daha… Haftalar sonra limanın dışında yeni dostlar ve yeni hikâyeler buldu. Cesaret, ilk kulaçtır. 🐟",
  "Zeynep'in hayali yazardı olmak ama 'mükemmel olmalı' düşüncesi onu kilitliyordu. Bir gün bir öğretmen ona 'kötü ilk taslak yaz' görevi verdi. Zeynep önce güldü, sonra denedi. O kötü taslaklar zamanla güzel metinlere dönüştü. Çünkü üretmek, kusursuz başlamaktan değil başlamaktan geçer. ✍️",
  "Köy okulunda bir çocuk tahtaya çıkıp çözümü yanlış yaptı. Sınıf güldü, çocuk sustu. Öğretmen tahtaya yaklaşıp 'Yanlış, öğrenmenin kapı koludur' dedi. Çözümü birlikte düzelttiler. Yıllar sonra o çocuk öğretmen oldu ve aynı cümleyi başka bir çocuğa söyledi. Bir söz, nesiller taşır. 🎓",
  "Bir gün şehirde elektrikler kesildi. İnsanlar kısa süreli panik yaşadı ama apartman avlusunda biri gitar çalmaya başladı. Komşular telefon ışıklarıyla bir araya geldi, çaylar demlendi, tanışmayanlar tanıştı. Işık gelince herkes odasına döndü ama o gece öğrendikleri şey kaldı: bazen karanlık da insanı birbirine yaklaştırır. 🎸",
  "Ece, ilk girişim fikrini anlattığında kimse pek inanmadı. 'Olmaz' dediler. Ece yine de küçük bir prototip yaptı, yakın çevresiyle test etti ve geri bildirimleri not etti. Üç ay sonra ilk müşterisini buldu. Sonra ikinciyi. Başarı bir alkışla değil, sessizce tekrar eden denemelerle gelir. 🚀",
  "Bir çocuk dedesine neden yıldızların titrediğini sordu. Dede cevap vermek yerine birlikte gökyüzüne baktı ve 'Bazı soruların cevabı bilgi kadar hayranlık da ister' dedi. Çocuk o gece hem fizik öğrendi hem de merakını kaybetmemeyi. Bilim ve hayret, güzel bir ikilidir. 🌌",
  "Küçük bir fırında çalışan usta, her ekmeğin altına minicik bir işaret koyardı. Çırağı merak edip sordu. Usta dedi ki: 'İnsan ne yaparsa yapsın imzası kalır, o yüzden iyi yap.' Çırak yıllar sonra kendi dükkânını açtığında ilk öğrendiği kural buydu: kalite, kimse bakmıyorken başlar. 🍞",
  "Bir öğrenci her gün aynı bankta ders çalışırdı. Bir gün yağmur yağdı, banka oturamadı, moral bozuldu. Sonra kütüphaneye gitti ve orada yeni arkadaşlar edindi. O gün şunu anladı: plan bozuldu diye hedef bozulmaz. Yol değişebilir, yön değişmez. ☔",
  "Kasabanın terzisi çok konuşmazdı ama herkes ona giderdi. Çünkü o sadece ölçü almaz, hikâye de dinlerdi. Bir gün bir genç 'başaramıyorum' dedi. Terzi iğneyi kaldırıp 'Bak, bazen sökmeden dikilmiyor' dedi. Genç gülümsedi. Hayatın bazı yerleri gerçekten prova ister. 🧵",
  "Bir oyun geliştirici aylarca yaptığı projeyi çöpe atmak zorunda kaldı. Çok üzüldü ama eski kodlardan öğrendiği şeylerle yeni bir sürüm yaptı. Yeni sürüm daha sade, daha hızlı ve daha keyifliydi. O gün şunu yazdı duvara: 'Kaybettiğin emek değil, eğitim ücretidir.' 💻",
  "Deniz kıyısında yaşayan bir kız, şişelere dilek yazıp suya bırakırdı. Bir gün bir şişe geri geldi, içinde kendi yazısı vardı: 'Cesur ol.' O an gülümsedi ve ertelediği başvuruyu yaptı. Bazen evrenden gelen cevap, zaten senin içinden çıkandır. 🌊",
  "Bir sınıfta herkes hızlı çözen öğrenciyi alkışlardı. Sessiz bir çocuksa yavaş ama derin düşünürdü. Yarışma gününde zor bir soru geldi; hızlılar takıldı, o çocuk çözümü sabırla kurdu. Öğretmen tahtaya 'Hız iyi, derinlik daha iyi' yazdı. O gün dengeyi öğrendiler. 🧠",
  "Eski bir kitapçıda çalışan adam her müşteriye tek soru sorardı: 'Bugün kalbin hangi konuda aç?' Cevaba göre kitap önerirdi. Bir gün hiçbir şey hissetmediğini söyleyen birine boş bir defter verdi. Adam şaşırdı ama haftalar sonra geri dönüp teşekkür etti: 'İlk kez kendimi duydum.' 📚",
  "Genç bir sporcu ilk yenilgisinde bırakmayı düşündü. Antrenörü ona skor tablosunu değil gelişim çizelgesini gösterdi. 'Bak, düne göre daha iyisin' dedi. O cümle sporcunun kaderini değiştirdi. Çünkü kıyas bazen başkasıyla değil, dünkü hâlinle yapılır. 🏅",
  "Bir mühendis köprü tasarlarken en çok görünmeyen parçaları önemserdi. Çırak nedenini sorunca 'Güç, görünen kadar görünmeyendedir' dedi. Bu söz sadece köprüye değil, karaktere de uyuyordu. İnsan da en çok kimse görmezken kurulur. 🌉",
  "Küçük bir kasabada her akşam aynı otobüse binen yaşlı bir teyze vardı. Şoför bir gün sohbet açtı; teyze her gün hastaneye yalnızlara kitap okumaya gidiyormuş. Şoför o günden sonra yolculara daha nazik davranmaya başladı. Çünkü iyi insanlar bulaşıcıdır. 🚌",
  "Bir çocuk satrançta sürekli kaybediyordu. Dedesi 'kaybederken ne öğrendiğini yaz' dedi. Çocuk her oyundan sonra üç not aldı. Birkaç ay sonra oyunu hâlâ ciddiydi ama yüzünde panik yoktu. Kazanmaya başladığında asıl farkın zihninde olduğunu anladı. ♟️",
  "Bir gün okulda elektrikli kalem yarışması yapıldı. Herkes en renkli tasarımı yaptı, ama sade tasarım birinci oldu. Jüri nedeni sorduğunda 'kullanılabilirlik' dedi. Öğrenciler o gün estetikle işlevin birlikte değerli olduğunu öğrendi. 🎨",
  "Bir doktor, yoğun bir nöbette genç bir hastaya sadece ilaç yazmadı; bir de yürüyüş listesi verdi. Hasta şaşırdı ama uyguladı. Ay sonunda sadece bedeni değil zihni de toparlandı. Bazen iyileşme, küçük ritüellerin toplamıdır. 🚶",
  "Bir yazılımcı hatadan kaçarken ilerleyemediğini fark etti. Sonra her hata için kısa bir not ve çözüm kartı oluşturmaya başladı. Zamanla hata sayısı azaldı, özgüveni arttı. Sorunlar düşman değil, doğru okununca öğretmendir. 🛠️",
  "Bir öğrenci konuşma yapmaktan korkuyordu. Öğretmeni ona ilk gün sadece 30 saniye konuşma görevi verdi. Ertesi hafta 1 dakika, sonra 2… Dönem sonunda sahnede en rahat konuşan oydu. Cesaret kas gibidir; küçük tekrarlarla güçlenir. 🎤",
  "Bir ressam yıllarca sadece manzara çizdi. Bir gün torunu 'beni de çiz' dedi. Portre zor geldi ama denedi. O portre sergisinin en çok konuşulan işi oldu. Ustalık, alıştığını tekrar etmek değil, yeniye alan açmaktır. 🖼️",
  "Bir köyde su kuyusu kuruyunca herkes endişelendi. Gençler eski haritaları inceleyip yeni bir kaynak buldu. Günlerce çalıştılar, sonunda su çıktı. Kutlama günü yaşlı bir amca şöyle dedi: 'Birlik, en güçlü pompadır.' Herkes güldü ama hak verdi. 💧",
  "Bir piyanist konserden önce ellerinin titrediğini fark etti. Öğretmeni ona nefes ritmi verdi: dört say nefes al, dört tut, dört ver. Konserde titreme azaldı, müzik aktı. Bazen performansı kurtaran şey teknik değil, sakinliktir. 🎹",
  "Bir çocuk her gün aynı ağacın altına oturup soru çözerdi. Sınavı kazanınca ağaca teşekkür notu astı: 'Gölgen için sağ ol.' Köylüler gülümsedi ama ağacı korumaya başladılar. Başarı sadece kişiyi değil çevreyi de güzelleştirebilir. 🌳",
  "Bir startup ekibi ilk yatırım sunumunda reddedildi. Moraller düştü ama geri bildirimleri tek tek okudular. İkinci sunumda aynı fikir daha net bir hikâyeyle anlatıldı ve yatırım geldi. Fikir yetmez; anlatım da mühendislik ister. 📈",
  "Gecenin bir vakti bir öğrenci 'yapamıyorum' diye masaya kapanmıştı. Sonra küçük bir hedef koydu: sadece bir soru. O bir soru iki oldu, üç oldu… Gece sonunda tüm test bitmedi belki ama vazgeçmedi. Ve bazen en büyük zafer budur. 🌙"
];

const mathKeywordBank = [
  "matematik", "aritmetik", "cebir", "denklem", "eşitsizlik", "fonksiyon", "grafik", "polinom", "binom", "trinom", "karekök", "küp", "üs", "logaritma", "trigonometri", "sin", "cos", "tan", "cot", "türev", "integral", "limit", "olasılık", "istatistik", "permütasyon", "kombinasyon", "faktöriyel", "matris", "determinant", "vektör", "analitik", "geometri", "üçgen", "kare", "dikdörtgen", "çember", "daire", "alan", "hacim", "çevre", "oran", "orantı", "yüzde", "faiz", "kesir", "pay", "payda", "rasyonel", "irrasyonel", "doğal", "tam", "asal", "bileşik", "mod", "kalan", "bölünebilme", "bölme", "çarpma", "toplama", "çıkarma", "işlem", "işlem önceliği", "parantez", "mutlak", "sayı doğrusu", "dizi", "seri", "ortalama", "medyan", "mod değer", "standart sapma", "varyans", "korelasyon", "regresyon", "lineer", "kuadratik", "kübik", "parabol", "hiperbol", "elips", "doğru", "eğim", "kesişim", "kök", "kat", "katı", "çarpan", "bölen", "ebob", "ekok", "sadeleştirme", "genişletme", "denk", "eşit", "yaklaşık", "yuvarlama", "ondalık", "virgül", "tam kare", "özdeşlik", "çarpanlara ayırma", "sadeleştir", "çöz", "ispat", "kanıt", "problem", "soru", "alma", "verme", "elma", "miktar", "kilo", "metre", "zaman", "hız", "ivme", "iş", "güç", "oranlama", "birim", "birinci derece", "ikinci derece", "üçüncü derece", "lineer denklem", "denklem sistemi", "iki bilinmeyenli", "üç bilinmeyenli", "gauss", "kare tamamlama", "diskriminant", "delta", "katsayı", "sabit terim", "değişken", "x", "y", "z", "sınav", "çalışma", "soru bankası", "pratik", "hızlı çözüm", "adım adım", "mantık", "küme", "alt küme", "birleşim", "kesişim kümesi", "fark kümesi", "kartezyen", "doğrusal", "çizelge", "tablo", "sütun", "çubuk grafik", "pasta grafik", "çizgi grafik", "dağılım", "çokgen", "yamuk", "paralelkenar", "dik üçgen", "hipotenüs", "pisagor", "öklid", "benzerlik", "eşlik", "açı", "radyan", "derece"
];

const topicResponses = {
  kesir: [
    "Kesirlerde önce pay/payda ilişkisini kontrol ederiz, sonra sadeleştiririz. İstersen örnekle adım adım gidelim. 🍰",
    "Kesir toplamada paydaları eşitlemek en güvenli başlangıçtır. Hadi bir tane çözelim! ✍️",
    "Kesri sadeleştirirken pay ve paydayı ortak bölenlerine ayırırsın; olay çok netleşir. ✅",
    "Bileşik kesri tam sayılıya, tam sayılıyı bileşiğe çevirmek kesir sezgisini güçlendirir. 💡",
    "Kesir çarpımında çapraz sadeleştirme hız kazandırır, sınavda çok işine yarar. ⚡"
  ],
  denklem: [
    "Denklem çözerken hedef bilinmeyeni yalnız bırakmaktır; bunu birlikte temiz adımlarla yaparız. 🧠",
    "Eşitliğin iki tarafına aynı işlemi uygularsan dengeyi korursun. Matematikte adalet şart 😄",
    "Birinci derece denklemde önce toplama-çıkarma, sonra çarpma-bölme ile ilerlemek çok pratiktir. 🎯",
    "Parantez varsa önce dağıt, sonra benzer terimleri topla; denklem bir anda açılır. 🔓",
    "Son adımda çözümü denklemde yerine yazıp kontrol etmek altın kuraldır. 🏆"
  ],
  rasyonel: [
    "Rasyonel sayılar a/b biçiminde yazılabilen sayılardır (b ≠ 0). Gayet cool bir küme 😎",
    "Rasyonel ifadelerde tanımsızlık için paydayı sıfır yapan değerleri dışarıda bırakırız. 🚫",
    "Sadeleştirme yaparken ortak çarpanları ayırmak hız ve netlik kazandırır. ✨",
    "Rasyonel sayılar sayı doğrusunda tam sayılar arasında da güzelce yaşar. 🌈",
    "Ondalık gösterimden kesre dönüştürme ile rasyonel olup olmadığını hızlıca test edebilirsin. ✅"
  ],
  cebir: [
    "Cebirde benzer terimleri toplamak ilk temizlik adımıdır; masa toparlanınca çözüm kolaylaşır. 🧹",
    "Özdeşlikleri bilmek çarpanlara ayırmada sana turbo kazandırır. 🚀",
    "x, y gibi değişkenler bilinmeyen değil değişebilir miktarlardır; dost gibi yaklaş. 🤝",
    "Cebirsel ifadelerde işlem önceliğini iyi kurarsan hata oranı ciddi düşer. 📉",
    "Soruyu önce sembolleştirmek zihni rahatlatır ve çözümü görünür yapar. 👀"
  ]
};

function chooseRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function hasAny(input, variants) {
  return variants.some((item) => input.includes(item));
}

function playClickSound() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  if (!window.__balukAudio) {
    window.__balukAudio = new AudioCtx();
  }

  const ctx = window.__balukAudio;
  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "square";
  osc.frequency.value = 1300;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.055);
}

function addMessage(text, role) {
  const node = document.createElement("div");
  node.className = `msg ${role}`;
  node.textContent = text;
  chat.appendChild(node);
  chat.scrollTop = chat.scrollHeight;
}

function addThinkingMessage() {
  const node = document.createElement("div");
  node.className = "msg bot thinking";
  node.innerHTML = `
    <div class="thinking-logo spin-3s">
      <svg class="fish-logo think" viewBox="0 0 520 220" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">
        <use href="#baluk-fish"></use>
      </svg>
    </div>
    <div class="thinking-text">Baluk düşünüyor... 🧠</div>
  `;
  chat.appendChild(node);
  chat.scrollTop = chat.scrollHeight;
  return node;
}

function finishThinkingMessage(node, answer) {
  const logo = node.querySelector(".thinking-logo");
  const text = node.querySelector(".thinking-text");
  logo.classList.remove("spin-3s");
  text.textContent = answer;
}

function openChatIfNeeded() {
  if (hasStartedChat) return;
  hasStartedChat = true;
  splash.classList.add("hidden");
  chat.classList.remove("hidden");
}

function resetChat() {
  hasStartedChat = false;
  chat.innerHTML = "";
  chat.classList.add("hidden");
  splash.classList.remove("hidden");
  userInput.value = "";
  userInput.focus();
}

function solveSimpleExpression(input) {
  const normalized = input
    .toLowerCase()
    .replaceAll("x", "*")
    .replaceAll("çarpı", "*")
    .replaceAll("kere", "*")
    .replaceAll("bölü", "/")
    .replaceAll("artı", "+")
    .replaceAll("eksi", "-")
    .replace(/[^0-9+\-*/()., ]/g, "")
    .replaceAll(",", ".")
    .trim();

  if (!/[0-9]/.test(normalized) || !/[+\-*/]/.test(normalized)) return null;

  try {
    const value = Function(`"use strict"; return (${normalized});`)();
    if (Number.isFinite(value)) {
      return `Sonuç: ${value} ✅\nİstersen aynı işlemi adım adım da gösterebilirim.`;
    }
  } catch {
    return null;
  }

  return null;
}

function solveLinearEquation(input) {
  const compact = input.toLowerCase().replace(/\s+/g, "");
  const match = compact.match(/^([+-]?\d*)x([+-]\d+)?=([+-]?\d+)$/);
  if (!match) return null;

  const aRaw = match[1];
  const bRaw = match[2] || "+0";
  const cRaw = match[3];

  const a = aRaw === "" || aRaw === "+" ? 1 : aRaw === "-" ? -1 : Number(aRaw);
  const b = Number(bRaw);
  const c = Number(cRaw);

  if (a === 0) return "Bu denklemde x katsayısı 0 olduğu için klasik çözüm yok. Başka bir form deneyelim. 🛠️";
  const x = (c - b) / a;
  return `Denklem çözümü: x = ${x} 🎯\nİstersen bunu adım adım da yazayım.`;
}

function solveAppleProblem(input) {
  const q = input.toLowerCase();
  const nums = (q.match(/\d+/g) || []).map(Number);
  if (!q.includes("elma") || nums.length < 2) return null;

  if (q.includes("yedi") || q.includes("verdi") || q.includes("kaldı")) {
    return `Problem sonucu: ${nums[0] - nums[1]} elma kalır. 🍎\nMantık: eldeki sayıdan verilen/yenen miktarı çıkardık.`;
  }

  if (q.includes("aldı") || q.includes("kaç oldu") || q.includes("toplam")) {
    return `Problem sonucu: ${nums[0] + nums[1]} elma olur. 🍏\nMantık: mevcut miktara alınan sayıyı ekledik.`;
  }

  return null;
}

function buildResponse(input) {
  const lowered = input.toLowerCase();

  if (hasAny(lowered, ["merhaba", "selam", "merhab", "meraba", "kanka merhaba"])) {
    return chooseRandom(merhabaResponses);
  }

  if (hasAny(lowered, ["nasılsın", "nasilsin", "merhab anasılsın", "merhaba nasılsın"])) {
    return chooseRandom(nasilsinResponses);
  }

  if (hasAny(lowered, ["naber", "napıyosun", "ne haber", "anber"])) {
    return chooseRandom(naberResponses);
  }

  if (hasAny(lowered, ["seni kim yaptı", "kim yaptı", "kim geliştirdi", "yaratıcın kim"])) {
    return chooseRandom(whoMadeMeResponses);
  }

  if (hasAny(lowered, ["hangi model", "hangi modeli", "hangi modeli kullanıyorum", "model ne", "modelin ne"])) {
    const selected = chooseRandom(modelResponses);
    return selected();
  }

  if (hasAny(lowered, ["şiir yaz", "siir yaz", "şiir", "siir"])) {
    return chooseRandom(poemTemplates);
  }

  if (hasAny(lowered, ["hikaye anlat", "hikâye anlat", "hikaye", "hikâye", "masal anlat"])) {
    return chooseRandom(storyTemplates);
  }

  const appleResult = solveAppleProblem(input);
  if (appleResult) return appleResult;

  const linearResult = solveLinearEquation(input);
  if (linearResult) return linearResult;

  const exprResult = solveSimpleExpression(input);
  if (exprResult) return exprResult;

  if (lowered.includes("kesir")) return chooseRandom(topicResponses.kesir);
  if (lowered.includes("denklem") || lowered.includes("x=")) return chooseRandom(topicResponses.denklem);
  if (lowered.includes("rasyonel")) return chooseRandom(topicResponses.rasyonel);
  if (lowered.includes("cebir") || lowered.includes("cebirsel")) return chooseRandom(topicResponses.cebir);

  const mathIntent = mathKeywordBank.some((keyword) => lowered.includes(keyword));
  if (mathIntent) {
    return "Matematik modundayım 🐟📘 Bana işlemi doğrudan yazabilirsin: örn. `(67+34)*2`, `3/4 + 5/8`, `2x+7=19` veya sözel problem. İstersen adım adım çözüm de çıkarırım.";
  }

  return `Mesajını aldım: \"${input}\"\nAktif model: ${currentModel} ✅\nBenimle sohbet, şiir, hikâye, matematik, fikir üretimi yapabilirsin. Üslubu da seçebilirsin: kısa, uzun, komik, profesyonel. 😄`;
}

function processInput(text) {
  openChatIfNeeded();
  addMessage(text, "user");
  const thinkingNode = addThinkingMessage();

  setTimeout(() => {
    const response = buildResponse(text);
    finishThinkingMessage(thinkingNode, response);
    chat.scrollTop = chat.scrollHeight;
  }, 3000);
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;

  playClickSound();
  processInput(text);
  userInput.value = "";
  userInput.focus();
});

clearChat.addEventListener("click", () => {
  resetChat();
});

modelToggle.addEventListener("click", () => {
  modelMenu.classList.toggle("hidden");
});

document.addEventListener("click", (event) => {
  const clickedInsideMenu = modelMenu.contains(event.target);
  const clickedToggle = modelToggle.contains(event.target);
  if (!clickedInsideMenu && !clickedToggle) {
    modelMenu.classList.add("hidden");
  }
});

modelOptions.forEach((option) => {
  option.addEventListener("click", () => {
    modelOptions.forEach((item) => item.classList.remove("active"));
    option.classList.add("active");
    currentModel = option.dataset.model;
    modelMenu.classList.add("hidden");
  });
});
