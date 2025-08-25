import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="w-9 h-9 p-0 hover:bg-accent/20 transition-all duration-300"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 text-foreground transition-transform duration-300 hover:scale-110" />
      ) : (
        <Sun className="h-4 w-4 text-foreground transition-transform duration-300 hover:scale-110" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}