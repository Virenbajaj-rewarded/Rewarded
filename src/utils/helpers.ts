export function safeJsonParse(str: string) {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.warn("⚠️ Invalid JSON:", str);
    return null;
  }
}

export async function testDelay(delay?: number) {
  return await new Promise((resolve) =>
    setTimeout(() => resolve(0), delay ?? 1000),
  );
}
