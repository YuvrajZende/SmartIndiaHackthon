import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  Map, 
  BarChart3, 
  TrendingUp, 
  Globe,
  Loader2,
  AlertCircle,
  RefreshCw
} from "lucide-react"
import { apiService, VisualizationResponse } from "@/services/api"

interface VisualizationPanelProps {
  regionKey: string
  onDataLoaded?: (data: VisualizationResponse) => void
}

export function SimpleVisualizationPanel({ regionKey, onDataLoaded }: VisualizationPanelProps) {
  const [data, setData] = useState<VisualizationResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("geo_map")

  const loadVisualizations = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Use the new endpoint that doesn't retrain models
      const response = await apiService.getVisualizations(regionKey)
      setData(response)
      onDataLoaded?.(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load visualizations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (regionKey) {
      loadVisualizations()
    }
  }, [regionKey])

  const renderVisualization = (type: string) => {
    if (!data?.visualizations) return null
    
    const vizData = data.visualizations[type as keyof typeof data.visualizations]
    if (!vizData) return null

    try {
      const plotData = JSON.parse(vizData)
      
      // Create a simple HTML page with the Plotly chart
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
          <style>
            body { margin: 0; padding: 0; }
            #plot { width: 100%; height: 100vh; }
          </style>
        </head>
        <body>
          <div id="plot"></div>
          <script>
            Plotly.newPlot('plot', ${JSON.stringify(plotData.data)}, ${JSON.stringify(plotData.layout)}, {
              responsive: true,
              displayModeBar: true,
              modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
            });
          </script>
        </body>
        </html>
      `
      
      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      
      return (
        <div className="w-full h-96 border rounded-lg overflow-hidden">
          <iframe
            src={url}
            className="w-full h-full"
            title={`${type} visualization`}
            onLoad={() => URL.revokeObjectURL(url)}
          />
        </div>
      )
    } catch (err) {
      return (
        <div className="flex items-center justify-center h-96 text-muted-foreground">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Failed to render visualization</p>
            <p className="text-xs mt-2">Error: {String(err).substring(0, 100)}...</p>
          </div>
        </div>
      )
    }
  }

  const renderSummary = () => {
    if (!data?.summary) return null

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(data.summary).map(([key, value]) => (
          <div key={key} className="p-4 border rounded-lg bg-card">
            <div className="text-sm font-medium text-muted-foreground capitalize">
              {key.replace(/_/g, ' ')}
            </div>
            <div className="text-lg font-semibold mt-1">
              {String(value)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderModelMetrics = () => {
    if (!data?.model_metrics) return null

    return (
      <div className="space-y-4">
        {Object.entries(data.model_metrics).map(([param, metrics]: [string, any]) => (
          <div key={param} className="p-4 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold capitalize mb-2">{param} Model</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">R² Score</div>
                <div className="text-xl font-semibold text-green-600">
                  {metrics.r2?.toFixed(3) || 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Mean Absolute Error</div>
                <div className="text-xl font-semibold text-blue-600">
                  {metrics.mae?.toFixed(3) || 'N/A'}
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-sm text-muted-foreground">Model Type</div>
                <div className="text-sm font-medium">
                  {metrics.model_type || 'Unknown'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="w-full border rounded-lg bg-card">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Loading ocean data analysis...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full border rounded-lg bg-card">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadVisualizations} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Summary Cards */}
      {data?.summary && (
        <div className="border rounded-lg bg-card">
          <div className="p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5" />
              Ocean Data Summary
            </h2>
            {renderSummary()}
          </div>
        </div>
      )}

      {/* Model Metrics */}
      {data?.model_metrics && (
        <div className="border rounded-lg bg-card">
          <div className="p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5" />
              Model Performance
            </h2>
            {renderModelMetrics()}
          </div>
        </div>
      )}

      {/* Visualizations */}
      {data?.visualizations && (
        <div className="border rounded-lg bg-card">
          <div className="p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5" />
              Ocean Visualizations
            </h2>
            
            {/* Simple Tab Navigation */}
            <div className="flex space-x-1 mb-4 bg-muted p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("geo_map")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === "geo_map" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Map className="h-4 w-4" />
                Map
              </button>
              <button
                onClick={() => setActiveTab("depth_profile")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === "depth_profile" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                Depth
              </button>
              <button
                onClick={() => setActiveTab("time_series")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === "time_series" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                Time
              </button>
              <button
                onClick={() => setActiveTab("scatter_3d")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === "scatter_3d" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Globe className="h-4 w-4" />
                3D
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="mt-4">
              {activeTab === "geo_map" && renderVisualization('geo_map')}
              {activeTab === "depth_profile" && renderVisualization('depth_profile')}
              {activeTab === "time_series" && renderVisualization('time_series')}
              {activeTab === "scatter_3d" && renderVisualization('scatter_3d')}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


