import Link from "next/link"
import Image from "next/image"
import { MEDIA_BASE_URL } from "@/lib/utils"

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

type LatestNovelsProps = {
  novels: Novel[]
}

export default function LatestNovels({ novels }: LatestNovelsProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Latest Updates</h2>
      <div className="space-y-4">
        {novels.map((novel, index) => (
          <div key={index} className="border rounded-md p-4 bg-card">
            <div className="flex gap-4">
              <div className="w-16 h-20 bg-slate-700 rounded-md flex items-center justify-center shrink-0 relative overflow-hidden">
                {novel.image ? (
                  <Image src={MEDIA_BASE_URL +novel.image || "/placeholder.svg"} alt={novel.title} fill className="object-cover" />
                ) : (
                  <span className="text-xs text-white">Cover</span>
                )}
              </div>
              <div className="flex-1">
                <Link href={novel.link} className="font-medium hover:underline">
                  {novel.title}
                </Link>
                <p className="text-sm text-muted-foreground mt-1">by {novel.author}</p>
                <div className="mt-2">
                  <Link href={novel.chapter_info.link} className="text-sm text-primary hover:underline">
                    {novel.chapter_info.title}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

