import type { Language } from "./types"

type Topic = "family" | "food" | "place" | "nature" | "music" | "general"

const KEYWORDS: Record<Exclude<Topic, "general">, string[]> = {
  family: ["family", "mother", "father", "son", "daughter", "wife", "husband", "child", "grand", "sister", "brother", "parent"],
  food: ["food", "eat", "cook", "tea", "rice", "fish", "meal", "sweet", "kitchen", "recipe"],
  place: ["place", "home", "village", "city", "town", "travel", "visit", "hill", "river", "market"],
  nature: ["tree", "flower", "garden", "bird", "rain", "mountain", "forest", "animal", "nature"],
  music: ["song", "music", "sing", "dance", "festival", "drum", "flute"],
}

const REACTIONS: Record<Language, string[]> = {
  en: ["That sounds wonderful.", "How lovely.", "Thank you for sharing that.", "What a warm memory.", "I can picture that."],
  hi: ["यह बहुत सुंदर लगता है।", "कितना प्यारा।", "साझा करने के लिए धन्यवाद।", "कितनी गर्मजोशी भरी याद।", "मैं इसकी कल्पना कर सकता हूँ।"],
  as: ["এইটো অতি সুন্দৰ লাগিল।", "কিমান মৰমীয়া।", "ভাগ কৰাৰ বাবে ধন্যবাদ।", "কিমান উষ্ম স্মৃতি।", "মই ইয়াক কল্পনা কৰিব পাৰিছোঁ।"],
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
}

function detectTopic(text: string): Topic {
  const lower = text.toLowerCase()
  for (const topic of Object.keys(KEYWORDS) as Exclude<Topic, "general">[]) {
    if (KEYWORDS[topic].some((k) => lower.includes(k))) return topic
  }
  return "general"
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateReply(userText: string, lang: Language): string {
  const topic = detectTopic(userText)
  const reaction = pick(REACTIONS[lang])
  const prompt = pick(PROMPTS[lang][topic])
  return `${reaction} ${prompt}`
}
