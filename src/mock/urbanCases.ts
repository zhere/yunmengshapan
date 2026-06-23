// 城管案件数据 - 云梦县城管业务协同模拟数据

export type UrbanCaseType = '占道经营' | '违规停车' | '垃圾堆积' | '违规广告' | '井盖缺失';
export type UrbanCaseSource = 'AI巡查' | '12345热线' | '网格员上报' | '市民投诉';
export type UrbanCaseStatus = '待派遣' | '已派遣' | '处置中' | '待核查' | '已结案';

export interface UrbanCase {
  id: string;
  caseNo: string;
  type: UrbanCaseType;
  source: UrbanCaseSource;
  status: UrbanCaseStatus;
  location: string;
  reportTime: string;
  deadline: string;
  handler: string;
  description: string;
  images: string[];
}

export interface UrbanStats {
  total: number;
  todayCount: number;
  pendingCount: number;
  processingCount: number;
  closedCount: number;
  closeRate: number;
  byType: { type: UrbanCaseType; count: number }[];
  bySource: { source: UrbanCaseSource; count: number }[];
  byStatus: { status: UrbanCaseStatus; count: number }[];
  trend7Days: { date: string; count: number }[];
}

const locations = [
  '城关镇曲阳路58号', '城关镇建设路102号', '城关镇楚王城大道35号',
  '城关镇珍珠坡路27号', '城关镇梦泽大道88号', '城关镇西大路16号',
  '城关镇南环路45号', '城关镇府前路9号', '城关镇文化路63号',
  '城关镇民主路21号', '城关镇解放路77号', '城关镇北环路33号',
  '义堂镇中心街12号', '义堂镇义堂大道56号', '义堂镇文化路8号',
  '曾店镇曾店街34号', '曾店镇振兴路19号', '曾店镇富民路7号',
  '吴铺镇吴铺街22号', '吴铺镇发展大道41号', '吴铺镇和谐路15号',
  '伍洛镇伍洛街18号', '伍洛镇滨河路29号', '伍洛镇新街6号',
  '下辛店镇下辛店街31号', '下辛店镇商贸路14号', '下辛店镇兴农路9号',
  '道桥镇道桥街25号', '道桥镇桥东路11号', '道桥镇滨河路37号',
  '隔蒲潭镇隔蒲街16号', '隔蒲潭镇蒲潭路23号', '隔蒲潭镇永安路5号',
  '胡金店镇胡金店街28号', '胡金店镇金店大道42号', '胡金店镇兴业路13号',
  '云梦县商业步行街', '云梦县农贸市场', '云梦县汽车客运站',
];

const handlers = [
  '张明', '李强', '王伟', '刘洋', '陈静',
  '杨帆', '赵磊', '黄丽', '周军', '吴敏',
];

const caseTypes: UrbanCaseType[] = ['占道经营', '违规停车', '垃圾堆积', '违规广告', '井盖缺失'];
const caseSources: UrbanCaseSource[] = ['AI巡查', '12345热线', '网格员上报', '市民投诉'];
const caseStatuses: UrbanCaseStatus[] = ['待派遣', '已派遣', '处置中', '待核查', '已结案'];

const descriptions: Record<UrbanCaseType, string[]> = {
  '占道经营': [
    '商铺占道经营，将商品摆放在人行道上，影响行人通行',
    '流动摊贩在路口占道经营，造成交通拥堵',
    '餐饮店占道摆放桌椅，占用公共区域',
  ],
  '违规停车': [
    '机动车违规停放在人行道上，阻碍行人通行',
    '多辆电动车违规停放在消防通道',
    '货车违规停放在禁停区域',
  ],
  '垃圾堆积': [
    '生活垃圾堆积未及时清运，散发异味',
    '建筑垃圾违规倾倒在路边',
    '垃圾桶满溢，周边散落大量垃圾',
  ],
  '违规广告': [
    '违规设置大型户外广告牌，存在安全隐患',
    '墙面违规张贴商业广告',
    '沿街悬挂违规横幅广告',
  ],
  '井盖缺失': [
    '路面井盖缺失，存在严重安全隐患',
    '井盖破损严重，随时可能塌陷',
    '井盖松动，车辆经过时异响明显',
  ],
};

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

function generateUrbanCases(count: number): UrbanCase[] {
  const cases: UrbanCase[] = [];
  for (let i = 1; i <= count; i++) {
    const type = caseTypes[i % caseTypes.length];
    const source = caseSources[i % caseSources.length];
    const statusRand = Math.random();
    const status: UrbanCaseStatus = statusRand < 0.08 ? '待派遣'
      : statusRand < 0.2 ? '已派遣'
      : statusRand < 0.4 ? '处置中'
      : statusRand < 0.55 ? '待核查'
      : '已结案';

    const reportDate = new Date(2026, 5, 23 - Math.floor(Math.random() * 15));
    const deadlineDate = new Date(reportDate.getTime() + (Math.floor(Math.random() * 3) + 1) * 24 * 60 * 60 * 1000);

    cases.push({
      id: `UC${String(i).padStart(5, '0')}`,
      caseNo: `YM-CG-2026${String(i).padStart(4, '0')}`,
      type,
      source,
      status,
      location: randomItem(locations),
      reportTime: formatDate(reportDate),
      deadline: formatDate(deadlineDate),
      handler: status === '待派遣' ? '' : randomItem(handlers),
      description: randomItem(descriptions[type]),
      images: [],
    });
  }
  return cases;
}

export const urbanCases: UrbanCase[] = generateUrbanCases(35);

export const urbanStats: UrbanStats = {
  total: 856,
  todayCount: 12,
  pendingCount: 18,
  processingCount: 34,
  closedCount: 789,
  closeRate: 92.2,
  byType: [
    { type: '占道经营', count: 267 },
    { type: '违规停车', count: 213 },
    { type: '垃圾堆积', count: 178 },
    { type: '违规广告', count: 112 },
    { type: '井盖缺失', count: 86 },
  ],
  bySource: [
    { source: 'AI巡查', count: 312 },
    { source: '12345热线', count: 234 },
    { source: '网格员上报', count: 189 },
    { source: '市民投诉', count: 121 },
  ],
  byStatus: [
    { status: '待派遣', count: 18 },
    { status: '已派遣', count: 23 },
    { status: '处置中', count: 34 },
    { status: '待核查', count: 15 },
    { status: '已结案', count: 789 },
  ],
  trend7Days: [
    { date: '6/17', count: 11 },
    { date: '6/18', count: 15 },
    { date: '6/19', count: 9 },
    { date: '6/20', count: 13 },
    { date: '6/21', count: 17 },
    { date: '6/22', count: 14 },
    { date: '6/23', count: 12 },
  ],
};
