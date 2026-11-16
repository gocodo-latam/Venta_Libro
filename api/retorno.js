const { flowRequest } = require('../lib/flow');
const { actualizarEstado } = require('../lib/planilla');

// Flow devuelve al comprador a esta URL (con POST y el token en el cuerpo)
// cuando termina, cancela o rechaza el pago. Un archivo HTML estático NO
// acepta POST en Vercel (error 405), por eso pasamos por aquí: consultamos
// el estado real a Flow y redirigimos (303 = pasa a GET) a la página de gracias.
module.exports = async (req, res) => {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const token = body.token || (req.query && req.query.token);

  const go = (estado, orderId) => {
    const qs = new URLSearchParams({ estado });
    if (orderId) qs.set('orderId', orderId);
    res.setHeader('Location', `/gracias.html?${qs.toString()}`);
    res.status(303).end();
  };

  if (!token) {
    go('desconocido', req.query && req.query.orderId);
    return;
  }

  try {
    const status = await flowRequest('/payment/getStatus', { token }, 'GET');
    // 1 pendiente, 2 pagada, 3 rechazada, 4 anulada
    const estado = { 1: 'pendiente', 2: 'pagado', 3: 'rechazado', 4: 'anulado' }[status.status] || 'desconocido';
    // Flow no siempre avisa por urlConfirmation cuando el pago es rechazado o cancelado,
    // y esos pedidos quedaban como "pendiente" en la planilla. Al volver el comprador
    // dejamos el estado real. ("pendiente" no se toca: aún puede confirmarse.)
    if (estado !== 'pendiente' && estado !== 'desconocido') {
      await actualizarEstado(status.commerceOrder, estado, 6000);
    }
    go(estado, status.commerceOrder);
  } catch (err) {
    console.error('Error en retorno de Flow:', err.message);
    go('desconocido', req.query && req.query.orderId);
  }
};
