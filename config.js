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

  // Textos de la página de venta. Todo es opcional: si dejas un campo
  // vacío, esa sección simplemente no se muestra.
  landing: {
    badge: 'Preventa',
    subtitle: 'Una tragicomedia metafísica entre la ciencia, la filosofía y el amor.',
    author: 'Gonzalo Cornejo Donoso',
    cover: '', // Ej: '/portada.jpg' (sube la imagen a /public). Vacío = portada tipográfica

    // Gancho corto que aparece justo antes de la compra
    hook: '¿Y si el problema no fuera lo que ves, sino lo que quedó fuera de la muestra?',

    synopsis: [
      'Gonzalo nace el día en que Italia le gana a Brasil en el Mundial de España 82. Desde muy chico entiende que la belleza no siempre gana y que el mundo suele preferir lo que funciona.',
      'Entre la infancia, el colegio, la familia, el trabajo y la ciudad, empieza a sospechar de las sombras: lo que no se ve, lo que no entra en la explicación oficial. Su manera de enfrentarlas es discutir con la materia.',
      'Es una novela sobre vergüenza, amor, fracaso, salud mental, fe y ciencia, contada con humor y con una pregunta de fondo: qué pasa cuando una explicación brillante ocupa el lugar de la verdad.'
    ],

    quote: 'A veces el precio no baja porque el cliente sea racional.',
    quoteBy: 'Un mensaje del libro',

    // "Lo que vas a encontrar": se muestra como tarjetas
    themes: [
      { icon: '🌓', title: 'Luz y sombra', text: 'Una mirada distinta sobre lo que vemos y lo que se nos escapa.' },
      { icon: '😅', title: 'Humor con fondo', text: 'Tragicomedia: te ríes, y de pronto te quedas pensando.' },
      { icon: '🔬', title: 'Ciencia y fe', text: 'Preguntas grandes, contadas desde una vida concreta.' },
      { icon: '❤️', title: 'Amor y fracaso', text: 'Infancia, vergüenza, salud mental y redención.' }
    ],

    // "Es para ti si..."
    audience: [
      'Te gustan las novelas contemporáneas con humor y preguntas grandes.',
      'Trabajas con datos, tecnología o sistemas y sospechas que algo queda fuera de la muestra.',
      'Creciste en los 80 y 90 en Chile y te gusta reconocer ese mundo en una historia.',
      'Buscas un regalo distinto para alguien que disfruta pensar.'
    ],

    // Reseñas reales de lectores (déjalo vacío hasta tener; no inventar)
    testimonials: [], // Ej: [{ text: 'Me hizo reír y pensar.', by: 'Nombre, Ciudad' }]

    authorBio:
      'Nació en Santiago de Chile en 1982. Es ingeniero civil industrial de la Pontificia Universidad Católica de Chile y ha trabajado en transporte, datos, pricing, procesos, innovación, tecnología e inteligencia artificial. Su mirada, entre sistemas, mercados y sombras, atraviesa esta novela.',

    deliveryNote: '',        // Ej: 'Fecha estimada de entrega: marzo 2027'
    whatsapp: '',            // Ej: '56912345678' (con código de país, sin + ni espacios)
    whatsappText: 'Hola, tengo una consulta sobre la preventa del libro'
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
        'Retiro directo con el autor. Dirección de retiro en Las Condes. ' +
        'Una vez confirmado el pago e impresos los libros te contactaré por WhatsApp/email para coordinar la dirección y el horario.'
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
