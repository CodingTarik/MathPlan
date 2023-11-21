function setSecurityHeaders(req, res, next) {
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  // Add more headers as needed

  next();
}

module.exports = setSecurityHeaders;
