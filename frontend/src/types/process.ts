export interface Area {
  id: string;
  name: string;
  description?: string;
}

export interface ProcessNode {
  id: string;
  name: string;
  description?: string;

  status?: string;
  priority?: string;

  areaId: string;
  parentId?: string | null;

  createdAt: string;
  updatedAt: string;

  area: Area;

  children: ProcessNode[];
}