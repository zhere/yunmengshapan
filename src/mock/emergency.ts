// 应急指挥调度数据 - 云梦县应急预案/资源/事件模拟数据

export type EmergencyPlanType = '防汛抗旱' | '火灾' | '群体事件' | '交通事故' | '环境事故';
export type EmergencyPlanLevel = 'I级' | 'II级' | 'III级' | 'IV级';
export type EmergencyResourceType = '摄像头' | '应急队伍' | '车辆' | '物资';
export type EmergencyResourceStatus = '可用' | '使用中' | '维护中';
export type EmergencyEventStatus = '接报' | '响应中' | '处置中' | '已结束';

export interface EmergencyPlan {
  id: string;
  name: string;
  type: EmergencyPlanType;
  level: EmergencyPlanLevel;
  responsiblePerson: string;
  phone: string;
  resources: string[];
  procedures: string[];
  updateTime: string;
}

export interface EmergencyResource {
  id: string;
  name: string;
  type: EmergencyResourceType;
  location: string;
  lng: number;
  lat: number;
  status: EmergencyResourceStatus;
  contact: string;
  phone: string;
}

export interface EmergencyEvent {
  id: string;
  name: string;
  type: EmergencyPlanType;
  level: EmergencyPlanLevel;
  location: string;
  lng: number;
  lat: number;
  reportTime: string;
  status: EmergencyEventStatus;
  description: string;
  planId: string;
  casualties: number;
  affectedArea: number;
}

// ==================== 预案数据 ====================
export const plans: EmergencyPlan[] = [
  {
    id: 'EP001',
    name: '云梦县防汛应急预案',
    type: '防汛抗旱',
    level: 'II级',
    responsiblePerson: '王建国',
    phone: '13807291001',
    resources: ['县消防救援大队', '城关镇应急分队', '防汛物资仓库', '冲锋舟3艘', '编织袋5000条'],
    procedures: [
      '接到汛情报告，值班人员立即向指挥部报告',
      '指挥部研判汛情等级，启动对应级别响应',
      '通知各成员单位进入应急状态',
      '组织危险区域群众转移',
      '调集应急队伍和物资前往现场',
      '开展抢险救援工作',
      '持续监测水情，及时报告',
      '险情解除后，组织恢复重建',
    ],
    updateTime: '2026-05-15',
  },
  {
    id: 'EP002',
    name: '云梦县城区火灾应急预案',
    type: '火灾',
    level: 'II级',
    responsiblePerson: '李卫东',
    phone: '13807291002',
    resources: ['县消防救援大队', '城关镇应急分队', '义堂镇应急分队', '消防车6辆', '灭火器材一批'],
    procedures: [
      '接到火警报告，立即通知消防队出警',
      '同步报告指挥部，启动应急响应',
      '组织周边群众疏散',
      '消防队到达现场开展灭火',
      '调集周边应急力量增援',
      '设立现场指挥所，统一指挥',
      '火情控制后，开展搜救和善后',
      '调查火灾原因，总结经验教训',
    ],
    updateTime: '2026-04-20',
  },
  {
    id: 'EP003',
    name: '云梦县群体性事件应急预案',
    type: '群体事件',
    level: 'I级',
    responsiblePerson: '张志强',
    phone: '13807291003',
    resources: ['县公安局特警大队', '城关派出所', '巡警大队', '应急通信车1辆'],
    procedures: [
      '接到群体性事件报告，立即报告指挥部',
      '启动I级响应，通知各成员单位',
      '公安力量赶赴现场维持秩序',
      '设立警戒线，隔离围观群众',
      '派员与群众代表对话沟通',
      '依法处置违法行为',
      '做好舆情监控和引导',
      '事件平息后，做好善后工作',
    ],
    updateTime: '2026-03-10',
  },
  {
    id: 'EP004',
    name: '云梦县重大交通事故应急预案',
    type: '交通事故',
    level: 'III级',
    responsiblePerson: '陈明远',
    phone: '13807291004',
    resources: ['县交警大队', '县消防救援大队', '120急救中心', '拖车2辆'],
    procedures: [
      '接到事故报告，交警立即出警',
      '同步通知消防和医疗急救',
      '到达现场后，先期处置救人',
      '封锁现场，疏导交通',
      '开展事故调查取证',
      '清理现场，恢复交通',
      '做好伤员救治和家属安抚',
      '撰写事故调查报告',
    ],
    updateTime: '2026-05-08',
  },
  {
    id: 'EP005',
    name: '云梦县环境突发事件应急预案',
    type: '环境事故',
    level: 'II级',
    responsiblePerson: '刘晓东',
    phone: '13807291005',
    resources: ['县生态环境局应急队', '县消防救援大队', '环境监测车1辆', '防护物资一批'],
    procedures: [
      '接到环境事故报告，立即报告指挥部',
      '启动应急响应，通知各成员单位',
      '环境监测队赶赴现场监测',
      '划定污染范围，设置警戒区',
      '组织污染区域群众疏散',
      '开展污染源控制和治理',
      '持续监测环境数据',
      '污染消除后，开展评估和恢复',
    ],
    updateTime: '2026-04-15',
  },
  {
    id: 'EP006',
    name: '云梦县抗旱应急预案',
    type: '防汛抗旱',
    level: 'III级',
    responsiblePerson: '王建国',
    phone: '13807291001',
    resources: ['县水利和湖泊局', '各乡镇水利站', '抗旱设备一批', '送水车3辆'],
    procedures: [
      '监测旱情发展，及时发布预警',
      '启动应急响应，组织抗旱工作',
      '合理调配水资源，保障人畜饮水',
      '组织送水车为缺水区域送水',
      '指导农民开展抗旱保苗',
      '争取上级抗旱资金和物资支持',
      '旱情缓解后，恢复正常供水',
      '总结抗旱经验，完善预案',
    ],
    updateTime: '2026-03-25',
  },
  {
    id: 'EP007',
    name: '云梦县森林火灾应急预案',
    type: '火灾',
    level: 'III级',
    responsiblePerson: '李卫东',
    phone: '13807291002',
    resources: ['县消防救援大队', '各乡镇应急分队', '风力灭火机10台', '消防水车2辆'],
    procedures: [
      '接到火情报告，立即组织扑救',
      '报告指挥部，启动应急响应',
      '组织周边群众撤离',
      '调集扑火力量和物资',
      '设立前线指挥所',
      '采取扑打、隔离等方式灭火',
      '火情控制后，清理余火',
      '调查火因，评估损失',
    ],
    updateTime: '2026-02-28',
  },
  {
    id: 'EP008',
    name: '云梦县危化品泄漏应急预案',
    type: '环境事故',
    level: 'I级',
    responsiblePerson: '刘晓东',
    phone: '13807291005',
    resources: ['县生态环境局应急队', '县消防救援大队', '县卫健局', '防化服20套', '堵漏器材一批'],
    procedures: [
      '接到危化品泄漏报告，立即报告指挥部',
      '启动I级响应，通知所有成员单位',
      '划定警戒区域，疏散周边群众',
      '消防队穿戴防护装备进入现场',
      '开展泄漏源堵漏',
      '环境监测队持续监测',
      '医疗队做好伤员救治准备',
      '泄漏控制后，开展环境修复',
    ],
    updateTime: '2026-01-20',
  },
];

