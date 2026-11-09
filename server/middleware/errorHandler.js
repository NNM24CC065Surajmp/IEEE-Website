export function errorHandler(err, req, res, next) {
  // Sanitize log: Never log passwords, tokens, or authorization headers
  const sanitizedHeaders = { ...req.headers };
  delete sanitizedHeaders.authorization;
  delete sanitizedHeaders.cookie;

  const sanitizedBody = req.body ? { ...req.body } : {};
  if (sanitizedBody.password) sanitizedBody.password = '[REDACTED]';
  if (sanitizedBody.token) sanitizedBody.token = '[REDACTED]';

  console.error('[Error Middleware]', {
    method: req.method,
    url: req.originalUrl,
    error: err.message,
    status: err.status || 500,
  });

  const statusCode = err.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error. Please try again later.',
    ...(isProduction ? {} : { stack: err.stack }),
  });
}
