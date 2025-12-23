import {
  baseStyle,
  cardStyle,
  escapeHtml,
  footer,
  header,
} from './base-styles';

export const merchantSuspendedTemplate = ({
  businessName,
  reason,
}: {
  businessName: string;
  reason: string;
}) => `
  <div style="${baseStyle}">
    <div style="${cardStyle}">
      ${header('Merchant application suspended')}
      <div style="padding:20px;background:#fff">
        <p style="margin:0 0 12px 0">Hello, ${businessName}.</p>
        <p style="margin:0 0 12px 0">
          Unfortunately, your merchant application is <b>suspended</b> at this time.
        </p>
        <p style="margin:0 0 12px 0"><b>Reason:</b> ${escapeHtml(reason)}</p>
        <p style="margin:0 0 12px 0">
          You can update your information and re-apply. If you believe this was a mistake, please contact support.
        </p>
        <a href="https://support.rewardedapp.com"
           style="display:inline-block;background:#111827;color:#fff;text-decoration:none;
                  padding:10px 16px;border-radius:8px">
          Contact support
        </a>
      </div>
      ${footer}
    </div>
  </div>
`;