// ==================== 应急资源数据 ====================
export const resources: EmergencyResource[] = [
  { id: 'ER001', name: '城关镇摄像头组', type: '摄像头', location: '城关镇楚王城大道', lng: 113.7534, lat: 31.0267, status: '可用', contact: '张伟', phone: '13807292001' },
  { id: 'ER002', name: '义堂镇摄像头组', type: '摄像头', location: '义堂镇义堂大道', lng: 113.7823, lat: 31.0456, status: '可用', contact: '李强', phone: '13807292002' },
  { id: 'ER003', name: '云梦东站摄像头组', type: '摄像头', location: '云梦东站广场', lng: 113.7712, lat: 31.0189, status: '可用', contact: '王磊', phone: '13807292003' },
  { id: 'ER004', name: '县消防救援大队', type: '应急队伍', location: '城关镇梦泽大道168号', lng: 113.7567, lat: 31.0156, status: '可用', contact: '赵刚', phone: '13807292004' },
  { id: 'ER005', name: '城关镇应急分队', type: '应急队伍', location: '城关镇政府', lng: 113.7489, lat: 31.0234, status: '可用', contact: '孙浩', phone: '13807292005' },
  { id: 'ER006', name: '义堂镇应急分队', type: '应急队伍', location: '义堂镇政府', lng: 113.7845, lat: 31.0478, status: '可用', contact: '周军', phone: '13807292006' },
  { id: 'ER007', name: '县公安局特警大队', type: '应急队伍', location: '城关镇楚王城大道99号', lng: 113.7556, lat: 31.0301, status: '可用', contact: '吴敏', phone: '13807292007' },
  { id: 'ER008', name: '县生态环境局应急队', type: '应急队伍', location: '城关镇建设路56号', lng: 113.7512, lat: 31.0234, status: '可用', contact: '黄丽', phone: '13807292008' },
  { id: 'ER009', name: '消防车01号', type: '车辆', location: '县消防救援大队', lng: 113.7567, lat: 31.0156, status: '可用', contact: '赵刚', phone: '13807292004' },
  { id: 'ER010', name: '消防车02号', type: '车辆', location: '县消防救援大队', lng: 113.7567, lat: 31.0156, status: '可用', contact: '赵刚', phone: '13807292004' },
  { id: 'ER011', name: '消防车03号', type: '车辆', location: '县消防救援大队', lng: 113.7567, lat: 31.0156, status: '使用中', contact: '赵刚', phone: '13807292004' },
  { id: 'ER012', name: '应急指挥车', type: '车辆', location: '县政府', lng: 113.7489, lat: 31.0234, status: '可用', contact: '杨帆', phone: '13807292009' },
  { id: 'ER013', name: '环境监测车', type: '车辆', location: '县生态环境局', lng: 113.7512, lat: 31.0234, status: '可用', contact: '黄丽', phone: '13807292008' },
  { id: 'ER014', name: '120急救车01号', type: '车辆', location: '县人民医院', lng: 113.7523, lat: 31.0198, status: '可用', contact: '陈静', phone: '13807292010' },
  { id: 'ER015', name: '防汛物资仓库', type: '物资', location: '城关镇北环路128号', lng: 113.7456, lat: 31.0312, status: '可用', contact: '刘洋', phone: '13807292011' },
  { id: 'ER016', name: '救灾物资储备库', type: '物资', location: '城关镇南环路56号', lng: 113.7434, lat: 31.0098, status: '可用', contact: '马超', phone: '13807292012' },
  { id: 'ER017', name: '消防器材仓库', type: '物资', location: '县消防救援大队', lng: 113.7567, lat: 31.0156, status: '可用', contact: '赵刚', phone: '13807292004' },
  { id: 'ER018', name: '应急通信车', type: '车辆', location: '县公安局', lng: 113.7556, lat: 31.0301, status: '维护中', contact: '吴敏', phone: '13807292007' },
];

