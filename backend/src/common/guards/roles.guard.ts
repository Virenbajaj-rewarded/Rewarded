import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/types/user-role.enum';
import { SKIP_EMAIL_CHECK_KEY } from '../decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    const skipEmailCheck = this.reflector.getAllAndOverride<boolean>(
      SKIP_EMAIL_CHECK_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!roles || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('No user found in request');
    }

    const userRole = user.role?.name as UserRole;

    if (!roles.includes(userRole)) {
      throw new ForbiddenException('Access denied for this role');
    }

    if (
      !skipEmailCheck &&
      userRole === UserRole.USER &&
      !user.isEmailConfirmed
    ) {
      throw new ForbiddenException(
        'Email must be confirmed to access this resource',
      );
    }

    return true;
  }
}
