import {
  baseStyle,
  cardStyle,
  escapeHtml,
  footer,
  header,
} from './base-styles';
import { CODE_TTL_MINUTES } from '../../../constants/code-settings';

export const forgotPasswordTemplate = (fullName: string, code: string) => `
  <div style="${baseStyle}">
    <div style="${cardStyle}">
      ${header('Password Reset Request')}
      <div style="padding:20px;background:#fff">
        <p style="margin:0 0 12px 0">Dear ${escapeHtml(fullName)},</p>
        <p style="margin:0 0 12px 0">
          You requested to reset your password for <b>RewardedApp</b>.
        </p>

        <p style="margin:0 0 16px 0">
          Your password reset code is:
        </p>

        <div style="text-align:center;margin:24px 0">
          <div style="
            display:inline-block;
            background:#f9fafb;
            border:1px solid #e5e7eb;
            border-radius:8px;
            padding:16px 32px;
            font-size:24px;
            font-weight:600;
            letter-spacing:4px;
            color:#111827;
          ">
            ${escapeHtml(code)}
          </div>
        </div>

        <p style="margin:0 0 12px 0;font-size:14px;color:#555">
          This code will expire in <b>${CODE_TTL_MINUTES} minutes</b>.
        </p>

        <p style="margin:16px 0 0 0;font-size:13px;color:#888">
          If you didn’t request this change, please ignore this message.
        </p>
      </div>
      ${footer}
    </div>
  </div>
`;
