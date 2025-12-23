import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FIREBASE_ADMIN } from '../modules/firebase/firebase.module';
import { UsersService } from '../../users/users.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    @Inject(FIREBASE_ADMIN) private app: admin.app.App,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const auth = req.headers.authorization as string | undefined;
    if (!auth?.startsWith('Bearer '))
      throw new UnauthorizedException('Missing bearer token');

    const token = auth.slice('Bearer '.length);
    try {
      const decoded = await this.app.auth().verifyIdToken(token);
      req.firebase = decoded;

      const user = await this.usersService.findByFirebaseId(decoded.uid, {
        role: true,
      });

      if (!user) {
        throw new ForbiddenException('User not found');
      }

      req.user = user;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
