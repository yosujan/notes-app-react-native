export interface Note {
  id: string;
  heading: string;
  description: string;
  images?: string[];
  createdAt: number;
  updatedAt: number;
}
