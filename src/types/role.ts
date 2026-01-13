export interface AdminRole {
  id: number;
  reportTo?: AdminRole;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export enum AdminRoleEnum {
  'superadmin' = 1,
  'trader' = 2,
  'accountant' = 3,
  'hr' = 4,
}