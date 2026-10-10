export const COMPANY_EMAIL_DOMAINS = ['example.com'];
export const COMPANY_EMAIL_DOMAINS_LABEL = '@example.com';
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function isValidEmailShape(email) {
  return EMAIL_SHAPE.test(String(email || '').trim());
}
export function isCompanyEmail(email) {
  return String(email || '')
    .trim()
    .toLowerCase()
    .endsWith('@example.com');
}
