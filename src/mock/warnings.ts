// 预警事件数据 - 云梦县预警事件模拟数据

export type WarningType = '城市管理' | '公共安全' | '交通出行' | '环境保护' | '政务服务';
export type WarningLevel = '高' | '中' | '低';
export type WarningStatus = '待处置' | '已派发' | '处置中' | '已反馈' | '已闭环';

export interface Warning {
  id: string;
  type: WarningType;
  subType: string;
  level: WarningLevel;
  location: string;
  time: string;
  status: WarningStatus;
  deviceName: string;
  description: string;
  handler: string;
}

export interface WarningStats {
  total: number;
  todayCount: number;
  pendingCount: number;
  processingCount: number;
  closedCount: number;
  closeRate: number;
  trend7Days: { date: string; count: number }[];
  trend30Days: { date: string; count: number }[];
  byType: { type: WarningType; count: number }[];
  byLevel: { level: WarningLevel; count: number }[];
}

const subTypeMap: Record<WarningType, string[]> = {
  '城市管理': ['占道经营', '违规停车', '垃圾堆积', '违规广告', '井盖缺失', '路面破损', '违章搭建'],
  '公共安全': ['人员聚集', '异常徘徊', '打架斗殴', '攀爬围栏', '物品遗留', '烟火检测'],
  '交通出行': ['交通拥堵', '车辆逆行', '行人闯红灯', '违规变道', '交通事故', '违停占道'],
  '环境保护': ['水质异常', '烟雾排放', '噪音扰民', '扬尘污染', '污水排放', '垃圾焚烧'],
  '政务服务': ['排队过长', '服务投诉', '设施损坏', '证件异常', '信息错误'],
};

const locations = [
  '城关镇曲阳路与建设路交叉口', '城关镇楚王城大道中段', '城关镇梦泽大道南段',
  '城关镇珍珠坡路东段', '城关镇西大路北段', '城关镇南环路西段',
  '义堂镇义堂大道与文化路交叉口', '义堂镇中心街中段',
  '曾店镇曾店街与振兴路交叉口', '曾店镇富民路东段',
  '吴铺镇发展大道中段', '吴铺镇和谐路与吴铺街交叉口',
  '伍洛镇伍洛街中段', '伍洛镇滨河路南段',
  '下辛店镇下辛店街与商贸路交叉口', '下辛店镇兴农路东段',
  '道桥镇道桥街中段', '道桥镇桥东路与滨河路交叉口',
  '隔蒲潭镇隔蒲街中段', '隔蒲潭镇蒲潭路南段',
  '胡金店镇金店大道中段', '胡金店镇兴业路东段',
  '云梦东站广场', '云梦县政务服务中心', '云梦县人民医院门口',
  '云梦县商业步行街', '云梦县农贸市场', '云梦县第一中学门口',
  '云梦县体育中心', '云梦县文化广场', '云梦县汽车客运站',
  '城关镇府前路与民主路交叉口', '城关镇解放路中段',
  '城关镇文化路与北环路交叉口', '城关镇北环路东段',
];

const handlers = [
  '张明', '李强', '王伟', '刘洋', '陈静',
  '杨帆', '赵磊', '黄丽', '周军', '吴敏',
  '徐涛', '孙浩', '马超', '朱红', '胡斌',
  '郭勇', '林芳', '何平', '罗刚', '梁华',
];

const deviceNames = [
  '公安局球机001', '城管局枪机003', '交通局球机005', '环保局半球007',
  '社区球机009', '公安局枪机011', '城管局球机013', '交通局半球015',
  '教育局球机017', '社区枪机019', '公安局半球021', '城管局枪机023',
];

