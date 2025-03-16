import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { Star, BookOpen, Library } from "lucide-react"
import { Button } from "@/components/ui/button"
import ChapterList from "@/components/chapter-list"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchNovelDetails } from "@/lib/api"
import type { Metadata, ResolvingMetadata } from "next"

type NovelData = {
  novelData: {
    title: string
    author: string
    image: string
    rating: string
    reviewCount: string
    status: string
    publisher: string
    year: string
    genres: string[]
    tags: string[]
    readNowLink: string
  }
  description: string
  allChapters: {
    title: string
    link: string
  }[]
}

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

// Generate dynamic metadata for each novel page
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Fetch novel data for metadata
  try {
    const novel = await fetchNovelDetails(params.slug, false)

    if (!novel) {
      return {
        title: "Novel Not Found",
        description: "The requested novel could not be found.",
      }
    }

    const { novelData, description } = novel

    // Create a short description (truncate if needed)
    const shortDescription = description.length > 160
      ? `${description.substring(0, 157)}...`
      : description

    return {
      title: `${novelData.title} by ${novelData.author} | WebNovelHub - Read Online`,
      description: shortDescription,
      openGraph: {
        title: novelData.title,
        description: shortDescription,
        type: 'book',
        url: `/novel-book/${params.slug}`,
        images: [
          {
            url: novelData.image || '/image.png',
            width: 800,
            height: 1200,
            alt: `Cover for ${novelData.title}`,
          },
        ],
        authors: [novelData.author],
        tags: [...(novelData.genres || []), ...(novelData.tags || [])],
      },
      twitter: {
        card: 'summary_large_image',
        title: novelData.title,
        description: shortDescription,
        images: [novelData.image || '/image.png'],
      },
      alternates: {
        canonical: `/novel-book/${params.slug}`,
      },
      keywords: [...(novelData.genres || []), ...(novelData.tags || [])].join(', '),
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Novel Details",
      description: "Read the latest novels online.",
    }
  }
}

// Loading component
function NovelPageSkeleton() {
  return (
    <div className="container mx-auto my-10">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <Skeleton className="w-full md:w-40 h-56" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
          <Skeleton className="h-6 w-40 mb-3" />
          <Skeleton className="h-24 w-full mb-8" />
          <Skeleton className="h-6 w-40 mb-3" />
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Error component
function NovelError({ error }: { error: string }) {
  return (
    <div className="container mx-auto text-center py-12">
      <p className="text-red-500">{error}</p>
    </div>
  )
}

// Novel content component
function NovelContent({ novel, slug }: { novel: NovelData, slug: string }) {
  const { novelData, description, allChapters } = novel

  return (
    <div className="container mx-auto my-10">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="w-full md:w-40 h-56 bg-slate-700 rounded-md flex items-center justify-center shrink-0 relative overflow-hidden">
              {novelData.image ? (
                <Image
                  src={novelData.image || "/placeholder.svg"}
                  alt={novelData.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-white">Novel Cover</span>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{novelData.title}</h1>
              <p className="text-sm text-muted-foreground mb-3">by {novelData.author}</p>

              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span>
                    {novelData.rating} ({novelData.reviewCount} ratings)
                  </span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span>{allChapters.length} Chapters</span>
                </div>
                <div className="flex items-center">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">{novelData.status}</span>
                </div>
              </div>

              <div className="flex gap-3 mb-4">
                <Button asChild>
                  <Link href={novelData.readNowLink}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Start Reading
                  </Link>
                </Button>
                <Button variant="outline">
                  <Library className="h-4 w-4 mr-2" />
                  Add to Library
                </Button>
              </div>

              {novelData.genres && novelData.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {novelData.genres.map((genre, index) => (
                    <Link
                      key={index}
                      href={`/genre/${genre.toLowerCase().replace(/\s+/g, "-")}`}
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs hover:bg-secondary/80"
                    >
                      {genre}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Synopsis</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>

          <ChapterList chapters={allChapters} slug={slug} />
        </div>
      </div>
    </div>
  )
}

// Novel content wrapper with error handling
async function NovelContentWrapper({ slug }: { slug: string }) {
  try {
    const novel = await fetchNovelDetails(slug, true)

    if (!novel) {
      return <div>Novel not found</div>
    }

    return <NovelContent novel={novel} slug={slug} />
  } catch (error) {
    return <NovelError error={(error as Error).message} />
  }
}

export default function NovelPage({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={<NovelPageSkeleton />}>
      <NovelContentWrapper slug={params.slug} />
    </Suspense>
  )
}