// ==================== 应急事件数据 ====================
export const emergencyEvents: EmergencyEvent[] = [
  {
    id: 'EE001',
    name: '城关镇曲阳路火灾',
    type: '火灾',
    level: 'III级',
    location: '城关镇曲阳路58号',
    lng: 113.7423,
    lat: 31.0256,
    reportTime: '2026-06-22 14:23:15',
    status: '已结束',
    description: '城关镇曲阳路58号一栋三层居民楼发生火灾，起火点位于二楼厨房，过火面积约80平方米，已疏散周边群众23人。',
    planId: 'EP002',
    casualties: 0,
    affectedArea: 80,
  },
  {
    id: 'EE002',
    name: '云梦县工业园区化学品泄漏',
    type: '环境事故',
    level: 'II级',
    location: '云梦县工业园区富森科技',
    lng: 113.7678,
    lat: 31.0089,
    reportTime: '2026-06-21 09:15:42',
    status: '已结束',
    description: '工业园区富森科技有限公司仓库发生盐酸泄漏，泄漏量约200升，已启动环境应急预案，周边500米范围内群众已疏散。',
    planId: 'EP008',
    casualties: 0,
    affectedArea: 500,
  },
  {
    id: 'EE003',
    name: '楚王城大道交通事故',
    type: '交通事故',
    level: 'III级',
    location: '城关镇楚王城大道与建设路交叉口',
    lng: 113.7534,
    lat: 31.0245,
    reportTime: '2026-06-20 18:45:33',
    status: '已结束',
    description: '楚王城大道与建设路交叉口发生两车追尾事故，造成1人受伤，交通中断约40分钟。',
    planId: 'EP004',
    casualties: 1,
    affectedArea: 0,
  },
  {
    id: 'EE004',
    name: '清明河乡洪涝灾害',
    type: '防汛抗旱',
    level: 'II级',
    location: '清明河乡河堤路',
    lng: 113.8234,
    lat: 30.9876,
    reportTime: '2026-06-19 06:30:00',
    status: '处置中',
    description: '连续暴雨导致清明河水位上涨，河堤路部分路段积水严重，已转移低洼区域群众156人，目前水位仍在上涨。',
    planId: 'EP001',
    casualties: 0,
    affectedArea: 2000,
  },
  {
    id: 'EE005',
    name: '商业步行街人员聚集事件',
    type: '群体事件',
    level: 'IV级',
    location: '云梦县商业步行街',
    lng: 113.7489,
    lat: 31.0212,
    reportTime: '2026-06-18 16:20:10',
    status: '已结束',
    description: '商业步行街因商家促销活动引发群众聚集，高峰期约200人，已安排警力维持秩序，未发生冲突。',
    planId: 'EP003',
    casualties: 0,
    affectedArea: 0,
  },
  {
    id: 'EE006',
    name: '隔蒲潭镇农田旱情',
    type: '防汛抗旱',
    level: 'IV级',
    location: '隔蒲潭镇蒲潭路',
    lng: 113.8056,
    lat: 31.0123,
    reportTime: '2026-06-17 10:00:00',
    status: '响应中',
    description: '隔蒲潭镇持续高温少雨，约800亩农田出现旱情，已安排送水车进行灌溉，同时向县水利部门申请调水。',
    planId: 'EP006',
    casualties: 0,
    affectedArea: 800,
  },
];
