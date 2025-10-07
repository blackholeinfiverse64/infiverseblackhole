import { useState, useEffect } from "react";
import { DepartmentList } from "../components/departments/department-list";
import { DepartmentHeader } from "../components/departments/department-header";
import { DepartmentDetails } from "../components/departments/DepartmentDetails";
import { EnhancedDepartmentDashboard } from "../components/departments/enhanced-department-dashboard";
import { AdvancedDepartmentManagement } from "../components/departments/advanced-department-management";
import { DepartmentAnalytics } from "../components/departments/department-analytics-simple";
import { RealTimeDepartmentMonitoring } from "../components/departments/real-time-monitoring";
import { DepartmentCollaboration } from "../components/departments/department-collaboration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { 
  LayoutDashboard, 
  List, 
  Settings, 
  Users, 
  BarChart3,
  ArrowLeft,
  Activity,
  Handshake
} from "lucide-react";
import { api } from "../lib/api";
import { useToast } from "../hooks/use-toast";

function Departments() {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      const response = await api.departments.getDepartments();
      const data = response.success ? response.data : response;
      setDepartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast({
        title: "Error",
        description: "Failed to load departments",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
  };

  const handleBackToDepartments = () => {
    setSelectedDepartment(null);
  };

  if (selectedDepartment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-x-hidden scrollbar-hide" 
           style={{
             scrollbarWidth: 'none',
             msOverflowStyle: 'none',
           }}>
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="relative z-10 p-6">
          <DepartmentDetails 
            department={selectedDepartment} 
            onBack={handleBackToDepartments} 
          />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-x-hidden scrollbar-hide" 
           style={{
             scrollbarWidth: 'none',
             msOverflowStyle: 'none',
           }}>
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="relative z-10 p-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-x-hidden scrollbar-hide" 
         style={{
           scrollbarWidth: 'none',
           msOverflowStyle: 'none',
         }}>
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {/* Main Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Enhanced Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-white">
                  Departments Hub
                </h1>
                <p className="text-gray-400 mt-2">
                  Comprehensive department management and analytics
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={fetchDepartments}
                  className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Main Tabs */}
            <div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-slate-800/50 border-slate-700 p-1 flex-shrink-0">
                  <TabsTrigger 
                    value="dashboard" 
                    className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </TabsTrigger>
                  <TabsTrigger 
                    value="list" 
                    className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                  >
                    <List className="h-4 w-4 mr-2" />
                    Department List
                  </TabsTrigger>
                  <TabsTrigger 
                    value="management" 
                    className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Management
                  </TabsTrigger>
                  <TabsTrigger 
                    value="analytics" 
                    className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger 
                    value="monitoring" 
                    className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    Live Monitoring
                  </TabsTrigger>
                  <TabsTrigger 
                    value="collaboration" 
                    className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                  >
                    <Handshake className="h-4 w-4 mr-2" />
                    Collaboration
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="mt-6">
                  <EnhancedDepartmentDashboard />
                </TabsContent>

                <TabsContent value="list" className="mt-6">
                  <div className="space-y-6">
                    <DepartmentHeader />
                    <DepartmentList onDepartmentSelect={handleDepartmentSelect} />
                  </div>
                </TabsContent>

                <TabsContent value="management" className="mt-6">
                  <AdvancedDepartmentManagement 
                    departments={departments} 
                    onRefresh={fetchDepartments} 
                  />
                </TabsContent>

                <TabsContent value="analytics" className="mt-6">
                  <DepartmentAnalytics departments={departments} />
                </TabsContent>

                <TabsContent value="monitoring" className="mt-6">
                  <RealTimeDepartmentMonitoring departments={departments} />
                </TabsContent>

                <TabsContent value="collaboration" className="mt-6">
                  <DepartmentCollaboration departments={departments} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Departments;