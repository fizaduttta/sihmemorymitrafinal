export type Screen =
  | "home"
  | "game"
  | "multiplayer"
  | "northeast"
  | "journey"
  | "memories"
  | "journal"
  | "companion"
  | "caregiver"
  | "settings"

export interface GameConfig {
  deck?: import("./types").CardContent[]
  deckId: string
  deckName: string
}
