import { Header } from "@/components/Header"
import { ChatInterface } from "@/components/ChatInterface"
import "@/globals.css"

function App() {
  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  )
}

export default App