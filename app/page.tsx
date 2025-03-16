import { Suspense } from "react"
import TopNovels from "@/components/top-novels"
import LatestNovels from "@/components/latest-novels"
import UserPanel from "@/components/user-panel"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchHomeData } from "@/lib/api"

type HomeData = {
  genres: { name: string; link: string }[]
  top_novels: { title: string; link: string; image: string }[]
  latest_novels: {
    title: string
    link: string
    image: string
    author: string
    chapter_info: {
      title: string
      link: string
    }
  }[]
}

async function HomeContent() {
  try {
    const data: HomeData = await fetchHomeData()

    return (
      <>
        <TopNovels novels={data?.top_novels || []} />
        <LatestNovels novels={data?.latest_novels || []} />
      </>
    )
  } catch (error) {
    console.error(error)
    return (
      <div className="container mx-auto text-center py-12">
        <p className="text-red-500">Error loading data. Please try again later.</p>
      </div>
    )
  }
}

function LoadingSkeleton() {
  return (
    <>
      <div className="mb-10">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
      <div>
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[100px] w-full" />
        </div>
      </div>
    </>
  )
}

export default function Home() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <Suspense fallback={<LoadingSkeleton />}>
            <HomeContent />
          </Suspense>
        </div>
      </div>
    </div>
  )
}