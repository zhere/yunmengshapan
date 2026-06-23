// 仪表盘统计数据 - 云梦县综合业务分析系统

// ==================== 设备概况 ====================
export const deviceStats = {
  total: 2156,
  online: 1987,
  offline: 134,
  maintenance: 35,
  onlineRate: 92.2,
  byType: [
    { type: '球机', count: 856 },
    { type: '枪机', count: 923 },
    { type: '半球', count: 377 },
  ],
  byDepartment: [
    { department: '公安局', count: 876, online: 812 },
    { department: '城管局', count: 432, online: 398 },
    { department: '交通局', count: 367, online: 341 },
    { department: '环保局', count: 198, online: 182 },
    { department: '教育局', count: 156, online: 148 },
    { department: '社区', count: 127, online: 106 },
  ],
};

// ==================== 预警趋势 ====================
export const warningTrend = {
  trend7Days: [
    { date: '6/17', count: 32, high: 5, medium: 14, low: 13 },
    { date: '6/18', count: 28, high: 3, medium: 12, low: 13 },
    { date: '6/19', count: 35, high: 6, medium: 15, low: 14 },
    { date: '6/20', count: 41, high: 8, medium: 18, low: 15 },
    { date: '6/21', count: 38, high: 7, medium: 16, low: 15 },
    { date: '6/22', count: 29, high: 4, medium: 13, low: 12 },
    { date: '6/23', count: 38, high: 6, medium: 17, low: 15 },
  ],
  trend30Days: Array.from({ length: 30 }, (_, i) => {
    const d = new Date(2026, 5, 23 - 29 + i);
    const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
    const count = Math.floor(Math.random() * 20) + 25;
    return {
      date: dateStr,
      count,
      high: Math.floor(count * 0.15),
      medium: Math.floor(count * 0.4),
      low: count - Math.floor(count * 0.15) - Math.floor(count * 0.4),
    };
  }),
};

// ==================== 部门处置率 ====================
export const departmentDisposalRate = [
  { department: '公安局', total: 312, disposed: 298, rate: 95.5 },
  { department: '城管局', total: 423, disposed: 389, rate: 92.0 },
  { department: '交通局', total: 267, disposed: 245, rate: 91.8 },
  { department: '环保局', total: 156, disposed: 138, rate: 88.5 },
  { department: '教育局', total: 78, disposed: 72, rate: 92.3 },
  { department: '社区', total: 50, disposed: 43, rate: 86.0 },
];

// ==================== AI分析概况 ====================
export const aiAnalysisStats = {
  totalTasks: 48,
  runningTasks: 12,
  todayEvents: 156,
  byType: [
    { type: '城市管理', count: 45, percentage: 28.8 },
    { type: '公共安全', count: 38, percentage: 24.4 },
    { type: '交通出行', count: 32, percentage: 20.5 },
    { type: '环境保护', count: 23, percentage: 14.7 },
    { type: '政务服务', count: 18, percentage: 11.5 },
  ],
  confidence: {
    average: 87.6,
    high: 92.3,
    low: 76.5,
  },
};

// ==================== 城管案件概况 ====================
export const urbanCaseStats = {
  todayCount: 12,
  pendingCount: 18,
  processingCount: 34,
  closedCount: 789,
  total: 856,
  closeRate: 92.2,
  byType: [
    { type: '占道经营', count: 267 },
    { type: '违规停车', count: 213 },
    { type: '垃圾堆积', count: 178 },
    { type: '违规广告', count: 112 },
    { type: '井盖缺失', count: 86 },
  ],
};

// ==================== 一标三实概况 ====================
export const collectionOverview = {
  addressTotal: 32567,
  populationTotal: 523467,
  houseTotal: 186534,
  unitTotal: 8923,
  flowPopulation: 35844,
  recentUpdate: '2026-06-23',
  dataQuality: 96.8,
};

// ==================== 网格概况 ====================
export const gridOverview = {
  totalGrids: 15,
  onDutyStaff: 17,
  totalStaff: 20,
  todayEvents: 24,
  totalEvents: 1567,
  processedRate: 89.3,
};

