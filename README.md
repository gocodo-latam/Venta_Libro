# Preventa de tu libro (pago con Flow + despacho o retiro)

Sitio simple para vender tu libro en preventa: el comprador llena un
formulario, elige si quiere **despacho a domicilio** o **retiro**
(con distintos puntos según a quién le corresponda: cercanos en tu
domicilio, comunidad religiosa a la salida de la iglesia, etc.), paga
con **Flow**, y el pedido queda registrado automáticamente en una
**planilla de Google Sheets** con su estado (pendiente/pagado).

No necesitas programar nada: solo editar 2 archivos de configuración
y seguir estos pasos.

## Qué incluye

- `public/index.html` — la página con el formulario de compra.
- `public/gracias.html` — página de agradecimiento tras el pago.
- `api/` — funciones que crean el pago en Flow y reciben la confirmación.
- `config.js` — **aquí editas** el precio del libro, costo de despacho
  y los puntos de retiro.
- `google-apps-script/Code.gs` — script para guardar los pedidos en
  una planilla de Google Sheets.

## Paso 1 — Editar `config.js`

Abre `config.js` y reemplaza:

- `book.title` y `book.price` (precio unitario en CLP).
- `shipping.despachoCost` (déjalo en `0` si el despacho es gratis).
- `pickupPoints`: agrega uno por cada grupo de destinatarios. Por
  ejemplo ya viene un ejemplo para "cercanos → retiro en tu domicilio"
  y otro para "comunidad religiosa → salida de la iglesia". Edita las
  direcciones y horarios reales, o agrega más puntos si los necesitas.

## Paso 2 — Crear la planilla de Google Sheets

1. Crea una planilla nueva en Google Sheets.
2. Nombra la primera hoja **Pedidos**.
3. En la fila 1 agrega estos encabezados (uno por columna):
   `Fecha | ID Pedido | Nombre | Email | Teléfono | Tipo Entrega | Dirección | Comuna | Región | Punto Retiro | Cantidad | Total | Estado`
4. Ve a **Extensiones > Apps Script**, borra lo que haya y pega el
   contenido de `google-apps-script/Code.gs`.
5. En ese script, cambia `TOKEN` por una clave secreta inventada por
   ti (ej. `libro2026-x7Q!`). La usarás en el paso 4.
6. Click en **Implementar > Nueva implementación**, tipo
   **Aplicación web**. Configura "Ejecutar como: yo" y "Quién tiene
   acceso: cualquier usuario". Copia la URL que te entrega.

## Paso 3 — Datos de Flow

Ya tienes tu cuenta y tus credenciales (`apiKey` y `secretKey`) de
Flow.cl. Este proyecto viene configurado para el **ambiente sandbox**
(pruebas) por defecto (`config.js` → `flow.environment: 'sandbox'`).
Cuando ya hayas probado todo el flujo de punta a punta, cambia ese
valor a `'prod'` y usa tus credenciales reales de producción (son
distintas a las de sandbox).

## Paso 4 — Desplegar en Vercel (recomendado, gratis)

Vercel permite subir tanto la página como las funciones que hablan
con Flow, sin necesidad de mantener un servidor propio.

1. Crea una cuenta gratis en https://vercel.com (puedes entrar con tu
   cuenta de GitHub).
2. Sube esta carpeta a un repositorio de GitHub (o usa la CLI de
   Vercel, ver abajo).
3. En Vercel, click en **Add New > Project** e importa el repositorio.
4. Antes de desplegar, ve a **Environment Variables** y agrega:
   - `FLOW_API_KEY`
   - `FLOW_SECRET_KEY`
   - `SHEET_WEBAPP_URL` (la URL del paso 2.6)
   - `SHEET_WEBAPP_TOKEN` (el mismo token que pusiste en el script)
   - `SITE_URL` (la usarás después de tu primer deploy, ver paso 5)
5. Dale a **Deploy**.

### Alternativa por línea de comandos

```bash
npm install -g vercel
cd preventa-libro
vercel        # primer deploy (de prueba)
vercel --prod # deploy final
```

Te pedirá iniciar sesión y te irá guiando.

## Paso 5 — Configurar SITE_URL

Después del primer deploy, Vercel te da una URL como
`https://preventa-libro-tuusuario.vercel.app`. Copia esa URL, ve a
**Settings > Environment Variables** en Vercel, agrega/edita
`SITE_URL` con ese valor (sin `/` al final) y vuelve a desplegar
(`vercel --prod` o "Redeploy" desde el panel).

Esta URL es la que Flow usará para avisar cuando un pago se confirme
y para redirigir al comprador de vuelta a tu página de gracias.

## Paso 6 — Probar

1. Entra a tu sitio, llena el formulario y paga con las
   [tarjetas de prueba de Flow](https://www.flow.cl/docs/api.html)
   (ambiente sandbox).
2. Revisa que la fila aparezca en tu planilla como "pendiente" y
   luego cambie a "pagado" tras completar el pago de prueba.
3. Cuando todo funcione, cambia `config.js` → `environment: 'prod'`,
   reemplaza las variables de entorno por tus credenciales reales de
   Flow y vuelve a desplegar.

## Notas de seguridad

- El monto a pagar siempre se calcula en el servidor a partir de
  `config.js`, nunca confiando en lo que envía el navegador — así
  nadie puede alterar el precio.
- Nunca compartas tu `FLOW_SECRET_KEY` ni el `SHEET_WEBAPP_TOKEN`
  fuera de las variables de entorno de Vercel.
- El endpoint de confirmación (`/api/confirmacion`) no confía en el
  cuerpo que manda Flow: vuelve a preguntarle a la API de Flow el
  estado real del pago antes de marcarlo como "pagado".

## ¿Y si prefiero no usar Vercel?

Puedes usar cualquier hosting que soporte funciones serverless de
Node.js (Netlify Functions, por ejemplo) con pequeños ajustes en la
carpeta `api/`. Si prefieres algo sin programar en absoluto, la
alternativa es usar un Google Form para recolectar los datos y un
"link de cobro" manual generado desde el panel de Flow.cl, pero
pierdes la automatización (registro automático + confirmación de
pago automática) que trae esta solución.
