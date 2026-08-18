// ============================================================
// CONFIGURA AQUÍ LOS DATOS DE TU PREVENTA
// Este archivo es la única fuente de verdad: el precio y el
// costo de despacho SIEMPRE se calculan en el servidor a partir
// de este archivo (nunca confiando en lo que mande el navegador),
// así nadie puede alterar el monto a pagar.
// ============================================================

module.exports = {
  book: {
    title: 'El Hombre que discutía con la materia',
    price: 20000, // precio unitario en CLP (sin puntos ni símbolos)
    currency: 'CLP'
  },

  shipping: {
    // Costo fijo de despacho a domicilio. Ponlo en 0 si el despacho es gratis.
    despachoCost: 4900
  },

  // Puntos/ modos de retiro. Agrega, edita o elimina los que necesites.
  // "id" no debe repetirse. "label" es lo que ve el comprador en el select.
  // "details" es el texto informativo que se muestra al elegir esa opción
  // (dirección, horario, cómo se coordina, etc).
  pickupPoints: [
    {
      id: 'cercanos',
      label: 'Familiares/amigos — Retiro en domicilio del autor',
      details:
        'Retiro directo conmigo. Dirección: Laura de Noves 344, Las Condes. ' +
        'Una vez confirmado el pago te contactaré por WhatsApp/email para coordinar el horario.'
    },
    {
      id: 'iglesia',
      label: 'Comunidad religiosa — Retiro a la salida de la iglesia',
      details:
        '[Nombre de la iglesia], [dirección]. Retiro los domingos a la salida de la misa de [hora]. ' +
        'Si no puedes ese día, escríbeme para coordinar otra alternativa.'
    }
  ],

  flow: {
    apiUrlSandbox: 'https://sandbox.flow.cl/api',
    apiUrlProd: 'https://www.flow.cl/api',
    // Cambia a 'prod' SOLO cuando hayas probado todo el flujo en sandbox
    // y tengas tus credenciales reales (de producción) de Flow.
    environment: 'prod'
  }
};
