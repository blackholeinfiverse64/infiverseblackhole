import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
// import { ScrollArea } from "../ui/scroll-area" // Removed - no scrolling
import { 
  MessageSquare,
  Share2,
  Users,
  Calendar,
  FileText,
  Send,
  Plus,
  Search,
  Filter,
  Network,
  Handshake,
  Target,
  ExternalLink
} from "lucide-react"
import { useToast } from "../../hooks/use-toast"
import { formatDistanceToNow } from "date-fns"

export function DepartmentCollaboration({ departments }) {
  const [messages, setMessages] = useState([])
  const [resources, setResources] = useState([])
  const [projects, setProjects] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false)
  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    type: "document",
    sharedWith: []
  })
  const { toast } = useToast()

  useEffect(() => {
    generateMockData()
  }, [])

  const generateMockData = () => {
    // Generate mock messages
    const mockMessages = []
    for (let i = 0; i < 15; i++) {
      const dept = departments[Math.floor(Math.random() * departments.length)]
      mockMessages.push({
        id: i,
        department: dept?.name || 'Unknown',
        user: `User ${Math.floor(Math.random() * 10) + 1}`,
        message: generateMockMessage(),
        timestamp: new Date(Date.now() - Math.random() * 86400000),
        type: Math.random() > 0.7 ? 'announcement' : 'discussion',
        replies: Math.floor(Math.random() * 5)
      })
    }
    setMessages(mockMessages.sort((a, b) => b.timestamp - a.timestamp))

    // Generate mock resources
    const mockResources = []
    const resourceTypes = ['document', 'template', 'tool', 'guideline']
    for (let i = 0; i < 10; i++) {
      const dept = departments[Math.floor(Math.random() * departments.length)]
      mockResources.push({
        id: i,
        title: `Resource ${i + 1}`,
        description: `Shared resource from ${dept?.name || 'Unknown'}`,
        type: resourceTypes[Math.floor(Math.random() * resourceTypes.length)],
        sharedBy: dept?.name || 'Unknown',
        sharedWith: departments.slice(0, Math.floor(Math.random() * 3) + 1).map(d => d.name),
        timestamp: new Date(Date.now() - Math.random() * 604800000), // Last week
        downloads: Math.floor(Math.random() * 50) + 1
      })
    }
    setResources(mockResources)

    // Generate mock projects
    const mockProjects = []
    for (let i = 0; i < 8; i++) {
      const involvedDepts = departments.slice(0, Math.floor(Math.random() * 3) + 2)
      mockProjects.push({
        id: i,
        title: `Cross-Department Project ${i + 1}`,
        description: `Collaborative project involving multiple departments`,
        departments: involvedDepts.map(d => d.name),
        status: ['planning', 'active', 'review', 'completed'][Math.floor(Math.random() * 4)],
        progress: Math.floor(Math.random() * 100),
        startDate: new Date(Date.now() - Math.random() * 2592000000), // Last month
        deadline: new Date(Date.now() + Math.random() * 2592000000), // Next month
        lead: involvedDepts[0]?.name || 'Unknown'
      })
    }
    setProjects(mockProjects)
  }

  const generateMockMessage = () => {
    const messages = [
      "Looking for collaboration on the new project initiative",
      "Sharing best practices from our recent successful deployment",
      "Need input from other departments on resource allocation",
      "Announcing new cross-department training sessions",
      "Seeking volunteers for the upcoming company event",
      "Sharing lessons learned from our process improvement",
      "Looking for feedback on proposed workflow changes",
      "Announcing availability of new collaboration tools"
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now(),
      department: selectedDepartment === 'all' ? 'General' : selectedDepartment,
      user: 'Current User',
      message: newMessage,
      timestamp: new Date(),
      type: 'discussion',
      replies: 0
    }

    setMessages(prev => [message, ...prev])
    setNewMessage("")
    
    toast({
      title: "Message sent",
      description: "Your message has been posted to the collaboration feed"
    })
  }

  const shareResource = () => {
    if (!newResource.title.trim()) return

    const resource = {
      id: Date.now(),
      ...newResource,
      sharedBy: 'Current User',
      timestamp: new Date(),
      downloads: 0
    }

    setResources(prev => [resource, ...prev])
    setNewResource({
      title: "",
      description: "",
      type: "document",
      sharedWith: []
    })
    setIsResourceDialogOpen(false)
    
    toast({
      title: "Resource shared",
      description: "Your resource has been shared with selected departments"
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning': return 'bg-blue-500/20 text-blue-200'
      case 'active': return 'bg-green-500/20 text-green-200'
      case 'review': return 'bg-yellow-500/20 text-yellow-200'
      case 'completed': return 'bg-purple-500/20 text-purple-200'
      default: return 'bg-gray-500/20 text-gray-200'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'document': return <FileText className="h-4 w-4" />
      case 'template': return <FileText className="h-4 w-4" />
      case 'tool': return <Target className="h-4 w-4" />
      case 'guideline': return <FileText className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Collaboration Header */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Handshake className="h-5 w-5 text-purple-400" />
            Department Collaboration Hub
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="communication">
        <TabsList className="bg-slate-800/50 border-slate-700 p-1">
          <TabsTrigger value="communication" className="data-[state=active]:bg-purple-500">
            <MessageSquare className="h-4 w-4 mr-2" />
            Communication
          </TabsTrigger>
          <TabsTrigger value="resources" className="data-[state=active]:bg-purple-500">
            <Share2 className="h-4 w-4 mr-2" />
            Resource Sharing
          </TabsTrigger>
          <TabsTrigger value="projects" className="data-[state=active]:bg-purple-500">
            <Network className="h-4 w-4 mr-2" />
            Joint Projects
          </TabsTrigger>
        </TabsList>

        <TabsContent value="communication" className="space-y-6">
          {/* Message Composer */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Post a Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Share updates, ask questions, or start a discussion..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white"
                rows={3}
              />
              <div className="flex justify-between items-center">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="bg-slate-700/50 border border-slate-600 rounded px-3 py-2 text-white"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept._id || dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <Button onClick={sendMessage} className="bg-purple-500 hover:bg-purple-600">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Messages Feed */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Collaboration Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-y-auto max-h-64">
                <div className="space-y-4">
                  {messages.map(message => (
                    <div key={message.id} className="p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{message.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white">{message.user}</span>
                            <Badge variant="outline" className="text-xs">
                              {message.department}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-gray-200 text-sm">{message.message}</p>
                          {message.replies > 0 && (
                            <button className="text-purple-400 text-xs mt-2 hover:underline">
                              {message.replies} replies
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          {/* Resource Sharing Header */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-medium">Shared Resources</h3>
                <Dialog open={isResourceDialogOpen} onOpenChange={setIsResourceDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-500 hover:bg-purple-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Share Resource
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-slate-700 text-white">
                    <DialogHeader>
                      <DialogTitle>Share a Resource</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Title</label>
                        <Input
                          value={newResource.title}
                          onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                          className="bg-slate-700/50 border-slate-600"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          value={newResource.description}
                          onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                          className="bg-slate-700/50 border-slate-600"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setIsResourceDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={shareResource} className="bg-purple-500 hover:bg-purple-600">
                          Share Resource
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map(resource => (
              <Card key={resource.id} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-purple-400 mt-1">
                      {getTypeIcon(resource.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{resource.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">{resource.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {resource.type}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {resource.downloads} downloads
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">
                          by {resource.sharedBy}
                        </span>
                        <Button size="sm" variant="outline" className="text-xs">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Open
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map(project => (
              <Card key={project.id} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-lg">{project.title}</CardTitle>
                      <p className="text-sm text-gray-400 mt-1">{project.description}</p>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Lead Department:</span>
                      <span className="text-white">{project.lead}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Involved Departments:</span>
                      <span className="text-white">{project.departments.length}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {project.departments.map((dept, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {dept}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button size="sm" variant="outline" className="w-full">
                    View Project Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}