/**
 * Simple in-memory rate limiter for API endpoints
 * For production, consider using Redis or a distributed rate limiting solution
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Check if a request should be rate limited
 * @param key - Identifier for the rate limit (e.g., IP address or user ID)
 * @param maxRequests - Maximum number of requests allowed in the window
 * @param windowMs - Time window in milliseconds
 * @returns true if request is allowed, false if rate limited
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  // No record or window expired - allow and create new record
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }

  // Within window - check count
  if (record.count >= maxRequests) {
    return false; // Rate limited
  }

  // Increment count and allow
  record.count++;
  return true;
}

/**
 * Get remaining requests for a key
 */
export function getRemainingRequests(
  key: string,
  maxRequests: number
): number {
  const record = rateLimitStore.get(key);
  if (!record || Date.now() > record.resetTime) {
    return maxRequests;
  }
  return Math.max(0, maxRequests - record.count);
}

/**
 * Clean up expired rate limit records (call periodically)
 */
export function cleanupExpiredRecords(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Clean up every 5 minutes
setInterval(cleanupExpiredRecords, 5 * 60 * 1000);
