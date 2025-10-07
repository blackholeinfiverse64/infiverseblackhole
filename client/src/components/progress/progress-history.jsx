import { format } from "date-fns";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Calendar,
  MessageSquare,
  Award,
  AlertCircle,
  Zap,
  Target,
  Clock
} from 'lucide-react';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';

export function ProgressHistory({ history }) {
  // Sort history by date (newest first)
  const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calculate progress changes
  const historyWithChanges = sortedHistory.map((entry, index) => {
    const nextEntry = sortedHistory[index + 1]; // Next entry (older)
    const progressChange = nextEntry ? entry.progressPercentage - nextEntry.progressPercentage : 0;
    return { ...entry, progressChange };
  });

  const getProgressChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="h-3 w-3 text-green-400" />;
    if (change < 0) return <TrendingDown className="h-3 w-3 text-red-400" />;
    return <Minus className="h-3 w-3 text-gray-400" />;
  };

  const getProgressChangeColor = (change) => {
    if (change > 0) return 'text-green-300';
    if (change < 0) return 'text-red-300';
    return 'text-gray-300';
  };

  const getProgressLevel = (progress) => {
    if (progress >= 90) return { label: 'Excellent', color: 'emerald', icon: '🚀' };
    if (progress >= 75) return { label: 'Great', color: 'green', icon: '⭐' };
    if (progress >= 50) return { label: 'Good', color: 'blue', icon: '👍' };
    if (progress >= 25) return { label: 'Fair', color: 'amber', icon: '⚡' };
    return { label: 'Starting', color: 'purple', icon: '🎯' };
  };

  return (
    <div className="space-y-4">
      {sortedHistory.length === 0 ? (
        <div className="text-center py-8">
          <div className="bg-indigo-900 border border-indigo-700 rounded-lg p-6">
            <Clock className="h-8 w-8 text-indigo-300 mx-auto mb-2" />
            <p className="text-indigo-200/70">No progress history available</p>
            <p className="text-sm text-indigo-200/50 mt-1">Your progress updates will appear here</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="bg-slate-900 border border-blue-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-blue-300" />
              <span className="text-sm font-medium text-blue-100">Progress Summary</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-white">{sortedHistory.length}</div>
                <div className="text-xs text-blue-200/70">Total Updates</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">
                  {Math.round(sortedHistory.reduce((sum, entry) => sum + entry.progressPercentage, 0) / sortedHistory.length)}%
                </div>
                <div className="text-xs text-blue-200/70">Avg Progress</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">
                  {sortedHistory[0].progressPercentage}%
                </div>
                <div className="text-xs text-blue-200/70">Current</div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 to-cyan-400 opacity-50" />
            <div className="space-y-6">
              {historyWithChanges.map((entry, index) => {
                const level = getProgressLevel(entry.progressPercentage);
                const isLatest = index === 0;
                
                return (
                  <div key={entry._id || index} className="relative pl-16">
                    {/* Timeline Node */}
                    <div className={`absolute left-0 top-0 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      isLatest 
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 border-blue-300 shadow-lg shadow-blue-500/25 animate-pulse' 
                        : 'bg-slate-800 border-blue-600'
                    }`}>
                      <div className="relative">
                        {getProgressIcon(entry.progressPercentage)}
                        {isLatest && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
                        )}
                      </div>
                    </div>

                    {/* Progress Card */}
                    <div className={`bg-slate-900 border rounded-lg p-4 transition-all duration-300 hover:bg-slate-800 ${
                      isLatest ? 'border-blue-600 shadow-lg shadow-blue-500/10' : 'border-slate-700'
                    }`}>
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-white">{entry.progressPercentage}%</span>
                            {entry.progressChange !== 0 && (
                              <div className={`flex items-center gap-1 text-xs ${getProgressChangeColor(entry.progressChange)}`}>
                                {getProgressChangeIcon(entry.progressChange)}
                                <span>{entry.progressChange > 0 ? '+' : ''}{entry.progressChange}%</span>
                              </div>
                            )}
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`${
                              level.color === 'emerald' ? 'border-emerald-300/30 text-emerald-300 bg-emerald-400/10' :
                              level.color === 'green' ? 'border-green-300/30 text-green-300 bg-green-400/10' :
                              level.color === 'blue' ? 'border-blue-300/30 text-blue-300 bg-blue-400/10' :
                              level.color === 'amber' ? 'border-amber-300/30 text-amber-300 bg-amber-400/10' :
                              'border-purple-300/30 text-purple-300 bg-purple-400/10'
                            }`}
                          >
                            {level.icon} {level.label}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-blue-200/70 mt-2 sm:mt-0">
                          <Calendar className="h-3 w-3" />
                          <time>{format(new Date(entry.date), "PPP 'at' p")}</time>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <Progress 
                          value={entry.progressPercentage} 
                          className={`h-2 bg-slate-800/30 [&>div]:transition-all [&>div]:duration-1000 ${
                            level.color === 'emerald' ? '[&>div]:bg-gradient-to-r [&>div]:from-emerald-400 [&>div]:to-green-500' :
                            level.color === 'green' ? '[&>div]:bg-gradient-to-r [&>div]:from-green-400 [&>div]:to-emerald-500' :
                            level.color === 'blue' ? '[&>div]:bg-gradient-to-r [&>div]:from-blue-400 [&>div]:to-cyan-500' :
                            level.color === 'amber' ? '[&>div]:bg-gradient-to-r [&>div]:from-amber-400 [&>div]:to-orange-500' :
                            '[&>div]:bg-gradient-to-r [&>div]:from-purple-400 [&>div]:to-indigo-500'
                          }`}
                        />
                      </div>
                      
                      {/* Content Sections */}
                      {entry.notes && (
                        <div className="mb-3 bg-green-900 border border-green-700 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="h-3.5 w-3.5 text-green-300" />
                            <h5 className="text-sm font-medium text-green-100">Progress Notes</h5>
                          </div>
                          <p className="text-sm text-green-200/80 leading-relaxed">{entry.notes}</p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {entry.blockers && (
                          <div className="bg-orange-900 border border-orange-700 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="h-3.5 w-3.5 text-orange-300" />
                              <h5 className="text-sm font-medium text-orange-100">Blockers</h5>
                            </div>
                            <p className="text-sm text-orange-200/80 leading-relaxed">{entry.blockers}</p>
                          </div>
                        )}
                        
                        {entry.achievements && (
                          <div className="bg-purple-900 border border-purple-700 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Award className="h-3.5 w-3.5 text-purple-300" />
                              <h5 className="text-sm font-medium text-purple-100">Achievements</h5>
                            </div>
                            <p className="text-sm text-purple-200/80 leading-relaxed">{entry.achievements}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getProgressIcon(progress) {
  if (progress === 100) {
    return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
  } else if (progress >= 75) {
    return <TrendingUp className="h-5 w-5 text-green-400" />;
  } else if (progress >= 50) {
    return <Zap className="h-5 w-5 text-blue-400" />;
  } else if (progress >= 25) {
    return <Info className="h-5 w-5 text-amber-400" />;
  } else {
    return <Target className="h-5 w-5 text-purple-400" />;
  }
}
