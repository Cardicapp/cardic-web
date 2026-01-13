import { User } from 'src/types/user'
import { CardFile } from './card'
import { Trade } from './trade'

export interface TradeChat {
  id: number;
  message: string;
  trade?: Trade | null;
  from?: User | null;
  type: TradeChatType;
  images?: CardFile[] | null;
  status?: any;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface TradeChatType {
  id: number;
  name: string;
}
