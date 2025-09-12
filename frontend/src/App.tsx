import { Header } from "@/components/Header"
import { ChatInterface } from "@/components/ChatInterface"
import { ModelLoader } from "@/components/ModelLoader"
import LandingPage from "./landing/LandingPage"
import { useState, useEffect } from "react"
import "@/globals.css"

function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [loadedModels, setLoadedModels] = useState<Record<string, any>>({})

  const handleModelLoaded = (regionKey: string, summary: any) => {
    setLoadedModels(prev => ({
      ...prev,
      [regionKey]: summary
    }))
  }

  const handleGetStarted = () => {
    setShowLanding(false)
  }

  useEffect(() => {
    if (showLanding) {
      document.body.classList.add('landing-mode')
      document.body.classList.remove('app-mode')
    } else {
      document.body.classList.add('app-mode')
      document.body.classList.remove('landing-mode')
    }

    return () => {
      document.body.classList.remove('landing-mode', 'app-mode')
    }
  }, [showLanding])

  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />
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