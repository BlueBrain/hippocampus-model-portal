const PREFS_KEY = 'bbpCookiePreferences';

let gtmInitialised = false;


export function getCookiePrefs() {
  const rawPrefs = localStorage.getItem(PREFS_KEY);

  if (!rawPrefs) {
    return null;
  }

  return JSON.parse(rawPrefs);
}


export function setCookiePrefs(prefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export function isGtmInitialised() {
  return gtmInitialised;
}

export function initGtm(gtmId) {
  const gtag = window['gtag'];

  gtag('js', new Date());
  gtag('config', gtmId, { 'anonymize_ip': true });

  gtmInitialised = true;
}
