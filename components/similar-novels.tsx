import Link from "next/link"

const similarNovels = [
  {
    id: 1,
    title: "Divine Sword Legacy",
    slug: "divine-sword-legacy",
    rating: 4.7,
  },
  {
    id: 2,
    title: "Jade Emperor's Will",
    slug: "jade-emperors-will",
    rating: 4.5,
  },
]

type SimilarNovelsProps = {
  currentNovel: string
}

export default function SimilarNovels({ currentNovel }: SimilarNovelsProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Similar Novels</h3>
      <div className="space-y-4">
        {similarNovels.map((novel) => (
          <div key={novel.id} className="border rounded-md overflow-hidden">
            <div className="h-32 bg-slate-700 flex items-center justify-center">
              <span className="text-white text-sm">Cover</span>
            </div>
            <div className="p-3">
              <Link href={`/novel/${novel.slug}`} className="font-medium hover:underline text-sm">
                {novel.title}
              </Link>
              <div className="text-sm text-muted-foreground mt-1">★ {novel.rating}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

