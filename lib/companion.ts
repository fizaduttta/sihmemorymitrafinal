import type { Language } from "./types"

type Topic = "family" | "food" | "place" | "nature" | "music" | "general"

const KEYWORDS: Record<Exclude<Topic, "general">, string[]> = {
  family: ["family", "mother", "father", "son", "daughter", "wife", "husband", "child", "grand", "sister", "brother", "parent", "माँ", "पिता", "परिवार", "মা", "দেউতা", "পৰিয়াল", "বাবা", "পরিবার", "आमा", "बुबा", "परिवार"],
  food: ["food", "eat", "cook", "tea", "rice", "fish", "meal", "sweet", "kitchen", "recipe", "खाना", "चाय", "চাহ", "ভাত", "মাছ", "খাদ্য", "খাবার", "चामल", "खाना"],
  place: ["place", "home", "village", "city", "town", "travel", "visit", "hill", "river", "market", "गाँव", "शहर", "গাঁও", "নগৰ", "গ্ৰাম", "শহর", "गाउँ", "सहर"],
  nature: ["tree", "flower", "garden", "bird", "rain", "mountain", "forest", "animal", "nature", "पेड़", "फूल", "गछ", "ফুল", "গাছ", "রুক্ষ", "फूल", "रुख"],
  music: ["song", "music", "sing", "dance", "festival", "drum", "flute", "गीत", "गाना", "উৎসৱ", "গান", "নৃত্য", "गीत", "नाच"],
}

const REACTIONS: Record<Language, string[]> = {
  en: ["That sounds wonderful.", "How lovely.", "Thank you for sharing that.", "What a warm memory.", "I can picture that."],
  hi: ["यह बहुत सुंदर लगता है।", "कितना प्यारा।", "साझा करने के लिए धन्यवाद।", "कितनी गर्मजोशी भरी याद।", "मैं इसकी कल्पना कर सकता हूँ।"],
  as: ["এইটো অতি সুন্দৰ লাগিল।", "কিমান মৰমীয়া।", "ভাগ কৰাৰ বাবে ধন্যবাদ।", "কিমান উষ্ম স্মৃতি।", "মই ইয়াক কল্পনা কৰিব পাৰিছোঁ।"],
  bn: ["এটা খুব সুন্দর শোনাচ্ছে।", "কী মিষ্টি।", "ভাগ করার জন্য ধন্যবাদ।", "কী উষ্ণ স্মৃতি।", "আমি এটা কল্পনা করতে পারছি।"],
  brx: ["बे मोजांथार लाजाबाय।", "बेसे गोजोन।", "रान्नायखौ रावदि थांबाय।", "बेसे उष्म गोसो।", "आं बेखौ फोरमायनो हायो।"],
  mni: ["মদু য়াম্না ফবা মলি।", "কয়াম নুংঙাইবা।", "পাংথোকপগীদমক থাগৎচরি।", "কয়াম নুংশিবা নিংশিং।", "ঐনা মদু য়েংবা ঙম্মি।"],
  mni_mtei: ["ꯃꯗꯨ ꯌꯥꯝꯅ ꯐꯕ ꯃꯂꯤ꯫", "ꯀꯌꯥꯝ ꯅꯨꯡꯉꯥꯏꯕ꯫", "ꯄꯥꯡꯊꯣꯛꯄꯒꯤꯗꯃꯛ ꯊꯥꯒꯠꯆꯔꯤ꯫", "ꯀꯌꯥꯝ ꯅꯨꯡꯁꯤꯕ ꯅꯤꯡꯁꯤꯡ꯫", "ꯑꯩꯅꯥ ꯃꯗꯨ ꯌꯦꯡꯕ ꯉꯝꯃꯤ꯫"],
  kha: ["Kaba bha eh.", "Kaba jem eh.", "Khublei ba phi la iashim.", "Kaba babha jingkynmaw.", "Nga lah pyrkhat sha ka."],
  lus: ["A mawi tak si.", "A nuam khawp mai.", "Share i tih avangin ka lawm e.", "A lawmawm hriatrengna.", "Ka hria a."],
  nag: ["Etu bhal lagi ase.", "Kiman mishti.", "Share korise nimite dhonyabad.", "Kiman gorom yaad.", "Moi etu photo dekhi bo pare."],
  kok: ["Boro rwmnai naikha.", "Bwswli rwmnai.", "Share kwrwi dhonyabad.", "Bwswli rwmnai kokwi.", "Ang bo naikwrwi paikha."],
  ne: ["यो धेरै राम्रो लाग्यो।", "कति मीठो।", "साझा गर्नुभएकोमा धन्यवाद।", "कति न्यानो सम्झना।", "म यसको कल्पना गर्न सक्छु।"],
}

