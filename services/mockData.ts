import { Client, Investment, AssetType, AppData } from '../types';

const CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    phone: '+1 (555) 0101',
    riskProfile: 'Medium',
    joinedDate: '2022-03-15',
    avatarUrl: 'https://picsum.photos/id/64/200/200'
  },
  {
    id: 'c2',
    name: 'Michael Chen',
    email: 'm.chen@techfirm.io',
    phone: '+1 (555) 0102',
    riskProfile: 'High',
    joinedDate: '2021-11-02',
    avatarUrl: 'https://picsum.photos/id/91/200/200'
  },
  {
    id: 'c3',
    name: 'Sarah Connor',
    email: 'sarah.c@skynet.net',
    phone: '+1 (555) 0103',
    riskProfile: 'Low',
    joinedDate: '2023-01-20',
    avatarUrl: 'https://picsum.photos/id/103/200/200'
  },
  {
    id: 'c4',
    name: 'David Bowman',
    email: 'dave@jupiter.org',
    phone: '+1 (555) 0104',
    riskProfile: 'Medium',
    joinedDate: '2020-08-14',
    avatarUrl: 'https://picsum.photos/id/192/200/200'
  }
];

const INVESTMENTS: Investment[] = [
  // Alice (Medium Risk)
  { id: 'i1', clientId: 'c1', name: 'Apple Inc.', symbol: 'AAPL', type: AssetType.STOCK, quantity: 50, purchasePrice: 150, currentPrice: 185.50, purchaseDate: '2022-06-01' },
  { id: 'i2', clientId: 'c1', name: 'Vanguard Total World Stock', symbol: 'VT', type: AssetType.MUTUAL_FUND, quantity: 200, purchasePrice: 90, currentPrice: 105.20, purchaseDate: '2022-04-15' },
  { id: 'i3', clientId: 'c1', name: 'US Treasury Bond 10Y', symbol: 'US10Y', type: AssetType.BOND, quantity: 10, purchasePrice: 1000, currentPrice: 980, purchaseDate: '2023-01-10' },

  // Michael (High Risk)
  { id: 'i4', clientId: 'c2', name: 'Bitcoin', symbol: 'BTC', type: AssetType.CRYPTO, quantity: 0.5, purchasePrice: 45000, currentPrice: 62000, purchaseDate: '2021-12-01' },
  { id: 'i5', clientId: 'c2', name: 'NVIDIA Corp', symbol: 'NVDA', type: AssetType.STOCK, quantity: 30, purchasePrice: 300, currentPrice: 850, purchaseDate: '2022-01-20' },
  { id: 'i6', clientId: 'c2', name: 'Tesla Inc.', symbol: 'TSLA', type: AssetType.STOCK, quantity: 100, purchasePrice: 200, currentPrice: 175, purchaseDate: '2023-05-05' },

  // Sarah (Low Risk)
  { id: 'i7', clientId: 'c3', name: 'Vanguard 500 Index', symbol: 'VFIAX', type: AssetType.MUTUAL_FUND, quantity: 150, purchasePrice: 400, currentPrice: 445, purchaseDate: '2023-02-01' },
  { id: 'i8', clientId: 'c3', name: 'Gold Trust', symbol: 'GLD', type: AssetType.STOCK, quantity: 20, purchasePrice: 180, currentPrice: 210, purchaseDate: '2023-03-10' },
  { id: 'i9', clientId: 'c3', name: 'High Yield Savings', symbol: 'HYSA', type: AssetType.CASH, quantity: 50000, purchasePrice: 1, currentPrice: 1, purchaseDate: '2023-01-20' },

  // David (Medium)
  { id: 'i10', clientId: 'c4', name: 'Microsoft', symbol: 'MSFT', type: AssetType.STOCK, quantity: 40, purchasePrice: 280, currentPrice: 410, purchaseDate: '2021-09-01' },
  { id: 'i11', clientId: 'c4', name: 'Ethereum', symbol: 'ETH', type: AssetType.CRYPTO, quantity: 5, purchasePrice: 2000, currentPrice: 3500, purchaseDate: '2021-09-10' },
  { id: 'i12', clientId: 'c4', name: 'Rental Property Fund', symbol: 'REIT', type: AssetType.REAL_ESTATE, quantity: 500, purchasePrice: 50, currentPrice: 55, purchaseDate: '2020-09-01' }
];

export const getMockData = (): AppData => {
  return {
    clients: CLIENTS,
    investments: INVESTMENTS
  };
};