import { SetMetadata } from '@nestjs/common';

export const SKIP_EMAIL_CHECK_KEY = 'skipEmailCheck';

/**
 * Skips email verification check in RolesGuard.
 * Use this for endpoints that should be accessible
 * even if the user hasn’t confirmed their email yet.
 */
export const SkipEmailVerificationCheck = () =>
  SetMetadata(SKIP_EMAIL_CHECK_KEY, true);
