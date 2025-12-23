import { baseStyle, cardStyle, footer, header } from './base-styles';

export const merchantApprovedTemplate = (
  businessName: string,
  dashboardUrl: string,
) => `
  <div style="${baseStyle}">
    <div style="${cardStyle}">
      ${header('Merchant account approved')}
      <div style="padding:20px;background:#fff">
        <p style="margin:0 0 12px 0">Hello, ${businessName}!</p>
        <p style="margin:0 0 12px 0">
          Great news — your merchant application has been <b>approved</b> 🎉
        </p>
        <p style="margin:0 0 12px 0">
          You can now complete your account setup and start using your merchant dashboard.
          Please follow the link below to finish registration and set your password:
        </p>
        <div style="margin:20px 0">
          <a href="${dashboardUrl}"
             style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;
                    padding:12px 20px;border-radius:8px;font-weight:500">
            Complete registration
          </a>
        </div>
        <p style="margin:0 0 8px 0;font-size:14px;color:#555">
          Once registration is completed, you’ll be able to:
        </p>
        <ul style="margin:8px 0 16px 20px; padding:0;color:#555;font-size:14px">
          <li>Create and manage QR campaigns</li>
          <li>Track issued and redeemed points</li>
          <li>Access reports and analytics</li>
        </ul>
        <p style="font-size:13px;color:#888">
          If you didn’t request a merchant account, please ignore this email.
        </p>
      </div>
      ${footer}
    </div>
  </div>
`;
