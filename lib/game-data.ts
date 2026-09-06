import type { CardContent, CategoryId, Difficulty, StateId } from "./types"
export interface RoundConfig {
  pairs: number
  preview: number
}

export const DIFFICULTY_ROUNDS: Record<Difficulty, RoundConfig[]> = {
  easy: [
    { pairs: 3, preview: 7 },
    { pairs: 3, preview: 6 },
    { pairs: 4, preview: 6 },
  ],
  medium: [
    { pairs: 4, preview: 6 },
    { pairs: 4, preview: 5 },
    { pairs: 5, preview: 5 },
  ],
  hard: [
    { pairs: 5, preview: 5 },
    { pairs: 5, preview: 4 },
    { pairs: 6, preview: 4 },
  ],
}

export const DIFFICULTIES: { id: Difficulty; icon: string; color: string }[] = [
  { id: "easy", icon: "leaf", color: "#4a9d6b" },
  { id: "medium", icon: "sun", color: "#dda12b" },
  { id: "hard", icon: "mountain", color: "#b0475a" },
]

const PALETTE = [
  "#4a9d6b",
  "#4a90c2",
  "#d1793f",
  "#dda12b",
  "#b0475a",
  "#3fa79a",
  "#8267be",
  "#a9743f",
]

/** [icon, label] tuples -> CardContent with cycling colors */
function deck(prefix: string, items: [string, string][]): CardContent[] {
  return items.map(([icon, label], i) => ({
    id: `${prefix}:${i}`,
    icon,
    label,
    color: PALETTE[i % PALETTE.length],
  }))
}

export const CATEGORIES: { id: CategoryId; icon: string }[] = [
  { id: "nature", icon: "leaf" },
  { id: "places", icon: "map-pin" },
  { id: "arts", icon: "palette" },
  { id: "cultural", icon: "drum" },
  { id: "food", icon: "utensils" },
]

export const STATES: { id: StateId; icon: string }[] = [
  { id: "arunachal", icon: "mountain-snow" },
  { id: "assam", icon: "leaf" },
  { id: "manipur", icon: "waves" },
  { id: "meghalaya", icon: "droplets" },
  { id: "mizoram", icon: "mountain" },
  { id: "nagaland", icon: "bird" },
  { id: "sikkim", icon: "mountain-snow" },
  { id: "tripura", icon: "castle" },
]

/** Friendly everyday pictures used for the default game and difficulty picker */
export const CLASSIC_DECK: CardContent[] = deck("classic", [
  ["sun", "Sun"],
  ["cloud", "Cloud"],
  ["flower", "Flower"],
  ["tree-pine", "Tree"],
  ["bird", "Bird"],
  ["fish", "Fish"],
  ["house", "House"],
  ["heart", "Heart"],
])

type StateDecks = Record<CategoryId, [string, string][]>

