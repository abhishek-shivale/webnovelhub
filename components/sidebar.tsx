"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sword,
  Compass,
  Film,
  Laugh,
  PenTool,
  Castle,
  Gamepad,
  Users,
  Globe,
  Heart,
  Clock,
  Ghost,
  Flower,
  Wand,
  ScrollText,
  Flame,
  AlertCircle,
  Home,
  MoreHorizontal,
  Brain,
  RefreshCw,
  Flag,
  BookOpen,
  Rocket,
  User,
  Coffee,
  Trophy,
  AlertTriangle,
  Frown,
  Shield,
  Book,
  History,
  Menu,
  X,
  Building2,
  Cpu,
  DoorOpen,
  VenetianMask,
  Dice1,
  UserSearch,
  Bot,
  Sparkle,
  ChevronRight,
  ChevronLeft,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

const genres = [
  {
    name: "Action",
    link: "/action",
    icon: <Sword className="h-4 w-4 mr-2" />,
  },
  {
    name: "Adventure",
    link: "/adventure",
    icon: <Compass className="h-4 w-4 mr-2" />,
  },
  {
    name: "Anime & comics",
    link: "/anime-&-comics",
    icon: <Film className="h-4 w-4 mr-2" />,
  },
  {
    name: "Comedy",
    link: "/comedy",
    icon: <Laugh className="h-4 w-4 mr-2" />,
  },
  {
    name: "Drama",
    link: "/drama",
    icon: <VenetianMask className="h-4 w-4 mr-2" />,
  },
  {
    name: "Eastern",
    link: "/eastern",
    icon: <Building2 className="h-4 w-4 mr-2" />,
  },
  {
    name: "Fanfiction",
    link: "/fanfiction",
    icon: <PenTool className="h-4 w-4 mr-2" />,
  },
  {
    name: "Fantasy",
    link: "/fantasy",
    icon: <Castle className="h-4 w-4 mr-2" />,
  },
  {
    name: "Game",
    link: "/game",
    icon: <Gamepad className="h-4 w-4 mr-2" />,
  },
  {
    name: "Gender bender",
    link: "/gender-bender",
    icon: <Users className="h-4 w-4 mr-2" />,
  },
  {
    name: "General",
    link: "/general",
    icon: <Globe className="h-4 w-4 mr-2" />,
  },
  {
    name: "Harem",
    link: "/harem",
    icon: <Heart className="h-4 w-4 mr-2" />,
  },
  {
    name: "Historical",
    link: "/historical",
    icon: <Clock className="h-4 w-4 mr-2" />,
  },
  {
    name: "Horror",
    link: "/horror",
    icon: <Ghost className="h-4 w-4 mr-2" />,
  },
  {
    name: "Isekai",
    link: "/isekai",
    icon: <DoorOpen className="h-4 w-4 mr-2" />,
  },
  {
    name: "Josei",
    link: "/josei",
    icon: <Flower className="h-4 w-4 mr-2" />,
  },
  {
    name: "Litrpg",
    link: "/litrpg",
    icon: <Dice1 className="h-4 w-4 mr-2" />,
  },
  {
    name: "Magic",
    link: "/magic",
    icon: <Wand className="h-4 w-4 mr-2" />,
  },
  {
    name: "Magical realism",
    link: "/magical-realism",
    icon: <ScrollText className="h-4 w-4 mr-2" />,
  },
  {
    name: "Martial arts",
    link: "/martial-arts",
    icon: <Flame className="h-4 w-4 mr-2" />,
  },
  {
    name: "Mature",
    link: "/mature",
    icon: <AlertCircle className="h-4 w-4 mr-2" />,
  },
  {
    name: "Mecha",
    link: "/mecha",
    icon: <Bot className="h-4 w-4 mr-2" />,
  },
  {
    name: "Modern life",
    link: "/modern-life",
    icon: <Home className="h-4 w-4 mr-2" />,
  },
  {
    name: "Mystery",
    link: "/mystery",
    icon: <UserSearch className="h-4 w-4 mr-2" />,
  },
  {
    name: "Other",
    link: "/other",
    icon: <MoreHorizontal className="h-4 w-4 mr-2" />,
  },
  {
    name: "Psychological",
    link: "/psychological",
    icon: <Brain className="h-4 w-4 mr-2" />,
  },
  {
    name: "Reincarnation",
    link: "/reincarnation",
    icon: <RefreshCw className="h-4 w-4 mr-2" />,
  },
  {
    name: "Report story",
    link: "/report-story",
    icon: <Flag className="h-4 w-4 mr-2" />,
  },
  {
    name: "Romance",
    link: "/romance",
    icon: <Heart className="h-4 w-4 mr-2" />,
  },
  {
    name: "School life",
    link: "/school-life",
    icon: <BookOpen className="h-4 w-4 mr-2" />,
  },
  {
    name: "Sci-fi",
    link: "/sci-fi",
    icon: <Rocket className="h-4 w-4 mr-2" />,
  },
  {
    name: "Seinen",
    link: "/seinen",
    icon: <User className="h-4 w-4 mr-2" />,
  },
  {
    name: "Shoujo",
    link: "/shoujo",
    icon: <Heart className="h-4 w-4 mr-2" />,
  },
  {
    name: "Shounen",
    link: "/shounen",
    icon: <User className="h-4 w-4 mr-2" />,
  },
  {
    name: "Slice of life",
    link: "/slice-of-life",
    icon: <Coffee className="h-4 w-4 mr-2" />,
  },
  {
    name: "Smut",
    link: "/smut",
    icon: <AlertCircle className="h-4 w-4 mr-2" />,
  },
  {
    name: "Sports",
    link: "/sports",
    icon: <Trophy className="h-4 w-4 mr-2" />,
  },
  {
    name: "Supernatural",
    link: "/supernatural",
    icon: <Ghost className="h-4 w-4 mr-2" />,
  },
  {
    name: "System",
    link: "/system",
    icon: <Cpu className="h-4 w-4 mr-2" />,
  },
  {
    name: "Thriller",
    link: "/thriller",
    icon: <AlertTriangle className="h-4 w-4 mr-2" />,
  },
  {
    name: "Tragedy",
    link: "/tragedy",
    icon: <Frown className="h-4 w-4 mr-2" />,
  },
  {
    name: "Urban",
    link: "/urban",
    icon: <Building2 className="h-4 w-4 mr-2" />,
  },
  {
    name: "Video games",
    link: "/video-games",
    icon: <Gamepad className="h-4 w-4 mr-2" />,
  },
  {
    name: "War",
    link: "/war",
    icon: <Shield className="h-4 w-4 mr-2" />,
  },
  {
    name: "Wuxia",
    link: "/wuxia",
    icon: <Flame className="h-4 w-4 mr-2" />,
  },
  {
    name: "Xianxia",
    link: "/xianxia",
    icon: <Sparkle className="h-4 w-4 mr-2" />,
  },
  {
    name: "Xuanhuan",
    link: "/xuanhuan",
    icon: <Sparkle className="h-4 w-4 mr-2" />,
  },
  {
    name: "Yaoi",
    link: "/yaoi",
    icon: <Heart className="h-4 w-4 mr-2" />,
  },
  {
    name: "Yuri",
    link: "/yuri",
    icon: <Heart className="h-4 w-4 mr-2" />,
  },
];

