import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FIREBASE_ADMIN } from '../../common/modules/firebase/firebase.module';

// ONLY FOR AUTH REGISTER CONTROLLER
@Injectable()
export class RegisterTokenGuard implements CanActivate {
  constructor(@Inject(FIREBASE_ADMIN) private app: admin.app.App) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const authHeader = req.headers.authorization as string | undefined;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = authHeader.slice('Bearer '.length);

    try {
      const decoded = await this.app.auth().verifyIdToken(token);
      req.firebase = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
