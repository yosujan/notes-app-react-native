export interface AttachedFile {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

export interface Note {
  id: string;
  heading: string;
  description: string;
  images?: string[];
  files?: AttachedFile[];
  createdAt: number;
  updatedAt: number;
}
