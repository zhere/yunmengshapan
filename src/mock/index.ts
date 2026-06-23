// 模拟数据统一导出
export { devices, deviceStats } from './devices';
export type { Device, DeviceStatus, DeviceType, DeviceDepartment, DeviceStats } from './devices';

export { warnings, warningStats } from './warnings';
export type { Warning, WarningType, WarningLevel, WarningStatus, WarningStats } from './warnings';

export { urbanCases, urbanStats } from './urbanCases';
export type { UrbanCase, UrbanCaseType, UrbanCaseSource, UrbanCaseStatus, UrbanStats } from './urbanCases';

export { addresses, addressStats } from './addresses';
export type { Address, AddressStatus, AddressStats } from './addresses';

export { population, houses, units, flowPopulation, collectionStats } from './collection';
export type { Population, House, PropertyType, Unit, UnitType, FlowPopulation, ResidenceType, CollectionStats } from './collection';

export { grids, staff, events, gridStats } from './grid';
export type { Grid, GridStaff, GridEvent, GridEventType, GridEventStatus, GridStats } from './grid';

export { dashboardStats, reportData, warningTrend, departmentDisposalRate, aiAnalysisStats, urbanCaseStats as statsUrbanCaseStats, collectionOverview, gridOverview } from './stats';

export { analysisTasks, analysisResults } from './analysis';
export type { AnalysisTask, AnalysisType, AnalysisStatus, AnalysisResult } from './analysis';

export { plans, resources, emergencyEvents } from './emergency';
export type { EmergencyPlan, EmergencyPlanType, EmergencyPlanLevel, EmergencyResource, EmergencyResourceType, EmergencyResourceStatus, EmergencyEvent, EmergencyEventStatus } from './emergency';
