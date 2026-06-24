// 小程序提交记录数据 - 网格员通过小程序提交的一标三实/地址核采记录

export type CollectionType = '人口核采' | '房屋核查' | '单位核采' | '标准地址校对' | '门牌申报';
export type SystemCheck = '通过' | '未通过' | '待校验';
export type ReviewStatus = '待审核' | '已通过' | '已驳回';

export interface SubmissionRecord {
  id: string;
  submitNo: string;
  standardAddress: string;
  addressCode: string;
  gridName: string;
  submitter: string;
  submitterPhone: string;
  collectionType: CollectionType;
  systemCheck: SystemCheck;
  reviewStatus: ReviewStatus;
  exceptionTag: string;
  submitTime: string;
  reviewTime: string;
  reviewComment: string;
  images: number;
}

const submitters = [
  { name: '张伟', phone: '138****5678', grid: '曲阳社区第一网格' },
  { name: '李强', phone: '139****2345', grid: '建设社区第一网格' },
  { name: '王磊', phone: '136****7890', grid: '楚王城社区第一网格' },
  { name: '刘军', phone: '158****3456', grid: '珍珠坡社区第一网格' },
  { name: '陈勇', phone: '159****6789', grid: '梦泽社区第一网格' },
  { name: '杨杰', phone: '137****9012', grid: '西大社区第一网格' },
  { name: '赵涛', phone: '188****4567', grid: '南环社区第一网格' },
  { name: '黄明', phone: '155****8901', grid: '义堂社区第一网格' },
];

const addresses = [
  '湖北省孝感市云梦县城关镇曲阳路58号曲阳社区01栋1单元101室',
  '湖北省孝感市云梦县城关镇曲阳路58号曲阳社区01栋1单元102室',
  '湖北省孝感市云梦县城关镇曲阳路58号曲阳社区01栋2单元201室',
  '湖北省孝感市云梦县城关镇建设路102号建设社区02栋1单元103室',
  '湖北省孝感市云梦县城关镇建设路102号建设社区02栋2单元201室',
  '湖北省孝感市云梦县城关镇楚王城大道35号楚王城社区03栋1单元101室',
  '湖北省孝感市云梦县城关镇楚王城大道35号楚王城社区03栋1单元102室',
  '湖北省孝感市云梦县城关镇珍珠坡路27号珍珠坡社区04栋1单元101室',
  '湖北省孝感市云梦县城关镇珍珠坡路27号珍珠坡社区04栋2单元202室',
  '湖北省孝感市云梦县城关镇梦泽大道88号梦泽社区05栋1单元101室',
  '湖北省孝感市云梦县城关镇梦泽大道88号梦泽社区05栋1单元103室',
  '湖北省孝感市云梦县城关镇西大路16号西大社区06栋1单元101室',
  '湖北省孝感市云梦县城关镇南环路45号南环社区07栋1单元102室',
  '湖北省孝感市云梦县城关镇北环路33号北环社区08栋1单元101室',
  '湖北省孝感市云梦县城关镇府前路9号府前社区09栋1单元101室',
  '湖北省孝感市云梦县城关镇文化路63号文化社区10栋1单元102室',
  '湖北省孝感市云梦县城关镇民主路21号民主社区11栋1单元101室',
  '湖北省孝感市云梦县城关镇解放路77号解放社区12栋1单元103室',
  '湖北省孝感市云梦县义堂镇义堂大道56号义堂社区13栋1单元101室',
  '湖北省孝感市云梦县曾店镇振兴路19号振兴社区14栋1单元101室',
];

const addressCodes = [
  '420923-001-015-003-01-1-01', '420923-001-015-003-01-1-02', '420923-001-015-003-01-2-01',
  '420923-002-012-007-02-1-03', '420923-002-012-007-02-2-01', '420923-003-008-015-03-1-01',
  '420923-003-008-015-03-1-02', '420923-004-011-021-04-1-01', '420923-004-011-021-04-2-02',
  '420923-005-009-033-05-1-01', '420923-005-009-033-05-1-03', '420923-006-007-041-06-1-01',
  '420923-007-006-045-07-1-02', '420923-008-005-033-08-1-01', '420923-009-004-009-09-1-01',
  '420923-010-003-063-10-1-02', '420923-011-002-021-11-1-01', '420923-012-001-077-12-1-03',
  '420923-013-014-056-13-1-01', '420923-014-013-019-14-1-01',
];