const warningTypes: WarningType[] = ['城市管理', '公共安全', '交通出行', '环境保护', '政务服务'];
const warningLevels: WarningLevel[] = ['高', '中', '低'];
const warningStatuses: WarningStatus[] = ['待处置', '已派发', '处置中', '已反馈', '已闭环'];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomTime(daysAgo: number): string {
  const now = new Date(2026, 5, 23, 23, 59, 59); // 2026-06-23
  const past = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  const randomTime = new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
  const y = randomTime.getFullYear();
  const m = String(randomTime.getMonth() + 1).padStart(2, '0');
  const d = String(randomTime.getDate()).padStart(2, '0');
  const h = String(randomTime.getHours()).padStart(2, '0');
  const min = String(randomTime.getMinutes()).padStart(2, '0');
  const s = String(randomTime.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

function generateDescription(type: WarningType, subType: string, location: string): string {
  const templates: Record<string, string[]> = {
    '占道经营': [
      `${location}发现流动摊贩占道经营，影响行人通行`,
      `${location}商铺出店经营，占用公共通道`,
    ],
    '违规停车': [
      `${location}发现机动车违规停放，阻碍交通`,
      `${location}多辆非机动车乱停乱放`,
    ],
    '垃圾堆积': [
      `${location}垃圾堆积未及时清运，影响市容`,
      `${location}垃圾桶满溢，周边散落垃圾`,
    ],
    '违规广告': [
      `${location}发现违规横幅广告`,
      `${location}墙面违规张贴小广告`,
    ],
    '井盖缺失': [
      `${location}发现井盖缺失，存在安全隐患`,
    ],
    '人员聚集': [
      `${location}发现人员异常聚集，需关注`,
      `${location}人群密集度超过阈值`,
    ],
    '异常徘徊': [
      `${location}发现可疑人员长时间徘徊`,
    ],
    '打架斗殴': [
      `${location}发现人员冲突事件`,
    ],
    '交通拥堵': [
      `${location}路段交通拥堵，车辆排队较长`,
    ],
    '车辆逆行': [
      `${location}发现车辆逆行行为`,
    ],
    '水质异常': [
      `${location}水体颜色异常，疑似污染`,
    ],
    '烟雾排放': [
      `${location}发现异常烟雾排放`,
    ],
    '排队过长': [
      `${location}办事群众排队过长，等候超时`,
    ],
  };
  const typeTemplates = templates[subType];
  if (typeTemplates) {
    return randomItem(typeTemplates);
  }
  return `${location}发现${subType}事件，请及时处置`;
}

function generateWarnings(count: number): Warning[] {
  const warnings: Warning[] = [];
  for (let i = 1; i <= count; i++) {
    const type = warningTypes[i % warningTypes.length];
    const subTypes = subTypeMap[type];
    const subType = subTypes[i % subTypes.length];
    const location = randomItem(locations);
    const levelRand = Math.random();
    const level: WarningLevel = levelRand < 0.15 ? '高' : levelRand < 0.5 ? '中' : '低';
    const statusRand = Math.random();
    const status: WarningStatus = statusRand < 0.1 ? '待处置' : statusRand < 0.25 ? '已派发' : statusRand < 0.45 ? '处置中' : statusRand < 0.7 ? '已反馈' : '已闭环';

    warnings.push({
      id: `WRN${String(i).padStart(5, '0')}`,
      type,
      subType,
      level,
      location,
      time: randomTime(i <= 10 ? 1 : i <= 25 ? 3 : 7),
      status,
      deviceName: randomItem(deviceNames),
      description: generateDescription(type, subType, location),
      handler: randomItem(handlers),
    });
  }
  return warnings;
}

export const warnings: Warning[] = generateWarnings(56);

// 生成7天趋势数据
function generate7DaysTrend(): { date: string; count: number }[] {
  const result: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(2026, 5, 23 - i);
    const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
    result.push({
      date: dateStr,
      count: Math.floor(Math.random() * 15) + 20,
    });
  }
  return result;
}

// 生成30天趋势数据
function generate30DaysTrend(): { date: string; count: number }[] {
  const result: { date: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(2026, 5, 23 - i);
    const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
    result.push({
      date: dateStr,
      count: Math.floor(Math.random() * 20) + 15,
    });
  }
  return result;
}

export const warningStats: WarningStats = {
  total: 1286,
  todayCount: 38,
  pendingCount: 23,
  processingCount: 45,
  closedCount: 1185,
  closeRate: 92.2,
  trend7Days: generate7DaysTrend(),
  trend30Days: generate30DaysTrend(),
  byType: [
    { type: '城市管理', count: 423 },
    { type: '公共安全', count: 312 },
    { type: '交通出行', count: 267 },
    { type: '环境保护', count: 156 },
    { type: '政务服务', count: 128 },
  ],
  byLevel: [
    { level: '高', count: 186 },
    { level: '中', count: 534 },
    { level: '低', count: 566 },
  ],
};
