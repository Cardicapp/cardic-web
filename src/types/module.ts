import { AdminRole } from "./role";
import { User } from "./user";

export interface PermissionModule {
  id: number;
  parent?: PermissionModule;
  name: string;
  type: number; // 1 module, 2 sub-module, 3 feature
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Permission {
  id: number;
  role?: AdminRole;
  user?: User;
  module: PermissionModule;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}


export enum PermissionModuleEnum {
  'userContent' = 1,
  'trading' = 2,
  'users' = 3,
  'transactions' = 4,
}

export enum PermissionSubModuleEnum {
  'categories' = 5,
  'subCategories' = 6,
  'promotions' = 7,
  'trades' = 8,
  'customers' = 9,
  'admins' = 10,
  'withdrawals' = 11,
  'wallet' = 37,
  'crypto' = 40,
}


export enum PermissionFeatureEnum {
  'writeCategories' = 12,
  'readCategories' = 13,
  'deleteCategories' = 14,
  'writeSubCategories' = 15,
  'readSubCategories' = 16,
  'deleteSubCategories' = 17,
  'createPromotions' = 18,
  'readPromotions' = 19,
  'assignTrade' = 20,
  'readTrades' = 21,
  'acceptTrades' = 22,
  'rejectTrades' = 23,
  'writeCustomers' = 24,
  'readCustomers' = 25,
  'enableCustomers' = 26,
  'disableCustomers' = 27,
  'deleteCustomers' = 28,
  'writeAdmins' = 29,
  'readAdmins' = 30,
  'enableAdmins' = 31,
  'disableAdmins' = 32,
  'deleteAdmins' = 33,
  'readWithdrawals' = 34,
  'acceptWithdrawals' = 35,
  'rejectWithdrawals' = 36,
  'readWallets' = 38,
  'sendMessage' = 39,
}

export enum ModuleTypeEnum {
  'module' = 1,
  'subModule' = 2,
  'feature' = 3
}