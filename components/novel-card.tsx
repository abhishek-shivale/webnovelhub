import Link from "next/link"
import Image from "next/image"
import { Star, BookOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { MEDIA_BASE_URL } from "@/lib/utils"

type NovelCardProps = {
  novel: {
    title: string
    link: string
    image: string
    author: string
    chapter_info?: {
      title: string
      link: string
    }
    rating?: number
    chapters?: number
  }
}

export default function NovelCard({ novel }: NovelCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200 ">
      <Link href={novel.link} className="block">
      <div className="w-full h-48 relative bg-muted"> {/* Adjust height as needed */}
          <Image
            src={MEDIA_BASE_URL + novel.image || "/placeholder.svg"}
            alt={novel.title}
            width={200} // Set a fixed width
            height={400} // Set a fixed height
            className="w-full h-full object-cover" // Ensure the image covers the container
          />
        </div>
      </Link>
      <CardContent className="p-4 space-y-2"> {/* Adjusted spacing */}
        <Link href={novel.link} className="block">
          <h3 className="font-semibold text-base hover:underline truncate"> {/* Adjusted font size */}
            {novel.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground truncate">by {novel.author}</p> {/* Truncate long author names */}

        {novel.chapter_info && (
          <Link
            href={novel.chapter_info.link}
            className="text-sm text-primary hover:underline block truncate"
          >
            {novel.chapter_info.title}
          </Link>
        )}

        {(novel.rating || novel.chapters) && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {novel.rating && (
              <div className="flex items-center">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
                <span>{novel.rating}</span>
              </div>
            )}
            {novel.chapters && (
              <div className="flex items-center">
                <BookOpen className="h-3.5 w-3.5 mr-1" />
                <span>{novel.chapters} Ch</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

