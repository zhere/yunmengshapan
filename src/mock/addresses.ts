// 标准地址数据 - 云梦县门牌管理模拟数据

export type AddressStatus = '正常' | '变更' | '注销';

export interface Address {
  id: string;
  code: string;
  fullAddress: string;
  province: string;
  city: string;
  county: string;
  street: string;
  plateNo: string;
  community: string;
  building: string;
  unit: string;
  room: string;
  status: AddressStatus;
  lng: number;
  lat: number;
}

export interface AddressStats {
  total: number;
  normalCount: number;
  changedCount: number;
  cancelledCount: number;
  byStreet: { street: string; count: number }[];
}

const streets = [
  { name: '曲阳路', code: '001' },
  { name: '建设路', code: '002' },
  { name: '楚王城大道', code: '003' },
  { name: '珍珠坡路', code: '004' },
  { name: '梦泽大道', code: '005' },
  { name: '西大路', code: '006' },
  { name: '南环路', code: '007' },
  { name: '北环路', code: '008' },
  { name: '府前路', code: '009' },
  { name: '文化路', code: '010' },
  { name: '民主路', code: '011' },
  { name: '解放路', code: '012' },
  { name: '义堂大道', code: '013' },
  { name: '振兴路', code: '014' },
  { name: '发展大道', code: '015' },
  { name: '滨河路', code: '016' },
  { name: '商贸路', code: '017' },
  { name: '金店大道', code: '018' },
];

const communities = [
  '曲阳社区', '建设社区', '楚王城社区', '珍珠坡社区', '梦泽社区',
  '西大社区', '南环社区', '北环社区', '府前社区', '文化社区',
  '民主社区', '解放社区', '义堂社区', '振兴社区', '发展社区',
  '滨河社区', '商贸社区', '金店社区',
];

const statuses: AddressStatus[] = ['正常', '变更', '注销'];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function padNum(n: number, len: number): string {
  return String(n).padStart(len, '0');
}

function generateAddresses(count: number): Address[] {
  const addresses: Address[] = [];
  for (let i = 1; i <= count; i++) {
    const streetIdx = i % streets.length;
    const street = streets[streetIdx];
    const community = communities[streetIdx];
    const plateNo = padNum(Math.floor(Math.random() * 200) + 1, 3);
    const building = padNum(Math.floor(Math.random() * 20) + 1, 2);
    const unit = padNum(Math.floor(Math.random() * 4) + 1, 1);
    const room = `${padNum(Math.floor(Math.random() * 6) + 1, 1)}0${padNum(Math.floor(Math.random() * 4) + 1, 1)}`;

    const statusRand = Math.random();
    const status: AddressStatus = statusRand < 0.85 ? '正常' : statusRand < 0.95 ? '变更' : '注销';

    const code = `420923-${street.code}-${padNum(Math.floor(Math.random() * 20) + 1, 3)}-${plateNo}-${building}-${unit}-${room.slice(0, 2)}`;

    addresses.push({
      id: `ADDR${String(i).padStart(5, '0')}`,
      code,
      fullAddress: `湖北省孝感市云梦县城关镇${street.name}${plateNo}号${community}${building}栋${unit}单元${room}室`,
      province: '湖北省',
      city: '孝感市',
      county: '云梦县',
      street: `城关镇${street.name}`,
      plateNo: `${plateNo}号`,
      community,
      building: `${building}栋`,
      unit: `${unit}单元`,
      room: `${room}室`,
      status,
      lng: +(113.7 + Math.random() * 0.2).toFixed(6),
      lat: +(30.9 + Math.random() * 0.2).toFixed(6),
    });
  }
  return addresses;
}

export const addresses: Address[] = generateAddresses(108);

export const addressStats: AddressStats = {
  total: 32567,
  normalCount: 30145,
  changedCount: 1892,
  cancelledCount: 530,
  byStreet: [
    { street: '曲阳路', count: 2856 },
    { street: '建设路', count: 2345 },
    { street: '楚王城大道', count: 3120 },
    { street: '珍珠坡路', count: 1876 },
    { street: '梦泽大道', count: 2678 },
    { street: '西大路', count: 1543 },
    { street: '南环路', count: 1987 },
    { street: '北环路', count: 1765 },
    { street: '府前路', count: 1234 },
    { street: '文化路', count: 2134 },
    { street: '民主路', count: 1567 },
    { street: '解放路', count: 1890 },
  ],
};
