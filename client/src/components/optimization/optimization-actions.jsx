"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { RefreshCw, Download, Share2, Brain, Sparkles, Loader2 } from "lucide-react";
import { useOptimizeWorkflow } from "../../hooks/use-ai";
import { api } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";

export function OptimizationActions({ tasks, setTasks, insights }) {
  const { optimizeWorkflow, isLoading } = useOptimizeWorkflow();
  const { toast } = useToast();

  const handleRefreshAnalysis = async () => {
    try {
      await optimizeWorkflow();
      toast({
        title: "Success",
        description: "AI analysis refreshed successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to refresh AI analysis",
        variant: "destructive",
      });
    }
  };

  const handleApplyAllRecommendations = async () => {
    try {
      const insightsData = await api.ai.getInsights();
      for (const insight of insightsData) {
        for (const action of insight.actions) {
          if (action.includes("Reassign")) {
            const taskTitle = insight.description.match(/Task '([^']+)'/)?.[1];
            const task = tasks.find((t) => t.title === taskTitle);
            if (task) {
              await api.tasks.updateTask(task._id, { assignee: null });
            }
          } else if (action.includes("Adjust deadlines")) {
            const taskTitle = insight.description.match(/Task '([^']+)'/)?.[1];
            const task = tasks.find((t) => t.title === taskTitle);
            if (task) {
              const newDueDate = new Date(task.dueDate);
              newDueDate.setDate(newDueDate.getDate() + 7);
              await api.tasks.updateTask(task._id, { dueDate: newDueDate.toISOString() });
            }
          }
        }
      }
      const updatedTasks = await api.tasks.getTasks();
      setTasks(updatedTasks);
      toast({
        title: "Success",
        description: "All AI recommendations applied",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to apply recommendations",
        variant: "destructive",
      });
    }
  };

  const handleExportInsights = async () => {
    try {
      const insightsData = await api.ai.getInsights();
      const blob = new Blob([JSON.stringify(insightsData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ai-insights.json";
      a.click();
      URL.revokeObjectURL(url);
      toast({
        title: "Success",
        description: "Insights exported successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to export insights",
        variant: "destructive",
      });
    }
  };

  const handleShareInsights = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast({
        title: "Success",
        description: "Link copied to clipboard",
      });
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    });
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-400" />
          AI Actions
        </h3>
        
        <Button 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300" 
          onClick={handleApplyAllRecommendations} 
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Apply All Recommendations
        </Button>
      </div>

      {/* Control Buttons */}
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start bg-slate-800/50 hover:bg-blue-500/20 border-slate-600/50 hover:border-blue-400/50 text-white hover:text-blue-200 transition-all duration-300"
          onClick={handleRefreshAnalysis}
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? "Analyzing Neural Patterns..." : "Refresh AI Analysis"}
        </Button>
        
        <Button
          variant="outline"
          className="w-full justify-start bg-slate-800/50 hover:bg-green-500/20 border-slate-600/50 hover:border-green-400/50 text-white hover:text-green-200 transition-all duration-300"
          onClick={handleExportInsights}
        >
          <Download className="mr-2 h-4 w-4" />
          Export Cosmic Data
        </Button>
        
        <Button
          variant="outline"
          className="w-full justify-start bg-slate-800/50 hover:bg-purple-500/20 border-slate-600/50 hover:border-purple-400/50 text-white hover:text-purple-200 transition-all duration-300"
          onClick={handleShareInsights}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share Intelligence
        </Button>
      </div>

      {/* Analysis Dashboard */}
      <Card className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 border border-blue-500/20 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2 text-base">
            <Brain className="h-4 w-4 text-blue-400" />
            Neural Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Total Insights</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">{insights ? insights.length : 0}</span>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">High Impact</span>
              <div className="flex items-center gap-2">
                <span className="text-red-400 font-medium">{insights ? insights.filter((i) => i.impact === "High").length : 0}</span>
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Medium Impact</span>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 font-medium">{insights ? insights.filter((i) => i.impact === "Medium").length : 0}</span>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Low Impact</span>
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-medium">{insights ? insights.filter((i) => i.impact === "Low").length : 0}</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="border-t border-slate-600/50 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Last Sync</span>
                <span className="text-blue-300 text-sm">
                  {insights && insights.length > 0
                    ? new Date().toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                      })
                    : "Never"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Status Indicator */}
      <Card className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 border border-green-500/20 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <div>
              <p className="text-white font-medium text-sm">AI Systems Online</p>
              <p className="text-green-300 text-xs">Neural networks active and monitoring</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}