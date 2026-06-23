// 行为分析数据 - 云梦县AI分析任务与结果模拟数据

export type AnalysisType = '城市管理' | '公共安全' | '交通出行' | '环境保护' | '政务服务';
export type AnalysisStatus = '运行中' | '已暂停' | '已完成';

export interface AnalysisTask {
  id: string;
  name: string;
  deviceName: string;
  analysisType: AnalysisType;
  status: AnalysisStatus;
  createTime: string;
  schedule: string;
  confidence: number;
  alertRule: string;
}

export interface AnalysisResult {
  id: string;
  taskId: string;
  taskName: string;
  type: AnalysisType;
  subType: string;
  confidence: number;
  captureTime: string;
  deviceName: string;
  location: string;
  imageUrl: string;
  description: string;
}

// ==================== 数据生成 ====================

const deviceNames = [
  '公安局球机001', '公安局枪机003', '公安局球机005',
  '城管局枪机007', '城管局球机009', '城管局半球011',
  '交通局球机013', '交通局枪机015', '交通局半球017',
  '环保局球机019', '环保局半球021',
  '教育局球机023', '社区球机025',
];

const analysisTypes: AnalysisType[] = ['城市管理', '公共安全', '交通出行', '环境保护', '政务服务'];
const analysisStatuses: AnalysisStatus[] = ['运行中', '已暂停', '已完成'];

const schedules = [
  '全天候运行', '工作日 08:00-20:00', '全天候运行', '每日 06:00-22:00',
  '工作日 07:00-19:00', '全天候运行', '节假日全天', '每日 08:00-18:00',
];

const alertRules = [
  '置信度≥85%触发告警', '置信度≥80%触发告警', '置信度≥90%触发告警',
  '置信度≥75%触发告警', '置信度≥85%触发告警，持续3秒', '置信度≥80%触发告警，持续5秒',
];

const subTypeMap: Record<AnalysisType, string[]> = {
  '城市管理': ['占道经营', '违规停车', '垃圾堆积', '违规广告', '井盖缺失'],
  '公共安全': ['人员聚集', '异常徘徊', '打架斗殴', '攀爬围栏', '烟火检测'],
  '交通出行': ['交通拥堵', '车辆逆行', '行人闯红灯', '违规变道', '违停占道'],
  '环境保护': ['烟雾排放', '水质异常', '扬尘污染', '污水排放'],
  '政务服务': ['排队过长', '设施损坏'],
};

const locations = [
  '城关镇曲阳路58号', '城关镇建设路102号', '城关镇楚王城大道35号',
  '城关镇珍珠坡路27号', '城关镇梦泽大道88号', '城关镇西大路16号',
  '城关镇南环路45号', '云梦县商业步行街', '云梦县农贸市场',
  '云梦县政务服务中心', '云梦县人民医院门口', '云梦县第一中学门口',
  '云梦东站广场', '云梦县汽车客运站', '云梦县工业园区',
];

