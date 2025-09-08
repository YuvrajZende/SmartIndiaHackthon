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
  AlertCircle,
  BarChart3,
  Eye,
  EyeOff,
  CheckCircle
} from "lucide-react"
import { apiService, VisualizationResponse } from "@/services/api"
import { SimpleVisualizationPanel } from "./SimpleVisualizationPanel"

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
      content: 'Hello! I\'m Ocean LLM, your AI assistant for ocean data analysis. I can help you understand oceanographic data from ARGO floats, provide insights about marine conditions, and assist with fishing recommendations. Please load the ocean models using the buttons above to get started!',
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
  const [showVisualizations, setShowVisualizations] = useState(false)
  const [visualizationData, setVisualizationData] = useState<VisualizationResponse | null>(null)
  const [apiKeyStatus, setApiKeyStatus] = useState<boolean>(false)
  const [loadedModels, setLoadedModels] = useState<Record<string, boolean>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check backend connection on component mount
  useEffect(() => {
    checkBackendConnection()
    checkModelStatus()
  }, [])

  // Check model status periodically
  useEffect(() => {
    const interval = setInterval(checkModelStatus, 5000) // Check every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const checkModelStatus = async () => {
    try {
      const response = await apiService.getModelStatus()
      const loadedStatus: Record<string, boolean> = {}
      Object.entries(response.model_status).forEach(([key, status]) => {
        loadedStatus[key] = status.loaded
      })
      setLoadedModels(loadedStatus)
    } catch (error) {
      console.error('Failed to check model status:', error)
    }
  }

  const checkBackendConnection = async () => {
    try {
      const health = await apiService.healthCheck()
      setIsConnected(true)
      setApiKeyStatus(health.api_key_set)
      
      if (!health.api_key_set) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          content: '⚠️ GEMINI_API_KEY is not set. Chatbot functionality will be limited. Please set the GEMINI_API_KEY environment variable in the backend.',
          sender: 'assistant',
          timestamp: new Date(),
          error: true
        }])
      }
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
    
    // Check if models are loaded for the selected region
    if (!loadedModels[selectedRegion]) {
      const warningMessage: Message = {
        id: Date.now().toString(),
        content: `⚠️ Models for ${selectedRegion.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} are not loaded yet. Please use the model loader buttons above to load the models first.`,
        sender: 'assistant',
        timestamp: new Date(),
        error: true
      }
      setMessages(prev => [...prev, warningMessage])
      return
    }
    
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
      
      // Auto-load visualizations if user asks about data or analysis
      if (currentInput.toLowerCase().includes('data') || 
          currentInput.toLowerCase().includes('analysis') || 
          currentInput.toLowerCase().includes('visualization') ||
          currentInput.toLowerCase().includes('graph') ||
          currentInput.toLowerCase().includes('chart')) {
        setShowVisualizations(true)
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. ${!apiKeyStatus ? 'Make sure GEMINI_API_KEY is set in the backend.' : 'Please make sure the backend server is running.'}`,
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
    <div className="flex h-full">
      {/* Chat Area */}
      <div className={`flex flex-col ${showVisualizations ? 'w-1/2' : 'w-full'} transition-all duration-300`}>
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
                <div className={`w-2 h-2 rounded-full ${loadedModels['arabian_sea'] ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                Arabian Sea
                {loadedModels['arabian_sea'] && <CheckCircle className="h-3 w-3 text-green-500 ml-auto" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedRegion('bay_of_bengal')} className="gap-2">
                <div className={`w-2 h-2 rounded-full ${loadedModels['bay_of_bengal'] ? 'bg-green-500' : 'bg-green-500'}`}></div>
                Bay of Bengal
                {loadedModels['bay_of_bengal'] && <CheckCircle className="h-3 w-3 text-green-500 ml-auto" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedRegion('north_indian_ocean')} className="gap-2">
                <div className={`w-2 h-2 rounded-full ${loadedModels['north_indian_ocean'] ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                North Indian Ocean
                {loadedModels['north_indian_ocean'] && <CheckCircle className="h-3 w-3 text-green-500 ml-auto" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowVisualizations(!showVisualizations)}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              {showVisualizations ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showVisualizations ? 'Hide' : 'Show'} Visualizations
            </Button>
            
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xs text-muted-foreground">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
              {!apiKeyStatus && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span className="text-xs text-yellow-600">No API Key</span>
                </div>
              )}
            </div>
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

      {/* Visualization Panel */}
      {showVisualizations && (
        <div className="w-1/2 border-l border-border overflow-y-auto">
          <div className="p-6">
            <SimpleVisualizationPanel 
              regionKey={selectedRegion} 
              onDataLoaded={setVisualizationData}
            />
          </div>
        </div>
      )}
    </div>
  )
}