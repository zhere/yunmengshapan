// 网格化管理数据 - 云梦县网格/网格员/网格事件模拟数据

// ==================== 网格 ====================
export interface Grid {
  id: string;
  name: string;
  code: string;
  area: number;
  community: string;
  staffName: string;
  staffPhone: string;
  householdCount: number;
  populationCount: number;
  eventCount: number;
  lng: number;
  lat: number;
  boundaryPoints: { lng: number; lat: number }[];
}

// ==================== 网格员 ====================
export interface GridStaff {
  id: string;
  name: string;
  phone: string;
  gender: '男' | '女';
  gridName: string;
  gridCode: string;
  onDuty: boolean;
  todayTasks: number;
  completedTasks: number;
  lastSignIn: string;
  lastSignOut: string;
  lng: number;
  lat: number;
}

// ==================== 网格事件 ====================
export type GridEventType = '城管问题' | '安全隐患' | '矛盾纠纷' | '环境卫生' | '设施损坏';
export type GridEventStatus = '待处理' | '处理中' | '已处理';

export interface GridEvent {
  id: string;
  type: GridEventType;
  description: string;
  location: string;
  reportTime: string;
  reporter: string;
  status: GridEventStatus;
  images: string[];
}

// ==================== 统计 ====================
export interface GridStats {
  totalGrids: number;
  totalStaff: number;
  onDutyStaff: number;
  todayEvents: number;
  totalEvents: number;
  processedRate: number;
  byType: { type: GridEventType; count: number }[];
  byStatus: { status: GridEventStatus; count: number }[];
}

// ==================== 数据生成 ====================

const surnames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '马', '朱', '胡', '郭', '林', '何', '罗', '梁'];
const givenNames = ['伟', '强', '磊', '军', '勇', '杰', '涛', '明', '超', '丽', '芳', '静', '敏', '娟', '艳'];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePhone(): string {
  const prefixes = ['138', '139', '136', '137', '158', '159', '188', '187', '155', '176'];
  return `${randomItem(prefixes)}${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`;
}

function generateBoundaryPoints(centerLng: number, centerLat: number): { lng: number; lat: number }[] {
  const offset = 0.005 + Math.random() * 0.005;
  return [
    { lng: +(centerLng - offset).toFixed(6), lat: +(centerLat + offset).toFixed(6) },
    { lng: +(centerLng + offset).toFixed(6), lat: +(centerLat + offset).toFixed(6) },
    { lng: +(centerLng + offset).toFixed(6), lat: +(centerLat - offset).toFixed(6) },
    { lng: +(centerLng - offset).toFixed(6), lat: +(centerLat - offset).toFixed(6) },
  ];
}

// 网格数据
const gridData = [
  { name: '曲阳社区第一网格', code: 'YM-CG-QY-01', community: '曲阳社区', lng: 113.7423, lat: 31.0256 },
  { name: '曲阳社区第二网格', code: 'YM-CG-QY-02', community: '曲阳社区', lng: 113.7478, lat: 31.0289 },
  { name: '建设社区第一网格', code: 'YM-CG-JS-01', community: '建设社区', lng: 113.7512, lat: 31.0234 },
  { name: '楚王城社区第一网格', code: 'YM-CG-CWC-01', community: '楚王城社区', lng: 113.7556, lat: 31.0301 },
  { name: '楚王城社区第二网格', code: 'YM-CG-CWC-02', community: '楚王城社区', lng: 113.7601, lat: 31.0267 },
  { name: '珍珠坡社区第一网格', code: 'YM-CG-ZZP-01', community: '珍珠坡社区', lng: 113.7434, lat: 31.0178 },
  { name: '梦泽社区第一网格', code: 'YM-CG-MZ-01', community: '梦泽社区', lng: 113.7567, lat: 31.0156 },
  { name: '梦泽社区第二网格', code: 'YM-CG-MZ-02', community: '梦泽社区', lng: 113.7623, lat: 31.0189 },
  { name: '西大社区第一网格', code: 'YM-CG-XD-01', community: '西大社区', lng: 113.7389, lat: 31.0212 },
  { name: '南环社区第一网格', code: 'YM-CG-NH-01', community: '南环社区', lng: 113.7456, lat: 31.0098 },
  { name: '义堂社区第一网格', code: 'YM-CG-YT-01', community: '义堂社区', lng: 113.7823, lat: 31.0456 },
  { name: '曾店社区第一网格', code: 'YM-CG-ZD-01', community: '曾店社区', lng: 113.8012, lat: 31.0523 },
  { name: '吴铺社区第一网格', code: 'YM-CG-WP-01', community: '吴铺社区', lng: 113.7678, lat: 31.0389 },
  { name: '伍洛社区第一网格', code: 'YM-CG-WL-01', community: '伍洛社区', lng: 113.8123, lat: 31.0356 },
  { name: '下辛店社区第一网格', code: 'YM-CG-XXD-01', community: '下辛店社区', lng: 113.8234, lat: 31.0278 },
];

export const grids: Grid[] = gridData.map((item, index) => ({
  id: `GRD${String(index + 1).padStart(3, '0')}`,
  name: item.name,
  code: item.code,
  area: +(0.3 + Math.random() * 0.7).toFixed(2),
  community: item.community,
  staffName: `${randomItem(surnames)}${randomItem(givenNames)}`,
  staffPhone: generatePhone(),
  householdCount: Math.floor(Math.random() * 500) + 200,
  populationCount: Math.floor(Math.random() * 1500) + 500,
  eventCount: Math.floor(Math.random() * 30) + 5,
  lng: item.lng,
  lat: item.lat,
  boundaryPoints: generateBoundaryPoints(item.lng, item.lat),
}));

