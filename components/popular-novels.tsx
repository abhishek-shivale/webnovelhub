import Link from "next/link"

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

type PopularNovelsProps = {
  novels: Novel[]
}

export default function PopularNovels({ novels }: PopularNovelsProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Latest Updates</h2>
      <div className="space-y-4">
        {novels.map((novel, index) => (
          <div key={index} className="border rounded-md p-4 bg-card">
            <div className="flex gap-4">
              <div className="w-16 h-20 bg-slate-700 rounded-md flex items-center justify-center shrink-0">
                <span className="text-xs text-white">Cover</span>
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

