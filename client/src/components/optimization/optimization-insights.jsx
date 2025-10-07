"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Sparkles, Clock, ArrowRight, Users, Link, GitBranch, Loader2, Brain } from "lucide-react";
import { api } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";

export function OptimizationInsights({ insights }) {
  const { toast } = useToast();

  const getImpactColor = (impact) => {
    switch (impact) {
      case "High":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      case "Medium":
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20";
      case "Low":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Resources": return <Users className="h-5 w-5" />;
      case "Dependencies": return <Link className="h-5 w-5" />;
      case "Deadlines": return <Clock className="h-5 w-5" />;
      case "Workflow": return <GitBranch className="h-5 w-5" />;
      default: return <Sparkles className="h-5 w-5" />;
    }
  };

  const handleApplyAction = async (action, insight) => {
    try {
      // Extract task title from description
      const taskTitle = insight.description.match(/Task '([^']+)'/)?.[1];
      if (!taskTitle) {
        throw new Error("Task not found in insight description");
      }

      const tasks = await api.tasks.getTasks();
      const task = tasks.find((t) => t.title === taskTitle);
      if (!task) {
        throw new Error("Task not found");
      }

      let updates = {};
      if (action.includes("Reassign")) {
        updates.assignee = null; // Mock reassignment
      } else if (action.includes("Adjust deadlines") || action.includes("Extend deadlines")) {
        const newDueDate = new Date(task.dueDate);
        newDueDate.setDate(newDueDate.getDate() + 7);
        updates.dueDate = newDueDate.toISOString();
      } else if (action.includes("Prioritize")) {
        updates.priority = "High";
      }

      await api.tasks.updateTask(task._id, updates);
      toast({
        title: "Success",
        description: `Action "${action}" applied to task "${taskTitle}"`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || `Failed to apply action "${action}"`,
        variant: "destructive",
      });
    }
  };

  if (!insights || insights.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <Tabs defaultValue="all" className="flex-1">
          <TabsList className="mb-6 bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger value="all" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">All Insights</TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">Resources</TabsTrigger>
            <TabsTrigger value="dependencies" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300">Dependencies</TabsTrigger>
            <TabsTrigger value="deadlines" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-300">Deadlines</TabsTrigger>
          </TabsList>

          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-6 py-16">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-blue-400/20 flex items-center justify-center backdrop-blur-sm">
                  <Brain className="w-10 h-10 text-blue-400/60" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">AI Analysis Pending</h3>
                <p className="text-white/60 max-w-md mx-auto leading-relaxed">
                  No AI insights available yet. Generate cosmic intelligence by clicking "Refresh Analysis" in the Control Center.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-blue-300/60">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="text-sm">Neural networks are ready for activation</span>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="all" className="flex-1">
        <TabsList className="mb-6 bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="all" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">All Insights</TabsTrigger>
          <TabsTrigger value="resources" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">Resources</TabsTrigger>
          <TabsTrigger value="dependencies" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300">Dependencies</TabsTrigger>
          <TabsTrigger value="deadlines" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-300">Deadlines</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0 space-y-4 flex-1">
          {insights.map((insight, index) => (
            <Card key={insight.id || index} className="group bg-gradient-to-br from-slate-800/40 to-slate-900/60 border-l-4 border-l-blue-400 hover:border-l-blue-300 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-all duration-300">
                      {getCategoryIcon(insight.category)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-white group-hover:text-blue-100 transition-colors text-lg">{insight.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs bg-slate-700/50 text-slate-300 border-slate-600">
                          {insight.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Badge className={`${getImpactColor(insight.impact)} transition-all duration-300`}>
                    {insight.impact} Impact
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-4 leading-relaxed">{insight.description}</p>
                <div className="flex flex-wrap gap-2">
                  {insight.actions.map((action, actionIndex) => (
                    <Button
                      key={actionIndex}
                      variant="outline"
                      size="sm"
                      className="bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 hover:border-blue-400/50 text-blue-300 hover:text-blue-200 transition-all duration-300"
                      onClick={() => handleApplyAction(action, insight)}
                    >
                      {action}
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="resources" className="mt-0 space-y-4 flex-1">
          {insights
            .filter((insight) => insight.category === "Resources")
            .map((insight, index) => (
              <Card key={insight.id || index} className="group bg-gradient-to-br from-slate-800/40 to-slate-900/60 border-l-4 border-l-purple-400 hover:border-l-purple-300 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-all duration-300">
                        <Users className="h-5 w-5 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-white group-hover:text-purple-100 transition-colors text-lg">{insight.title}</CardTitle>
                        <Badge variant="outline" className="text-xs bg-slate-700/50 text-slate-300 border-slate-600 mt-1">
                          {insight.category}
                        </Badge>
                      </div>
                    </div>
                    <Badge className={`${getImpactColor(insight.impact)} transition-all duration-300`}>
                      {insight.impact} Impact
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 mb-4 leading-relaxed">{insight.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {insight.actions.map((action, actionIndex) => (
                      <Button
                        key={actionIndex}
                        variant="outline"
                        size="sm"
                        className="bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30 hover:border-purple-400/50 text-purple-300 hover:text-purple-200 transition-all duration-300"
                        onClick={() => handleApplyAction(action, insight)}
                      >
                        {action}
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="dependencies" className="mt-0 space-y-4 flex-1">
          {insights
            .filter((insight) => insight.category === "Dependencies")
            .map((insight, index) => (
              <Card key={insight.id || index} className="group bg-gradient-to-br from-slate-800/40 to-slate-900/60 border-l-4 border-l-green-400 hover:border-l-green-300 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-green-500/10">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-all duration-300">
                        <Link className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-white group-hover:text-green-100 transition-colors text-lg">{insight.title}</CardTitle>
                        <Badge variant="outline" className="text-xs bg-slate-700/50 text-slate-300 border-slate-600 mt-1">
                          {insight.category}
                        </Badge>
                      </div>
                    </div>
                    <Badge className={`${getImpactColor(insight.impact)} transition-all duration-300`}>
                      {insight.impact} Impact
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 mb-4 leading-relaxed">{insight.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {insight.actions.map((action, actionIndex) => (
                      <Button
                        key={actionIndex}
                        variant="outline"
                        size="sm"
                        className="bg-green-500/10 hover:bg-green-500/20 border-green-500/30 hover:border-green-400/50 text-green-300 hover:text-green-200 transition-all duration-300"
                        onClick={() => handleApplyAction(action, insight)}
                      >
                        {action}
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="deadlines" className="mt-0 space-y-4 flex-1">
          {insights
            .filter((insight) => insight.category === "Deadlines")
            .map((insight, index) => (
              <Card key={insight.id || index} className="group bg-gradient-to-br from-slate-800/40 to-slate-900/60 border-l-4 border-l-orange-400 hover:border-l-orange-300 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-orange-500/10">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/30 transition-all duration-300">
                        <Clock className="h-5 w-5 text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-white group-hover:text-orange-100 transition-colors text-lg">{insight.title}</CardTitle>
                        <Badge variant="outline" className="text-xs bg-slate-700/50 text-slate-300 border-slate-600 mt-1">
                          {insight.category}
                        </Badge>
                      </div>
                    </div>
                    <Badge className={`${getImpactColor(insight.impact)} transition-all duration-300`}>
                      {insight.impact} Impact
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 mb-4 leading-relaxed">{insight.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {insight.actions.map((action, actionIndex) => (
                      <Button
                        key={actionIndex}
                        variant="outline"
                        size="sm"
                        className="bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30 hover:border-orange-400/50 text-orange-300 hover:text-orange-200 transition-all duration-300"
                        onClick={() => handleApplyAction(action, insight)}
                      >
                        {action}
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}