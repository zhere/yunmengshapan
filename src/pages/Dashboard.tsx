import DashboardHeader from './Dashboard/DashboardHeader';
import DeviceOverview from './Dashboard/DeviceOverview';
import AIAnalysisStats from './Dashboard/AIAnalysisStats';
import CollectionOverview from './Dashboard/CollectionOverview';
import MapOverview from './Dashboard/MapOverview';
import UrbanCaseOverview from './Dashboard/UrbanCaseOverview';
import RealtimeEvents from './Dashboard/RealtimeEvents';
import WarningTrend from './Dashboard/WarningTrend';
import DepartmentDisposalRate from './Dashboard/DepartmentDisposalRate';
import GridOverview from './Dashboard/GridOverview';

export default function Dashboard() {
  return (
    <div className="flex flex-col h-full gap-3 overflow-hidden">
      {/* Top header bar */}
      <DashboardHeader />

      {/* Main grid: 3 columns */}
      <div className="grid grid-cols-12 gap-3 flex-1 min-h-0 overflow-hidden">
        {/* Left column - 25% */}
        <div className="col-span-3 flex flex-col gap-3 min-h-0 overflow-hidden">
          <DeviceOverview />
          <AIAnalysisStats />
          <CollectionOverview />
        </div>

        {/* Center column - 50% */}
        <div className="col-span-6 flex flex-col gap-3 min-h-0 overflow-hidden">
          <MapOverview />
          <UrbanCaseOverview />
          <RealtimeEvents />
        </div>

        {/* Right column - 25% */}
        <div className="col-span-3 flex flex-col gap-3 min-h-0 overflow-hidden">
          <WarningTrend />
          <DepartmentDisposalRate />
          <GridOverview />
        </div>
      </div>
    </div>
  );
}
