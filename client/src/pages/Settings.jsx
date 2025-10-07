import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { ProfileSettings } from "../components/settings/profile-settings"
import { WorkspaceSettings } from "../components/settings/workspace-settings"
import { NotificationSettings } from "../components/settings/notification-settings"
import ConsentSettings from "../components/settings/ConsentSettings";
import { Settings as SettingsIcon, User, Briefcase, Bell, Shield } from "lucide-react"

function Settings() {
  return (
    <div className="space-y-6 p-6">
      {/* Clean Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        </div>
        <p className="text-white/70">
          Manage your account and workspace preferences
        </p>
      </div>

      {/* Settings Card */}
      <Card className="bg-background/80 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Account Settings</CardTitle>
          <CardDescription className="text-white/60">
            Configure your preferences and account settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-background/50 border border-white/10">
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-white flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger 
                value="workspace" 
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-white flex items-center gap-2"
              >
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">Workspace</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-white flex items-center gap-2"
              >
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger 
                value="consent" 
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-white flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Consent</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="profile">
                <ProfileSettings />
              </TabsContent>
              <TabsContent value="workspace">
                <WorkspaceSettings />
              </TabsContent>
              <TabsContent value="notifications">
                <NotificationSettings />
              </TabsContent>
              <TabsContent value="consent">
                <ConsentSettings />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default Settings
