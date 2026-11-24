import { importX509, jwtVerify } from 'jose';

const FIREBASE_CERTS_URL =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
const MAX_PHOTO_BYTES = 1024 * 1024;
const PHOTO_PREFIX = 'profile-photos/';
let cachedCertificates;
let certificateCacheExpiresAt = 0;

function getAllowedOrigins(env) {
  return new Set(
    String(env.ALLOWED_ORIGINS || '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
  );
}

function corsHeaders(origin) {
  const headers = new Headers({
    'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  });
  if (origin) headers.set('Access-Control-Allow-Origin', origin);
  return headers;
}

function jsonResponse(payload, status, headers) {
  const responseHeaders = new Headers(headers);
  responseHeaders.set('Content-Type', 'application/json; charset=utf-8');
  responseHeaders.set('Cache-Control', 'no-store');
  responseHeaders.set('X-Content-Type-Options', 'nosniff');
  return new Response(JSON.stringify(payload), { status, headers: responseHeaders });
}

async function loadFirebaseCertificates() {
  if (cachedCertificates && Date.now() < certificateCacheExpiresAt) {
    return cachedCertificates;
  }

  const response = await fetch(FIREBASE_CERTS_URL);
  if (!response.ok) throw new Error('Could not retrieve Firebase signing certificates.');

  const certificates = await response.json();
  const cacheControl = response.headers.get('Cache-Control') || '';
  const maxAge = Number(cacheControl.match(/(?:^|,)\s*max-age=(\d+)/i)?.[1] || 300);
  cachedCertificates = certificates;
  certificateCacheExpiresAt = Date.now() + Math.max(60, maxAge) * 1000;
  return cachedCertificates;
}

async function firebaseSigningKey(protectedHeader) {
  if (protectedHeader.alg !== 'RS256' || typeof protectedHeader.kid !== 'string') {
    throw new Error('Unsupported Firebase token signing key.');
  }

  const certificates = await loadFirebaseCertificates();
  const certificate = certificates[protectedHeader.kid];
  if (!certificate) {
    // A key may have rotated since this isolate cached the previous set.
    cachedCertificates = undefined;
    certificateCacheExpiresAt = 0;
    const refreshedCertificates = await loadFirebaseCertificates();
    if (!refreshedCertificates[protectedHeader.kid]) {
      throw new Error('Firebase signing key was not found.');
    }
    return importX509(refreshedCertificates[protectedHeader.kid], 'RS256');
  }

  return importX509(certificate, 'RS256');
}

async function authenticate(request, env) {
  const authorization = request.headers.get('Authorization') || '';
  const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);
  if (!tokenMatch) return { error: 'A Firebase ID token is required.', status: 401 };

  const projectId = String(env.FIREBASE_PROJECT_ID || '').trim();
  if (!projectId) return { error: 'Firebase project configuration is missing.', status: 500 };

  try {
    const { payload } = await jwtVerify(tokenMatch[1], firebaseSigningKey, {
      algorithms: ['RS256'],
      audience: projectId,
      issuer: `https://securetoken.google.com/${projectId}`,
      requiredClaims: ['sub', 'iat', 'exp', 'auth_time'],
    });
    const now = Math.floor(Date.now() / 1000);
    if (
      typeof payload.sub !== 'string' ||
      !payload.sub ||
      typeof payload.iat !== 'number' ||
      payload.iat > now + 60 ||
      typeof payload.auth_time !== 'number' ||
      payload.auth_time > now + 60
    ) {
      return { error: 'The Firebase ID token is invalid.', status: 401 };
    }

    // Match the college-domain restriction already enforced by the profile UI.
    const email = typeof payload.email === 'string' ? payload.email.toLowerCase() : '';
    if (!email.endsWith('@nmamit.in')) {
      return { error: 'An NMAMIT college account is required.', status: 403 };
    }

    return { uid: payload.sub };
  } catch {
    return { error: 'The Firebase ID token is invalid or expired.', status: 401 };
  }
}

async function readBodyLimited(request) {
  const declaredLength = Number(request.headers.get('Content-Length') || 0);
  if (declaredLength > MAX_PHOTO_BYTES) return null;
  if (!request.body) return new Uint8Array();

  const reader = request.body.getReader();
  const chunks = [];
  let totalLength = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalLength += value.byteLength;
    if (totalLength > MAX_PHOTO_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

function readUint24(view, offset) {
  return view.getUint8(offset) | (view.getUint8(offset + 1) << 8) | (view.getUint8(offset + 2) << 16);
}

function getWebpDimensions(bytes) {
  if (bytes.byteLength < 25) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const ascii = (offset, length) => String.fromCharCode(...bytes.subarray(offset, offset + length));
  if (ascii(0, 4) !== 'RIFF' || ascii(8, 4) !== 'WEBP' || view.getUint32(4, true) + 8 !== bytes.byteLength) {
    return null;
  }

  let offset = 12;
  while (offset + 8 <= bytes.byteLength) {
    const chunkType = ascii(offset, 4);
    const chunkLength = view.getUint32(offset + 4, true);
    const dataOffset = offset + 8;
    if (dataOffset + chunkLength > bytes.byteLength) return null;

    if (chunkType === 'VP8X' && chunkLength >= 10) {
      return {
        width: readUint24(view, dataOffset + 4) + 1,
        height: readUint24(view, dataOffset + 7) + 1,
      };
    }
    if (
      chunkType === 'VP8 ' &&
      chunkLength >= 10 &&
      view.getUint8(dataOffset + 3) === 0x9d &&
      view.getUint8(dataOffset + 4) === 0x01 &&
      view.getUint8(dataOffset + 5) === 0x2a
    ) {
      return {
        width: view.getUint16(dataOffset + 6, true) & 0x3fff,
        height: view.getUint16(dataOffset + 8, true) & 0x3fff,
      };
    }
    if (chunkType === 'VP8L' && chunkLength >= 5 && view.getUint8(dataOffset) === 0x2f) {
      const b1 = view.getUint8(dataOffset + 1);
      const b2 = view.getUint8(dataOffset + 2);
      const b3 = view.getUint8(dataOffset + 3);
      const b4 = view.getUint8(dataOffset + 4);
      return {
        width: 1 + (b1 | ((b2 & 0x3f) << 8)),
        height: 1 + ((b2 >> 6) | (b3 << 2) | ((b4 & 0x0f) << 10)),
      };
    }

    offset = dataOffset + chunkLength + (chunkLength % 2);
  }
  return null;
}

function isSquare512Webp(bytes) {
  const dimensions = getWebpDimensions(bytes);
  return dimensions?.width === 512 && dimensions?.height === 512;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const allowedOrigins = getAllowedOrigins(env);
    const headers = corsHeaders(origin && allowedOrigins.has(origin) ? origin : null);

    if (origin && !allowedOrigins.has(origin)) {
      return jsonResponse({ error: 'Origin is not allowed.' }, 403, headers);
    }
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    const url = new URL(request.url);
    if (url.pathname !== '/me/photo') {
      return jsonResponse({ error: 'Not found.' }, 404, headers);
    }
    if (!['GET', 'PUT', 'DELETE'].includes(request.method)) {
      headers.set('Allow', 'GET, PUT, DELETE, OPTIONS');
      return jsonResponse({ error: 'Method not allowed.' }, 405, headers);
    }

    const identity = await authenticate(request, env);
    if (identity.error) return jsonResponse({ error: identity.error }, identity.status, headers);

    // The key comes only from the verified Firebase subject, never from request input.
    const key = `${PHOTO_PREFIX}${encodeURIComponent(identity.uid)}.webp`;

    if (request.method === 'PUT') {
      if (request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'image/webp') {
        return jsonResponse({ error: 'Upload a WebP image.' }, 415, headers);
      }
      const bytes = await readBodyLimited(request);
      if (!bytes) return jsonResponse({ error: 'Image must be 1 MB or smaller.' }, 413, headers);
      if (!isSquare512Webp(bytes)) {
        return jsonResponse({ error: 'Image must be a valid 512 × 512 WebP.' }, 400, headers);
      }

      await env.PHOTOS.put(key, bytes, {
        httpMetadata: {
          contentType: 'image/webp',
          cacheControl: 'private, no-store',
        },
      });
      return jsonResponse({ key, contentType: 'image/webp' }, 200, headers);
    }

    if (request.method === 'GET') {
      const object = await env.PHOTOS.get(key);
      if (!object) return jsonResponse({ error: 'Photo not found.' }, 404, headers);

      const photoHeaders = new Headers(headers);
      photoHeaders.set('Content-Type', 'image/webp');
      photoHeaders.set('Cache-Control', 'private, no-store');
      photoHeaders.set('X-Content-Type-Options', 'nosniff');
      photoHeaders.set('Content-Security-Policy', "default-src 'none'; sandbox");
      return new Response(object.body, { status: 200, headers: photoHeaders });
    }

    await env.PHOTOS.delete(key);
    return new Response(null, {
      status: 204,
      headers: new Headers({ ...Object.fromEntries(headers), 'Cache-Control': 'no-store' }),
    });
  },
};
