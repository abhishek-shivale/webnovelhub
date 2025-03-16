"use client"

import Link from "next/link"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useEffect, useState } from "react"

export default function UserPanel() {
  const [readingHistory, setReadingHistory] = useLocalStorage<any[]>("reading-history", [])
  const [bookmarks, setBookmarks] = useLocalStorage<any[]>("bookmarks", [])
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="space-y-6">
      <div className="border rounded-md p-4 bg-card">
        <div className="flex items-center gap-2 mb-2">
          <User className="h-6 w-6" />
          <div>
            <p className="font-medium">Guest User</p>
            <Button variant="link" className="h-auto p-0 text-xs">
              Sign In
            </Button>
          </div>
        </div>
      </div>

      {readingHistory.length > 0 && (
        <div className="border rounded-md p-4 bg-card">
          <h3 className="font-medium mb-2">Reading History</h3>
          <ul className="space-y-2 text-sm">
            {readingHistory.slice(0, 3).map((item, index) => (
              <li key={index}>
                <Link href={item.url} className="hover:underline">
                  {item.title}
                </Link>
                <p className="text-xs text-muted-foreground">Chapter {item.chapter}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {bookmarks.length > 0 && (
        <div className="border rounded-md p-4 bg-card">
          <h3 className="font-medium mb-2">Bookmarks</h3>
          <ul className="space-y-2 text-sm">
            {bookmarks.slice(0, 3).map((item, index) => (
              <li key={index}>
                <Link href={item.url} className="hover:underline">
                  {item.title}
                </Link>
                <p className="text-xs text-muted-foreground">Chapter {item.chapter}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

