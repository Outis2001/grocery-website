/**
 * Simple in-memory rate limiter for API routes.
 * For production at scale, consider Redis-based solutions.
 */

const store = new Map<string, { count: number; resetAt: number }>()

const cleanupInterval = 60 * 1000 // Clean up every minute
let lastCleanup = Date.now()

function cleanup() {
  if (Date.now() - lastCleanup < cleanupInterval) return
  lastCleanup = Date.now()
  const now = Date.now()
  Array.from(store.entries()).forEach(([key, value]) => {
    if (value.resetAt < now) store.delete(key)
  })
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): { allowed: boolean; remaining: number } {
  cleanup()

  const now = Date.now()
  const entry = store.get(key)

  if (!entry) {
    store.set(key, {
      count: 1,
      resetAt: now + windowSeconds * 1000,
    })
    return { allowed: true, remaining: limit - 1 }
  }

  if (entry.resetAt < now) {
    store.set(key, {
      count: 1,
      resetAt: now + windowSeconds * 1000,
    })
    return { allowed: true, remaining: limit - 1 }
  }

  entry.count++
  const remaining = Math.max(0, limit - entry.count)
  return {
    allowed: entry.count <= limit,
    remaining,
  }
}

export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  return ip
}
