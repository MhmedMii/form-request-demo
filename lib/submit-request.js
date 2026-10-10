// Submission is entirely local. No request body is sent to a server.
export async function submitRequest(payload) {
  if (payload.demo !== true) return { ok: false, error: 'demo_only' };
  await new Promise((resolve) => setTimeout(resolve, 650));
  const suffix = globalThis.crypto.randomUUID().slice(0, 6).toUpperCase();
  return { ok: true, demo: true, requestId: 'DEMO-' + suffix };
}
