import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole, Permission } from '../enums/roles.enum';
import { ROLES_KEY, PERMISSIONS_KEY } from '../decorators/roles.decorator';
import { UserContext } from '../interfaces/user.interface';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: UserContext = request.user;

    if (!user) {
      return false;
    }

    // Check roles
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      return false;
    }

    // Super admin bypasses all permission checks
    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    // Check permissions
    if (requiredPermissions) {
      const hasAllPermissions = requiredPermissions.every(permission =>
        user.permissions.includes(permission),
      );
      if (!hasAllPermissions) {
        return false;
      }
    }

    return true;
  }
}
