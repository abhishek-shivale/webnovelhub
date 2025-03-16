"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { MEDIA_BASE_URL } from "@/lib/api"

type Novel = {
  title: string
  link: string
  image: string
}

type TopNovelsProps = {
  novels: Novel[]
}

export default function TopNovels({ novels }: TopNovelsProps) {
  // Add badges to the first three novels
  const badges = ["Featured Novel", "Editor's Pick", "Trending"]

  return (
    <section className="mb-10 relative">
      <h2 className="text-xl font-semibold mb-4">Top Novels</h2>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {novels.map((novel, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <Link href={novel.link}>
                <Card className="h-[200px] bg-slate-700 hover:bg-slate-600 transition-colors text-white overflow-hidden">
                  <CardContent className="p-0 h-full flex flex-col justify-end relative">
                    {novel.image && (
                      <Image src={MEDIA_BASE_URL + novel.image || "/placeholder.svg"} alt={novel.title} fill className="object-cover" />
                    )}
                    <div className="p-4 bg-gradient-to-t from-black/70 to-transparent h-full flex flex-col justify-end absolute inset-0">
                      <h3 className="font-semibold text-lg">{novel.title}</h3>
                      {index < badges.length && <p className="text-xs text-slate-300">{badges[index]}</p>}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </div>
      </Carousel>
    </section>
  )
}

