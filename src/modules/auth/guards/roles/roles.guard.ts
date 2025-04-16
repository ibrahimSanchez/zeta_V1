import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "src/modules/auth/decorators/roles.decorator";
import { Role } from "src/modules/auth/enums/role.enum";
import { UsersService } from "../../../users/users.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;
    const user = context.switchToHttp().getRequest().user;

    if (!user || !user.tipusucod) {
      return false;
    }

    try {
      const userRole = await this.usersService.getUserTypeByTipusucod(
        user.tipusucod,
      );

      return requiredRoles.some((role) => userRole === role);
    } catch (error) {
      console.error("Error al obtener el rol:", error);
      return false;
    }
  }
}
