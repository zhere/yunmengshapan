// 一标三实核采数据 - 云梦县人口/房屋/单位/流动人口模拟数据

// ==================== 实有人口 ====================
export interface Population {
  id: string;
  name: string;
  idCard: string;
  gender: '男' | '女';
  phone: string;
  education: '小学' | '初中' | '高中' | '大专' | '本科' | '硕士';
  occupation: string;
  maritalStatus: '未婚' | '已婚' | '离异' | '丧偶';
  addressCode: string;
  address: string;
  isResident: boolean;
  updateTime: string;
}

// ==================== 实有房屋 ====================
export type PropertyType = '自住' | '出租' | '空置' | '商用';

export interface House {
  id: string;
  addressCode: string;
  address: string;
  owner: string;
  ownerPhone: string;
  propertyType: PropertyType;
  area: number;
  rooms: number;
  isRented: boolean;
  tenants: number;
}

// ==================== 实有单位 ====================
export type UnitType = '机关' | '团体' | '企业' | '事业单位' | '个体工商户';

export interface Unit {
  id: string;
  name: string;
  type: UnitType;
  category: string;
  legalPerson: string;
  phone: string;
  address: string;
  employeeCount: number;
  businessScope: string;
}

// ==================== 流动人口 ====================
export type ResidenceType = '租赁' | '借住' | '单位宿舍' | '其他';

export interface FlowPopulation {
  id: string;
  name: string;
  idCard: string;
  gender: '男' | '女';
  fromPlace: string;
  residenceAddress: string;
  residenceType: ResidenceType;
  permitNo: string;
  permitExpiry: string;
  registerDate: string;
}

// ==================== 统计 ====================
export interface CollectionStats {
  populationTotal: number;
  populationResident: number;
  populationNonResident: number;
  houseTotal: number;
  houseSelfOccupied: number;
  houseRented: number;
  houseVacant: number;
  houseCommercial: number;
  unitTotal: number;
  flowTotal: number;
}

// ==================== 数据生成 ====================

const surnames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '马', '朱', '胡', '郭', '林', '何', '罗', '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧', '程'];
const maleNames = ['伟', '强', '磊', '军', '勇', '杰', '涛', '明', '超', '刚', '平', '辉', '鹏', '华', '飞', '斌', '浩', '亮', '建', '国'];
const femaleNames = ['丽', '芳', '静', '敏', '娟', '艳', '秀', '玲', '桂', '英', '红', '梅', '琴', '霞', '燕', '莉', '慧', '洁', '雪', '琳'];

const occupations = [
  '务农', '个体经营', '企业职工', '公务员', '教师', '医生', '司机',
  '建筑工人', '服务员', '销售人员', '技术人员', '管理人员', '退休人员',
  '自由职业', '学生', '无业',
];