const PROMPTS: Record<Language, Record<Topic, string[]>> = {
  en: {
    family: ["Who in your family are you closest to?", "What is a happy day you spent with family?"],
    food: ["What dish reminds you of home?", "Who taught you to make it?"],
    place: ["What did that place look like?", "What did you love most about it?"],
    nature: ["What season do you enjoy the most?", "Did you have a favourite tree or flower?"],
    music: ["What songs did you like to sing?", "Do you remember a festival you loved?"],
    general: [
      "What is a memory that always makes you smile?",
      "Tell me about a place you loved as a child.",
      "Would you like to play a short memory game?",
      "Maybe you could write this in your journal too.",
    ],
  },
  hi: {
    family: ["आप अपने परिवार में किसके सबसे करीब हैं?", "परिवार के साथ बिताया कोई खुशी का दिन बताइए।"],
    food: ["कौन-सा व्यंजन आपको घर की याद दिलाता है?", "इसे बनाना आपको किसने सिखाया?"],
    place: ["वह जगह कैसी दिखती थी?", "आपको उसमें सबसे अच्छा क्या लगता था?"],
    nature: ["आपको कौन-सा मौसम सबसे अच्छा लगता है?", "क्या आपका कोई पसंदीदा पेड़ या फूल था?"],
    music: ["आप कौन-से गीत गाना पसंद करते थे?", "क्या आपको कोई प्रिय त्योहार याद है?"],
    general: [
      "कौन-सी याद आपको हमेशा मुस्कुरा देती है?",
      "बचपन की कोई प्रिय जगह के बारे में बताइए।",
      "क्या आप एक छोटा स्मृति खेल खेलना चाहेंगे?",
      "शायद आप इसे अपनी डायरी में भी लिख सकते हैं।",
    ],
  },
  as: {
    family: ["আপোনাৰ পৰিয়ালত কাৰ লগত আটাইতকৈ ওচৰ?", "পৰিয়ালৰ সৈতে কটোৱা এটা সুখৰ দিনৰ কথা কওক।"],
    food: ["কোন খাদ্যই আপোনাক ঘৰৰ কথা মনত পেলায়?", "ইয়াক বনাব কোনে শিকালে?"],
    place: ["সেই ঠাইখন কেনেকুৱা আছিল?", "তাত আপোনাক আটাইতকৈ কি ভাল লাগিছিল?"],
    nature: ["আপোনাক কোন ঋতু আটাইতকৈ ভাল লাগে?", "আপোনাৰ প্ৰিয় গছ বা ফুল আছিল নেকি?"],
    music: ["আপুনি কি গীত গাব ভাল পাইছিল?", "আপোনাৰ প্ৰিয় কোনো উৎসৱ মনত আছে নেকি?"],
    general: [
      "কোন স্মৃতিয়ে আপোনাক সদায় হাঁহি আনে?",
      "সৰুতে ভাল পোৱা এটা ঠাইৰ কথা কওক।",
      "আপুনি এটা সৰু স্মৃতি খেল খেলিব বিচাৰে নেকি?",
      "হয়তো আপুনি ইয়াক ডায়েৰীতো লিখিব পাৰে।",
    ],
  },
  bn: {
    family: ["আপনার পরিবারে কার সাথে সবচেয়ে কাছের?", "পরিবারের সাথে কাটানো কোনো আনন্দের দিনের কথা বলুন।"],
    food: ["কোন খাবার আপনাকে বাড়ির কথা মনে করায়?", "এটা বানানো কে শিখিয়েছিলেন?"],
    place: ["সেই জায়গাটা কেমন দেখতে ছিল?", "সেখানে আপনার সবচেয়ে ভালো কী লাগত?"],
    nature: ["কোন ঋতু আপনার সবচেয়ে প্রিয়?", "আপনার প্রিয় কোনো গাছ বা ফুল ছিল?"],
    music: ["আপনি কোন গান গাইতে ভালোবাসতেন?", "আপনার প্রিয় কোনো উৎসবের কথা মনে আছে?"],
    general: [
      "কোন স্মৃতি আপনাকে সবসময় হাসায়?",
      "ছোটবেলার প্রিয় কোনো জায়গার কথা বলুন।",
      "আপনি কি একটা ছোট্ট স্মৃতি খেলা খেলতে চান?",
      "হয়তো এটা আপনি ডায়েরিতেও লিখতে পারেন।",
    ],
  },
  brx: {
    family: ["नोंनि नखर-ननिआव जायखौ आटाइनि सिगां?", "नखर-ननिजों जोबनाय एखे रजा सानखौ फोरमाय।"],
    food: ["जायखौ नोंखौ नखर मोसानो?", "बेखौ बानायनो जायबो लोगोसे?"],
    place: ["बे जायगायाव कि लोगोसे?", "तायाव नोंखौ आटाइनि मोजां कि लागाबाय?"],
    nature: ["नोंखौ जायखौ रोखो आटाइनि मोजां?", "नोंनि प्रिय गछ एबा फुल आबाय?"],
    music: ["नों जायखौ गीत लिरनो लुबैयो?", "नोंनि प्रिय जायखौ उथावखौ गोसोआव दं?"],
    general: [
      "जायखौ गोसो नोंखौ सदाय हांसिबाय?",
      "गोदैनि प्रिय जायगायाव कि फोरमाय।",
      "नों मोनसे फिसा गोसो खेला खेलानो लुबैयो?",
      "बादि बेखौ नोंनि लिरगिरियावबो लिरनो हायो।",
    ],
  },
  mni: {
    family: ["নহাক্কী ইমুংদা কনা নপাক নাইবা?", "ইমুংগা লোয়ননা লৈখিবা নুংঙাইবা নুমিৎ অমা তাক্লু।"],
    food: ["কনানা চাক অসিনা নহাক্কী য়ুম নিংশিংহল্লি?", "কনানা মসি শাবা তম্বীবগে?"],
    place: ["মফম অদু করম্না উবগে?", "মদুদা করি খ্বাইদগী নুংঙাইবিগে?"],
    nature: ["মতম করম্বদু খ্বাইদগী পাম্মি?", "নহাক্কী পাম্নবা উ নত্রগা লৈ অমা লৈরম্বিরা?"],
    music: ["নহাক্না করম্বা ইশৈ ইশৈ নুংঙাইবগে?", "নহাক্কী নিংশিংলিবা কুম্মেই অমা লৈরম্বিরা?"],
    general: [
      "করম্বা নিংশিংনা মৎম পুম্নমক্তা নহাক্পু নোক্মহল্লি?",
      "অঙাং ওইরিঙৈদা পাম্লিবা মফম অমগী মতাংদা তাক্লু।",
      "নহাক্না নিংশিং ইনফিয়ামনা অপীকপা খরা শান্ননিংবরা?",
      "মদুবু নহাক্কী ডাইরিদসু ইবা য়াই।",
    ],
  },
  mni_mtei: {
    family: ["ꯅꯍꯥꯛꯀꯤ ꯏꯃꯨꯡꯗ ꯀꯅꯥ ꯅꯄꯥꯛ ꯅꯥꯏꯕ?", "ꯏꯃꯨꯡꯒ ꯂꯣꯌꯅꯅ ꯂꯩꯈꯤꯕ ꯅꯨꯡꯉꯥꯏꯕ ꯅꯨꯃꯤꯠ ꯑꯃ ꯇꯥꯛꯂꯨ꯫"],
    food: ["ꯀꯅꯥꯅꯥ ꯆꯥꯛ ꯑꯁꯤꯅ ꯅꯍꯥꯛꯀꯤ ꯌꯨꯝ ꯅꯤꯡꯁꯤꯡꯍꯜꯂꯤ?", "ꯀꯅꯥꯅꯥ ꯃꯁꯤ ꯁꯥꯕ ꯇꯝꯕꯤꯕꯒꯦ?"],
    place: ["ꯃꯐꯝ ꯑꯗꯨ ꯀꯔꯝꯅ ꯎꯕꯒꯦ?", "ꯃꯗꯨꯗ ꯀꯔꯤ ꯈ꯭ꯋꯥꯏꯗꯒꯤ ꯅꯨꯡꯉꯥꯏꯕꯤꯒꯦ?"],
    nature: ["ꯃꯇꯝ ꯀꯔꯝꯕꯗꯨ ꯈ꯭ꯋꯥꯏꯗꯒꯤ ꯄꯥꯝꯃꯤ?", "ꯅꯍꯥꯛꯀꯤ ꯄꯥꯝꯅꯕ ꯎ ꯅꯠꯔꯒ ꯂꯩ ꯑꯃ ꯂꯩꯔꯝꯕꯤꯔꯥ?"],
    music: ["ꯅꯍꯥꯛꯅꯥ ꯀꯔꯝꯕ ꯏꯁꯩ ꯅꯨꯡꯉꯥꯏꯕꯒꯦ?", "ꯅꯍꯥꯛꯀꯤ ꯅꯤꯡꯁꯤꯡꯂꯤꯕ ꯀꯨꯝꯃꯩ ꯑꯃ ꯂꯩꯔꯝꯕꯤꯔꯥ?"],
    general: [
      "ꯀꯔꯝꯕ ꯅꯤꯡꯁꯤꯡꯅꯥ ꯃꯇꯝ ꯄꯨꯝꯅꯃꯛꯇ ꯅꯍꯥꯛꯄꯨ ꯅꯣꯛꯃꯍꯜꯂꯤ?",
      "ꯑꯉꯥꯡ ꯑꯣꯏꯔꯤꯡꯩꯗ ꯄꯥꯝꯂꯤꯕ ꯃꯐꯝ ꯑꯃꯒꯤ ꯃꯇꯥꯡꯗ ꯇꯥꯛꯂꯨ꯫",
      "ꯅꯍꯥꯛꯅꯥ ꯅꯤꯡꯁꯤꯡ ꯏꯅꯐꯤꯌꯥꯝꯅꯥ ꯑꯄꯤꯛꯄ ꯈꯔꯥ ꯁꯥꯟꯅꯅꯤꯡꯕꯔꯥ?",
      "ꯃꯗꯨꯕꯨ ꯅꯍꯥꯛꯀꯤ ꯗꯥꯏꯔꯤꯗꯁꯨ ꯏꯕ ꯌꯥꯏ꯫",
    ],
  },
  kha: {
    family: ["Mano ha ka iing jong phi ba phi ithuh eh?", "Batai ia nga ia ka sngi babha shong ryngkat bad iing."],
    food: ["Kaei ka jingbam ka pynkynmaw ia phi ia ka iing?", "Mano u la hikai ia phi ban pynshai?"],
    place: ["Kumno ka jaka kane ka lada mih?", "Kaei ba phi la ieit tam bad ka?"],
    nature: ["Kaba noh ka lasi ba phi ieit tam?", "Don ma ba dei u dieng lane ka syntiew jong phi?"],
    music: ["Ki jingrwai kata phi ieit ban rwai?", "Phi kynmaw ei ei ka pyrthei-ka babha ia phi?"],
    general: [
      "Kaei ka jingkynmaw ba pynsngew smat ia phi mynta mynta?",
      "Batai ia nga ia ka jaka ba phi la ieit hapoh ka jinghikai lynti.",
      "Phi kwah ban sain kawei ka kai jingkynmaw ba rit?",
      "Lah ruh ban thoh ia kane ha ka kot jingkynmaw jong phi.",
    ],
  },
  lus: {
    family: ["I chhungkuaah tuin naih ber i tih?", "I chhungte nena in hlim ni khat sawi rawh."],
    food: ["Eng ei nge in chhung han a chhiar?", "Tuin nge hei siam dan a zirtir che?"],
    place: ["Chu hmun chu engtin nge a lang?", "A chunga eng nge duh ber i neih?"],
    nature: ["Eng thla nge duh ber i neih?", "Thlai emaw pangpar duh ber i nei em?"],
    music: ["Eng hla nge sa duh i neih?", "Kut duh ber i hriat reng em?"],
    general: [
      "Eng hriatrengna nge ni tinin a ti hlim che?",
      "I naupan lai hmun duh ber sawi rawh.",
      "Hriatrengna infiamna tlem tê khel i duh em?",
      "Hei hi i lehkhabuah pawh i ziak thei ang.",
    ],
  },
  nag: {
    family: ["Apna parivar te kunke logote khubi ase?", "Parivar logote pati kene khushi din ekta koi bi."],
    food: ["Kuntu kha-koni apnike ghor yaad diye?", "Etu banabole kun sikhaise?"],
    place: ["Etu jaga kineka thakise?", "Ta te apnike sob se bhal ki lagise?"],
    nature: ["Kuntu ritu apnike sob se bhal lage?", "Apna laga mon jai laga gash ba phul thakise?"],
    music: ["Apni kuntu gaana gabole mon lage?", "Yaad ase kuntu festival apni mon jaise?"],
    general: [
      "Kuntu yaad hodai apnike hasi diye?",
      "Chuti thakotte ekta mon jai laga jaga laga kotha koi bi.",
      "Ekta chuti yaad khela khelibole mon ase?",
      "Etu apni diary te bhi likhi bo pare.",
    ],
  },
  kok: {
    family: ["Nini nokhorok-mai jwbwrsa hamung suk?", "Nokhorok-mai swrwi rangswrwi mwsai dini ha kokrok."],
    food: ["Bwsw chami-achang ni nokni kokwi paikha?", "Bwsw kwrwi bagwi phorkha?"],
    place: ["Bo jaga bwtwl naikha?", "Bwtai ni lwngkha rwmnai?"],
    nature: ["Bwsw ritu ni jwbwrsa lwngkha?", "Nini lwngkha bwphang ba bwsa thangkha?"],
    music: ["Bwsw gaana gaanai lwngkha?", "Bwsw parab rwyakkha?"],
    general: [
      "Bwsw kokwi swrwi rangswrwi khwlaimung?",
      "Chikha bwtai rwmnai jaga ni kokrok.",
      "Rwmnai kokwi khel khelnai lwngkha?",
      "Bora sipahiwi bhi kolwi payw.",
    ],
  },
  ne: {
    family: ["तपाईंको परिवारमा कोसँग सबभन्दा नजिक हुनुहुन्छ?", "परिवारसँग बिताएको खुशीको दिनको बारेमा भन्नुहोस्।"],
    food: ["कुन खाना तपाईंलाई घरको याद दिलाउँछ?", "यो बनाउन तपाईंलाई कसले सिकायो?"],
    place: ["त्यो ठाउँ कस्तो थियो?", "त्यहाँ तपाईंलाई सबभन्दा राम्रो के लाग्थ्यो?"],
    nature: ["तपाईंलाई कुन ऋतु सबभन्दा मन पर्छ?", "तपाईंको मनपर्ने रुख वा फूल थियो?"],
    music: ["तपाईं कुन गीत गाउन मन पराउनुहुन्थ्यो?", "तपाईंलाई कुनै प्रिय चाड याद छ?"],
    general: [
      "कुन सम्झना तपाईंलाई सधैं मुस्कुराउँछ?",
      "बचपनको मनपर्ने ठाउँको बारेमा भन्नुहोस्।",
      "एउटा सानो स्मृति खेल खेल्न चाहनुहुन्छ?",
      "तपाईं यसलाई डायरीमा पनि लेख्न सक्नुहुन्छ।",
    ],
  },
}

function detectTopic(text: string): Topic {
  const lower = text.toLowerCase()
  for (const topic of Object.keys(KEYWORDS) as Exclude<Topic, "general">[]) {
    if (KEYWORDS[topic].some((k) => lower.includes(k.toLowerCase()))) return topic
  }
  return "general"
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateReply(userText: string, lang: Language): string {
  const topic = detectTopic(userText)
  const reactions = REACTIONS[lang] ?? REACTIONS.en
  const prompts = (PROMPTS[lang] ?? PROMPTS.en)[topic]
  const reaction = pick(reactions)
  const prompt = pick(prompts)
  return `${reaction} ${prompt}`
}
