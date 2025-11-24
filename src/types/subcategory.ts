import { TaskCategory } from './task';

export interface TaskSubcategory {
  id: string;
  user_id: string;
  category: TaskCategory;
  name: string;
  color?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateSubcategoryDTO {
  category: TaskCategory;
  name: string;
  color?: string;
}

export interface UpdateSubcategoryDTO {
  name?: string;
  color?: string;
}
