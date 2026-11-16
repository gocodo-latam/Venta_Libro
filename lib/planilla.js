// Actualiza el estado de un pedido en la planilla de Google Sheets (Apps Script).
// Es "mejor esfuerzo": si falla o tarda, solo queda en los logs y no rompe el flujo.
async function actualizarEstado(orderId, estado, timeoutMs = 8000) {
  if (!process.env.SHEET_WEBAPP_URL || !orderId) return;
  try {
    await fetch(process.env.SHEET_WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        token: process.env.SHEET_WEBAPP_TOKEN || '',
        action: 'actualizar',
        orderId,
        status: estado
      }),
      signal: AbortSignal.timeout(timeoutMs)
    });
  } catch (e) {
    console.error('No se pudo actualizar la planilla:', e.message);
  }
}

module.exports = { actualizarEstado };
