export type User = {
  id: string;
  active?: boolean;
  created?: Date;
  updated?: Date;

  email: string;
  role: UserRole;
  lastLogin?: Date;
};

export type UserSession = {
  id?: string;
  created?: Date;
  updated?: Date;

  userId: string;
  user?: User;

  role: UserRole;
  expires: Date;
};

export type Token = {
  id?: string;
  created?: Date;
  updated?: Date;

  code: string;
  email: string;
  type: TokenType;
  expires: Date;
};

export enum TokenType {
  MAGIC_LINK = 'MAGIC_LINK',
}

export enum UserRole {
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_USER = 'ROLE_USER',
}
