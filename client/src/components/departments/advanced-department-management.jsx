import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Checkbox } from "../ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { 
  Plus,
  Edit,
  Trash2,
  Users,
  UserPlus,
  Settings,
  Copy,
  Download,
  Upload,
  Filter,
  Search,
  MoreHorizontal,
  Building2,
  Layers,
  Network,
  Shuffle,
  Target,
  Briefcase
} from "lucide-react"
import { api } from "../../lib/api"
import { useToast } from "../../hooks/use-toast"

export function AdvancedDepartmentManagement({ departments, onRefresh }) {
  const [selectedDepartments, setSelectedDepartments] = useState([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false)
  const [isHierarchyModalOpen, setIsHierarchyModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [users, setUsers] = useState([])
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
    color: "#6366f1",
    lead: "",
    members: [],
    parentDepartment: "",
    budget: 0,
    location: "",
    type: "operational"
  })
  const [bulkEditData, setBulkEditData] = useState({
    lead: "",
    parentDepartment: "",
    type: "",
    budget: ""
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const usersData = await api.users.getUsers() // Assuming this endpoint exists
      setUsers(usersData)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterBy === "all") return matchesSearch
    if (filterBy === "has-lead") return matchesSearch && dept.lead
    if (filterBy === "no-lead") return matchesSearch && !dept.lead
    if (filterBy === "active") return matchesSearch && dept.members?.length > 0
    if (filterBy === "inactive") return matchesSearch && (!dept.members || dept.members.length === 0)
    
    return matchesSearch
  })

  const handleSelectDepartment = (deptId, checked) => {
    if (checked) {
      setSelectedDepartments([...selectedDepartments, deptId])
    } else {
      setSelectedDepartments(selectedDepartments.filter(id => id !== deptId))
    }
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedDepartments(filteredDepartments.map(dept => dept._id || dept.id))
    } else {
      setSelectedDepartments([])
    }
  }

  const handleCreateDepartment = async () => {
    try {
      await api.departments.createDepartment(newDepartment)
      toast({
        title: "Success",
        description: "Department created successfully"
      })
      setIsCreateModalOpen(false)
      setNewDepartment({
        name: "",
        description: "",
        color: "#6366f1",
        lead: "",
        members: [],
        parentDepartment: "",
        budget: 0,
        location: "",
        type: "operational"
      })
      onRefresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create department",
        variant: "destructive"
      })
    }
  }

  const handleBulkEdit = async () => {
    try {
      const promises = selectedDepartments.map(deptId => {
        const updateData = {}
        if (bulkEditData.lead) updateData.lead = bulkEditData.lead
        if (bulkEditData.parentDepartment) updateData.parentDepartment = bulkEditData.parentDepartment
        if (bulkEditData.type) updateData.type = bulkEditData.type
        if (bulkEditData.budget) updateData.budget = parseInt(bulkEditData.budget)
        
        return api.departments.updateDepartment(deptId, updateData)
      })
      
      await Promise.all(promises)
      
      toast({
        title: "Success",
        description: `Updated ${selectedDepartments.length} departments`
      })
      setIsBulkEditModalOpen(false)
      setSelectedDepartments([])
      setBulkEditData({ lead: "", parentDepartment: "", type: "", budget: "" })
      onRefresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update departments",
        variant: "destructive"
      })
    }
  }

  const handleBulkDelete = async () => {
    if (confirm(`Are you sure you want to delete ${selectedDepartments.length} departments?`)) {
      try {
        const promises = selectedDepartments.map(deptId => 
          api.departments.deleteDepartment(deptId)
        )
        
        await Promise.all(promises)
        
        toast({
          title: "Success",
          description: `Deleted ${selectedDepartments.length} departments`
        })
        setSelectedDepartments([])
        onRefresh()
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete departments",
          variant: "destructive"
        })
      }
    }
  }

  const exportDepartments = () => {
    const dataStr = JSON.stringify(filteredDepartments, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = 'departments.json'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const departmentTypes = [
    { value: "operational", label: "Operational" },
    { value: "support", label: "Support" },
    { value: "strategic", label: "Strategic" },
    { value: "project", label: "Project-based" },
    { value: "temporary", label: "Temporary" }
  ]

  return (
    <div className="space-y-6">
      {/* Management Header */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-400" />
            Advanced Department Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Search and Filter */}
            <div className="flex gap-2 flex-1 min-w-[300px]">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-48 bg-slate-700/50 border-slate-600 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="has-lead">With Lead</SelectItem>
                  <SelectItem value="no-lead">Without Lead</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-500 hover:bg-purple-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Department
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Department</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <Tabs defaultValue="basic">
                      <TabsList className="bg-slate-700/50">
                        <TabsTrigger value="basic">Basic Info</TabsTrigger>
                        <TabsTrigger value="advanced">Advanced</TabsTrigger>
                        <TabsTrigger value="members">Members</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="basic" className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Department Name</Label>
                            <Input
                              value={newDepartment.name}
                              onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                              className="bg-slate-700/50 border-slate-600"
                            />
                          </div>
                          <div>
                            <Label>Color</Label>
                            <Input
                              type="color"
                              value={newDepartment.color}
                              onChange={(e) => setNewDepartment({...newDepartment, color: e.target.value})}
                              className="bg-slate-700/50 border-slate-600 h-10"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={newDepartment.description}
                            onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
                            className="bg-slate-700/50 border-slate-600"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label>Department Lead</Label>
                          <Select 
                            value={newDepartment.lead} 
                            onValueChange={(value) => setNewDepartment({...newDepartment, lead: value})}
                          >
                            <SelectTrigger className="bg-slate-700/50 border-slate-600">
                              <SelectValue placeholder="Select a lead" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                              {users.map(user => (
                                <SelectItem key={user._id} value={user._id}>
                                  {user.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="advanced" className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Department Type</Label>
                            <Select 
                              value={newDepartment.type} 
                              onValueChange={(value) => setNewDepartment({...newDepartment, type: value})}
                            >
                              <SelectTrigger className="bg-slate-700/50 border-slate-600">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-slate-700">
                                {departmentTypes.map(type => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Budget</Label>
                            <Input
                              type="number"
                              value={newDepartment.budget}
                              onChange={(e) => setNewDepartment({...newDepartment, budget: parseInt(e.target.value) || 0})}
                              className="bg-slate-700/50 border-slate-600"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Location</Label>
                            <Input
                              value={newDepartment.location}
                              onChange={(e) => setNewDepartment({...newDepartment, location: e.target.value})}
                              className="bg-slate-700/50 border-slate-600"
                            />
                          </div>
                          <div>
                            <Label>Parent Department</Label>
                            <Select 
                              value={newDepartment.parentDepartment} 
                              onValueChange={(value) => setNewDepartment({...newDepartment, parentDepartment: value})}
                            >
                              <SelectTrigger className="bg-slate-700/50 border-slate-600">
                                <SelectValue placeholder="Select parent" />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-slate-700">
                                {departments.map(dept => (
                                  <SelectItem key={dept._id || dept.id} value={dept._id || dept.id}>
                                    {dept.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="members" className="space-y-4 mt-4">
                        <div>
                          <Label>Select Members</Label>
                          <div className="border border-slate-600 rounded-md p-2 bg-slate-700/50 overflow-y-auto max-h-40">
                            {users.map(user => (
                              <div key={user._id} className="flex items-center space-x-2 p-2">
                                <Checkbox
                                  id={user._id}
                                  checked={newDepartment.members.includes(user._id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setNewDepartment({
                                        ...newDepartment, 
                                        members: [...newDepartment.members, user._id]
                                      })
                                    } else {
                                      setNewDepartment({
                                        ...newDepartment, 
                                        members: newDepartment.members.filter(id => id !== user._id)
                                      })
                                    }
                                  }}
                                />
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <Label htmlFor={user._id} className="text-sm cursor-pointer">
                                    {user.name}
                                  </Label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="flex gap-2 justify-end">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsCreateModalOpen(false)}
                        className="bg-slate-700/50 border-slate-600 text-white"
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleCreateDepartment} className="bg-purple-500 hover:bg-purple-600">
                        Create Department
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button 
                variant="outline" 
                onClick={exportDepartments}
                className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              <Dialog open={isHierarchyModalOpen} onOpenChange={setIsHierarchyModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline"
                    className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
                  >
                    <Network className="h-4 w-4 mr-2" />
                    Hierarchy
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Department Hierarchy</DialogTitle>
                  </DialogHeader>
                  <div className="p-4">
                    <p className="text-gray-400 mb-4">Visual department hierarchy and relationships</p>
                    {/* This would contain a tree view or organizational chart */}
                    <div className="text-center text-gray-500">
                      Hierarchy visualization would be implemented here
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedDepartments.length > 0 && (
            <div className="mt-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-purple-500/20 text-purple-200">
                    {selectedDepartments.length} selected
                  </Badge>
                  <span className="text-sm text-gray-400">
                    Bulk actions available
                  </span>
                </div>
                <div className="flex gap-2">
                  <Dialog open={isBulkEditModalOpen} onOpenChange={setIsBulkEditModalOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="bg-slate-700/50 border-slate-600 text-white">
                        <Edit className="h-4 w-4 mr-2" />
                        Bulk Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700 text-white">
                      <DialogHeader>
                        <DialogTitle>Bulk Edit Departments</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Change Lead (optional)</Label>
                          <Select value={bulkEditData.lead} onValueChange={(value) => setBulkEditData({...bulkEditData, lead: value})}>
                            <SelectTrigger className="bg-slate-700/50 border-slate-600">
                              <SelectValue placeholder="Keep current leads" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                              {users.map(user => (
                                <SelectItem key={user._id} value={user._id}>
                                  {user.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Change Type (optional)</Label>
                          <Select value={bulkEditData.type} onValueChange={(value) => setBulkEditData({...bulkEditData, type: value})}>
                            <SelectTrigger className="bg-slate-700/50 border-slate-600">
                              <SelectValue placeholder="Keep current types" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                              {departmentTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            onClick={() => setIsBulkEditModalOpen(false)}
                            className="bg-slate-700/50 border-slate-600 text-white"
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleBulkEdit} className="bg-purple-500 hover:bg-purple-600">
                            Update Selected
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={handleBulkDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Department List with Selection */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Department List</CardTitle>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedDepartments.length === filteredDepartments.length && filteredDepartments.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <Label className="text-sm text-gray-400">Select All</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredDepartments.map((department) => {
              const deptId = department._id || department.id
              const isSelected = selectedDepartments.includes(deptId)
              
              return (
                <div 
                  key={deptId} 
                  className={`p-4 rounded-lg border transition-colors ${
                    isSelected 
                      ? 'border-purple-500/50 bg-purple-500/10' 
                      : 'border-slate-600 bg-slate-700/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => handleSelectDepartment(deptId, checked)}
                      />
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: department.color }}
                      >
                        {department.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{department.name}</h4>
                        <p className="text-sm text-gray-400">{department.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-white">
                          {department.members ? department.members.filter(m => m && m._id).length : 0}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-gray-300 border-gray-500">
                        {department.type || 'operational'}
                      </Badge>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}