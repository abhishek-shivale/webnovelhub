import { Suspense } from "react";
import { Metadata, ResolvingMetadata } from "next";
import NovelCard from "@/components/novel-card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchGenreData } from "@/lib/api";

type Novel = {
  title: string;
  link: string;
  image: string;
  author: string;
  chapter_info: {
    title: string;
    link: string;
  };
};

type GenreData = {
  genre: Novel[];
};

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

function formatGenreName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug;
  const genreName = formatGenreName(slug);
  return {
    title: `${genreName} Novels | WebNovelHub`,
    description: `Explore our collection of ${genreName} novels. Find the latest and most popular ${genreName} stories all in one place.`,
    keywords: [
      "novels online",
      "read novels free",
      "best novels",
      "novel books",
      "fiction novels",
      "romance novels",
      "fantasy novels",
      "thriller novels",
      "novel series",
      "classic novels",
      "light novels",
      "novel recommendations",
      "book novels",
      "novel genres",
      "novel reading sites",
      "novel ebook",
      "novel reviews",
      "popular novels",
      "new novels",
      "novel collection",
    ],
    openGraph: {
      title: `${genreName} Novels | WebNovelHub`,
      description: `Explore our collection of ${genreName} novels. Find the latest and most popular ${genreName} stories all in one place.`,
      type: "website",
      url: `/genre/${slug}`,
      images: [
        {
          url: `/image.png`,
          width: 1200,
          height: 630,
          alt: `${genreName} Novels`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${genreName} Novels | WebNovelHub`,
      description: `Explore our collection of ${genreName} novels. Find the latest and most popular ${genreName} stories all in one place.`,
      images: [`/image.png`],
    },
    alternates: {
      canonical: `/genre/${slug}`,
    },
  };
}

async function GenreContent({ slug }: { slug: string }) {
  try {
    const data: GenreData = await fetchGenreData(slug);
    const genreName = formatGenreName(slug);

    return (
      <>
        <h1 className="text-2xl font-bold mb-2">{genreName}</h1>
        <p className="text-muted-foreground mb-8">
          Novels in the {genreName} genre
        </p>

        {data?.genre && data.genre.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.genre.map((novel, index) => (
              <NovelCard key={index} novel={novel} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No novels found in this genre.
            </p>
          </div>
        )}
      </>
    );
  } catch (error) {
    console.error(error);
    return (
      <div className="container mx-auto text-center py-12">
        <p className="text-red-500">
          Error loading genre data. Please try again later.
        </p>
      </div>
    );
  }
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton key={i} className="h-[300px] w-full" />
      ))}
    </div>
  );
}

export default async function GenrePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const genreName = formatGenreName((await params).slug);

  return (
    <div className="container mx-auto">
      <Suspense
        fallback={
          <>
            <h1 className="text-2xl font-bold mb-2">{genreName}</h1>
            <p className="text-muted-foreground mb-8">
              Novels in the {genreName} genre
            </p>
            <LoadingSkeleton />
          </>
        }
      >
        <GenreContent slug={(await params).slug} />
      </Suspense>
    </div>
  );
}
