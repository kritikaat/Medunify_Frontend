import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { HealthScoreCard } from '@/components/dashboard/HealthScoreCard';
import { TimelinePreview } from '@/components/dashboard/TimelinePreview';
import { RecentReports } from '@/components/dashboard/RecentReports';
import { QuickActions } from '@/components/dashboard/QuickActions';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar />
      
      <div className="ml-64">
        <DashboardHeader />
        
        <main className="p-6">
          <div className="grid gap-6">
            {/* Health Score */}
            <HealthScoreCard score={72} />
            
            {/* Timeline & Quick Actions */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TimelinePreview />
              </div>
              <div>
                <QuickActions />
              </div>
            </div>
            
            {/* Recent Reports */}
            <RecentReports />
          </div>
        </main>
      </div>
    </div>
  );
}
