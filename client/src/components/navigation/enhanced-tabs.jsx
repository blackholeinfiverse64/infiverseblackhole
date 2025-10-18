import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useTabs } from '../../hooks/use-tabs';
import { Loader2 } from 'lucide-react';

/**
 * Enhanced Tabs Wrapper Component
 * Prevents screen freezing and stuck states when switching tabs
 * 
 * Usage:
 * <EnhancedTabs
 *   defaultTab="overview"
 *   tabs={[
 *     { value: 'overview', label: 'Overview', icon: <Icon />, content: <Content /> },
 *     { value: 'analytics', label: 'Analytics', icon: <Icon />, content: <Content /> }
 *   ]}
 * />
 */
export function EnhancedTabs({ 
  defaultTab, 
  tabs = [], 
  className = "",
  tabsListClassName = "",
  onTabChange = null,
  debounceMs = 200
}) {
  const { activeTab, setActiveTab, isTransitioning } = useTabs(defaultTab, debounceMs);

  const handleTabChange = React.useCallback((value) => {
    setActiveTab(value);
    if (onTabChange) {
      onTabChange(value);
    }
  }, [setActiveTab, onTabChange]);

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={handleTabChange} 
      className={className}
    >
      <TabsList className={tabsListClassName}>
        {tabs.map((tab) => (
          <TabsTrigger 
            key={tab.value} 
            value={tab.value}
            disabled={isTransitioning}
            className="flex items-center gap-2"
          >
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent 
          key={tab.value} 
          value={tab.value}
          className="relative min-h-[200px]"
        >
          {isTransitioning && activeTab === tab.value ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : null}
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

/**
 * Example usage:
 * 
 * import { EnhancedTabs } from '@/components/navigation/enhanced-tabs';
 * import { Activity, Users, BarChart3 } from 'lucide-react';
 * 
 * function MyDashboard() {
 *   const tabs = [
 *     {
 *       value: 'overview',
 *       label: 'Overview',
 *       icon: <Activity className="w-4 h-4" />,
 *       content: <OverviewContent />
 *     },
 *     {
 *       value: 'users',
 *       label: 'Users',
 *       icon: <Users className="w-4 h-4" />,
 *       content: <UsersContent />
 *     },
 *     {
 *       value: 'analytics',
 *       label: 'Analytics',
 *       icon: <BarChart3 className="w-4 h-4" />,
 *       content: <AnalyticsContent />
 *     }
 *   ];
 * 
 *   return (
 *     <EnhancedTabs
 *       defaultTab="overview"
 *       tabs={tabs}
 *       className="space-y-6"
 *       tabsListClassName="grid w-full grid-cols-3"
 *       onTabChange={(tab) => console.log('Tab changed to:', tab)}
 *     />
 *   );
 * }
 */
