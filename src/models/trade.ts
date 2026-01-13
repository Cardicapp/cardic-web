import { User } from '../types/user'
import { Category } from './category'
import { SubCategory } from './sub-category'

export interface Trade {
  id: number;
  amount: number;
  cardAmount: number;
  cryptoAmount: number;
  currentRate: number;
  totalPaid: number;
  comment: string;
  category: Category;
  categoryType: any;
  subCategory: SubCategory;
  user: User | null;
  assignee: User | null;
  status: any;
}
