"use client"
import { Settings, Moon, Sun, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { useTheme } from "next-themes"
import { useLocalStorage } from "@/hooks/use-local-storage"

export default function ReaderSettings() {
  const { setTheme, theme } = useTheme()
  const [fontSize, setFontSize] = useLocalStorage("reader-font-size", 16)

  const applyFontSize = (size: number) => {
    setFontSize(size)
    document.documentElement.style.setProperty("--reader-font-size", `${size}px`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Reader settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Reader Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="p-2">
          <p className="text-sm mb-2">Theme</p>
          <div className="flex gap-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              size="sm"
              className="w-full"
              onClick={() => setTheme("light")}
            >
              <Sun className="h-4 w-4 mr-2" />
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              size="sm"
              className="w-full"
              onClick={() => setTheme("dark")}
            >
              <Moon className="h-4 w-4 mr-2" />
              Dark
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator />

        <div className="p-2">
          <p className="text-sm mb-2">Font Size</p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => applyFontSize(Math.max(12, fontSize - 1))}
            >
              <Minus className="h-3 w-3" />
              <span className="sr-only">Decrease font size</span>
            </Button>

            <Slider
              value={[fontSize]}
              min={12}
              max={24}
              step={1}
              onValueChange={(value) => applyFontSize(value[0])}
              className="flex-1"
            />

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => applyFontSize(Math.min(24, fontSize + 1))}
            >
              <Plus className="h-3 w-3" />
              <span className="sr-only">Increase font size</span>
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

