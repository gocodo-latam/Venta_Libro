const { flowRequest } = require('../lib/flow');
const { actualizarEstado } = require('../lib/planilla');

// Flow llama esta URL server-to-server después de un intento de pago.
// Por seguridad NO confiamos en el cuerpo que envía Flow: usamos el
// token recibido para preguntarle directamente a Flow (getStatus)
// cuál es el estado real del pago.
module.exports = async (req, res) => {
  try {
    const token = req.method === 'POST' ? (req.body && req.body.token) : req.query.token;

    if (!token) {
      res.status(400).send('Falta token');
      return;
    }

    const status = await flowRequest('/payment/getStatus', { token }, 'GET');
    // status.status: 1 pendiente, 2 pagada, 3 rechazada, 4 anulada

    let estado = 'pendiente';
    if (status.status === 2) estado = 'pagado';
    else if (status.status === 3) estado = 'rechazado';
    else if (status.status === 4) estado = 'anulado';

    await actualizarEstado(status.commerceOrder, estado);

    // Flow solo espera un 200 OK, sin cuerpo específico.
    res.status(200).send('OK');
  } catch (err) {
    console.error('Error en confirmación de Flow:', err);
    // Respondemos 200 igual para que Flow no reintente en loop; el
    // detalle del error queda registrado en los logs de Vercel.
    res.status(200).send('OK');
  }
};