const DATA: Record<StateId, StateDecks> = {
  arunachal: {
    nature: [
      ["mountain-snow", "Snow Peaks"],
      ["flower", "Wild Orchid"],
      ["bird", "Hornbill"],
      ["tree-pine", "Pine Forest"],
      ["waves", "Mountain River"],
      ["sun", "Land of Dawn"],
    ],
    places: [
      ["landmark", "Tawang"],
      ["church", "Hill Monastery"],
      ["mountain", "Sela Pass"],
      ["sprout", "Ziro Valley"],
      ["trees", "Namdapha"],
      ["map-pin", "Bumla"],
    ],
    arts: [
      ["sprout", "Bamboo Craft"],
      ["gift", "Cane Basket"],
      ["shirt", "Woven Shawl"],
      ["palette", "Thangka Art"],
      ["feather", "Headgear"],
      ["drum", "Festival Drum"],
    ],
    cultural: [
      ["drum", "Folk Dance"],
      ["music", "Folk Song"],
      ["gift", "Losar Festival"],
      ["shirt", "Traditional Dress"],
      ["church", "Monastery Life"],
      ["heart", "Village Life"],
    ],
    food: [
      ["soup", "Thukpa"],
      ["cup-soda", "Butter Tea"],
      ["utensils", "Rice Meal"],
      ["fish", "River Fish"],
      ["sprout", "Bamboo Shoot"],
      ["apple", "Kiwi & Apple"],
    ],
  },
  assam: {
    nature: [
      ["leaf", "Tea Leaf"],
      ["waves", "Brahmaputra"],
      ["bird", "Kaziranga Birds"],
      ["fish", "River Fish"],
      ["flower", "Kopou Orchid"],
      ["sprout", "Wetlands"],
    ],
    places: [
      ["landmark", "Kaziranga"],
      ["sailboat", "Majuli Island"],
      ["church", "Kamakhya"],
      ["sprout", "Tea Gardens"],
      ["mountain", "Haflong Hills"],
      ["castle", "Sivasagar"],
    ],
    arts: [
      ["shirt", "Muga Silk"],
      ["palette", "Mask Making"],
      ["gift", "Jaapi Hat"],
      ["drum", "Dhol Drum"],
      ["sprout", "Cane & Bamboo"],
      ["flower-2", "Gamosa Weave"],
    ],
    cultural: [
      ["drum", "Bihu Dance"],
      ["music", "Bihu Song"],
      ["flower-2", "Gamosa"],
      ["gift", "Rongali Bihu"],
      ["church", "Namghar"],
      ["heart", "Community"],
    ],
    food: [
      ["coffee", "Assam Tea"],
      ["fish", "Masor Tenga"],
      ["utensils", "Rice & Curry"],
      ["soup", "Khar"],
      ["leaf", "Banana Leaf Meal"],
      ["sprout", "Bamboo Shoot"],
    ],
  },
  manipur: {
    nature: [
      ["waves", "Loktak Lake"],
      ["sprout", "Floating Islands"],
      ["footprints", "Sangai Deer"],
      ["bird", "Wetland Birds"],
      ["flower", "Shirui Lily"],
      ["mountain", "Green Hills"],
    ],
    places: [
      ["waves", "Loktak"],
      ["landmark", "Kangla Fort"],
      ["house", "Ima Market"],
      ["trees", "Keibul Lamjao"],
      ["mountain", "Dzukou Valley"],
      ["map-pin", "Imphal"],
    ],
    arts: [
      ["shirt", "Handloom Weave"],
      ["palette", "Pottery"],
      ["gift", "Cane Craft"],
      ["drum", "Pung Drum"],
      ["feather", "Dance Costume"],
      ["flower-2", "Phanek Textile"],
    ],
    cultural: [
      ["drum", "Ras Leela"],
      ["music", "Folk Music"],
      ["gift", "Yaoshang"],
      ["shirt", "Traditional Dress"],
      ["heart", "Family Life"],
      ["smile", "Village Fair"],
    ],
    food: [
      ["soup", "Eromba"],
      ["fish", "Ngari Fish"],
      ["utensils", "Rice Meal"],
      ["leaf", "Herbs & Greens"],
      ["sprout", "Bamboo Shoot"],
      ["citrus", "Kachai Lemon"],
    ],
  },
  meghalaya: {
    nature: [
      ["droplets", "Waterfalls"],
      ["cloud", "Cloud Hills"],
      ["trees", "Sacred Forest"],
      ["flower", "Wild Blooms"],
      ["waves", "Clear Streams"],
      ["bird", "Hill Birds"],
    ],
    places: [
      ["footprints", "Root Bridges"],
      ["droplets", "Nohkalikai Falls"],
      ["house", "Mawlynnong"],
      ["mountain", "Shillong Peak"],
      ["map-pin", "Cherrapunji"],
      ["trees", "Sacred Groves"],
    ],
    arts: [
      ["sprout", "Bamboo Craft"],
      ["gift", "Cane Basket"],
      ["shirt", "Woven Cloth"],
      ["music", "Bamboo Flute"],
      ["palette", "Wood Carving"],
      ["drum", "Festival Drum"],
    ],
    cultural: [
      ["drum", "Nongkrem Dance"],
      ["music", "Folk Song"],
      ["gift", "Spring Festival"],
      ["shirt", "Jainsem Dress"],
      ["heart", "Clan Life"],
      ["smile", "Village Gathering"],
    ],
    food: [
      ["utensils", "Jadoh Rice"],
      ["soup", "Dohneiiong"],
      ["fish", "River Fish"],
      ["leaf", "Local Greens"],
      ["sprout", "Bamboo Shoot"],
      ["egg", "Pumpkin & Egg"],
    ],
  },
  mizoram: {
    nature: [
      ["mountain", "Blue Hills"],
      ["sprout", "Bamboo Groves"],
      ["flower", "Wild Orchid"],
      ["bird", "Hill Birds"],
      ["cloud", "Misty Ranges"],
      ["trees", "Green Forest"],
    ],
    places: [
      ["mountain", "Phawngpui Peak"],
      ["house", "Aizawl"],
      ["waves", "Palak Lake"],
      ["trees", "Murlen Forest"],
      ["map-pin", "Reiek"],
      ["sprout", "Terrace Fields"],
    ],
    arts: [
      ["shirt", "Puan Weave"],
      ["sprout", "Bamboo Craft"],
      ["gift", "Cane Basket"],
      ["drum", "Bamboo Dance"],
      ["palette", "Handicraft"],
      ["flower-2", "Textile Pattern"],
    ],
    cultural: [
      ["drum", "Cheraw Dance"],
      ["music", "Folk Song"],
      ["gift", "Chapchar Kut"],
      ["shirt", "Traditional Dress"],
      ["heart", "Community Life"],
      ["smile", "Village Fair"],
    ],
    food: [
      ["soup", "Bai Stew"],
      ["utensils", "Rice Meal"],
      ["fish", "Smoked Fish"],
      ["leaf", "Local Greens"],
      ["sprout", "Bamboo Shoot"],
      ["egg", "Vawksa Rep"],
    ],
  },
  nagaland: {
    nature: [
      ["bird", "Hornbill"],
      ["mountain", "Green Hills"],
      ["trees", "Forest Ranges"],
      ["flower", "Wild Rhododendron"],
      ["cloud", "Misty Valley"],
      ["sprout", "Terrace Farms"],
    ],
    places: [
      ["house", "Kohima"],
      ["mountain", "Dzukou Valley"],
      ["map-pin", "Kisama"],
      ["trees", "Japfu Peak"],
      ["landmark", "Heritage Village"],
      ["tent-tree", "Hill Village"],
    ],
    arts: [
      ["shirt", "Naga Shawl"],
      ["sprout", "Bamboo Craft"],
      ["gift", "Cane Basket"],
      ["palette", "Wood Carving"],
      ["feather", "Headgear"],
      ["drum", "Log Drum"],
    ],
    cultural: [
      ["drum", "Hornbill Festival"],
      ["music", "Folk Song"],
      ["gift", "Harvest Feast"],
      ["shirt", "Traditional Dress"],
      ["heart", "Clan Life"],
      ["smile", "Village Gathering"],
    ],
    food: [
      ["utensils", "Rice Meal"],
      ["soup", "Smoked Pork Stew"],
      ["fish", "River Fish"],
      ["leaf", "Axone & Greens"],
      ["sprout", "Bamboo Shoot"],
      ["citrus", "Naga Chilli"],
    ],
  },
  sikkim: {
    nature: [
      ["mountain-snow", "Khangchendzonga"],
      ["footprints", "Red Panda"],
      ["flower", "Rhododendron"],
      ["tree-pine", "Alpine Forest"],
      ["waves", "Glacier Lakes"],
      ["bird", "Mountain Birds"],
    ],
    places: [
      ["church", "Rumtek Monastery"],
      ["mountain-snow", "Nathula"],
      ["waves", "Tsomgo Lake"],
      ["house", "Gangtok"],
      ["map-pin", "Yumthang Valley"],
      ["trees", "Yuksom"],
    ],
    arts: [
      ["palette", "Thangka Art"],
      ["gift", "Handmade Carpet"],
      ["sprout", "Bamboo Craft"],
      ["shirt", "Woven Shawl"],
      ["music", "Prayer Bell"],
      ["feather", "Mask Craft"],
    ],
    cultural: [
      ["drum", "Cham Dance"],
      ["music", "Folk Song"],
      ["gift", "Losar Festival"],
      ["shirt", "Bakhu Dress"],
      ["church", "Monastery Life"],
      ["heart", "Village Life"],
    ],
    food: [
      ["soup", "Thukpa"],
      ["gift", "Momo Dumpling"],
      ["cup-soda", "Butter Tea"],
      ["utensils", "Rice Meal"],
      ["leaf", "Sinki & Greens"],
      ["sprout", "Bamboo Shoot"],
    ],
  },
  tripura: {
    nature: [
      ["trees", "Green Forest"],
      ["sprout", "Bamboo Groves"],
      ["bird", "Forest Birds"],
      ["flower", "Wild Blooms"],
      ["waves", "Calm Lakes"],
      ["footprints", "Clouded Leopard"],
    ],
    places: [
      ["castle", "Ujjayanta Palace"],
      ["church", "Neermahal"],
      ["waves", "Rudrasagar Lake"],
      ["landmark", "Unakoti"],
      ["trees", "Sepahijala"],
      ["map-pin", "Agartala"],
    ],
    arts: [
      ["sprout", "Bamboo Craft"],
      ["gift", "Cane Basket"],
      ["shirt", "Risa Textile"],
      ["palette", "Handicraft"],
      ["drum", "Festival Drum"],
      ["flower-2", "Woven Pattern"],
    ],
    cultural: [
      ["drum", "Garia Dance"],
      ["music", "Folk Song"],
      ["gift", "Garia Puja"],
      ["shirt", "Traditional Dress"],
      ["heart", "Village Life"],
      ["smile", "Community Fair"],
    ],
    food: [
      ["utensils", "Rice Meal"],
      ["fish", "Berma Fish"],
      ["soup", "Mui Borok"],
      ["leaf", "Local Greens"],
      ["sprout", "Bamboo Shoot"],
      ["gift", "Awan Bangwi"],
    ],
  },
}