const collectionTypes: CollectionType[] = ['人口核采', '房屋核查', '单位核采', '标准地址校对', '门牌申报'];
const exceptionTags = ['—', '地址重复', '信息不完整', '坐标偏移', '门牌缺失', '照片模糊', '数据冲突'];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function padNum(n: number, len: number): string {
  return String(n).padStart(len, '0');
}

function generateSubmissionRecords(count: number): SubmissionRecord[] {
  const records: SubmissionRecord[] = [];
  for (let i = 1; i <= count; i++) {
    const submitter = submitters[i % submitters.length];
    const collectionType = collectionTypes[i % collectionTypes.length];
    const isPass = Math.random() > 0.25;
    const systemCheck: SystemCheck = isPass ? '通过' : Math.random() > 0.5 ? '未通过' : '待校验';
    const isReviewed = collectionType !== '标准地址校对' ? Math.random() > 0.3 : Math.random() > 0.6;
    const isApproved = isReviewed && Math.random() > 0.2;
    const reviewStatus: ReviewStatus = !isReviewed ? '待审核' : isApproved ? '已通过' : '已驳回';

    // 异常标签：系统校验未通过或已驳回时有异常标签
    let exceptionTag: string;
    if (systemCheck === '未通过' || reviewStatus === '已驳回') {
      exceptionTag = randomItem(exceptionTags.filter(t => t !== '—'));
    } else {
      exceptionTag = Math.random() > 0.85 ? randomItem(exceptionTags.filter(t => t !== '—')) : '—';
    }

    const submitDate = new Date(2026, 5, 23 - Math.floor(Math.random() * 14));
    const submitTime = `${submitDate.getFullYear()}-${padNum(submitDate.getMonth() + 1, 2)}-${padNum(submitDate.getDate(), 2)} ${padNum(8 + Math.floor(Math.random() * 10), 2)}:${padNum(Math.floor(Math.random() * 60), 2)}:00`;

    const reviewDate = new Date(submitDate.getTime() + (Math.random() > 0.5 ? 1 : 2) * 24 * 60 * 60 * 1000);
    const reviewTime = isReviewed ? `${reviewDate.getFullYear()}-${padNum(reviewDate.getMonth() + 1, 2)}-${padNum(reviewDate.getDate(), 2)} ${padNum(9 + Math.floor(Math.random() * 8), 2)}:${padNum(Math.floor(Math.random() * 60), 2)}:00` : '—';

    const reviewComments: Record<string, string> = {
      '已通过': '数据核实无误，审核通过。',
      '已驳回': `信息有误，请重新采集。${randomItem(['地址与实际不符', '缺少照片佐证', '信息填写不完整'])}`,
      '待审核': '',
    };

    records.push({
      id: `SUBM${padNum(i, 4)}`,
      submitNo: `SUBM-${submitDate.getFullYear()}${padNum(submitDate.getMonth() + 1, 2)}${padNum(submitDate.getDate(), 2)}-${padNum(i, 3)}`,
      standardAddress: addresses[i % addresses.length],
      addressCode: addressCodes[i % addressCodes.length],
      gridName: submitter.grid,
      submitter: submitter.name,
      submitterPhone: submitter.phone,
      collectionType,
      systemCheck,
      reviewStatus,
      exceptionTag,
      submitTime,
      reviewTime,
      reviewComment: reviewComments[reviewStatus] || '',
      images: Math.floor(Math.random() * 5) + 1,
    });
  }
  return records;
}

export const submissionRecords: SubmissionRecord[] = generateSubmissionRecords(36);
