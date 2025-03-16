"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon } from "lucide-react"
import NovelCard from "@/components/novel-card"
import { Skeleton } from "@/components/ui/skeleton"
import { searchNovels } from "@/lib/api"

type Novel = {
  title: string
  link: string
  image: string
  author: string
  chapter_info: {
    title: string
    link: string
  }
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(query)
  const [novels, setNovels] = useState<Novel[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return

      setLoading(true)
      try {
        const results = await searchNovels(query)
        setNovels(results)
      } catch (error) {
        console.error("Error fetching novels:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim()) return

    router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Search Light Novels</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <Input
          type="search"
          placeholder="Search by title, author, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        <Button type="submit">
          <SearchIcon className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[300px] w-full" />
          ))}
        </div>
      ) : query && novels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {novels.map((novel, index) => (
            <NovelCard key={index} novel={novel} />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No novels found matching your search criteria.</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Enter a search term to find novels.</p>
        </div>
      )}
    </div>
  )
}

