import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for IFS endpoints
 * Limits to 100 requests per 15 minutes per IP
 */
export const ifsRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Stricter rate limiter for sync endpoint
 * Limits to 20 requests per 15 minutes per IP
 */
export const syncRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 sync requests per windowMs (since sync can batch multiple items)
  message: 'Too many sync requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
