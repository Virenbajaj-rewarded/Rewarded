import { createParamDecorator } from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/auth';

export const ReqFirebase = createParamDecorator((_d, ctx) => {
  const req = ctx.switchToHttp().getRequest();
  return req.firebase as DecodedIdToken;
});
