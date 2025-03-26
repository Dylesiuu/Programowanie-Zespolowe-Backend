export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  EMPLOYEE = 'employee',
}

export const RolePriority = {
  [UserRole.ADMIN]: 3,
  [UserRole.EMPLOYEE]: 2,
  [UserRole.USER]: 1,
};
