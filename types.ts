export enum AssetType {
  STOCK = 'Stock',
  MUTUAL_FUND = 'Mutual Fund',
  CRYPTO = 'Crypto',
  BOND = 'Bond',
  REAL_ESTATE = 'Real Estate',
  CASH = 'Cash'
}

export interface Investment {
  id: string;
  clientId: string;
  name: string;
  symbol: string;
  type: AssetType;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string; // ISO Date
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  riskProfile: 'Low' | 'Medium' | 'High';
  joinedDate: string;
  avatarUrl: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface AppData {
  clients: Client[];
  investments: Investment[];
}