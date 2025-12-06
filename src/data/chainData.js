// Mock 데이터 - Mintscan Mainnet 40개 체인
// 로고: https://www.mintscan.io/assets/chains/_rendered/{chain}@3x.png
export const chainData = [
  // Tier 1 - 대형 체인
  { id: 1, name: 'COSMOS HUB', ticker: 'ATOM', score: 95, logo: 'https://www.mintscan.io/assets/chains/_rendered/cosmos@3x.png' },
  { id: 2, name: 'OSMOSIS', ticker: 'OSMO', score: 92, logo: 'https://www.mintscan.io/assets/chains/_rendered/osmosis@3x.png' },
  { id: 3, name: 'CELESTIA', ticker: 'TIA', score: 89, logo: 'https://www.mintscan.io/assets/chains/_rendered/celestia@3x.png' },
  { id: 4, name: 'DYDX', ticker: 'DYDX', score: 87, logo: 'https://www.mintscan.io/assets/chains/_rendered/dydx@3x.png' },
  { id: 5, name: 'INJECTIVE', ticker: 'INJ', score: 85, logo: 'https://www.mintscan.io/assets/chains/_rendered/injective@3x.png' },
  { id: 6, name: 'SEI', ticker: 'SEI', score: 83, logo: 'https://www.mintscan.io/assets/chains/_rendered/sei@3x.png' },
  { id: 7, name: 'AKASH', ticker: 'AKT', score: 81, logo: 'https://www.mintscan.io/assets/chains/_rendered/akash@3x.png' },
  
  // Tier 2 - 주요 체인
  { id: 8, name: 'BABYLON', ticker: 'BABY', score: 79, logo: 'https://www.mintscan.io/assets/chains/_rendered/babylon@3x.png' },
  { id: 9, name: 'STRIDE', ticker: 'STRD', score: 77, logo: 'https://www.mintscan.io/assets/chains/_rendered/stride@3x.png' },
  { id: 10, name: 'NEUTRON', ticker: 'NTRN', score: 75, logo: 'https://www.mintscan.io/assets/chains/_rendered/neutron@3x.png' },
  { id: 11, name: 'AXELAR', ticker: 'AXL', score: 73, logo: 'https://www.mintscan.io/assets/chains/_rendered/axelar@3x.png' },
  { id: 12, name: 'KAVA', ticker: 'KAVA', score: 71, logo: 'https://www.mintscan.io/assets/chains/_rendered/kava@3x.png' },
  { id: 13, name: 'SECRET', ticker: 'SCRT', score: 69, logo: 'https://www.mintscan.io/assets/chains/_rendered/secret@3x.png' },
  { id: 14, name: 'STARGAZE', ticker: 'STARS', score: 67, logo: 'https://www.mintscan.io/assets/chains/_rendered/stargaze@3x.png' },
  { id: 15, name: 'AGORIC', ticker: 'BLD', score: 65, logo: 'https://www.mintscan.io/assets/chains/_rendered/agoric@3x.png' },
  
  // Tier 3 - 중형 체인
  { id: 16, name: 'ARCHWAY', ticker: 'ARCH', score: 63, logo: 'https://www.mintscan.io/assets/chains/_rendered/archway@3x.png' },
  { id: 17, name: 'BAND', ticker: 'BAND', score: 61, logo: 'https://www.mintscan.io/assets/chains/_rendered/band@3x.png' },
  { id: 18, name: 'CHIHUAHUA', ticker: 'HUAHUA', score: 59, logo: 'https://www.mintscan.io/assets/chains/_rendered/chihuahua@3x.png' },
  { id: 19, name: 'COREUM', ticker: 'COREUM', score: 57, logo: 'https://www.mintscan.io/assets/chains/_rendered/coreum@3x.png' },
  { id: 20, name: 'CRONOS POS', ticker: 'CRO', score: 55, logo: 'https://www.mintscan.io/assets/chains/_rendered/crypto-org@3x.png' },
  { id: 21, name: 'ASI ALLIANCE', ticker: 'FET', score: 53, logo: 'https://www.mintscan.io/assets/chains/_rendered/fetchai@3x.png' },
  { id: 22, name: 'GRAVITY BRIDGE', ticker: 'GRAV', score: 51, logo: 'https://www.mintscan.io/assets/chains/_rendered/gravity-bridge@3x.png' },
  { id: 23, name: 'HUMANS.AI', ticker: 'HEART', score: 49, logo: 'https://www.mintscan.io/assets/chains/_rendered/humans@3x.png' },
  { id: 24, name: 'MANTRA', ticker: 'OM', score: 47, logo: 'https://www.mintscan.io/assets/chains/_rendered/mantra@3x.png' },
  { id: 25, name: 'MEDIBLOC', ticker: 'MED', score: 45, logo: 'https://www.mintscan.io/assets/chains/_rendered/medibloc@3x.png' },
  
  // Tier 4 - 소형 체인
  { id: 26, name: 'MILKYWAY', ticker: 'MILK', score: 43, logo: 'https://www.mintscan.io/assets/chains/_rendered/milkyway@3x.png' },
  { id: 27, name: 'NILLION', ticker: 'NIL', score: 41, logo: 'https://www.mintscan.io/assets/chains/_rendered/nillion@3x.png' },
  { id: 28, name: 'NOBLE', ticker: 'NOBLE', score: 39, logo: 'https://www.mintscan.io/assets/chains/_rendered/noble@3x.png' },
  { id: 29, name: 'PERSISTENCE', ticker: 'XPRT', score: 37, logo: 'https://www.mintscan.io/assets/chains/_rendered/persistence@3x.png' },
  { id: 30, name: 'PROVENANCE', ticker: 'HASH', score: 35, logo: 'https://www.mintscan.io/assets/chains/_rendered/provenance@3x.png' },
  { id: 31, name: 'REGEN', ticker: 'REGEN', score: 33, logo: 'https://www.mintscan.io/assets/chains/_rendered/regen@3x.png' },
  { id: 32, name: 'SAGA', ticker: 'SAGA', score: 31, logo: 'https://www.mintscan.io/assets/chains/_rendered/saga@3x.png' },
  { id: 33, name: 'SHENTU', ticker: 'CTK', score: 29, logo: 'https://www.mintscan.io/assets/chains/_rendered/shentu@3x.png' },
  { id: 34, name: 'TERRA', ticker: 'LUNA', score: 27, logo: 'https://www.mintscan.io/assets/chains/_rendered/terra@3x.png' },
  { id: 35, name: 'ALTHEA', ticker: 'ALTHEA', score: 25, logo: 'https://www.mintscan.io/assets/chains/_rendered/althea@3x.png' },
  
  // Tier 5 - 기타 체인
  { id: 36, name: 'ATOMONE', ticker: 'ATONE', score: 23, logo: 'https://www.mintscan.io/assets/chains/_rendered/atomone@3x.png' },
  { id: 37, name: 'LOMBARD', ticker: 'LOM', score: 21, logo: 'https://www.mintscan.io/assets/chains/_rendered/lombard@3x.png' },
  { id: 38, name: 'XION', ticker: 'XION', score: 19, logo: 'https://www.mintscan.io/assets/chains/_rendered/xion@3x.png' },
  { id: 39, name: 'XPLA', ticker: 'XPLA', score: 17, logo: 'https://www.mintscan.io/assets/chains/_rendered/xpla@3x.png' },
  { id: 40, name: 'ZETACHAIN', ticker: 'ZETA', score: 15, logo: '/ZETACHAIN.png' },
];

export default chainData;

