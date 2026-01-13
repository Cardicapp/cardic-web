import { User } from "./user";

export interface Promotion {
    id: number;
    title: string;
    body: string;
    sender: User;
    channelType: number;
    recipientType: number;
    sensitivityType: number;
    userType: number;
    status: any;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }