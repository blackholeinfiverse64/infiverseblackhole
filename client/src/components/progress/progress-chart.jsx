import { useEffect, useState } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { format } from "date-fns";
import { TrendingUp, BarChart3, PieChartIcon, Activity, Target } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

export function ProgressChart({ history, dueDate }) {
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState('line');
  const [stats, setStats] = useState({
    averageProgress: 0,
    progressVelocity: 0,
    estimatedCompletion: null,
    totalEntries: 0
  });

  useEffect(() => {
    if (history && history.length > 0) {
      // Sort history by date
      const sortedHistory = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Create chart data with formatted dates and additional metrics
      const data = sortedHistory.map((entry, index) => {
        const previousEntry = sortedHistory[index - 1];
        const progressChange = previousEntry ? entry.progressPercentage - previousEntry.progressPercentage : 0;
        
        return {
          date: format(new Date(entry.date), "MMM dd"),
          fullDate: format(new Date(entry.date), "PPP"),
          progress: entry.progressPercentage,
          progressChange: progressChange,
          rawDate: new Date(entry.date),
          notes: entry.notes || '',
          achievements: entry.achievements || '',
          blockers: entry.blockers || ''
        };
      });
      
      // Add due date with 100% target if it's in the future
      const dueDateObj = new Date(dueDate);
      if (dueDateObj > new Date()) {
        data.push({
          date: format(dueDateObj, "MMM dd"),
          fullDate: format(dueDateObj, "PPP"),
          target: 100,
          rawDate: dueDateObj,
          isTarget: true
        });
      }
      
      // Calculate statistics
      const progressValues = sortedHistory.map(entry => entry.progressPercentage);
      const avgProgress = progressValues.reduce((sum, val) => sum + val, 0) / progressValues.length;
      
      // Calculate velocity (progress per day)
      let velocity = 0;
      if (sortedHistory.length > 1) {
        const firstEntry = sortedHistory[0];
        const lastEntry = sortedHistory[sortedHistory.length - 1];
        const daysDiff = (new Date(lastEntry.date) - new Date(firstEntry.date)) / (1000 * 60 * 60 * 24);
        const progressDiff = lastEntry.progressPercentage - firstEntry.progressPercentage;
        velocity = daysDiff > 0 ? progressDiff / daysDiff : 0;
      }
      
      // Estimate completion date
      let estimatedCompletion = null;
      if (velocity > 0) {
        const currentProgress = progressValues[progressValues.length - 1];
        const remainingProgress = 100 - currentProgress;
        const daysToComplete = remainingProgress / velocity;
        estimatedCompletion = new Date(Date.now() + daysToComplete * 24 * 60 * 60 * 1000);
      }
      
      setStats({
        averageProgress: Math.round(avgProgress),
        progressVelocity: Math.round(velocity * 10) / 10,
        estimatedCompletion,
        totalEntries: sortedHistory.length
      });
      
      setChartData(data);
    }
  }, [history, dueDate]);

  if (chartData.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-blue-900 border border-blue-700 rounded-lg p-6">
          <Activity className="h-8 w-8 text-blue-300 mx-auto mb-2" />
          <p className="text-blue-200/70">No progress data available yet</p>
          <p className="text-sm text-blue-200/50 mt-1">Start tracking your progress to see visualizations</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-blue-300 rounded-lg p-3 shadow-lg">
          <p className="text-blue-100 font-medium mb-2">{data.fullDate}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-white">
                {entry.name}: {entry.value}{entry.name === 'Progress' || entry.name === 'Target' ? '%' : ''}
              </span>
            </div>
          ))}
          {data.progressChange !== undefined && data.progressChange !== 0 && (
            <p className={`text-xs mt-2 ${
              data.progressChange > 0 ? 'text-green-300' : 'text-red-300'
            }`}>
              {data.progressChange > 0 ? '+' : ''}{data.progressChange}% change
            </p>
          )}
          {data.notes && (
            <p className="text-xs text-blue-200/70 mt-2 italic">
              "{data.notes.slice(0, 50)}{data.notes.length > 50 ? '...' : ''}"
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (chartType) {
      case 'area':
        return (
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" opacity={0.2} />
            <XAxis dataKey="date" stroke="#93c5fd" fontSize={12} tickLine={false} />
            <YAxis stroke="#93c5fd" fontSize={12} tickLine={false} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="progress"
              stroke="#60a5fa"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#progressGradient)"
              dot={{ r: 5, fill: "#3b82f6", stroke: "#60a5fa", strokeWidth: 2 }}
              activeDot={{ r: 8, fill: "#60a5fa", stroke: "#93c5fd", strokeWidth: 2 }}
            />
            {chartData.some(item => item.target) && (
              <Line
                type="monotone"
                dataKey="target"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4, fill: "#10b981" }}
              />
            )}
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" opacity={0.2} />
            <XAxis dataKey="date" stroke="#93c5fd" fontSize={12} tickLine={false} />
            <YAxis stroke="#93c5fd" fontSize={12} tickLine={false} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="progress"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              opacity={0.8}
            />
          </BarChart>
        );
      default:
        return (
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" opacity={0.2} />
            <XAxis dataKey="date" stroke="#93c5fd" fontSize={12} tickLine={false} />
            <YAxis stroke="#93c5fd" fontSize={12} tickLine={false} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="progress"
              stroke="#60a5fa"
              strokeWidth={3}
              dot={{ r: 5, strokeWidth: 2, fill: "#3b82f6", stroke: "#60a5fa" }}
              activeDot={{ r: 8, strokeWidth: 2, fill: "#60a5fa", stroke: "#93c5fd" }}
            />
            {chartData.some(item => item.target) && (
              <Line
                type="monotone"
                dataKey="target"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4, strokeWidth: 2, fill: "#10b981", stroke: "#34d399" }}
              />
            )}
          </LineChart>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Chart Type Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-300" />
          <span className="text-sm font-medium text-blue-100">Visualization</span>
        </div>
        <div className="flex gap-1">
          <Button
            variant={chartType === 'line' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('line')}
            className={`h-8 px-2 ${
              chartType === 'line' 
                ? 'bg-blue-500 text-white' 
                : 'bg-slate-800 border-blue-600 text-blue-200 hover:bg-blue-700'
            }`}
          >
            <TrendingUp className="h-3 w-3" />
          </Button>
          <Button
            variant={chartType === 'area' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('area')}
            className={`h-8 px-2 ${
              chartType === 'area' 
                ? 'bg-blue-500 text-white' 
                : 'bg-slate-800 border-blue-600 text-blue-200 hover:bg-blue-700'
            }`}
          >
            <Activity className="h-3 w-3" />
          </Button>
          <Button
            variant={chartType === 'bar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('bar')}
            className={`h-8 px-2 ${
              chartType === 'bar' 
                ? 'bg-blue-500 text-white' 
                : 'bg-slate-800 border-blue-600 text-blue-200 hover:bg-blue-700'
            }`}
          >
            <BarChart3 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Progress Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-blue-900 border border-blue-700 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-blue-100">{stats.averageProgress}%</div>
          <div className="text-xs text-blue-200/70">Avg Progress</div>
        </div>
        <div className="bg-green-900 border border-green-700 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-green-100">{stats.progressVelocity}%</div>
          <div className="text-xs text-green-200/70">Daily Rate</div>
        </div>
        <div className="bg-purple-900 border border-purple-700 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-purple-100">{stats.totalEntries}</div>
          <div className="text-xs text-purple-200/70">Updates</div>
        </div>
        <div className="bg-amber-900 border border-amber-700 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-amber-100">
            {stats.estimatedCompletion ? format(stats.estimatedCompletion, 'MMM dd') : 'N/A'}
          </div>
          <div className="text-xs text-amber-200/70">Est. Complete</div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full bg-slate-900 border border-slate-700 rounded-lg p-3">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Progress Trend Indicator */}
      {chartData.length > 1 && (
        <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-cyan-300" />
              <span className="text-sm font-medium text-cyan-100">Progress Trend</span>
            </div>
            <div className={`text-sm font-medium ${
              stats.progressVelocity > 0 ? 'text-green-300' : 
              stats.progressVelocity < 0 ? 'text-red-300' : 'text-gray-300'
            }`}>
              {stats.progressVelocity > 0 ? '📈 Improving' : 
               stats.progressVelocity < 0 ? '📉 Declining' : '➡️ Stable'}
            </div>
          </div>
          <Progress 
            value={Math.min(100, Math.max(0, stats.progressVelocity * 10 + 50))} 
            className="mt-2 h-2 bg-cyan-800 [&>div]:bg-gradient-to-r [&>div]:from-cyan-400 [&>div]:to-blue-400" 
          />
        </div>
      )}
    </div>
  );
}
