"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import NovelCard from "@/components/novel-card"

type CollectionItem = {
  id: number
  title: string
  slug: string
  author: string
  rating: number
  chapters: number
  views: string
  cover: string
  description: string
  category: string
  addedAt: number
}

export default function CollectionPage() {
  const [collection, setCollection] = useLocalStorage<CollectionItem[]>("collection", [])
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const clearCollection = () => {
    setCollection([])
  }

  const removeFromCollection = (id: number) => {
    setCollection(collection.filter((item) => item.id !== id))
  }

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Collection</h1>
        {collection.length > 0 && (
          <Button variant="outline" onClick={clearCollection}>
            Clear Collection
          </Button>
        )}
      </div>

      {collection.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collection.map((novel) => (
            <div key={novel.id} className="relative">
              {/* @ts-ignore */}
              <NovelCard novel={novel} />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={() => removeFromCollection(novel.id)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove from collection</span>
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-md">
          <p className="text-muted-foreground">Your collection is empty.</p>
          <Button asChild className="mt-4">
            <Link href="/">Browse Novels</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

