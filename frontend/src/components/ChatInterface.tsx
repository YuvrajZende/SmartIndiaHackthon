import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  Paperclip, 
  Plus, 
  Send, 
  Mic, 
  MicOff,
  Image,
  FileText,
  Bot,
  Lightbulb,
  AlertCircle
} from "lucide-react"
import { apiService } from "@/services/api"

interface Message {
  id: string
  content: string
  sender: 'user' | 'assistant'
  timestamp: Date
  error?: boolean
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m Ocean LLM, your AI assistant for ocean data analysis. I can help you understand oceanographic data from ARGO floats, provide insights about marine conditions, and assist with fishing recommendations. What would you like to know about the ocean?',
      sender: 'assistant',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState('arabian_sea')
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check backend connection on component mount
  useEffect(() => {
    checkBackendConnection()
  }, [])

  const checkBackendConnection = async () => {
    try {
      await apiService.healthCheck()
      setIsConnected(true)
    } catch (error) {
      setIsConnected(false)
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: 'Unable to connect to Ocean LLM backend. Please ensure the FastAPI server is running on http://localhost:8000',
        sender: 'assistant',
        timestamp: new Date(),
        error: true
      }])
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isSending) return
    
    setIsSending(true)
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    
    try {
      const response = await apiService.sendMessage(currentInput, selectedRegion)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        sender: 'assistant',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please make sure the backend server is running.`,
        sender: 'assistant',
        timestamp: new Date(),
        error: true
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsSending(false)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const toggleListening = () => {
    setIsListening(!isListening)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in-0 slide-in-from-bottom-2 duration-300`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground ml-12'
                  : message.error
                  ? 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 mr-12'
                  : 'bg-muted text-muted-foreground mr-12'
              }`}
            >
              {message.sender === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  {message.error ? (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  ) : (
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                  )}
                  <span className="text-xs font-medium">
                    {message.error ? 'Error' : 'Ocean LLM'}
                  </span>
                </div>
              )}
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex justify-start animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            <div className="bg-muted text-muted-foreground rounded-2xl px-4 py-3 mr-12">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Compact Input Area */}
      <div className="p-6">
        {/* Ocean Region Selector and Status */}
        <div className="mb-4 flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <Bot className="h-4 w-4" />
                Ocean Region: {selectedRegion.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setSelectedRegion('arabian_sea')} className="gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Arabian Sea
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedRegion('bay_of_bengal')} className="gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Bay of Bengal
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedRegion('north_indian_ocean')} className="gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                North Indian Ocean
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-xs text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Sleek Compact Input Box */}
        <div className={`relative bg-background border border-border rounded-2xl transition-all duration-300 ${
          isFocused ? 'border-ring shadow-lg shadow-ring/10' : 'hover:border-ring/50'
        } ${isSending ? 'animate-pulse' : ''}`}>
          <div className="flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything"
              className="flex-1 bg-transparent px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:outline-none rounded-2xl"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
            
            <div className="flex items-center gap-2 pr-3">
              <Button
                variant="ghost"
                size="icon"
                className={`h-9 w-9 rounded-full transition-all duration-200 ${
                  isListening ? 'scale-110 text-red-500 bg-red-50 dark:bg-red-950' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                onClick={toggleListening}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4 animate-pulse" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
              
              <Button 
                onClick={handleSend}
                disabled={!input.trim() || isSending}
                size="icon"
                className={`h-9 w-9 rounded-full transition-all duration-200 ${
                  input.trim() && !isSending
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 shadow-sm' 
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                } ${isSending ? 'scale-95 opacity-70' : ''}`}
              >
                <Send className={`h-4 w-4 transition-transform duration-200 ${
                  isSending ? 'translate-x-1' : ''
                }`} />
              </Button>
            </div>
          </div>
        </div>

        {/* Buffer Text */}
        <p className="text-xs text-muted-foreground text-center mt-3">
          Ocean LLM can make mistakes. Check important info.
        </p>
      </div>
    </div>
  )
}