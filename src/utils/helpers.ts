export function safeJsonParse(str: string) {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.warn('⚠️ Invalid JSON:', str);
    return null;
  }
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
