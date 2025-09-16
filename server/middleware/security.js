const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const winston = require('winston');

// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'practicelink-dmp' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Rate limiting configurations
const createRateLimit = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  message: { error: message },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.path
    });
    res.status(429).json({ error: message });
  }
});

// Security middleware
const securityMiddleware = [
  // Helmet for security headers
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://*.supabase.co"],
        fontSrc: ["'self'", "data:"]
      }
    },
    crossOriginEmbedderPolicy: false
  }),

  // Compression
  compression(),

  // Request logging
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }),

  // General rate limiting
  createRateLimit(15 * 60 * 1000, 100, 'Too many requests from this IP'),
];

// Specific rate limits
const authRateLimit = createRateLimit(15 * 60 * 1000, 5, 'Too many authentication attempts');
const uploadRateLimit = createRateLimit(60 * 1000, 10, 'Too many upload attempts');
const apiRateLimit = createRateLimit(60 * 1000, 60, 'API rate limit exceeded');

// Audit logging middleware
const auditLogger = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    logger.info('API Request', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      contentLength: res.get('Content-Length'),
      userId: req.user?.id || 'anonymous'
    });
  });
  
  next();
};

module.exports = {
  logger,
  securityMiddleware,
  authRateLimit,
  uploadRateLimit,
  apiRateLimit,
  auditLogger
};