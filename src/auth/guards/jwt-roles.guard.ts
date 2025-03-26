import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { RolePriority, UserRole } from '../roles/user-role.enum';

@Injectable()
export class JwtRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (process.env.NODE_ENV === 'development') {
      return true;
    }

    //Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    //Get token from header
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    //Verify token
    let payload;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    //Check required roles
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    //If no roles required, return true
    if (!requiredRoles) {
      return true;
    }

    //CHeck if user has required roles
    const hasAccess = payload.roles?.some((userRole) => {
      return requiredRoles.some((requiredRole) =>
        this.hasRoleOrHigher(userRole, requiredRole),
      );
    });
    if (!hasAccess) {
      throw new ForbiddenException('Lack of required roles');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private hasRoleOrHigher(userRole: UserRole, requiredRole: UserRole): boolean {
    return RolePriority[userRole] >= RolePriority[requiredRole];
  }
}
