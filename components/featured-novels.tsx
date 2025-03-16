import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

type Novel = {
  title: string
  link: string
  image: string
}

type FeaturedNovelsProps = {
  novels: Novel[]
}

export default function FeaturedNovels({ novels }: FeaturedNovelsProps) {
  // Add badges to the first three novels
  const badges = ["Featured Novel", "Editor's Pick", "Trending"]

  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4">Featured Novels</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {novels.map((novel, index) => (
          <Link href={novel.link} key={index}>
            <Card className="h-[200px] bg-slate-700 hover:bg-slate-600 transition-colors text-white overflow-hidden">
              <CardContent className="p-0 h-full flex flex-col justify-end">
                <div className="p-4 bg-gradient-to-t from-black/70 to-transparent h-full flex flex-col justify-end">
                  <h3 className="font-semibold text-lg">{novel.title}</h3>
                  {index < badges.length && <p className="text-xs text-slate-300">{badges[index]}</p>}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

