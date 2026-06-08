interface JwtPayload {
  sub: string
  email: string
  name: string
  roles: string | string[]
  exp: number
  iat: number
}

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  return atob(padded)
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = JSON.parse(base64UrlDecode(parts[1])) as JwtPayload
    return payload
  } catch {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token)
  if (!payload) return true
  return payload.exp * 1000 < Date.now()
}

export function getTokenRoles(token: string): string[] {
  const payload = decodeJwt(token)
  if (!payload) return []
  if (Array.isArray(payload.roles)) return payload.roles
  if (typeof payload.roles === 'string') return [payload.roles]
  return []
}

export function getTokenExpiresAt(token: string): Date | null {
  const payload = decodeJwt(token)
  if (!payload) return null
  return new Date(payload.exp * 1000)
}
