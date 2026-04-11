import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";

/**
 * Jerarquía de roles del lab UNIMET:
 *   superadmin > professor > student
 */
const ROLE_HIERARCHY: Record<string, string[]> = {
  superadmin: ["superadmin", "professor", "student"],
  professor: ["professor", "student"],
  student: ["student"],
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndMerge<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) return false;

    const userAccessibleRoles = ROLE_HIERARCHY[user.role] || [user.role];
    return requiredRoles.some((role) => userAccessibleRoles.includes(role));
  }
}
