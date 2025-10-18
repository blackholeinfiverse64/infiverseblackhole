import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { ProfileSettings } from "../components/settings/profile-settings"
import { WorkspaceSettings } from "../components/settings/workspace-settings"
import { NotificationSettings } from "../components/settings/notification-settings"
import ConsentSettings from "../components/settings/ConsentSettings";
import { SpaceParticles, CosmicOrbs } from "../components/ui/space-particles"
import { Settings as SettingsIcon, User, Briefcase, Bell, Shield, Sparkles } from "lucide-react"

function Settings() {
  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      {/* Space Background */}
      <div className="fixed inset-0 z-0">
        <SpaceParticles count={30} className="opacity-40" />
        <CosmicOrbs count={6} className="opacity-20" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-primary/30">
              <SettingsIcon className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
              Cosmic Settings
            </h1>
          </div>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Configure your cosmic workspace and personalize your intergalactic experience
          </p>
          
          {/* Cosmic Divider */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          </div>
        </div>

        {/* Enhanced Settings Card */}
        <div className="max-w-6xl mx-auto">
          <Card className="bg-background/20 backdrop-blur-xl border-primary/20 shadow-2xl">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-gold animate-pulse" />
                <CardTitle className="text-2xl bg-gradient-to-r from-gold via-primary to-accent bg-clip-text text-transparent">
                  System Configuration
                </CardTitle>
                <Sparkles className="h-5 w-5 text-gold animate-pulse" />
              </div>
              <CardDescription className="text-white/60 text-lg">
                Fine-tune your cosmic experience across all dimensions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-background/30 backdrop-blur-sm border border-primary/20 p-1 rounded-xl">
                  <TabsTrigger 
                    value="profile" 
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-white data-[state=active]:border-primary/30 rounded-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="workspace" 
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-white data-[state=active]:border-primary/30 rounded-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <Briefcase className="h-4 w-4" />
                    <span className="hidden sm:inline">Workspace</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notifications" 
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-white data-[state=active]:border-primary/30 rounded-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <Bell className="h-4 w-4" />
                    <span className="hidden sm:inline">Notifications</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="consent" 
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-white data-[state=active]:border-primary/30 rounded-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">Consent</span>
                  </TabsTrigger>
                </TabsList>
                
                {/* Tab Content with enhanced styling */}
                <div className="mt-8">
                  <TabsContent value="profile" className="space-y-6">
                    <div className="bg-background/10 backdrop-blur-sm rounded-xl border border-primary/10 p-6">
                      <ProfileSettings />
                    </div>
                  </TabsContent>
                  <TabsContent value="workspace" className="space-y-6">
                    <div className="bg-background/10 backdrop-blur-sm rounded-xl border border-primary/10 p-6">
                      <WorkspaceSettings />
                    </div>
                  </TabsContent>
                  <TabsContent value="notifications" className="space-y-6">
                    <div className="bg-background/10 backdrop-blur-sm rounded-xl border border-primary/10 p-6">
                      <NotificationSettings />
                    </div>
                  </TabsContent>
                  <TabsContent value="consent" className="space-y-6">
                    <div className="bg-background/10 backdrop-blur-sm rounded-xl border border-primary/10 p-6">
                      <ConsentSettings />
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Footer Message */}
        <div className="text-center py-8">
          <p className="text-white/40 text-sm">
            🌌 Your settings are automatically synced across the cosmic network
          </p>
        </div>
      </div>
    </div>
  )
}

export default Settings