const addresses = [
  { code: '420923-001-015-003-01-1-01', addr: '城关镇曲阳路58号曲阳社区01栋1单元101室' },
  { code: '420923-001-015-003-01-1-02', addr: '城关镇曲阳路58号曲阳社区01栋1单元102室' },
  { code: '420923-001-015-003-01-2-01', addr: '城关镇曲阳路58号曲阳社区01栋2单元201室' },
  { code: '420923-002-012-007-02-1-03', addr: '城关镇建设路102号建设社区02栋1单元103室' },
  { code: '420923-002-012-007-02-2-01', addr: '城关镇建设路102号建设社区02栋2单元201室' },
  { code: '420923-003-008-015-03-1-01', addr: '城关镇楚王城大道35号楚王城社区03栋1单元101室' },
  { code: '420923-003-008-015-03-1-02', addr: '城关镇楚王城大道35号楚王城社区03栋1单元102室' },
  { code: '420923-004-011-021-04-1-01', addr: '城关镇珍珠坡路27号珍珠坡社区04栋1单元101室' },
  { code: '420923-004-011-021-04-2-02', addr: '城关镇珍珠坡路27号珍珠坡社区04栋2单元202室' },
  { code: '420923-005-009-033-05-1-01', addr: '城关镇梦泽大道88号梦泽社区05栋1单元101室' },
  { code: '420923-005-009-033-05-1-03', addr: '城关镇梦泽大道88号梦泽社区05栋1单元103室' },
  { code: '420923-006-007-041-06-1-01', addr: '城关镇西大路16号西大社区06栋1单元101室' },
  { code: '420923-006-007-041-06-2-01', addr: '城关镇西大路16号西大社区06栋2单元201室' },
  { code: '420923-007-006-045-07-1-02', addr: '城关镇南环路45号南环社区07栋1单元102室' },
  { code: '420923-008-005-033-08-1-01', addr: '城关镇北环路33号北环社区08栋1单元101室' },
  { code: '420923-009-004-009-09-1-01', addr: '城关镇府前路9号府前社区09栋1单元101室' },
  { code: '420923-010-003-063-10-1-02', addr: '城关镇文化路63号文化社区10栋1单元102室' },
  { code: '420923-011-002-021-11-1-01', addr: '城关镇民主路21号民主社区11栋1单元101室' },
  { code: '420923-012-001-077-12-1-03', addr: '城关镇解放路77号解放社区12栋1单元103室' },
  { code: '420923-013-014-056-13-1-01', addr: '义堂镇义堂大道56号义堂社区13栋1单元101室' },
  { code: '420923-014-013-019-14-1-01', addr: '曾店镇振兴路19号振兴社区14栋1单元101室' },
  { code: '420923-015-012-041-15-1-02', addr: '吴铺镇发展大道41号发展社区15栋1单元102室' },
  { code: '420923-016-011-029-16-1-01', addr: '伍洛镇滨河路29号滨河社区16栋1单元101室' },
  { code: '420923-017-010-014-17-1-01', addr: '下辛店镇商贸路14号商贸社区17栋1单元101室' },
  { code: '420923-018-009-042-18-1-01', addr: '胡金店镇金店大道42号金店社区18栋1单元101室' },
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateName(gender: '男' | '女'): string {
  const surname = randomItem(surnames);
  const givenName = gender === '男' ? randomItem(maleNames) : randomItem(femaleNames);
  return `${surname}${givenName}`;
}

function generateIdCard(): string {
  // 云梦县行政区划代码 420923
  const area = '420923';
  const year = String(1960 + Math.floor(Math.random() * 45));
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  const seq = String(Math.floor(Math.random() * 999)).padStart(3, '0');
  const check = String(Math.floor(Math.random() * 10));
  return `${area}${year}${month}${day}${seq}${check}`;
}

function generatePhone(): string {
  const prefixes = ['138', '139', '136', '137', '158', '159', '188', '187', '155', '153', '176', '177', '178', '130', '131', '132'];
  return `${randomItem(prefixes)}${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`;
}

// 生成实有人口数据
function generatePopulation(count: number): Population[] {
  const result: Population[] = [];
  const educations: Population['education'][] = ['小学', '初中', '高中', '大专', '本科', '硕士'];
  const maritalStatuses: Population['maritalStatus'][] = ['未婚', '已婚', '离异', '丧偶'];

  for (let i = 1; i <= count; i++) {
    const gender: '男' | '女' = i % 3 === 0 ? '女' : '男';
    const addr = addresses[i % addresses.length];
    const isResident = Math.random() > 0.3;
    const updateDate = new Date(2026, 5, 23 - Math.floor(Math.random() * 30));
    const updateTime = `${updateDate.getFullYear()}-${String(updateDate.getMonth() + 1).padStart(2, '0')}-${String(updateDate.getDate()).padStart(2, '0')}`;

    result.push({
      id: `POP${String(i).padStart(5, '0')}`,
      name: generateName(gender),
      idCard: generateIdCard(),
      gender,
      phone: generatePhone(),
      education: randomItem(educations),
      occupation: randomItem(occupations),
      maritalStatus: randomItem(maritalStatuses),
      addressCode: addr.code,
      address: addr.addr,
      isResident,
      updateTime,
    });
  }
  return result;
}

// 生成实有房屋数据
function generateHouses(count: number): House[] {
  const result: House[] = [];
  const propertyTypes: PropertyType[] = ['自住', '出租', '空置', '商用'];

  for (let i = 1; i <= count; i++) {
    const addr = addresses[i % addresses.length];
    const propertyType = randomItem(propertyTypes);
    const isRented = propertyType === '出租';
    const tenants = isRented ? Math.floor(Math.random() * 4) + 1 : 0;

    result.push({
      id: `HSE${String(i).padStart(5, '0')}`,
      addressCode: addr.code,
      address: addr.addr,
      owner: generateName('男'),
      ownerPhone: generatePhone(),
      propertyType,
      area: Math.floor(Math.random() * 150) + 40,
      rooms: Math.floor(Math.random() * 4) + 1,
      isRented,
      tenants,
    });
  }
  return result;
}

// 生成实有单位数据
function generateUnits(count: number): Unit[] {
  const result: Unit[] = [];
  const unitTypes: UnitType[] = ['机关', '团体', '企业', '事业单位', '个体工商户'];
  const unitNames = [
    '云梦县市场监督管理局', '云梦县教育局', '云梦县卫生健康局',
    '云梦县公安局城关派出所', '云梦县城市管理执法局', '云梦县交通运输局',
    '云梦县生态环境局', '云梦县民政局', '云梦县人力资源和社会保障局',
    '云梦县住房和城乡建设局', '云梦县水利和湖泊局', '云梦县农业农村局',
    '云梦县商务局', '云梦县文化和旅游局', '云梦县应急管理局',
    '云梦县供销合作社', '云梦县总工会', '云梦县妇女联合会',
    '云梦县工商业联合会', '云梦县残疾人联合会',
    '云梦县第一中学', '云梦县实验中学', '云梦县实验小学', '云梦县职业教育中心',
    '云梦县人民医院', '云梦县中医院', '云梦县妇幼保健院',
    '湖北云梦盐化产业园', '云梦县富森科技有限公司', '云梦县鑫源纺织有限公司',
    '云梦县华泰建材有限公司', '云梦县绿源农业发展有限公司',
    '城关镇便民超市', '义堂镇五金店', '曾店镇农资店',
    '吴铺镇餐饮店', '伍洛镇理发店', '下辛店镇药店',
    '道桥镇服装店', '隔蒲潭镇电器店', '胡金店镇水果店',
  ];
  const categories: Record<UnitType, string[]> = {
    '机关': ['行政', '执法', '监督'],
    '团体': ['社会团体', '群众团体', '行业组织'],
    '企业': ['制造业', '建筑业', '服务业', '农业', '信息技术'],
    '事业单位': ['教育', '医疗', '科研', '文化'],
    '个体工商户': ['零售', '餐饮', '服务', '维修'],
  };
  const businessScopes: Record<UnitType, string[]> = {
    '机关': ['行政管理', '执法监督', '公共服务'],
    '团体': ['社会服务', '行业协调', '会员管理'],
    '企业': ['生产制造', '工程建设', '商品销售', '技术服务'],
    '事业单位': ['教育教学', '医疗保健', '科学研究', '文化宣传'],
    '个体工商户': ['日用百货', '餐饮服务', '美容美发', '五金建材'],
  };

  for (let i = 1; i <= count; i++) {
    const type = unitTypes[i % unitTypes.length];
    const name = unitNames[i - 1] || `${randomItem(surnames)}${type === '个体工商户' ? '经营部' : '有限公司'}`;

    result.push({
      id: `UNT${String(i).padStart(5, '0')}`,
      name,
      type,
      category: randomItem(categories[type]),
      legalPerson: generateName('男'),
      phone: generatePhone(),
      address: addresses[i % addresses.length].addr,
      employeeCount: type === '个体工商户' ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 100) + 10,
      businessScope: randomItem(businessScopes[type]),
    });
  }
  return result;
}

