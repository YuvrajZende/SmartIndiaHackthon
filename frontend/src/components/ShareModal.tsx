import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Info, Link, Copy } from "lucide-react"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [shareUrl] = useState("https://oceanllm.com/share/...")
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Share public link to chat</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Warning Box */}
        <div className="bg-muted/50 border border-muted rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground mb-1">
                This conversation may include personal information.
              </p>
              <p className="text-sm text-muted-foreground">
                Take a moment to check the content before sharing the link.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <p className="text-sm text-muted-foreground mb-6">
          Your name, custom instructions, and any messages you add after sharing stay private.{" "}
          <button className="underline hover:no-underline">Learn more</button>
        </p>

        {/* Share URL and Button */}
        <div className="flex items-center gap-3 p-3 bg-muted/30 border border-border rounded-xl">
          <div className="flex-1 text-sm text-muted-foreground font-mono truncate">
            {shareUrl}
          </div>
          <Button
            onClick={handleCopyLink}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6"
          >
            {copied ? (
              <>
                <Copy className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Link className="h-4 w-4" />
                Create link
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}