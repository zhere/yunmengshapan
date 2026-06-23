import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import VideoPage from '@/pages/Video';
import VideoPreviewRoute from '@/pages/Video/VideoPreviewRoute';
import VideoPlaybackRoute from '@/pages/Video/VideoPlaybackRoute';
import VideoMap from '@/pages/Video/VideoMap';
import AnalysisOverview from '@/pages/Analysis';
import AnalysisTasks from '@/pages/Analysis/AnalysisTasks';
import AnalysisRealtime from '@/pages/Analysis/AnalysisRealtime';
import AnalysisResults from '@/pages/Analysis/AnalysisResults';
import WarningCenter from '@/pages/Warning';
import WarningRulesPage from '@/pages/Warning/WarningRules';
import WarningStatsPage from '@/pages/Warning/WarningStats';
import UrbanOverview from '@/pages/Urban';
import UrbanCases from '@/pages/Urban/UrbanCases';
import UrbanPatrol from '@/pages/Urban/UrbanPatrol';
import UrbanStats from '@/pages/Urban/UrbanStats';
import EmergencyOverview from '@/pages/Emergency';
import EmergencyMap from '@/pages/Emergency/EmergencyMap';
import EmergencyPlans from '@/pages/Emergency/EmergencyPlans';
import EmergencyReview from '@/pages/Emergency/EmergencyReview';
import AddressOverview from '@/pages/Address';
import AddressStandard from '@/pages/Address/AddressStandard';
import AddressPlate from '@/pages/Address/AddressPlate';
import AddressQrcode from '@/pages/Address/AddressQrcode';
import CollectionOverview from '@/pages/Collection';
import CollectionTasks from '@/pages/Collection/CollectionTasks';
import CollectionPopulation from '@/pages/Collection/CollectionPopulation';
import CollectionHouse from '@/pages/Collection/CollectionHouse';
import CollectionUnit from '@/pages/Collection/CollectionUnit';
import CollectionFlow from '@/pages/Collection/CollectionFlow';
import CollectionQuality from '@/pages/Collection/CollectionQuality';
import CollectionRelation from '@/pages/Collection/CollectionRelation';
import GridOverview from '@/pages/Grid';
import GridDivision from '@/pages/Grid/GridDivision';
import GridStaff from '@/pages/Grid/GridStaff';
import GridTasks from '@/pages/Grid/GridTasks';
import GridEvents from '@/pages/Grid/GridEvents';
import GridPerformance from '@/pages/Grid/GridPerformance';
import GridMobile from '@/pages/Grid/GridMobile';
import ReportOverview from '@/pages/Report';
import ReportList from '@/pages/Report/ReportList';
import ReportCustom from '@/pages/Report/ReportCustom';
import ReportDrill from '@/pages/Report/ReportDrill';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/video/preview/:id" element={<VideoPreviewRoute />} />
          <Route path="/video/playback/:id" element={<VideoPlaybackRoute />} />
          <Route path="/video/map" element={<VideoMap />} />
          <Route path="/analysis" element={<AnalysisOverview />} />
          <Route path="/analysis/tasks" element={<AnalysisTasks />} />
          <Route path="/analysis/realtime" element={<AnalysisRealtime />} />
          <Route path="/analysis/results" element={<AnalysisResults />} />
          <Route path="/warning" element={<WarningCenter />} />
          <Route path="/warning/rules" element={<WarningRulesPage />} />
          <Route path="/warning/stats" element={<WarningStatsPage />} />
          <Route path="/urban" element={<UrbanOverview />} />
          <Route path="/urban/cases" element={<UrbanCases />} />
          <Route path="/urban/patrol" element={<UrbanPatrol />} />
          <Route path="/urban/stats" element={<UrbanStats />} />
          <Route path="/emergency" element={<EmergencyOverview />} />
          <Route path="/emergency/map" element={<EmergencyMap />} />
          <Route path="/emergency/plans" element={<EmergencyPlans />} />
          <Route path="/emergency/review" element={<EmergencyReview />} />
          <Route path="/address" element={<AddressOverview />} />
          <Route path="/address/standard" element={<AddressStandard />} />
          <Route path="/address/plate" element={<AddressPlate />} />
          <Route path="/address/qrcode" element={<AddressQrcode />} />
          <Route path="/collection" element={<CollectionOverview />} />
          <Route path="/collection/tasks" element={<CollectionTasks />} />
          <Route path="/collection/population" element={<CollectionPopulation />} />
          <Route path="/collection/house" element={<CollectionHouse />} />
          <Route path="/collection/unit" element={<CollectionUnit />} />
          <Route path="/collection/flow" element={<CollectionFlow />} />
          <Route path="/collection/quality" element={<CollectionQuality />} />
          <Route path="/collection/relation" element={<CollectionRelation />} />
          <Route path="/grid" element={<GridOverview />} />
          <Route path="/grid/division" element={<GridDivision />} />
          <Route path="/grid/staff" element={<GridStaff />} />
          <Route path="/grid/tasks" element={<GridTasks />} />
          <Route path="/grid/events" element={<GridEvents />} />
          <Route path="/grid/performance" element={<GridPerformance />} />
          <Route path="/grid/mobile" element={<GridMobile />} />
          <Route path="/report" element={<ReportOverview />} />
          <Route path="/report/list" element={<ReportList />} />
          <Route path="/report/custom" element={<ReportCustom />} />
          <Route path="/report/drill" element={<ReportDrill />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
