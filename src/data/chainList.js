/**
 * 37개 블록체인 목록 (Noble, Lombard, ZetaChain 제외)
 * 
 * 제외 사유:
 * - Noble: 시장데이터 전체 null, proposals/validators 빈 파일
 * - Lombard: 시장데이터 전체 null, validators 빈 파일
 * - ZetaChain: 데이터 폴더 없음
 */

export const CHAINS = [
  { id: 'cosmos', name: 'Cosmos Hub', symbol: 'ATOM', folder: 'Cosmos' },
  { id: 'babylon', name: 'Babylon', symbol: 'BABY', folder: 'Babylon' },
  { id: 'osmosis', name: 'Osmosis', symbol: 'OSMO', folder: 'Osmosis' },
  { id: 'secret', name: 'Secret', symbol: 'SCRT', folder: 'Secret' },
  { id: 'agoric', name: 'Agoric', symbol: 'BLD', folder: 'Agoric' },
  { id: 'akash', name: 'Akash', symbol: 'AKT', folder: 'Akash' },
  { id: 'althea', name: 'Althea', symbol: 'ALTHEA', folder: 'Althea', issues: ['marketCap_null'] },
  { id: 'archway', name: 'Archway', symbol: 'ARCH', folder: 'Archway' },
  { id: 'atomone', name: 'AtomOne', symbol: 'ATONE', folder: 'AtomOne' },
  { id: 'axelar', name: 'Axelar', symbol: 'AXL', folder: 'Axelar', issues: ['tokenSupply_zero'] },
  { id: 'band', name: 'Band', symbol: 'BAND', folder: 'Band' },
  { id: 'celestia', name: 'Celestia', symbol: 'TIA', folder: 'Celestia' },
  { id: 'chihuahua', name: 'Chihuahua', symbol: 'HUAHUA', folder: 'Chihuahua' },
  { id: 'coreum', name: 'Coreum', symbol: 'COREUM', folder: 'Coreum' },
  { id: 'cronos', name: 'Cronos POS', symbol: 'CRO', folder: 'Cronos POS' },
  { id: 'dydx', name: 'dYdX', symbol: 'DYDX', folder: 'DYDX' },
  { id: 'asi', name: 'ASI Alliance', symbol: 'FET', folder: 'ASI Alliance', issues: ['tokenSupply_zero'] },
  { id: 'gravity', name: 'Gravity Bridge', symbol: 'GRAV', folder: 'Gravity Bridge' },
  { id: 'humans', name: 'Humans.ai', symbol: 'HEART', folder: 'Humans.ai' },
  { id: 'injective', name: 'Injective', symbol: 'INJ', folder: 'Injective' },
  { id: 'kava', name: 'Kava', symbol: 'KAVA', folder: 'Kava' },
  { id: 'mantra', name: 'MANTRA', symbol: 'OM', folder: 'Mantra' },
  { id: 'medibloc', name: 'MediBloc', symbol: 'MED', folder: 'MediBloc' },
  { id: 'milkyway', name: 'MilkyWay', symbol: 'MILK', folder: 'MilkyWay', issues: ['recent_5days_null'] },
  { id: 'neutron', name: 'Neutron', symbol: 'NTRN', folder: 'Neutron' },
  { id: 'nillion', name: 'Nillion', symbol: 'NIL', folder: 'Nillion' },
  { id: 'persistence', name: 'Persistence', symbol: 'XPRT', folder: 'Persistence' },
  { id: 'provenance', name: 'Provenance', symbol: 'HASH', folder: 'Provenance' },
  { id: 'regen', name: 'Regen', symbol: 'REGEN', folder: 'Regen' },
  { id: 'saga', name: 'Saga', symbol: 'SAGA', folder: 'Saga' },
  { id: 'sei', name: 'Sei', symbol: 'SEI', folder: 'Sei' },
  { id: 'shentu', name: 'Shentu', symbol: 'CTK', folder: 'Shentu' },
  { id: 'stargaze', name: 'Stargaze', symbol: 'STARS', folder: 'Stargaze' },
  { id: 'stride', name: 'Stride', symbol: 'STRD', folder: 'Stride' },
  { id: 'terra', name: 'Terra', symbol: 'LUNA', folder: 'Terra' },
  { id: 'xion', name: 'Xion', symbol: 'XION', folder: 'Xion' },
  { id: 'xpla', name: 'XPLA', symbol: 'XPLA', folder: 'XPLA' },
];