// 网格员数据
const staffNames = [
  '张伟', '李强', '王磊', '刘军', '陈勇',
  '杨杰', '赵涛', '黄明', '周超', '吴丽',
  '徐芳', '孙静', '马敏', '朱娟', '胡艳',
  '郭明', '林强', '何磊', '罗军', '梁勇',
];

export const staff: GridStaff[] = staffNames.map((name, index) => {
  const grid = grids[index % grids.length];
  const onDuty = Math.random() > 0.15;
  const todayTasks = Math.floor(Math.random() * 8) + 2;
  const completedTasks = Math.floor(todayTasks * (0.4 + Math.random() * 0.5));
  const signInHour = 7 + Math.floor(Math.random() * 2);
  const signOutHour = onDuty ? '' : `${17 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;

  return {
    id: `STF${String(index + 1).padStart(3, '0')}`,
    name,
    phone: generatePhone(),
    gender: index % 3 === 0 ? '女' : '男',
    gridName: grid.name,
    gridCode: grid.code,
    onDuty,
    todayTasks,
    completedTasks,
    lastSignIn: `2026-06-23 ${String(signInHour).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    lastSignOut: signOutHour ? `2026-06-22 ${signOutHour}:00` : '',
    lng: +(grid.lng + (Math.random() - 0.5) * 0.01).toFixed(6),
    lat: +(grid.lat + (Math.random() - 0.5) * 0.01).toFixed(6),
  };
});

// 网格事件数据
const eventTypes: GridEventType[] = ['城管问题', '安全隐患', '矛盾纠纷', '环境卫生', '设施损坏'];
const eventStatuses: GridEventStatus[] = ['待处理', '处理中', '已处理'];
const eventLocations = [
  '城关镇曲阳路58号', '城关镇建设路102号', '城关镇楚王城大道35号',
  '城关镇珍珠坡路27号', '城关镇梦泽大道88号', '城关镇西大路16号',
  '城关镇南环路45号', '城关镇府前路9号', '城关镇文化路63号',
  '城关镇民主路21号', '义堂镇义堂大道56号', '曾店镇振兴路19号',
  '吴铺镇发展大道41号', '伍洛镇滨河路29号', '下辛店镇商贸路14号',
  '道桥镇道桥街25号', '隔蒲潭镇隔蒲街16号', '胡金店镇金店大道42号',
  '云梦县商业步行街', '云梦县农贸市场',
];

const eventDescriptions: Record<GridEventType, string[]> = {
  '城管问题': [
    '商铺占道经营，将商品摆放在人行道上',
    '流动摊贩在路口占道经营',
    '违规设置户外广告牌',
  ],
  '安全隐患': [
    '老旧电线裸露，存在触电风险',
    '消防通道被杂物堵塞',
    '围墙出现裂缝，有倒塌风险',
  ],
  '矛盾纠纷': [
    '邻里因噪音问题发生纠纷',
    '业主与物业因停车费问题产生矛盾',
    '商铺之间因经营范围发生争执',
  ],
  '环境卫生': [
    '垃圾堆积未及时清运',
    '下水道堵塞，污水外溢',
    '绿化带内垃圾散落',
  ],
  '设施损坏': [
    '路灯损坏不亮，夜间出行不便',
    '路面坑洼，影响通行',
    '公共座椅损坏，存在安全隐患',
  ],
};

function generateGridEvents(count: number): GridEvent[] {
  const result: GridEvent[] = [];
  for (let i = 1; i <= count; i++) {
    const type = eventTypes[i % eventTypes.length];
    const statusRand = Math.random();
    const status: GridEventStatus = statusRand < 0.2 ? '待处理' : statusRand < 0.5 ? '处理中' : '已处理';
    const reportDate = new Date(2026, 5, 23 - Math.floor(Math.random() * 7));
    const h = String(Math.floor(Math.random() * 14) + 7).padStart(2, '0');
    const min = String(Math.floor(Math.random() * 60)).padStart(2, '0');

    result.push({
      id: `GEV${String(i).padStart(5, '0')}`,
      type,
      description: randomItem(eventDescriptions[type]),
      location: randomItem(eventLocations),
      reportTime: `${reportDate.getFullYear()}-${String(reportDate.getMonth() + 1).padStart(2, '0')}-${String(reportDate.getDate()).padStart(2, '0')} ${h}:${min}:00`,
      reporter: randomItem(staffNames),
      status,
      images: [],
    });
  }
  return result;
}

export const events: GridEvent[] = generateGridEvents(24);

export const gridStats: GridStats = {
  totalGrids: 15,
  totalStaff: 20,
  onDutyStaff: 17,
  todayEvents: 24,
  totalEvents: 1567,
  processedRate: 89.3,
  byType: [
    { type: '城管问题', count: 423 },
    { type: '安全隐患', count: 312 },
    { type: '矛盾纠纷', count: 267 },
    { type: '环境卫生', count: 345 },
    { type: '设施损坏', count: 220 },
  ],
  byStatus: [
    { status: '待处理', count: 167 },
    { status: '处理中', count: 234 },
    { status: '已处理', count: 1166 },
  ],
};
