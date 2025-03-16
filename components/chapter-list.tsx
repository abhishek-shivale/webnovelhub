"use client"

import Link from "next/link"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Chapter = {
  title: string
  link: string
}

type ChapterListProps = {
  chapters: Chapter[]
  slug: string
}

export default function ChapterList({ chapters, slug }: ChapterListProps) {
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")

  const sortedChapters = [...chapters].sort((a, b) => {
    // Extract chapter numbers from titles if possible
    const aMatch = a.title.match(/Chapter (\d+)/i)
    const bMatch = b.title.match(/Chapter (\d+)/i)

    const aNum = aMatch ? Number.parseInt(aMatch[1]) : 0
    const bNum = bMatch ? Number.parseInt(bMatch[1]) : 0

    if (sortOrder === "newest") {
      return bNum - aNum
    } else {
      return aNum - bNum
    }
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Chapters</h2>
        <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "newest" | "oldest")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md divide-y">
        {sortedChapters.map((chapter, index) => {
          // Extract chapter number if possible
          const match = chapter.title.match(/Chapter (\d+)/i)
          const chapterNumber = match ? match[1] : index + 1

          return (
            <div key={index} className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground w-8">{chapterNumber}</span>
                <Link href={chapter.link} className="hover:underline font-medium">
                  {chapter.title}
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