// ==================== 仪表盘汇总 ====================
export const dashboardStats = {
  deviceStats,
  warningTrend,
  departmentDisposalRate,
  aiAnalysisStats,
  urbanCaseStats,
  collectionOverview,
  gridOverview,
  // 实时事件滚动列表
  recentEvents: [
    { id: '1', type: '城市管理', subType: '占道经营', level: '中', location: '城关镇曲阳路58号', time: '2026-06-23 14:32:15' },
    { id: '2', type: '公共安全', subType: '人员聚集', level: '高', location: '云梦县商业步行街', time: '2026-06-23 14:28:43' },
    { id: '3', type: '交通出行', subType: '交通拥堵', level: '中', location: '城关镇楚王城大道35号', time: '2026-06-23 14:25:17' },
    { id: '4', type: '环境保护', subType: '烟雾排放', level: '高', location: '云梦县工业园区', time: '2026-06-23 14:20:56' },
    { id: '5', type: '城市管理', subType: '违规停车', level: '低', location: '城关镇梦泽大道88号', time: '2026-06-23 14:15:32' },
    { id: '6', type: '公共安全', subType: '异常徘徊', level: '中', location: '云梦县人民医院门口', time: '2026-06-23 14:10:08' },
    { id: '7', type: '城市管理', subType: '垃圾堆积', level: '低', location: '城关镇南环路45号', time: '2026-06-23 14:05:44' },
    { id: '8', type: '交通出行', subType: '违停占道', level: '中', location: '城关镇建设路102号', time: '2026-06-23 14:01:21' },
    { id: '9', type: '政务服务', subType: '排队过长', level: '低', location: '云梦县政务服务中心', time: '2026-06-23 13:55:09' },
    { id: '10', type: '环境保护', subType: '噪音扰民', level: '中', location: '城关镇文化路63号', time: '2026-06-23 13:50:37' },
  ],
};

// ==================== 报表数据 ====================
export const reportData = {
  // 月度报告
  monthlyReports: [
    { month: '2026-01', events: 892, disposed: 823, rate: 92.3, cases: 67, closed: 58 },
    { month: '2026-02', events: 756, disposed: 698, rate: 92.3, cases: 54, closed: 47 },
    { month: '2026-03', events: 934, disposed: 867, rate: 92.8, cases: 72, closed: 65 },
    { month: '2026-04', events: 1023, disposed: 951, rate: 93.0, cases: 78, closed: 71 },
    { month: '2026-05', events: 1156, disposed: 1072, rate: 92.7, cases: 85, closed: 78 },
    { month: '2026-06', events: 1286, disposed: 1185, rate: 92.2, cases: 92, closed: 82 },
  ],
  // 周报数据
  weeklyData: {
    weekStart: '2026-06-17',
    weekEnd: '2026-06-23',
    events: 241,
    disposed: 223,
    rate: 92.5,
    cases: 18,
    closed: 15,
    aiDetections: 156,
    gridEvents: 24,
    staffOnDuty: 17,
  },
  // 各乡镇统计
  townshipStats: [
    { name: '城关镇', population: 125634, area: 45.2, events: 456, cases: 312, grids: 5 },
    { name: '义堂镇', population: 45678, area: 67.8, events: 123, cases: 67, grids: 1 },
    { name: '曾店镇', population: 38912, area: 58.3, events: 98, cases: 45, grids: 1 },
    { name: '吴铺镇', population: 32456, area: 52.1, events: 87, cases: 38, grids: 1 },
    { name: '伍洛镇', population: 28765, area: 43.7, events: 76, cases: 32, grids: 1 },
    { name: '下辛店镇', population: 31234, area: 56.9, events: 89, cases: 41, grids: 1 },
    { name: '道桥镇', population: 25678, area: 48.5, events: 67, cases: 28, grids: 1 },
    { name: '隔蒲潭镇', population: 23456, area: 41.2, events: 56, cases: 23, grids: 1 },
    { name: '胡金店镇', population: 21345, area: 38.7, events: 48, cases: 19, grids: 1 },
    { name: '倒店乡', population: 18765, area: 35.4, events: 34, cases: 15, grids: 1 },
    { name: '沙河乡', population: 16543, area: 32.1, events: 28, cases: 12, grids: 0 },
    { name: '清明河乡', population: 14501, area: 29.8, events: 24, cases: 10, grids: 0 },
  ],
  // 季度对比
  quarterlyComparison: [
    { quarter: '2025Q4', events: 2678, disposed: 2456, rate: 91.7 },
    { quarter: '2026Q1', events: 2582, disposed: 2388, rate: 92.5 },
    { quarter: '2026Q2', events: 3465, disposed: 3208, rate: 92.6 },
  ],
};
