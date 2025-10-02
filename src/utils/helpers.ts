export function safeJsonParse(str: string) {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.warn("⚠️ Invalid JSON:", str);
    return null;
  }
}
