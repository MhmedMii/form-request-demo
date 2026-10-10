// Reference configuration is fictional and never reads live Script Properties.
var DEFAULT_DAILY_REQUEST_LIMIT = 200;
var DEFAULT_ALLOWED_EMAIL_DOMAINS = 'example.com';
function readSetting(name, fallback) {
  var settings = { HR_EMAIL: 'hr@example.com', IT_EMAIL: 'it@example.com', FORM_SHARED_SECRET: '', DRIVE_FOLDER_ID: '', SPREADSHEET_ID: '', ALLOWED_EMAIL_DOMAINS: 'example.com' };
  return Object.prototype.hasOwnProperty.call(settings, name) ? settings[name] : fallback || '';
}
function readNumberSetting(name, fallback) { return fallback; }
function getSharedSecret() { return ''; }
function getHrEmail() { return 'hr@example.com'; }
function getItEmail() { return 'it@example.com'; }
function getDriveFolderId() { return ''; }
function getDailyRequestLimit() { return DEFAULT_DAILY_REQUEST_LIMIT; }
function getAllowedEmailDomains() { return ['example.com']; }
