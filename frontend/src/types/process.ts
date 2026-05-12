export interface Area {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProcessNode {
  id: string;
  name: string;
  description?: string;

  status?: string;
  priority?: string;
  executionType?: string;

  areaId: string;
  organizationId: string;
  parentId?: string | null;

  createdAt: string;
  updatedAt: string;

  area: Area;

  children: ProcessNode[];

  tools?: string;
  responsibles?: string;
  documentation?: string;
}
