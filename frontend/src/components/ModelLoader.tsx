import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Waves,
  MapPin,
  Globe
} from "lucide-react"
import { apiService, ModelStatus } from "@/services/api"

interface ModelLoaderProps {
  onModelLoaded?: (regionKey: string, summary: any) => void
}

export function ModelLoader({ onModelLoaded }: ModelLoaderProps) {
  const [modelStatus, setModelStatus] = useState<Record<string, ModelStatus>>({})
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [errorStates, setErrorStates] = useState<Record<string, string>>({})

  const regions = [
    {
      key: 'arabian_sea',
      name: 'Arabian Sea',
      icon: Waves,
      color: 'bg-blue-500',
      description: 'Western Indian Ocean region'
    },
    {
      key: 'bay_of_bengal', 
      name: 'Bay of Bengal',
      icon: MapPin,
      color: 'bg-green-500',
      description: 'Eastern Indian Ocean region'
    },
    {
      key: 'north_indian_ocean',
      name: 'North Indian Ocean',
      icon: Globe,
      color: 'bg-purple-500',
      description: 'Complete North Indian Ocean'
    }
  ]

  // Load initial model status
  useEffect(() => {
    loadModelStatus()
  }, [])

  const loadModelStatus = async () => {
    try {
      const response = await apiService.getModelStatus()
      setModelStatus(response.model_status)
    } catch (error) {
      console.error('Failed to load model status:', error)
    }
  }

  const handleLoadModel = async (regionKey: string) => {
    setLoadingStates(prev => ({ ...prev, [regionKey]: true }))
    setErrorStates(prev => ({ ...prev, [regionKey]: '' }))

    try {
      const response = await apiService.loadModels(regionKey)
      
      // Update model status
      await loadModelStatus()
      
      // Notify parent component
      if (onModelLoaded && response.summary) {
        onModelLoaded(regionKey, response.summary)
      }

      // Show success message briefly
      setTimeout(() => {
        setLoadingStates(prev => ({ ...prev, [regionKey]: false }))
      }, 1000)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load models'
      setErrorStates(prev => ({ ...prev, [regionKey]: errorMessage }))
      setLoadingStates(prev => ({ ...prev, [regionKey]: false }))
    }
  }

  const getButtonVariant = (regionKey: string) => {
    if (loadingStates[regionKey]) return 'default'
    if (errorStates[regionKey]) return 'destructive'
    if (modelStatus[regionKey]?.loaded) return 'secondary'
    return 'outline'
  }

  const getButtonContent = (regionKey: string, regionName: string) => {
    if (loadingStates[regionKey]) {
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading Models...
        </>
      )
    }
    
    if (errorStates[regionKey]) {
      return (
        <>
          <AlertCircle className="h-4 w-4" />
          Error Loading
        </>
      )
    }
    
    if (modelStatus[regionKey]?.loaded) {
      return (
        <>
          <CheckCircle className="h-4 w-4" />
          Models Ready
        </>
      )
    }
    
    return (
      <>
        <Waves className="h-4 w-4" />
        Load {regionName}
      </>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {regions.map((region) => {
        const IconComponent = region.icon
        const regionStatus = modelStatus[region.key]
        const isLoading = loadingStates[region.key]
        const hasError = errorStates[region.key]
        const isLoaded = regionStatus?.loaded

        return (
          <div key={region.key} className="relative">
            <Button
              variant={getButtonVariant(region.key)}
              size="sm"
              className={`h-8 px-3 text-xs transition-all duration-200 ${
                isLoaded 
                  ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300' 
                  : hasError
                  ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                  : 'hover:scale-105'
              }`}
              onClick={() => handleLoadModel(region.key)}
              disabled={isLoading || isLoaded}
              title={isLoaded ? `Models loaded for ${region.name}` : `Load models for ${region.name}`}
            >
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${region.color}`}></div>
                <span className="hidden sm:inline">{region.name.split(' ')[0]}</span>
                {isLoaded && <CheckCircle className="h-3 w-3" />}
                {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                {hasError && <AlertCircle className="h-3 w-3" />}
              </div>
            </Button>

            {/* Status indicator */}
            {isLoaded && regionStatus?.summary && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-background"></div>
            )}

            {/* Error tooltip */}
            {hasError && (
              <div className="absolute top-full right-0 mt-1 z-50 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 p-2 rounded shadow-lg whitespace-nowrap">
                {hasError}
              </div>
            )}
          </div>
        )
      })}
      
      {/* Summary indicator */}
      <div className="text-xs text-muted-foreground ml-2">
        {Object.values(modelStatus).filter(status => status.loaded).length}/{regions.length}
      </div>
    </div>
  )
}