// 제외된 체인
export const EXCLUDED_CHAINS = [
  { id: 'noble', name: 'Noble', symbol: 'NOBLE', reason: '시장데이터 전체 null, proposals/validators 빈 파일' },
  { id: 'lombard', name: 'Lombard', symbol: 'LOM', reason: '시장데이터 전체 null, validators 빈 파일' },
  { id: 'zetachain', name: 'ZetaChain', symbol: 'ZETA', reason: '데이터 폴더 없음' },
];

// 10개 세부 지표 정의
export const METRICS = {
  proposalRate: {
    name: 'Proposal Rate',
    description: '투표 참여율',
    source: 'proposals',
    higherIsBetter: true,
  },
  proposalCount: {
    name: 'Proposal Count', 
    description: '제안 수',
    source: 'proposals',
    higherIsBetter: true,
  },
  ibcOut: {
    name: 'IBC Out',
    description: 'IBC 전송량',
    source: 'relayer',
    higherIsBetter: true,
  },
  liveTime: {
    name: 'Live Time',
    description: '체인 운영 기간 (일)',
    source: 'base',
    higherIsBetter: true,
  },
  nc: {
    name: 'NC',
    description: '나카모토 계수',
    source: 'validators',
    higherIsBetter: true, // 높을수록 탈중앙화
  },
  priceVolatility: {
    name: 'Price Volatility',
    description: '가격 변동성',
    source: 'base',
    higherIsBetter: false, // 낮을수록 안정적
  },
  activeAddress: {
    name: 'Active Address',
    description: '활성 주소 수',
    source: 'base',
    higherIsBetter: true,
  },
  marketCap: {
    name: 'Market Cap',
    description: '시가총액',
    source: 'base',
    higherIsBetter: true,
  },
  transactionVolume: {
    name: 'Transaction Volume',
    description: '거래량',
    source: 'base',
    higherIsBetter: true,
  },
  stakingRatio: {
    name: 'Staking Ratio',
    description: '스테이킹 비율',
    source: 'base',
    higherIsBetter: true,
  },
};

// 체인 출시일 (Live Time 계산용)
export const CHAIN_LAUNCH_DATES = {
  cosmos: '2019-03-13',
  osmosis: '2021-06-19',
  secret: '2020-02-13',
  agoric: '2022-05-28',
  akash: '2020-09-25',
  althea: '2024-04-24',
  archway: '2023-06-14',
  atomone: '2024-02-27',
  axelar: '2022-02-07',
  babylon: '2024-04-09',
  band: '2020-06-10',
  celestia: '2023-10-31',
  chihuahua: '2022-01-04',
  coreum: '2023-03-25',
  cronos: '2021-03-25',
  dydx: '2023-10-26',
  asi: '2021-03-31', // Fetch.ai 기준
  gravity: '2021-12-14',
  humans: '2023-01-18',
  injective: '2021-11-17',
  kava: '2019-11-14',
  mantra: '2024-10-23',
  medibloc: '2021-05-12',
  milkyway: '2024-06-01',
  neutron: '2023-05-10',
  nillion: '2024-03-20',
  persistence: '2021-03-30',
  provenance: '2021-03-26',
  regen: '2021-04-15',
  saga: '2024-04-09',
  sei: '2023-08-15',
  shentu: '2019-10-24',
  stargaze: '2021-10-29',
  stride: '2022-09-05',
  terra: '2022-05-28', // Terra 2.0
  xion: '2024-03-07',
  xpla: '2022-04-25',
};

export default CHAINS;

