const config = require('../config');
const { flowRequest } = require('../lib/flow');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const {
      nombre,
      email,
      telefono,
      cantidad,
      tipoEntrega, // 'despacho' | 'retiro'
      direccion,
      comuna,
      region,
      puntoRetiro // id de config.pickupPoints
    } = body || {};

    if (!nombre || !email || !telefono || !cantidad || !tipoEntrega) {
      res.status(400).json({ error: 'Faltan datos obligatorios' });
      return;
    }

    const qty = parseInt(cantidad, 10);
    if (!qty || qty < 1) {
      res.status(400).json({ error: 'Cantidad inválida' });
      return;
    }

    if (tipoEntrega === 'despacho' && (!direccion || !comuna || !region)) {
      res.status(400).json({ error: 'Faltan datos de despacho (dirección, comuna, región)' });
      return;
    }

    let puntoRetiroLabel = '';
    if (tipoEntrega === 'retiro') {
      const punto = config.pickupPoints.find((p) => p.id === puntoRetiro);
      if (!punto) {
        res.status(400).json({ error: 'Debes seleccionar un punto de retiro válido' });
        return;
      }
      puntoRetiroLabel = punto.label;
    }

    // El monto SIEMPRE se calcula en el servidor con los valores de config.js.
    const total =
      config.book.price * qty + (tipoEntrega === 'despacho' ? config.shipping.despachoCost : 0);

    const orderId = 'PRE-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const siteUrl = process.env.SITE_URL;

    if (!siteUrl) {
      res.status(500).json({ error: 'Falta configurar la variable de entorno SITE_URL' });
      return;
    }

    // 1) Guardar el pedido como "pendiente" en la planilla (si está configurado)
    if (process.env.SHEET_WEBAPP_URL) {
      try {
        await fetch(process.env.SHEET_WEBAPP_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            token: process.env.SHEET_WEBAPP_TOKEN || '',
            action: 'crear',
            data: JSON.stringify({
              orderId,
              nombre,
              email,
              telefono,
              tipoEntrega,
              direccion: direccion || '',
              comuna: comuna || '',
              region: region || '',
              puntoRetiro: puntoRetiroLabel,
              cantidad: qty,
              total
            })
          })
        });
      } catch (e) {
        console.error('No se pudo guardar en la planilla:', e.message);
        // No bloqueamos el pago por esto, pero queda en los logs.
      }
    }

    // 2) Crear el pago en Flow
    const flowResp = await flowRequest('/payment/create', {
      commerceOrder: orderId,
      subject: `Preventa "${config.book.title}" x${qty}`,
      currency: config.book.currency,
      amount: total,
      email,
      urlConfirmation: `${siteUrl}/api/confirmacion`,
      urlReturn: `${siteUrl}/gracias.html?orderId=${orderId}`
    });

    res.status(200).json({ url: flowResp.url, token: flowResp.token, orderId, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el pedido', detail: err.message });
  }
};
