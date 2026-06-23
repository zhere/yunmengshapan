// 设备数据 - 云梦县摄像头设备模拟数据

export type DeviceStatus = 'online' | 'offline' | 'maintenance';
export type DeviceType = '球机' | '枪机' | '半球';
export type DeviceDepartment = '公安局' | '城管局' | '交通局' | '环保局' | '教育局' | '社区';

export interface Device {
  id: string;
  name: string;
  location: string;
  status: DeviceStatus;
  type: DeviceType;
  department: DeviceDepartment;
  lng: number;
  lat: number;
  ip: string;
  groupName: string;
}

export interface DeviceStats {
  total: number;
  online: number;
  offline: number;
  maintenance: number;
  onlineRate: number;
}

// 云梦县主要区域和街道
const locations = [
  '城关镇曲阳路', '城关镇建设路', '城关镇楚王城大道', '城关镇珍珠坡路',
  '城关镇梦泽大道', '城关镇西大路', '城关镇南环路', '城关镇北环路',
  '城关镇府前路', '城关镇文化路', '城关镇民主路', '城关镇解放路',
  '义堂镇中心街', '义堂镇义堂大道', '义堂镇文化路',
  '曾店镇曾店街', '曾店镇振兴路', '曾店镇富民路',
  '吴铺镇吴铺街', '吴铺镇发展大道', '吴铺镇和谐路',
  '伍洛镇伍洛街', '伍洛镇滨河路', '伍洛镇新街',
  '下辛店镇下辛店街', '下辛店镇商贸路', '下辛店镇兴农路',
  '道桥镇道桥街', '道桥镇桥东路', '道桥镇滨河路',
  '隔蒲潭镇隔蒲街', '隔蒲潭镇蒲潭路', '隔蒲潭镇永安路',
  '胡金店镇胡金店街', '胡金店镇金店大道', '胡金店镇兴业路',
  '倒店乡倒店街', '倒店乡民生路', '倒店乡富民路',
  '沙河乡沙河街', '沙河乡河东路', '沙河乡新街',
  '清明河乡清明街', '清明河乡河堤路', '清明河乡兴农路',
  '云梦东站广场', '云梦火车站', '云梦县政务服务中心',
  '云梦县人民医院', '云梦县中医院', '云梦县第一中学',
  '云梦县实验中学', '云梦县实验小学', '云梦县体育中心',
  '云梦县博物馆', '云梦县文化广场', '云梦县汽车客运站',
  '云梦县农贸市场', '云梦县商业步行街', '云梦县工业园区',
  '云梦县湿地公园', '云梦县烈士陵园', '云梦县图书馆',
];

const departments: DeviceDepartment[] = ['公安局', '城管局', '交通局', '环保局', '教育局', '社区'];
const deviceTypes: DeviceType[] = ['球机', '枪机', '半球'];
const statuses: DeviceStatus[] = ['online', 'offline', 'maintenance'];

const groupNames = [
  '城关镇监控组', '义堂镇监控组', '曾店镇监控组', '吴铺镇监控组',
  '伍洛镇监控组', '下辛店镇监控组', '道桥镇监控组', '隔蒲潭镇监控组',
  '胡金店镇监控组', '倒店乡监控组', '沙河乡监控组', '清明河乡监控组',
  '交通卡口组', '学校监控组', '医院监控组', '公共场所监控组',
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomIp(): string {
  return `192.168.${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 254) + 1}`;
}

function randomLng(): number {
  return +(113.7 + Math.random() * 0.2).toFixed(6);
}

function randomLat(): number {
  return +(30.9 + Math.random() * 0.2).toFixed(6);
}

// 生成设备名称
function generateDeviceName(index: number, department: DeviceDepartment, type: DeviceType): string {
  const typeMap: Record<DeviceType, string> = {
    '球机': '球机',
    '枪机': '枪机',
    '半球': '半球',
  };
  return `${department}${typeMap[type]}${String(index).padStart(3, '0')}`;
}

// 生成200+设备数据
function generateDevices(count: number): Device[] {
  const devices: Device[] = [];
  for (let i = 1; i <= count; i++) {
    const department = departments[i % departments.length];
    const type = deviceTypes[i % deviceTypes.length];
    // 92%在线, 6%离线, 2%维护
    const statusRand = Math.random();
    const status: DeviceStatus = statusRand < 0.92 ? 'online' : statusRand < 0.98 ? 'offline' : 'maintenance';

    devices.push({
      id: `DEV${String(i).padStart(5, '0')}`,
      name: generateDeviceName(i, department, type),
      location: randomItem(locations),
      status,
      type,
      department,
      lng: randomLng(),
      lat: randomLat(),
      ip: randomIp(),
      groupName: randomItem(groupNames),
    });
  }
  return devices;
}

export const devices: Device[] = generateDevices(215);

export const deviceStats: DeviceStats = {
  total: 2156,
  online: 1987,
  offline: 134,
  maintenance: 35,
  onlineRate: 92.2,
};
