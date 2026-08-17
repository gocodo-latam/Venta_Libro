const config = require('../config');

// Expone solo los datos públicos (nunca las credenciales de Flow)
// para que el formulario pueda mostrar precio, costo de despacho
// y puntos de retiro sin duplicar esa info en el HTML.
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    book: config.book,
    shipping: config.shipping,
    pickupPoints: config.pickupPoints
  });
};