export function getNortheastDeck(state: StateId, category: CategoryId): CardContent[] {
  return deck(`ne:${state}:${category}`, DATA[state][category])
}

export function getDeckId(state: StateId, category: CategoryId): string {
  return `ne:${state}:${category}`
}

/**
 * Larger deck for local multiplayer (needs up to 21 unique items for 4P/Hard).
 * Combines the classic deck with hand-picked variety from every state so we
 * always have plenty of visually-distinct pairs.
 */
export const MULTI_DECK: CardContent[] = (() => {
  const seen = new Set<string>()
  const items: [string, string][] = []
  // Start with classic items
  for (const c of CLASSIC_DECK) {
    const key = `${c.icon}|${c.label}`
    if (seen.has(key)) continue
    seen.add(key)
    items.push([c.icon, c.label ?? c.icon])
  }
  // Then pull unique icon/label combos from every state deck
  const stateIds = Object.keys(DATA) as StateId[]
  const catIds: CategoryId[] = ["nature", "places", "arts", "cultural", "food"]
  for (const st of stateIds) {
    for (const cat of catIds) {
      for (const [icon, label] of DATA[st][cat]) {
        const key = `${icon}|${label}`
        if (seen.has(key)) continue
        seen.add(key)
        items.push([icon, label])
      }
    }
  }
  return deck("multi", items)
})()
