export enum UserRoleEnum {
  'admin' = 1,
  'user' = 2,
}

export enum StatusEnum {
  'active' = 1,
  'inactive' = 2,
}

export enum TradeStatusEnum {
  'created' = 1,
  'active' = 2,
  'pending' = 3,
  'accepted' = 4,
  'closed' = 5,
  'rejected' = 6,
  'reopened' = 7,
}

export enum TradeChatTypeEnum {
  'text' = 1,
  'image' = 2,
}

export enum TransactionTypeEnum {
  'credit' = 1,
  'debit' = 2,
}

export class TradeEvents {
  static chatAdded = 'chat_added'
}

export enum NotificationRecipientTypeEnum {
  'general' = 1,
  'specific' = 2,
}
export enum NotificationChannelTypeEnum {
  'email' = 1,
  'push' = 2,
}

export enum NotificationUserTypeEnum {
  'admin' = 1,
  'customer' = 2,
}

export enum NotificationTypeEnum {
  'info' = 1,
  'error' = 2,
  'success' = 3
}

export enum CategoryTypeEnum {
  'card' = 1,
  'crypto' = 2,
}
