import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  X, 
  Settings, 
  Bell, 
  User, 
  Puzzle, 
  Clock, 
  Shield, 
  Database, 
  UserCircle,
  ChevronRight,
  Play,
  Info
} from "lucide-react"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

type SettingsTab = 'general' | 'notifications' | 'personalization' | 'connectors' | 'schedules' | 'data-controls' | 'security' | 'account'

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')
  const [settings, setSettings] = useState({
    theme: 'dark',
    accentColor: 'default',
    language: 'auto-detect',
    spokenLanguage: 'auto-detect',
    voice: 'maple',
    showAdditionalModels: false,
    customInstructions: true,
    referenceSavedMemories: true,
    referenceChatHistory: true,
    referenceRecordHistory: true,
    notifications: {
      email: true,
      push: false,
      desktop: true
    }
  })

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const updateNestedSetting = (parent: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [parent]: { ...(prev[parent as keyof typeof prev] as any), [key]: value }
    }))
  }

  if (!isOpen) return null

  const sidebarItems = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'personalization', label: 'Personalization', icon: User },
    { id: 'connectors', label: 'Connectors', icon: Puzzle },
    { id: 'schedules', label: 'Schedules', icon: Clock },
    { id: 'data-controls', label: 'Data controls', icon: Database },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'account', label: 'Account', icon: UserCircle },
  ]

  const connectors = [
    { name: 'Box', icon: '📦', color: 'bg-blue-500' },
    { name: 'Canva', icon: '🎨', color: 'bg-purple-500' },
    { name: 'Dropbox', icon: '📁', color: 'bg-blue-600' },
    { name: 'GitHub', icon: '🐙', color: 'bg-gray-800' },
    { name: 'Gmail', icon: '📧', color: 'bg-red-500' },
    { name: 'Google Calendar', icon: '📅', color: 'bg-blue-500' },
    { name: 'Google Contacts', icon: '👥', color: 'bg-blue-500' },
    { name: 'HubSpot', icon: '🔶', color: 'bg-orange-500' },
    { name: 'Linear', icon: '📐', color: 'bg-purple-600' },
    { name: 'Notion', icon: '📝', color: 'bg-gray-700' },
    { name: 'Outlook Calendar', icon: '📅', color: 'bg-blue-600' },
    { name: 'Outlook Email', icon: '📧', color: 'bg-blue-600' },
  ]

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl w-full max-w-4xl h-[80vh] shadow-2xl overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 bg-muted/30 backdrop-blur-sm border-r border-border/50 p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Settings</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-full hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as SettingsTab)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                      activeTab === item.id
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-foreground">General</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground">Theme</label>
                      <select 
                        value={settings.theme}
                        onChange={(e) => updateSetting('theme', e.target.value)}
                        className="bg-muted border border-border rounded-lg px-3 py-1.5 text-sm"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground">Accent color</label>
                      <select 
                        value={settings.accentColor}
                        onChange={(e) => updateSetting('accentColor', e.target.value)}
                        className="bg-muted border border-border rounded-lg px-3 py-1.5 text-sm"
                      >
                        <option value="default">Default</option>
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                        <option value="purple">Purple</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground">Language</label>
                      <select 
                        value={settings.language}
                        onChange={(e) => updateSetting('language', e.target.value)}
                        className="bg-muted border border-border rounded-lg px-3 py-1.5 text-sm"
                      >
                        <option value="auto-detect">Auto-detect</option>
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-foreground">Spoken language</label>
                        <select 
                          value={settings.spokenLanguage}
                          onChange={(e) => updateSetting('spokenLanguage', e.target.value)}
                          className="bg-muted border border-border rounded-lg px-3 py-1.5 text-sm"
                        >
                          <option value="auto-detect">Auto-detect</option>
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                        </select>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        For best results, select the language you mainly speak. If it's not listed, it may still be supported via auto-detection.
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground">Voice</label>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Play className="h-3 w-3" />
                          Play
                        </Button>
                        <select 
                          value={settings.voice}
                          onChange={(e) => updateSetting('voice', e.target.value)}
                          className="bg-muted border border-border rounded-lg px-3 py-1.5 text-sm"
                        >
                          <option value="maple">Maple</option>
                          <option value="oak">Oak</option>
                          <option value="pine">Pine</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground">Show additional models</label>
                      <button
                        onClick={() => updateSetting('showAdditionalModels', !settings.showAdditionalModels)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.showAdditionalModels ? 'bg-primary' : 'bg-muted'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.showAdditionalModels ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'personalization' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-foreground">Personalization</h3>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">Custom instructions</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground">On</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground">Memory</h4>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Reference saved memories</p>
                          <p className="text-sm text-muted-foreground">Let Ocean LLM save and use memories when responding.</p>
                        </div>
                        <button
                          onClick={() => updateSetting('referenceSavedMemories', !settings.referenceSavedMemories)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.referenceSavedMemories ? 'bg-primary' : 'bg-muted'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.referenceSavedMemories ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Reference chat history</p>
                          <p className="text-sm text-muted-foreground">Let Ocean LLM reference all previous conversations when responding.</p>
                        </div>
                        <button
                          onClick={() => updateSetting('referenceChatHistory', !settings.referenceChatHistory)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.referenceChatHistory ? 'bg-primary' : 'bg-muted'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.referenceChatHistory ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div>
                        <h4 className="font-medium text-foreground">Manage memories</h4>
                      </div>
                      <Button variant="secondary" size="sm">
                        Manage
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Ocean LLM may use Memory to personalize queries to search providers, such as Bing.{" "}
                        <button className="underline hover:no-underline">Learn more</button>
                      </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">Record mode</h4>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Reference record history</p>
                          <p className="text-sm text-muted-foreground">Let Ocean LLM reference all previous recording transcripts and notes when responding.</p>
                        </div>
                        <button
                          onClick={() => updateSetting('referenceRecordHistory', !settings.referenceRecordHistory)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.referenceRecordHistory ? 'bg-primary' : 'bg-muted'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.referenceRecordHistory ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'connectors' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Enabled connectors</h3>
                    <p className="text-sm text-muted-foreground">
                      Ocean LLM can access information from connected apps. Your permissions are always respected.{" "}
                      <button className="underline hover:no-underline">Learn more</button>
                    </p>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-semibold">G</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">Google Drive</h4>
                        <p className="text-sm text-muted-foreground">Chat, Deep research, Agent mode, File uploads</p>
                      </div>
                      <Button variant="secondary" size="sm" className="gap-2">
                        Add chat, deep research
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-4">Browse connectors</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {connectors.map((connector) => (
                        <button
                          key={connector.name}
                          className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 ${connector.color} rounded-lg flex items-center justify-center text-white text-sm`}>
                              {connector.icon}
                            </div>
                            <span className="font-medium text-foreground">{connector.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-foreground">Notifications</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Email notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                      <button
                        onClick={() => updateNestedSetting('notifications', 'email', !settings.notifications.email)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.notifications.email ? 'bg-primary' : 'bg-muted'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notifications.email ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Push notifications</p>
                        <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                      </div>
                      <button
                        onClick={() => updateNestedSetting('notifications', 'push', !settings.notifications.push)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.notifications.push ? 'bg-primary' : 'bg-muted'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notifications.push ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Desktop notifications</p>
                        <p className="text-sm text-muted-foreground">Show notifications on your desktop</p>
                      </div>
                      <button
                        onClick={() => updateNestedSetting('notifications', 'desktop', !settings.notifications.desktop)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.notifications.desktop ? 'bg-primary' : 'bg-muted'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notifications.desktop ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Placeholder for other tabs */}
              {['schedules', 'data-controls', 'security', 'account'].includes(activeTab) && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-foreground capitalize">{activeTab.replace('-', ' ')}</h3>
                  <p className="text-muted-foreground">Settings for {activeTab.replace('-', ' ')} will be available soon.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}