// 生成流动人口数据
function generateFlowPopulation(count: number): FlowPopulation[] {
  const result: FlowPopulation[] = [];
  const residenceTypes: ResidenceType[] = ['租赁', '借住', '单位宿舍', '其他'];
  const fromPlaces = [
    '河南省信阳市', '河南省驻马店市', '安徽省六安市', '安徽省阜阳市',
    '湖南省岳阳市', '江西省九江市', '四川省达州市', '重庆市',
    '贵州省铜仁市', '云南省昭通市', '甘肃省陇南市', '陕西省安康市',
    '山东省菏泽市', '河北省邯郸市', '广西壮族自治区桂林市',
  ];

  for (let i = 1; i <= count; i++) {
    const gender: '男' | '女' = i % 3 === 0 ? '女' : '男';
    const registerDate = new Date(2026, 5, 23 - Math.floor(Math.random() * 90));
    const permitExpiry = new Date(registerDate.getTime() + 365 * 24 * 60 * 60 * 1000);

    result.push({
      id: `FLW${String(i).padStart(5, '0')}`,
      name: generateName(gender),
      idCard: generateIdCard(),
      gender,
      fromPlace: fromPlaces[i % fromPlaces.length],
      residenceAddress: addresses[i % addresses.length].addr,
      residenceType: randomItem(residenceTypes),
      permitNo: `JZ${String(420923).padStart(6, '0')}${String(i).padStart(6, '0')}`,
      permitExpiry: `${permitExpiry.getFullYear()}-${String(permitExpiry.getMonth() + 1).padStart(2, '0')}-${String(permitExpiry.getDate()).padStart(2, '0')}`,
      registerDate: `${registerDate.getFullYear()}-${String(registerDate.getMonth() + 1).padStart(2, '0')}-${String(registerDate.getDate()).padStart(2, '0')}`,
    });
  }
  return result;
}

export const population: Population[] = generatePopulation(56);
export const houses: House[] = generateHouses(33);
export const units: Unit[] = generateUnits(22);
export const flowPopulation: FlowPopulation[] = generateFlowPopulation(16);

export const collectionStats: CollectionStats = {
  populationTotal: 523467,
  populationResident: 487623,
  populationNonResident: 35844,
  houseTotal: 186534,
  houseSelfOccupied: 142367,
  houseRented: 28456,
  houseVacant: 9876,
  houseCommercial: 5835,
  unitTotal: 8923,
  flowTotal: 35844,
};
