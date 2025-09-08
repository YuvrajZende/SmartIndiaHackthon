import { Header } from "@/components/Header"
import { ChatInterface } from "@/components/ChatInterface"
import { ModelLoader } from "@/components/ModelLoader"
import { useState } from "react"
import "@/globals.css"

function App() {
  const [loadedModels, setLoadedModels] = useState<Record<string, any>>({})

  const handleModelLoaded = (regionKey: string, summary: any) => {
    setLoadedModels(prev => ({
      ...prev,
      [regionKey]: summary
    }))
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
        <Header />
        <ModelLoader onModelLoaded={handleModelLoaded} />
      </div>
      <main className="flex-1 overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  )
}

export default App