import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu"
import { Moon, Sun, Share, MoreHorizontal, Waves } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import { ShareModal } from "./ShareModal"
import { SettingsModal } from "./SettingsModal"

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  return (
    <>
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Waves className="h-6 w-6 text-blue-500" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
            <span className="font-semibold text-foreground">Ocean LLM</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => setIsShareModalOpen(true)}
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8"
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsSettingsModalOpen(true)}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>Help & FAQ</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>

    <ShareModal 
      isOpen={isShareModalOpen} 
      onClose={() => setIsShareModalOpen(false)} 
    />
    <SettingsModal 
      isOpen={isSettingsModalOpen} 
      onClose={() => setIsSettingsModalOpen(false)} 
    />
  </>
  )
}