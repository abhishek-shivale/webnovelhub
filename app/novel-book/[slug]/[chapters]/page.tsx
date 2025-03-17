import { Suspense } from "react";
import Link from "next/link";
import { Metadata } from "next/types";
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Share2,
  Moon,
  Sun,
  Home,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { cookies } from 'next/headers';
import ReaderSettings from "@/components/reader-settings";
import { fetchChapterContent } from "@/lib/api";
import { ScrollArea } from "@/components/ui/scroll-area";
import AudioPlayer from "@/components/audio-player";

type ChapterData = {
  novel_title: string;
  chap_title: string;
  next_chapter: {
    title: string;
    link: string;
  } | null;
  prev_chapter: {
    title: string;
    link: string;
  } | null;
  content: string;
};

// Generate metadata for the page
export async function generateMetadata({
  params
}: {
  params: { slug: string; chapters: string }
}): Promise<Metadata> {
  try {
    const chapter = await fetchChapterContent(params.slug, params.chapters);

    return {
      title: `${chapter.chap_title} - ${chapter.novel_title} | WebNovelHub`,
      description: `Read ${chapter.chap_title} from ${chapter.novel_title} with WebNovelHub online. Continue your reading journey with the best reading experience.`,
      openGraph: {
        title: `${chapter.chap_title} - ${chapter.novel_title} | WebNovelHub`,
        description: `Read ${chapter.chap_title} from ${chapter.novel_title} with WebNovelHub online.`,
        type: 'article',
        url: `/novel-book/${params.slug}/${params.chapters}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: chapter.chap_title,
        description: chapter.content.substring(0, 200),
        images: '/image.png',
      },
      alternates: {
        canonical: `/novel-book/${params.slug}/${params.chapters}`,
      },
    };
  } catch (err) {
    return {
      title: 'Chapter - WebNovelHub',
      description: 'Read novels on WebNovelHub online with the best reading experience.',
    };
  }
}

// New server action for bookmark management
async function getBookmarkStatus(slug: string, chapter: string) {
  const bookmarksCookie = (await cookies()).get('bookmarks')?.value;
  if (!bookmarksCookie) return false;

  try {
    const bookmarks = JSON.parse(bookmarksCookie);
    return bookmarks.some(
      (bookmark: any) =>
        bookmark.novelSlug === slug &&
        bookmark.chapterNumber === chapter
    );
  } catch (e) {
    return false;
  }
}

// Function to calculate read time
function calculateReadTime(content: string): number {
  const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.ceil(wordCount / 200);
}

// Function to update reading history
async function updateReadingHistory(
  slug: string,
  chapter: string,
  novelTitle: string,
  chapterTitle: string
) {
  const historyCookie = (await cookies()).get('reading-history')?.value;
  let history: any[] = [];

  try {
    if (historyCookie) {
      history = JSON.parse(historyCookie);
    }
  } catch (e) {
    history = [];
  }

  const historyItem = {
    id: `${slug}-${chapter}`,
    novelTitle: novelTitle,
    novelSlug: slug,
    chapterTitle: chapterTitle,
    chapterNumber: chapter,
    timestamp: Date.now(),
  };

  const filteredHistory = history.filter((item) => item.id !== historyItem.id);
  const newHistory = [historyItem, ...filteredHistory].slice(0, 20);

  // Would normally set cookie here, but simplified for this example
  return historyItem;
}

// Loading component
function ChapterSkeleton() {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-6">
      <div className="mb-4">
        <Skeleton className="h-8 w-3/4 mb-2" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

export default async function ChapterPage({
  params
}: {
  params: Promise<{ slug: string; chapters: string }>
}) {
  const {slug, chapters} = await params;
  // SSR data fetching
  let chapter: ChapterData | null = null;
  let error: string | null = null;

  try {
    chapter = await fetchChapterContent(slug, chapters);

    // Update reading history on server
    if (chapter) {
      await updateReadingHistory(
        slug,
        chapters,
        chapter.novel_title,
        chapter.chap_title
      );
    }
  } catch (err) {
    error = "Error loading chapter. Please try again later.";
    console.error(err);
  }

  // Get bookmark status
  const bookmarked = await getBookmarkStatus(slug, chapters);

  // Calculate read time if chapter exists
  const estimatedReadTime = chapter ? calculateReadTime(chapter.content) : 0;

  // Get theme from cookies
  const cookieStore = cookies();
  const theme = (await cookieStore).get('theme')?.value || 'light';

  if (error) {
    return (
      <div className="container mx-auto text-center py-12">
        <p className="text-red-500">{error}</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Return to Home
          </Link>
        </Button>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="container mx-auto text-center py-12">
        <p>Chapter not found</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Return to Home
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Fixed top bar - made more compact */}
      <div className="sticky top-0 bg-background border-b z-10 py-1 px-2">
        <div className="container max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href={`/novel-book/${slug}`}
            className="text-sm hover:underline flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Link>

          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <form action="/api/bookmark" method="post">
                    <input type="hidden" name="slug" value={slug} />
                    <input type="hidden" name="chapter" value={chapters} />
                    <input type="hidden" name="action" value={bookmarked ? "remove" : "add"} />
                    <Button variant="ghost" size="sm" type="submit">
                      <Bookmark
                        className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`}
                      />
                    </Button>
                  </form>
                </TooltipTrigger>
                <TooltipContent>
                  {bookmarked ? "Remove bookmark" : "Add bookmark"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    data-share-url={`${process.env.NEXT_PUBLIC_BASE_URL}/novel-book/${slug}/${chapters}`}
                    data-share-title={`${chapter.chap_title} - ${chapter.novel_title}`}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share chapter</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <form action="/api/theme" method="post">
                    <input type="hidden" name="theme" value={theme === "dark" ? "light" : "dark"} />
                    <Button variant="ghost" size="sm" type="submit">
                      {theme === "dark" ? (
                        <Sun className="h-4 w-4" />
                      ) : (
                        <Moon className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                </TooltipTrigger>
                <TooltipContent>
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <ReaderSettings />
            <Suspense fallback={
              <Button variant="ghost" size="sm" disabled>
                <span className="h-4 w-4">🔈</span>
              </Button>
            }>
              <AudioPlayer chapter={chapter} />
            </Suspense>
          </div>
        </div>
      </div>

      <Suspense fallback={<ChapterSkeleton />}>
        <div className="container max-w-5xl mx-auto px-4 py-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">{chapter.chap_title}</h1>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {chapter.novel_title}
              </p>
              <p className="text-sm text-muted-foreground flex items-center">
                <Eye className="h-4 w-4 mr-1" /> {estimatedReadTime} min read
              </p>
            </div>
          </div>

          <ScrollArea>
            <div
              className="prose dark:prose-invert max-w-none mb-8"
              style={{
                fontSize: `var(--reader-font-size, 16px)`,
                lineHeight: `var(--reader-line-height, 1.8)`,
                height: "calc(100vh - 200px)",
                padding: "1rem",
              }}
              dangerouslySetInnerHTML={{ __html: chapter.content }}
            />
          </ScrollArea>

          <div className="hidden bottom-0 left-20 right-0 bg-background p-2 md:block">
            <div className="flex items-center justify-between py-3 border-t">
              {chapter.prev_chapter && chapter.prev_chapter.title ? (
                <Button variant="outline" asChild>
                  <Link href={chapter.prev_chapter.link}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous Chapter
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" disabled>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous Chapter
                </Button>
              )}

              {chapter.next_chapter && chapter.next_chapter.title ? (
                <Button variant="default" asChild>
                  <Link href={chapter.next_chapter.link}>
                    Next Chapter
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" disabled>
                  Next Chapter
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Suspense>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-2 md:hidden">
        <div className="flex items-center justify-between">
          {chapter.prev_chapter && chapter.prev_chapter.title ? (
            <Button variant="ghost" size="sm" asChild>
              <Link href={chapter.prev_chapter.link}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Prev
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" disabled>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </Button>
          )}
          {chapter.next_chapter && chapter.next_chapter.title ? (
            <Button variant="default" size="sm" asChild>
              <Link href={chapter.next_chapter.link}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" disabled>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}