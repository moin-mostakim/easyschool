import { UserRole, Permission } from '../enums/roles.enum';
export interface JwtPayload {
    userId: string;
    email: string;
    role: UserRole;
    schoolId?: string;
    permissions: Permission[];
    iat?: number;
    exp?: number;
}
export interface UserContext {
    userId: string;
    email: string;
    role: UserRole;
    schoolId?: string;
    permissions: Permission[];
}
export interface RolePermission {
    role: UserRole;
    permissions: Permission[];
}
