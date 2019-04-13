
export interface ITaskCard {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  type: string;
  order: number;
}