const descriptions: Record<string, string[]> = {
  '占道经营': ['检测到商铺占道经营行为', '发现流动摊贩占道经营'],
  '违规停车': ['检测到机动车违规停放', '发现非机动车乱停乱放'],
  '垃圾堆积': ['检测到垃圾堆积未清运', '发现垃圾桶满溢'],
  '人员聚集': ['检测到人员异常聚集', '人群密度超过阈值'],
  '异常徘徊': ['检测到可疑人员长时间徘徊'],
  '交通拥堵': ['检测到路段交通拥堵', '车辆排队长度超过阈值'],
  '烟雾排放': ['检测到异常烟雾排放'],
  '排队过长': ['检测到办事群众排队过长'],
};

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 分析任务数据
export const analysisTasks: AnalysisTask[] = [
  { id: 'AT001', name: '城关镇占道经营监测', deviceName: '城管局枪机007', analysisType: '城市管理', status: '运行中', createTime: '2026-06-20 08:00:00', schedule: '全天候运行', confidence: 85, alertRule: '置信度≥85%触发告警' },
  { id: 'AT002', name: '商业街人员聚集监测', deviceName: '公安局球机001', analysisType: '公共安全', status: '运行中', createTime: '2026-06-19 10:30:00', schedule: '全天候运行', confidence: 80, alertRule: '置信度≥80%触发告警' },
  { id: 'AT003', name: '楚王城大道交通监测', deviceName: '交通局球机013', analysisType: '交通出行', status: '运行中', createTime: '2026-06-18 09:15:00', schedule: '工作日 08:00-20:00', confidence: 90, alertRule: '置信度≥90%触发告警' },
  { id: 'AT004', name: '工业园区烟雾监测', deviceName: '环保局球机019', analysisType: '环境保护', status: '运行中', createTime: '2026-06-17 14:00:00', schedule: '全天候运行', confidence: 85, alertRule: '置信度≥85%触发告警，持续3秒' },
  { id: 'AT005', name: '政务中心排队监测', deviceName: '社区球机025', analysisType: '政务服务', status: '运行中', createTime: '2026-06-16 08:00:00', schedule: '工作日 08:00-18:00', confidence: 80, alertRule: '置信度≥80%触发告警' },
  { id: 'AT006', name: '梦泽大道违停监测', deviceName: '城管局球机009', analysisType: '城市管理', status: '运行中', createTime: '2026-06-15 07:30:00', schedule: '每日 06:00-22:00', confidence: 85, alertRule: '置信度≥85%触发告警' },
  { id: 'AT007', name: '医院门口异常徘徊监测', deviceName: '公安局枪机003', analysisType: '公共安全', status: '运行中', createTime: '2026-06-14 10:00:00', schedule: '全天候运行', confidence: 80, alertRule: '置信度≥80%触发告警，持续5秒' },
  { id: 'AT008', name: '农贸市场垃圾监测', deviceName: '城管局半球011', analysisType: '城市管理', status: '已暂停', createTime: '2026-06-13 09:00:00', schedule: '每日 08:00-18:00', confidence: 75, alertRule: '置信度≥75%触发告警' },
  { id: 'AT009', name: '建设路交通拥堵监测', deviceName: '交通局枪机015', analysisType: '交通出行', status: '运行中', createTime: '2026-06-12 08:30:00', schedule: '工作日 07:00-19:00', confidence: 85, alertRule: '置信度≥85%触发告警' },
  { id: 'AT010', name: '学校门口安全监测', deviceName: '教育局球机023', analysisType: '公共安全', status: '运行中', createTime: '2026-06-11 07:00:00', schedule: '工作日 07:00-19:00', confidence: 90, alertRule: '置信度≥90%触发告警' },
  { id: 'AT011', name: '珍珠坡路违规广告监测', deviceName: '城管局枪机007', analysisType: '城市管理', status: '已完成', createTime: '2026-06-10 10:00:00', schedule: '每日 08:00-18:00', confidence: 80, alertRule: '置信度≥80%触发告警' },
  { id: 'AT012', name: '工业园区扬尘监测', deviceName: '环保局半球021', analysisType: '环境保护', status: '运行中', createTime: '2026-06-09 14:30:00', schedule: '工作日 08:00-20:00', confidence: 85, alertRule: '置信度≥85%触发告警' },
  { id: 'AT013', name: '客运站人员聚集监测', deviceName: '公安局球机005', analysisType: '公共安全', status: '已暂停', createTime: '2026-06-08 08:00:00', schedule: '全天候运行', confidence: 80, alertRule: '置信度≥80%触发告警' },
  { id: 'AT014', name: '南环路井盖缺失监测', deviceName: '城管局球机009', analysisType: '城市管理', status: '运行中', createTime: '2026-06-07 09:00:00', schedule: '每日 06:00-22:00', confidence: 75, alertRule: '置信度≥75%触发告警' },
  { id: 'AT015', name: '东站广场违停监测', deviceName: '交通局半球017', analysisType: '交通出行', status: '运行中', createTime: '2026-06-06 08:00:00', schedule: '全天候运行', confidence: 85, alertRule: '置信度≥85%触发告警' },
  { id: 'AT016', name: '西大路烟火检测', deviceName: '公安局球机001', analysisType: '公共安全', status: '运行中', createTime: '2026-06-05 10:00:00', schedule: '全天候运行', confidence: 90, alertRule: '置信度≥90%触发告警' },
];

// 分析结果数据
function generateAnalysisResults(count: number): AnalysisResult[] {
  const results: AnalysisResult[] = [];
  const taskPool = analysisTasks.slice(0, 10);

  for (let i = 1; i <= count; i++) {
    const task = taskPool[i % taskPool.length];
    const subTypes = subTypeMap[task.analysisType];
    const subType = subTypes[i % subTypes.length];
    const captureDate = new Date(2026, 5, 23 - Math.floor(Math.random() * 7));
    const h = String(Math.floor(Math.random() * 14) + 7).padStart(2, '0');
    const min = String(Math.floor(Math.random() * 60)).padStart(2, '0');
    const s = String(Math.floor(Math.random() * 60)).padStart(2, '0');

    const descList = descriptions[subType];
    const description = descList ? randomItem(descList) : `检测到${subType}事件`;

    results.push({
      id: `AR${String(i).padStart(5, '0')}`,
      taskId: task.id,
      taskName: task.name,
      type: task.analysisType,
      subType,
      confidence: +(75 + Math.random() * 20).toFixed(1),
      captureTime: `${captureDate.getFullYear()}-${String(captureDate.getMonth() + 1).padStart(2, '0')}-${String(captureDate.getDate()).padStart(2, '0')} ${h}:${min}:${s}`,
      deviceName: task.deviceName,
      location: randomItem(locations),
      imageUrl: `/placeholder/analysis/${i}.jpg`,
      description,
    });
  }
  return results;
}

export const analysisResults: AnalysisResult[] = generateAnalysisResults(24);
