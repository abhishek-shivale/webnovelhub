"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

type HistoryItem = {
  id: string
  novelTitle: string
  novelSlug: string
  chapterTitle: string
  chapterNumber: number
  timestamp: number
}

export default function HistoryPage() {
  const [readingHistory, setReadingHistory] = useLocalStorage<HistoryItem[]>("reading-history", [])
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const clearHistory = () => {
    setReadingHistory([])
  }

  const removeHistoryItem = (id: string) => {
    setReadingHistory(readingHistory.filter((item) => item.id !== id))
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Reading History</h1>
        {readingHistory.length > 0 && (
          <Button variant="outline" onClick={clearHistory}>
            Clear History
          </Button>
        )}
      </div>

      {readingHistory.length > 0 ? (
        <div className="border rounded-md divide-y">
          {readingHistory.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4">
              <div>
                <Link href={`/novel/${item.novelSlug}`} className="font-medium hover:underline">
                  {item.novelTitle}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <Link
                    href={`/novel-book/${item.novelSlug}/${item.chapterNumber}`}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    Chapter {item.chapterNumber}: {item.chapterTitle}
                  </Link>
                  <span className="text-xs text-muted-foreground">{formatDate(item.timestamp)}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeHistoryItem(item.id)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove from history</span>
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-md">
          <p className="text-muted-foreground">Your reading history is empty.</p>
          <Button asChild className="mt-4">
            <Link href="/">Browse Novels</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

