export default function ensureHttps(url) {
    if (!url) return '';
    return url.replace('http://', 'https://');
  }