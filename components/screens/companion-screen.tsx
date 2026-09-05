"use client"

import { useEffect, useRef, useState } from "react"
import { Send, Smile } from "lucide-react"
import { useStore } from "@/lib/store"
import { ScreenHeader } from "@/components/screen-header"
import { generateReply } from "@/lib/companion"

export function CompanionScreen({ onBack }: { onBack: () => void }) {
  const { t, name, language, chat, addChat } = useStore()
  const [draft, setDraft] = useState("")
  const endRef = useRef<HTMLDivElement>(null)
  const seeded = useRef(false)

  // Seed greeting once if empty
  useEffect(() => {
    if (seeded.current) return
    seeded.current = true
    if (chat.length === 0) {
      addChat({ from: "companion", text: t("companion.greeting", { name: name ?? "" }) })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chat.length])

  function send() {
    const text = draft.trim()
    if (!text) return
    addChat({ from: "user", text })
    setDraft("")
    const reply = generateReply(text, language)
    setTimeout(() => addChat({ from: "companion", text: reply }), 500)
  }

  return (
    <div className="flex h-[calc(100dvh-9rem)] flex-col">
      <ScreenHeader title={t("companion.title")} subtitle={t("companion.subtitle")} onBack={onBack} />

      <div className="flex-1 overflow-y-auto pb-2">
        <div className="flex flex-col gap-3">
          {chat.map((m) => (
            <div
              key={m.id}
              className={`flex items-end gap-2 ${m.from === "user" ? "flex-row-reverse" : ""}`}
            >
              {m.from === "companion" && (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Smile className="h-5 w-5" strokeWidth={2.4} />
                </span>
              )}
              <div
                className={`max-w-[78%] rounded-[16px] border-[3px] border-wood-dark px-4 py-2.5 text-base font-medium ${
                  m.from === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) send()
          }}
          placeholder={t("companion.placeholder")}
          className="flex-1 rounded-[14px] border-[3px] border-wood-dark bg-background px-4 py-3 text-base font-medium outline-none focus:ring-4 focus:ring-primary/40"
        />
        <button
          type="button"
          onClick={send}
          aria-label={t("companion.send")}
          className="pixel-btn flex h-12 w-12 shrink-0 items-center justify-center bg-primary text-primary-foreground"
        >
          <Send className="h-5 w-5" strokeWidth={2.4} />
        </button>
      </div>
    </div>
  )
}
