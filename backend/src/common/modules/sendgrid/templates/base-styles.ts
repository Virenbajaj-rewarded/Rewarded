export const baseStyle = `
  font-family: Inter, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  color: #111827;
`;

export const cardStyle = `
  max-width: 560px;
  margin: 24px auto;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
`;

export const header = (title: string) => `
  <div style="background:#111827;color:#fff;padding:16px 20px">
    <h1 style="margin:0;font-size:18px">${title}</h1>
  </div>
`;

export const footer = `
  <div style="padding:12px 20px;color:#6b7280;font-size:12px;border-top:1px solid #e5e7eb">
    © ${new Date().getFullYear()} RewardedApp. All rights reserved.
  </div>
`;

export const escapeHtml = (s: string) => {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
