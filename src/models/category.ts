export interface Category {
  id: number;
  name: string;
  description: string;
  address: string;
  photo: CategoryPhoto;
  status: any;
  deletedAt: string | null;
}

export interface CategoryPhoto {
  id: number;
  name: string;
  fileName: string;
  path: string;
}
