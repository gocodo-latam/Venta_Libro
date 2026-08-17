// ============================================================
// APPS SCRIPT — Recibe los pedidos y los guarda en esta planilla.
//
// CÓMO INSTALARLO:
// 1. Crea una planilla nueva en Google Sheets.
// 2. Cambia el nombre de la primera hoja a: Pedidos
// 3. En la fila 1 pon estos encabezados (uno por columna):
//    Fecha | ID Pedido | Nombre | Email | Teléfono | Tipo Entrega |
//    Dirección | Comuna | Región | Punto Retiro | Cantidad | Total | Estado
// 4. Ve a Extensiones > Apps Script, borra el contenido de Code.gs
//    y pega este archivo completo.
// 5. Cambia la constante TOKEN de abajo por una clave secreta tuya
//    (invéntala, ej: "libro2026-x7Q!") y usa esa misma clave como
//    SHEET_WEBAPP_TOKEN en las variables de entorno de Vercel.
// 6. Click en Implementar > Nueva implementación > tipo "Aplicación web".
//    - Ejecutar como: Yo (tu cuenta)
//    - Quién tiene acceso: Cualquier usuario
// 7. Copia la URL que te entrega ("Web app URL") y úsala como
//    SHEET_WEBAPP_URL en las variables de entorno de Vercel.
// ============================================================

const SHEET_NAME = 'Pedidos';
const TOKEN = 'CAMBIA_ESTE_TOKEN_POR_UNO_SECRETO';

function doPost(e) {
  const params = e.parameter;

  if (params.token !== TOKEN) {
    return jsonOutput({ error: 'unauthorized' });
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    return jsonOutput({ error: 'No existe la hoja "' + SHEET_NAME + '"' });
  }

  if (params.action === 'crear') {
    const data = JSON.parse(params.data);
    sheet.appendRow([
      new Date(),
      data.orderId,
      data.nombre,
      data.email,
      data.telefono,
      data.tipoEntrega,
      data.direccion || '',
      data.comuna || '',
      data.region || '',
      data.puntoRetiro || '',
      data.cantidad,
      data.total,
      'pendiente'
    ]);
    return jsonOutput({ ok: true });
  }

  if (params.action === 'actualizar') {
    const orderId = params.orderId;
    const status = params.status;
    const values = sheet.getDataRange().getValues();
    for (let i = 1; i < values.length; i++) {
      if (values[i][1] === orderId) {
        sheet.getRange(i + 1, 13).setValue(status); // columna 13 = Estado
        break;
      }
    }
    return jsonOutput({ ok: true });
  }

  return jsonOutput({ error: 'Acción desconocida' });
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
