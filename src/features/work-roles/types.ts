export type WorkRole = {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateWorkRoleRequest = {
  code: string;
  name: string;
  isActive?: boolean;
};

export type UpdateWorkRoleRequest = Partial<CreateWorkRoleRequest>;