const search = [
  {
    name: "Search",
    icon: <Search className="h-4 w-4 mr-2" />,
    href: "/search",
  },
]

const libraryLinks = [
  {
    name: "My Collection",
    icon: <Book className="h-4 w-4 mr-2" />,
    href: "/collection",
  },
  {
    name: "Reading History",
    icon: <History className="h-4 w-4 mr-2" />,
    href: "/history",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-30">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 bottom-0 left-0 z-20 bg-background border-r transition-all duration-300",
          isCollapsed && !isMobileOpen
            ? "w-20 -translate-x-full md:w-20 md:translate-x-0"
            : "w-64",
          isMobileOpen ? "translate-x-0" : ""
        )}
      >
        <ScrollArea className="h-full">
          <div className="p-4 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                className="flex items-center space-x-2 text-xl font-bold"
              >
                <Book className="h-8 w-8" />{" "}
                {!isCollapsed && <span>WebNovelHub</span>}
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden md:block"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-6 w-6" />
                ) : (
                  <ChevronLeft className="h-6 w-6" />
                )}
              </Button>
            </div>

            <div>
              <h3
                className={cn(
                  "text-sm font-medium mb-2",
                  isCollapsed && !isMobileOpen ? "sr-only" : ""
                )}
              >
                Search
              </h3>
              <ul className="space-y-1">
                {search.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center text-sm py-2 rounded-md hover:bg-accent transition-colors",
                        pathname === link.href && "bg-accent",
                        isCollapsed && !isMobileOpen
                          ? "justify-center px-0"
                          : "px-4"
                      )}
                      title={
                        isCollapsed && !isMobileOpen ? link.name : undefined
                      }
                    >
                      {React.cloneElement(link.icon, {
                        className: "h-6 w-6 mr-2", // Increased icon size
                      })}
                      {(!isCollapsed || isMobileOpen) && link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="my-4">
              <h3
                className={cn(
                  "text-sm font-medium mb-2",
                  isCollapsed && !isMobileOpen ? "sr-only" : ""
                )}
              >
                Library
              </h3>
              <ul className="space-y-1">
                {libraryLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center text-sm py-2 rounded-md hover:bg-accent transition-colors",
                        pathname === link.href && "bg-accent",
                        isCollapsed && !isMobileOpen
                          ? "justify-center px-0"
                          : "px-4"
                      )}
                      title={
                        isCollapsed && !isMobileOpen ? link.name : undefined
                      }
                    >
                      {React.cloneElement(link.icon, {
                        className: "h-6 w-6 mr-2", // Increased icon size
                      })}
                      {(!isCollapsed || isMobileOpen) && link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Genre List */}
            <div className="flex-1">
              <h3
                className={cn(
                  "text-sm font-medium mb-2",
                  isCollapsed ? "sr-only" : ""
                )}
              >
                Genres
              </h3>
              <ul className="space-y-1 ">
                {genres.map((genre) => (
                  <li key={genre.name}>
                    <Link
                      href={"/genre" + genre.link}
                      className={cn(
                        "flex items-center text-sm py-2 rounded-md hover:bg-accent transition-colors",
                        isCollapsed ? " px-4" : "px-4"
                      )}
                    >
                      <span className="text-lg mr-2">
                        {React.cloneElement(genre.icon, {
                          className: "h-6 w-6 mr-2",
                        })}
                      </span>
                      {!isCollapsed || isMobileOpen ? genre.name : ""}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>



            {/* Mobile Collapse Button */}
            <div className="md:hidden mt-auto pt-4">
              <Button
                variant="outline"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="w-full"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-5 w-5 mr-2" />
                ) : (
                  <ChevronLeft className="h-5 w-5 mr-2" />
                )}
                {isCollapsed ? "Expand" : "Collapse"}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>

      <div
        className={cn(
          "hidden md:block transition-all duration-300",
          isCollapsed ? "ml-20" : "ml-64"
        )}
      />
    </>
  );
}
