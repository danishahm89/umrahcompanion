import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.customizeEnquiry.deleteMany();
  await prisma.ebook.deleteMany();
  await prisma.dua.deleteMany();
  await prisma.duaStage.deleteMany();
  await prisma.packingItem.deleteMany();
  await prisma.packingGroup.deleteMany();
  await prisma.vaccineItem.deleteMany();
  await prisma.newsItem.deleteMany();
  await prisma.newsSource.deleteMany();
  await prisma.nusukLink.deleteMany();
  await prisma.faqItem.deleteMany();
  await prisma.service.deleteMany();
  await prisma.guideRitual.deleteMany();
  await prisma.firstTimeStep.deleteMany();
  await prisma.itineraryItem.deleteMany();
  await prisma.packageInclusion.deleteMany();
  await prisma.package.deleteMany();
  await prisma.contactInfo.deleteMany();
  await prisma.appSettings.deleteMany();
  await prisma.adminUser.deleteMany();

  await prisma.adminUser.create({
    data: {
      email: 'admin@alzakwaantours.in',
      passwordHash: await bcrypt.hash('umrah-admin-2026', 10),
      name: 'Alzakwaan Staff',
    },
  });

  await prisma.appSettings.create({
    data: {
      id: 1,
      companyName: 'Alzakwaan Tours & Travels Pvt Ltd',
      appName: 'Umrah Companion',
    },
  });

  await prisma.contactInfo.create({
    data: {
      id: 1,
      whatsapp: '+91 99905 43267',
      phone: '+91 85338 98533',
      website: 'www.alzakwaantours.com',
      primaryEmail: 'info@alzakwaantours.com',
      secondaryEmail: 'alzakwaantours@gmail.com',
      offices: JSON.stringify(['Aligarh', 'Delhi', 'Patna']),
    },
  });

  const RIT: [string, string, string, string, string, string][] = [
    ['Niyyah & Ihram', 'नीयत और एहराम', 'نیت اور احرام', 'Enter Ihram at or before the Miqat, after two rakat and the intention.', 'मीक़ात पर या उससे पहले, दो रकात और नीयत के बाद एहराम बाँधें।', 'میقات پر یا اس سے پہلے، دو رکعت اور نیت کے بعد احرام باندھیں۔'],
    ['Talbiyah', 'तलबिया', 'تلبیہ', 'Recite it aloud from the Miqat until you reach the Haram.', 'मीक़ात से हरम पहुँचने तक बुलंद आवाज़ में पढ़ें।', 'میقات سے حرم پہنچنے تک بلند آواز میں پڑھیں۔'],
    ['Tawaf', 'तवाफ़', 'طواف', 'Seven circuits of the Kaaba, beginning and ending at the Black Stone.', 'काबा के सात चक्कर, हजरे-अस्वद से शुरू और वहीं ख़त्म।', 'کعبہ کے سات چکر، حجرِ اسود سے شروع اور وہیں ختم۔'],
    ['Sai', 'सई', 'سعی', 'Seven walks between Safa and Marwah, starting at Safa.', 'सफ़ा और मरवा के बीच सात चक्कर, सफ़ा से शुरू।', 'صفا اور مروہ کے درمیان سات چکر، صفا سے شروع۔'],
    ['Halq or Taqsir', 'हल्क़ या तक़सीर', 'حلق یا تقصیر', 'Shave or trim the hair. Ihram ends here and Umrah is complete.', 'बाल मुँडवाएँ या कटवाएँ। यहीं एहराम ख़त्म और उमराह पूरा।', 'بال منڈوائیں یا کٹوائیں۔ یہیں احرام ختم اور عمرہ مکمل۔'],
    ['Zamzam & farewell', 'ज़मज़म और विदाई', 'زمزم اور الوداع', 'Drink Zamzam, pray, and make your closing duas before leaving.', 'ज़मज़म पिएँ, नमाज़ पढ़ें और रुख़्सत से पहले दुआ करें।', 'زمزم پییں، نماز پڑھیں اور رخصت سے پہلے دعا کریں۔'],
  ];
  for (const [i, r] of RIT.entries()) {
    await prisma.guideRitual.create({ data: { order: i, titleEn: r[0], titleHi: r[1], titleUr: r[2], descEn: r[3], descHi: r[4], descUr: r[5] } });
  }

  const STEPS: [string, string, string, string, string, string][] = [
    ['Documents & Nusuk ID', 'दस्तावेज़ और नुसुक आईडी', 'دستاویزات اور نسک آئی ڈی', 'Passport valid six months, photographs, and a Nusuk account.', 'छह महीने वैध पासपोर्ट, फ़ोटो और नुसुक अकाउंट।', 'چھ ماہ کا معتبر پاسپورٹ، تصاویر اور نسک اکاؤنٹ۔'],
    ['Vaccines', 'टीके', 'ویکسین', 'Meningitis ACWY certificate must be ready before the visa.', 'वीज़ा से पहले मेनिंजाइटिस ACWY सर्टिफ़िकेट तैयार रखें।', 'ویزا سے پہلے مینینجائٹس ACWY سرٹیفکیٹ تیار رکھیں۔'],
    ['At the airport', 'एयरपोर्ट पर', 'ایئرپورٹ پر', 'Keep Ihram in your cabin bag and change before the Miqat.', 'एहराम केबिन बैग में रखें और मीक़ात से पहले बदलें।', 'احرام کیبن بیگ میں رکھیں اور میقات سے پہلے تبدیل کریں۔'],
    ['Entering Ihram', 'एहराम बाँधना', 'احرام باندھنا', 'Two white sheets, two rakat, then the intention and Talbiyah.', 'दो सफ़ेद चादरें, दो रकात, फिर नीयत और तलबिया।', 'دو سفید چادریں، دو رکعت، پھر نیت اور تلبیہ۔'],
    ['Performing Umrah', 'उमराह अदा करना', 'عمرہ ادا کرنا', 'Tawaf, then Sai, then Halq or Taqsir. Take water and go slowly.', 'तवाफ़, फिर सई, फिर हल्क़ या तक़सीर। पानी रखें, आराम से चलें।', 'طواف، پھر سعی، پھر حلق یا تقصیر۔ پانی رکھیں، آرام سے چلیں۔'],
    ['Madinah & return', 'मदीना और वापसी', 'مدینہ اور واپسی', 'Book the Rawdah permit on Nusuk and keep return papers together.', 'नुसुक पर रौज़ा परमिट बुक करें और वापसी के कागज़ साथ रखें।', 'نسک پر روضہ پرمٹ بک کریں اور واپسی کے کاغذات ساتھ رکھیں۔'],
  ];
  for (const [i, s] of STEPS.entries()) {
    await prisma.firstTimeStep.create({ data: { order: i, titleEn: s[0], titleHi: s[1], titleUr: s[2], descEn: s[3], descHi: s[4], descUr: s[5] } });
  }

  const STAGES: [string, string, string][] = [
    ['Ihram', 'एहराम', 'احرام'], ['Tawaf', 'तवाफ़', 'طواف'], ['Sai', 'सई', 'سعی'], ['Halq', 'हल्क़', 'حلق'],
  ];
  const STAGE_NOTE: [string, string, string][] = [
    ['Said after the two rakat, then repeated on the way.', 'दो रकात के बाद पढ़ें, फिर रास्ते में दोहराएँ।', 'دو رکعت کے بعد پڑھیں، پھر راستے میں دہرائیں۔'],
    ['Said at the start of each circuit and between the corners.', 'हर चक्कर की शुरुआत में और कोनों के बीच पढ़ें।', 'ہر چکر کے آغاز پر اور کونوں کے درمیان پڑھیں۔'],
    ['Said on Safa and repeated during the seven walks.', 'सफ़ा पर पढ़ें और सात चक्करों में दोहराएँ।', 'صفا پر پڑھیں اور سات چکروں میں دہرائیں۔'],
    ['Said after the hair is cut and with Zamzam water.', 'बाल कटने के बाद और ज़मज़म पीते वक़्त पढ़ें।', 'بال کٹنے کے بعد اور زمزم پیتے وقت پڑھیں۔'],
  ];
  const DUAS: { ar: string; tr: string; w: [string, string, string]; m: [string, string, string] }[][] = [
    [
      { ar: 'اللَّهُمَّ إِنِّي أُرِيدُ الْعُمْرَةَ فَيَسِّرْهَا لِي وَتَقَبَّلْهَا مِنِّي', tr: "Allahumma inni uridul-'umrata fa-yassirha li wa taqabbalha minni", w: ['Intention', 'नीयत', 'نیت'], m: ['O Allah, I intend Umrah — make it easy for me and accept it from me.', 'ऐ अल्लाह, मैं उमराह का इरादा रखता हूँ — इसे आसान कर और मुझसे क़बूल कर।', 'اے اللہ، میں عمرہ کا ارادہ رکھتا ہوں — اسے آسان کر اور مجھ سے قبول کر۔'] },
      { ar: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ', tr: 'Labbayk Allahumma labbayk, labbayka la sharika laka labbayk…', w: ['Talbiyah', 'तलबिया', 'تلبیہ'], m: ['Here I am, O Allah, here I am. You have no partner. All praise, blessing and dominion are Yours.', 'मैं हाज़िर हूँ ऐ अल्लाह, मैं हाज़िर हूँ। तेरा कोई शरीक नहीं। हर तारीफ़, नेमत और बादशाही तेरी है।', 'میں حاضر ہوں اے اللہ، میں حاضر ہوں۔ تیرا کوئی شریک نہیں۔ ہر تعریف، نعمت اور بادشاہی تیری ہے۔'] },
    ],
    [
      { ar: 'بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ', tr: 'Bismillahi wallahu akbar', w: ['At the Black Stone', 'हजरे-अस्वद पर', 'حجرِ اسود پر'], m: ['In the name of Allah, and Allah is the Greatest.', 'अल्लाह के नाम से, और अल्लाह सबसे बड़ा है।', 'اللہ کے نام سے، اور اللہ سب سے بڑا ہے۔'] },
      { ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', tr: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar", w: ['Yemeni corner to the Black Stone', 'रुक्ने-यमानी से हजरे-अस्वद तक', 'رکنِ یمانی سے حجرِ اسود تک'], m: ['Our Lord, give us good in this world and the next, and save us from the Fire.', 'ऐ हमारे रब, हमें दुनिया और आख़िरत में भलाई दे और आग के अज़ाब से बचा।', 'اے ہمارے رب، ہمیں دنیا اور آخرت میں بھلائی دے اور آگ کے عذاب سے بچا۔'] },
    ],
    [
      { ar: 'إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ', tr: "Inna s-Safa wal-Marwata min sha'a'irillah", w: ['On Safa', 'सफ़ा पर', 'صفا پر'], m: ['Indeed Safa and Marwah are among the signs of Allah.', 'बेशक सफ़ा और मरवा अल्लाह की निशानियों में से हैं।', 'بے شک صفا اور مروہ اللہ کی نشانیوں میں سے ہیں۔'] },
      { ar: 'رَبِّ اغْفِرْ وَارْحَمْ إِنَّكَ أَنْتَ الْأَعَزُّ الْأَكْرَمُ', tr: "Rabbighfir warham innaka antal-a'azzul-akram", w: ['Between Safa and Marwah', 'सफ़ा और मरवा के बीच', 'صفا اور مروہ کے درمیان'], m: ['My Lord, forgive and have mercy — You are the Most Mighty, the Most Generous.', 'ऐ मेरे रब, माफ़ कर और रहम कर — तू ही सबसे ग़ालिब, सबसे करीम है।', 'اے میرے رب، معاف کر اور رحم کر — تو ہی سب سے غالب، سب سے کریم ہے۔'] },
    ],
    [
      { ar: 'اللَّهُمَّ تَقَبَّلْ مِنِّي وَاغْفِرْ لِي', tr: 'Allahumma taqabbal minni waghfir li', w: ['After Halq', 'हल्क़ के बाद', 'حلق کے بعد'], m: ['O Allah, accept this from me and forgive me.', 'ऐ अल्लाह, इसे मुझसे क़बूल कर और मुझे माफ़ कर।', 'اے اللہ، اسے مجھ سے قبول کر اور مجھے معاف کر۔'] },
      { ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا وَاسِعًا وَشِفَاءً مِنْ كُلِّ دَاءٍ', tr: "Allahumma inni as'aluka 'ilman nafi'an wa rizqan wasi'an wa shifa'an min kulli da'", w: ['Drinking Zamzam', 'ज़मज़म पीते वक़्त', 'زمزم پیتے وقت'], m: ['O Allah, I ask You for useful knowledge, ample provision and a cure from every illness.', 'ऐ अल्लाह, मैं तुझसे नफ़ा देने वाला इल्म, कुशादा रिज़्क़ और हर बीमारी से शिफ़ा माँगता हूँ।', 'اے اللہ، میں تجھ سے نفع بخش علم، کشادہ رزق اور ہر بیماری سے شفا مانگتا ہوں۔'] },
    ],
  ];
  for (const [i, s] of STAGES.entries()) {
    const stage = await prisma.duaStage.create({ data: { order: i, nameEn: s[0], nameHi: s[1], nameUr: s[2], noteEn: STAGE_NOTE[i][0], noteHi: STAGE_NOTE[i][1], noteUr: STAGE_NOTE[i][2] } });
    for (const [j, d] of DUAS[i].entries()) {
      await prisma.dua.create({ data: { stageId: stage.id, order: j, arabic: d.ar, transliteration: d.tr, whenEn: d.w[0], whenHi: d.w[1], whenUr: d.w[2], meaningEn: d.m[0], meaningHi: d.m[1], meaningUr: d.m[2] } });
    }
  }

  const PACK: [[string, string, string], [string, string, string][]][] = [
    [['Documents', 'दस्तावेज़', 'دستاویزات'], [
      ['Passport', 'पासपोर्ट', 'پاسپورٹ'], ['Visa printout', 'वीज़ा प्रिंटआउट', 'ویزا پرنٹ آؤٹ'],
      ['Nusuk permit QR', 'नुसुक परमिट QR', 'نسک پرمٹ QR'], ['Vaccine certificate', 'टीका सर्टिफ़िकेट', 'ویکسین سرٹیفکیٹ'],
      ['Four photographs', 'चार फ़ोटो', 'چار تصاویر'], ['Ticket copies', 'टिकट की कॉपी', 'ٹکٹ کی کاپی'],
    ]],
    [['Ihram & clothing', 'एहराम और कपड़े', 'احرام اور کپڑے'], [
      ['Two Ihram sheets', 'दो एहराम चादरें', 'دو احرام چادریں'], ['Ihram belt', 'एहराम बेल्ट', 'احرام بیلٹ'],
      ['Unstitched slippers', 'बिना सिलाई चप्पल', 'بغیر سلائی چپل'], ['Prayer cap', 'टोपी', 'ٹوپی'],
      ['Loose clothing / abaya', 'ढीले कपड़े / अबाया', 'ڈھیلے کپڑے / عبایا'], ['Unscented soap', 'बिना ख़ुशबू साबुन', 'بغیر خوشبو صابن'],
    ]],
    [['Health', 'सेहत', 'صحت'], [
      ['Prescription medicines', 'नियमित दवाएँ', 'مستقل دوائیں'], ['ORS sachets', 'ORS पैकेट', 'او آر ایس ساشے'],
      ['Bandages & antiseptic', 'पट्टी और एंटीसेप्टिक', 'پٹی اور اینٹی سیپٹک'], ['Petroleum jelly', 'वैसलीन', 'ویزلین'],
      ['Masks', 'मास्क', 'ماسک'],
    ]],
    [['Essentials', 'ज़रूरी सामान', 'ضروری سامان'], [
      ['Zamzam bottle', 'ज़मज़म बोतल', 'زمزم بوتل'], ['Foldable prayer mat', 'तह होने वाली जानमाज़', 'تہ ہونے والی جانماز'],
      ['Power bank', 'पावर बैंक', 'پاور بینک'], ['Universal adapter', 'यूनिवर्सल अडैप्टर', 'یونیورسل اڈاپٹر'],
      ['Shoe bag', 'जूते का थैला', 'جوتوں کا تھیلا'], ['Umbrella', 'छतरी', 'چھتری'],
    ]],
  ];
  for (const [i, [g, items]] of PACK.entries()) {
    const group = await prisma.packingGroup.create({ data: { order: i, titleEn: g[0], titleHi: g[1], titleUr: g[2] } });
    for (const [j, it] of items.entries()) {
      await prisma.packingItem.create({ data: { groupId: group.id, order: j, textEn: it[0], textHi: it[1], textUr: it[2] } });
    }
  }

  const VAX: [string, string, string, string, string, string, string, string, string][] = [
    ['Meningococcal ACWY', 'मेनिंगोकोकल ACWY', 'مینینگوکوکل ACWY', 'Mandatory', 'अनिवार्य', 'لازمی', 'Taken 10 days to 3 years before arrival. Certificate checked at visa stage.', '10 दिन से 3 साल पहले लगवाएँ। सर्टिफ़िकेट वीज़ा में जाँचा जाता है।', '10 دن سے 3 سال پہلے لگوائیں۔ سرٹیفکیٹ ویزا میں چیک ہوتا ہے۔'],
    ['Polio (OPV)', 'पोलियो (OPV)', 'پولیو (OPV)', 'Required for India', 'भारत के लिए आवश्यक', 'بھارت کے لیے لازمی', 'One dose 4 weeks to 12 months before departure.', 'रवानगी से 4 हफ़्ते से 12 महीने पहले एक ख़ुराक।', 'روانگی سے 4 ہفتے تا 12 ماہ پہلے ایک خوراک۔'],
    ['Seasonal influenza', 'मौसमी फ़्लू', 'موسمی فلو', 'Recommended', 'अनुशंसित', 'تجویز کردہ', 'Advised for crowded seasons and for elders.', 'भीड़ के मौसम और बुज़ुर्गों के लिए सलाह दी जाती है।', 'ہجوم کے موسم اور بزرگوں کے لیے مشورہ دیا جاتا ہے۔'],
    ['COVID-19', 'कोविड-19', 'کووڈ-19', 'Recommended', 'अनुशंसित', 'تجویز کردہ', 'Follow the current Saudi advisory at the time of travel.', 'सफ़र के वक़्त की मौजूदा सऊदी सलाह देखें।', 'سفر کے وقت کی موجودہ سعودی ہدایت دیکھیں۔'],
    ['Yellow fever', 'येलो फ़ीवर', 'یلو فیور', 'If transiting', 'ट्रांज़िट करने पर', 'ٹرانزٹ کی صورت میں', 'Only if you transit a listed country. Ask us if unsure.', 'सिर्फ़ सूचीबद्ध देश से ट्रांज़िट पर। शक हो तो पूछें।', 'صرف فہرست میں شامل ملک سے ٹرانزٹ پر۔ شک ہو تو پوچھیں۔'],
  ];
  for (const [i, v] of VAX.entries()) {
    await prisma.vaccineItem.create({ data: { order: i, nameEn: v[0], nameHi: v[1], nameUr: v[2], statusEn: v[3], statusHi: v[4], statusUr: v[5], descEn: v[6], descHi: v[7], descUr: v[8] } });
  }

  const newsSourceNames: [string, string][] = [
    ['Nusuk', 'nusuk.sa'],
    ['Ministry of Hajj', 'haj.gov.sa'],
    ['Saudi Press Agency', 'spa.gov.sa'],
  ];
  const sources: Record<string, string> = {};
  for (const [name, domain] of newsSourceNames) {
    const src = await prisma.newsSource.create({ data: { name, domain, lastSyncedAt: new Date() } });
    sources[name] = src.id;
  }
  const NEWS: [string, string, string, string, string, string, string, string][] = [
    ['Nusuk', '2h', 'Umrah permit slots opened for Safar 1448', 'New booking windows released for Makkah and for Rawdah visits in Madinah.', 'सफ़र 1448 के लिए उमराह परमिट स्लॉट खुले', 'मक्का और मदीना में रौज़ा ज़ियारत के लिए नई बुकिंग विंडो जारी।', 'صفر 1448 کے لیے عمرہ پرمٹ سلاٹ کھل گئے', 'مکہ اور مدینہ میں روضہ زیارت کے لیے نئی بکنگ ونڈو جاری۔'],
    ['Ministry of Hajj', '5h', 'Rawdah permits bookable ten days ahead', 'The booking horizon has been extended; one visit per pilgrim per season.', 'रौज़ा परमिट दस दिन पहले बुक हो सकेंगे', 'बुकिंग अवधि बढ़ाई गई; हर ज़ायरीन को सीज़न में एक ज़ियारत।', 'روضہ پرمٹ دس دن پہلے بک ہو سکیں گے', 'بکنگ مدت بڑھا دی گئی؛ ہر زائر کو سیزن میں ایک زیارت۔'],
    ['Saudi Press Agency', '1d', 'Additional Mataf capacity opens for peak hours', 'Crowd management adds new routes for wheelchair users.', 'पीक आवर्स में मताफ़ की अतिरिक्त क्षमता', 'भीड़ प्रबंधन में व्हीलचेयर के लिए नए रास्ते।', 'پیک آورز میں مطاف کی اضافی گنجائش', 'ہجوم کے انتظام میں وہیل چیئر کے لیے نئے راستے۔'],
    ['Nusuk', '2d', 'Nusuk app adds an Urdu interface', 'Pilgrims can now switch the permit flow to Urdu.', 'नुसुक ऐप में उर्दू इंटरफ़ेस', 'ज़ायरीन अब परमिट प्रक्रिया उर्दू में कर सकते हैं।', 'نسک ایپ میں اردو انٹرفیس', 'زائرین اب پرمٹ کا عمل اردو میں کر سکتے ہیں۔'],
  ];
  for (const [i, n] of NEWS.entries()) {
    await prisma.newsItem.create({
      data: {
        sourceId: sources[n[0]],
        publishedAt: new Date(Date.now() - i * 3600_000),
        titleEn: n[2], bodyEn: n[3], titleHi: n[4], bodyHi: n[5], titleUr: n[6], bodyUr: n[7],
        approved: true,
      },
    });
  }

  const LINKS: [string, string, string, string, string][] = [
    ['Nusuk portal — sign in', 'नुसुक पोर्टल — साइन इन', 'نسک پورٹل — سائن ان', 'nusuk.sa', 'https://www.nusuk.sa'],
    ['Book an Umrah permit', 'उमराह परमिट बुक करें', 'عمرہ پرمٹ بک کریں', 'nusuk.sa · permits', 'https://www.nusuk.sa'],
    ['Book a Rawdah visit', 'रौज़ा ज़ियारत बुक करें', 'روضہ زیارت بک کریں', 'nusuk.sa · Madinah', 'https://www.nusuk.sa'],
    ['Nusuk Masar guide', 'नुसुक मसार गाइड', 'نسک مسار گائیڈ', 'nusuk.sa · masar', 'https://www.nusuk.sa'],
    ['Ministry of Hajj & Umrah', 'हज और उमराह मंत्रालय', 'وزارتِ حج و عمرہ', 'haj.gov.sa', 'https://www.haj.gov.sa'],
    ['Visa status check', 'वीज़ा स्थिति जाँचें', 'ویزا اسٹیٹس چیک کریں', 'visa.mofa.gov.sa', 'https://visa.mofa.gov.sa'],
  ];
  for (const [i, l] of LINKS.entries()) {
    await prisma.nusukLink.create({ data: { order: i, titleEn: l[0], titleHi: l[1], titleUr: l[2], host: l[3], url: l[4] } });
  }

  const FAQ: [string, string, string, string, string, string][] = [
    ['How long does an Umrah visa take?', 'उमराह वीज़ा में कितना समय लगता है?', 'عمرہ ویزا میں کتنا وقت لگتا ہے؟', 'Usually 5 to 10 working days once documents and the ACWY certificate are with us.', 'दस्तावेज़ और ACWY सर्टिफ़िकेट मिलने के बाद आम तौर पर 5 से 10 कार्यदिवस।', 'دستاویزات اور ACWY سرٹیفکیٹ ملنے کے بعد عام طور پر 5 سے 10 کاروباری دن۔'],
    ['Can women travel without a mahram?', 'महिलाएँ मेहरम के बिना जा सकती हैं?', 'خواتین محرم کے بغیر جا سکتی ہیں؟', 'Yes — current Saudi rules allow it, and we place solo travellers in group rooms.', 'हाँ — मौजूदा सऊदी नियम इसकी इजाज़त देते हैं; अकेली यात्री ग्रुप रूम में रखी जाती हैं।', 'جی ہاں — موجودہ سعودی قواعد اجازت دیتے ہیں؛ اکیلی مسافر گروپ روم میں رکھی جاتی ہیں۔'],
    ['Is the Rawdah visit included?', 'रौज़ा ज़ियारत शामिल है?', 'روضہ زیارت شامل ہے؟', 'We book it on Nusuk for you, but slots are issued by the Ministry and cannot be guaranteed.', 'हम नुसुक पर बुक करते हैं, लेकिन स्लॉट मंत्रालय देता है, गारंटी नहीं दी जा सकती।', 'ہم نسک پر بک کرتے ہیں، مگر سلاٹ وزارت دیتی ہے، ضمانت نہیں دی جا سکتی۔'],
    ['What is not included in the price?', 'क़ीमत में क्या शामिल नहीं?', 'قیمت میں کیا شامل نہیں؟', 'Personal shopping, laundry, extra meals, and anything marked optional on the package.', 'निजी ख़रीदारी, कपड़े धुलाई, अतिरिक्त खाना और पैकेज में वैकल्पिक चीज़ें।', 'ذاتی خریداری، کپڑے دھلائی، اضافی کھانا اور پیکج میں اختیاری اشیاء۔'],
    ['Can you arrange wheelchairs?', 'व्हीलचेयर का इंतिज़ाम हो सकता है?', 'وہیل چیئر کا انتظام ہو سکتا ہے؟', 'Yes, at the airport and in the Haram. Tell us at booking so we can request it early.', 'हाँ, एयरपोर्ट और हरम में। बुकिंग के वक़्त बताएँ ताकि पहले से माँगा जाए।', 'جی ہاں، ایئرپورٹ اور حرم میں۔ بکنگ کے وقت بتائیں تاکہ پہلے سے درخواست ہو۔'],
    ['Do you also book air and train tickets?', 'हवाई और रेल टिकट भी बुक करते हैं?', 'ہوائی اور ٹرین ٹکٹ بھی بک کرتے ہیں؟', 'Yes — domestic and international air, plus IRCTC train tickets to your departure city.', 'हाँ — घरेलू और अंतरराष्ट्रीय हवाई, साथ ही रवानगी शहर तक IRCTC रेल टिकट।', 'جی ہاں — ملکی و بین الاقوامی ہوائی، اور روانگی شہر تک IRCTC ٹکٹ۔'],
  ];
  for (const [i, q] of FAQ.entries()) {
    await prisma.faqItem.create({ data: { order: i, questionEn: q[0], questionHi: q[1], questionUr: q[2], answerEn: q[3], answerHi: q[4], answerUr: q[5] } });
  }

  const PKGS: Array<{
    name: [string, string, string]; price: number; type: string; date: Date; nights: number;
    dist: number; stars: string; city: [string, string, string]; meals: [string, string, string];
    hajjShifting?: boolean;
  }> = [
    { name: ['Economy Umrah — 10 Nights', 'इकॉनमी उमराह — 10 रातें', 'اکانومی عمرہ — 10 راتیں'], price: 78500, type: 'group', date: new Date(2026, 10, 12), nights: 10, dist: 900, stars: '3★', city: ['Delhi', 'दिल्ली', 'دہلی'], meals: ['Breakfast', 'नाश्ता', 'ناشتہ'] },
    { name: ['Comfort Umrah — 14 Nights', 'कम्फ़र्ट उमराह — 14 रातें', 'کمفرٹ عمرہ — 14 راتیں'], price: 112000, type: 'group', date: new Date(2026, 10, 24), nights: 14, dist: 450, stars: '4★', city: ['Delhi', 'दिल्ली', 'دہلی'], meals: ['Breakfast & dinner', 'नाश्ता और रात का खाना', 'ناشتہ اور رات کا کھانا'] },
    { name: ['Premium Haram View — 12 Nights', 'प्रीमियम हरम व्यू — 12 रातें', 'پریمیم حرم ویو — 12 راتیں'], price: 185000, type: 'private', date: new Date(2026, 11, 5), nights: 12, dist: 150, stars: '5★', city: ['Lucknow', 'लखनऊ', 'لکھنؤ'], meals: ['Full board', 'तीनों वक़्त का खाना', 'تینوں وقت کا کھانا'] },
    { name: ['Ramadan Umrah — 15 Nights', 'रमज़ान उमराह — 15 रातें', 'رمضان عمرہ — 15 راتیں'], price: 210000, type: 'group', date: new Date(2027, 1, 18), nights: 15, dist: 600, stars: '4★', city: ['Patna', 'पटना', 'پٹنہ'], meals: ['Full board', 'तीनों वक़्त का खाना', 'تینوں وقت کا کھانا'] },
    { name: ['Hajj — 20 Days, Shifting', 'हज — 20 दिन, शिफ़्टिंग', 'حج — 20 دن، شفٹنگ'], price: 320000, type: 'hajj', date: new Date(2027, 5, 2), nights: 19, dist: 700, stars: '4★', city: ['Delhi', 'दिल्ली', 'دہلی'], meals: ['Full board', 'तीनों वक़्त का खाना', 'تینوں وقت کا کھانا'], hajjShifting: true },
    { name: ['Hajj — 20 Days, Non-Shifting', 'हज — 20 दिन, नॉन-शिफ़्टिंग', 'حج — 20 دن، نان شفٹنگ'], price: 355000, type: 'hajj', date: new Date(2027, 5, 2), nights: 19, dist: 400, stars: '4★', city: ['Delhi', 'दिल्ली', 'دہلی'], meals: ['Full board', 'तीनों वक़्त का खाना', 'تینوں وقت کا کھانا'], hajjShifting: false },
    { name: ['Hajj — 32 Days, Shifting', 'हज — 32 दिन, शिफ़्टिंग', 'حج — 32 دن، شفٹنگ'], price: 385000, type: 'hajj', date: new Date(2027, 4, 20), nights: 31, dist: 700, stars: '4★', city: ['Lucknow', 'लखनऊ', 'لکھنؤ'], meals: ['Full board', 'तीनों वक़्त का खाना', 'تینوں وقت کا کھانا'], hajjShifting: true },
    { name: ['Hajj — 32 Days, Non-Shifting', 'हज — 32 दिन, नॉन-शिफ़्टिंग', 'حج — 32 دن، نان شفٹنگ'], price: 425000, type: 'hajj', date: new Date(2027, 4, 20), nights: 31, dist: 350, stars: '5★', city: ['Lucknow', 'लखनऊ', 'لکھنؤ'], meals: ['Full board', 'तीनों वक़्त का खाना', 'تینوں وقت کا کھانا'], hajjShifting: false },
  ];
  const itinTemplate: [string, string, string, string, string, string][] = [
    ['Day 1', 'दिन 1', 'دن 1', 'Flight to Jeddah, transfer to Makkah, Ihram at the Miqat', 'जेद्दा उड़ान, मक्का ट्रांसफ़र, मीक़ात पर एहराम', 'جدہ پرواز، مکہ منتقلی، میقات پر احرام'],
    ['Day 2', 'दिन 2', 'دن 2', 'Umrah with a guide from our staff', 'हमारे स्टाफ़ के गाइड के साथ उमराह', 'ہمارے اسٹاف کے گائیڈ کے ساتھ عمرہ'],
    ['Makkah', 'मक्का', 'مکہ', 'Seven nights, ziyarat of Mina and Arafat', 'सात रातें, मीना और अराफ़ात की ज़ियारत', 'سات راتیں، منیٰ اور عرفات کی زیارت'],
    ['Madinah', 'मदीना', 'مدینہ', 'Three nights, Rawdah permit requested on Nusuk', 'तीन रातें, नुसुक पर रौज़ा परमिट', 'تین راتیں، نسک پر روضہ پرمٹ'],
  ];
  const inclTemplate: [string, string, string][] = [
    ['Return flights from your departure city', 'रवानगी शहर से आने-जाने की फ़्लाइट', 'روانگی شہر سے آنے جانے کی فلائٹ'],
    ['Umrah visa and Nusuk permits', 'उमराह वीज़ा और नुसुक परमिट', 'عمرہ ویزا اور نسک پرمٹ'],
    ['Hotels in Makkah and Madinah', 'मक्का और मदीना में होटल', 'مکہ اور مدینہ میں ہوٹل'],
    ['Air-conditioned transport and Ziyarat', 'एसी ट्रांसपोर्ट और ज़ियारत', 'اے سی ٹرانسپورٹ اور زیارت'],
    ['Urdu and Hindi speaking group leader', 'उर्दू और हिंदी बोलने वाला ग्रुप लीडर', 'اردو اور ہندی بولنے والا گروپ لیڈر'],
    ['Zamzam and travel kit', 'ज़मज़म और ट्रैवल किट', 'زمزم اور ٹریول کٹ'],
  ];
  for (const [i, p] of PKGS.entries()) {
    const pkg = await prisma.package.create({
      data: {
        type: p.type, order: i, live: true,
        nameEn: p.name[0], nameHi: p.name[1], nameUr: p.name[2],
        priceInr: p.price, departDate: p.date, nights: p.nights,
        hotelStars: p.stars, hotelDistM: p.dist,
        cityEn: p.city[0], cityHi: p.city[1], cityUr: p.city[2],
        mealsEn: p.meals[0], mealsHi: p.meals[1], mealsUr: p.meals[2],
        visaIncluded: true, flightIncluded: true,
        hajjShifting: p.hajjShifting ?? null,
      },
    });
    for (const [j, it] of itinTemplate.entries()) {
      await prisma.itineraryItem.create({ data: { packageId: pkg.id, order: j, keyEn: it[0], keyHi: it[1], keyUr: it[2], textEn: it[3], textHi: it[4], textUr: it[5] } });
    }
    for (const [j, inc] of inclTemplate.entries()) {
      await prisma.packageInclusion.create({ data: { packageId: pkg.id, order: j, textEn: inc[0], textHi: inc[1], textUr: inc[2] } });
    }
  }

  const SERV: [string, string, string, string, string, string, string[], string | null][] = [
    ['Air tickets', 'हवाई टिकट', 'ہوائی ٹکٹ', 'Domestic and international fares, including Jeddah and Madinah sectors for pilgrims.', 'घरेलू और अंतरराष्ट्रीय किराए, ज़ायरीन के लिए जेद्दा और मदीना सेक्टर सहित।', 'ملکی و بین الاقوامی کرائے، زائرین کے لیے جدہ اور مدینہ سیکٹر سمیت۔', ['Jeddah', 'Madinah', 'Dubai', 'Group fares'], 'air'],
    ['Train tickets', 'रेल टिकट', 'ٹرین ٹکٹ', 'IRCTC bookings to your departure airport, including group and tatkal requests.', 'रवानगी एयरपोर्ट तक IRCTC बुकिंग, ग्रुप और तत्काल सहित।', 'روانگی ایئرپورٹ تک IRCTC بکنگ، گروپ اور تتکال سمیت۔', ['IRCTC', 'Group', 'Tatkal'], 'train'],
    ['Visa services', 'वीज़ा सेवाएँ', 'ویزا سروسز', 'Umrah and Hajj visas, plus tourist and business visas for other countries.', 'उमराह और हज वीज़ा, साथ ही अन्य देशों के टूरिस्ट और बिज़नेस वीज़ा।', 'عمرہ اور حج ویزا، نیز دیگر ممالک کے ٹورسٹ اور بزنس ویزا۔', ['Umrah', 'Hajj', 'Tourist', 'Business'], null],
  ];
  for (const [i, s] of SERV.entries()) {
    await prisma.service.create({ data: { order: i, nameEn: s[0], nameHi: s[1], nameUr: s[2], descEn: s[3], descHi: s[4], descUr: s[5], tags: JSON.stringify(s[6]), formType: s[7] } });
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
