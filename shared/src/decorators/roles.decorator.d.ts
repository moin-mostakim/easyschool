import { UserRole, Permission } from '../enums/roles.enum';
export declare const ROLES_KEY = "roles";
export declare const PERMISSIONS_KEY = "permissions";
export declare const Roles: (...roles: UserRole[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const RequirePermissions: (...permissions: Permission[]) => import("@nestjs/common").CustomDecorator<string>;
