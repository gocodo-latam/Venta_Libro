const crypto = require('crypto');
const config = require('../config');

// Firma los parámetros según el algoritmo que exige Flow:
// se ordenan las llaves alfabéticamente, se concatenan como
// "llave"+"valor" (sin separadores) y se firma con HMAC-SHA256
// usando el secretKey del comercio.
function signParams(params, secretKey) {
  const keys = Object.keys(params).sort();
  let toSign = '';
  keys.forEach((k) => {
    toSign += k + params[k];
  });
  return crypto.createHmac('sha256', secretKey).update(toSign).digest('hex');
}

async function flowRequest(path, params, method = 'POST') {
  // .trim() por si al copiar/pegar en Vercel quedó un espacio o salto de línea
  const secretKey = (process.env.FLOW_SECRET_KEY || '').trim();
  const apiKey = (process.env.FLOW_API_KEY || '').trim();

  if (!secretKey || !apiKey) {
    throw new Error('Faltan las variables de entorno FLOW_API_KEY / FLOW_SECRET_KEY');
  }

  const baseUrl =
    config.flow.environment === 'prod' ? config.flow.apiUrlProd : config.flow.apiUrlSandbox;

  const allParams = { ...params, apiKey };
  allParams.s = signParams(allParams, secretKey);

  const body = new URLSearchParams(allParams);
  const url = `${baseUrl}${path}`;

  const resp = await fetch(method === 'GET' ? `${url}?${body.toString()}` : url, {
    method,
    headers: method === 'POST' ? { 'Content-Type': 'application/x-www-form-urlencoded' } : undefined,
    body: method === 'POST' ? body : undefined,
    signal: AbortSignal.timeout(15000) // no dejar al comprador esperando para siempre
  });

  const data = await resp.json();

  if (!resp.ok || data.code) {
    // Flow devuelve {code, message} cuando hay error
    throw new Error(data.message || 'Error en la API de Flow');
  }

  return data;
}

module.exports = { signParams, flowRequest };
