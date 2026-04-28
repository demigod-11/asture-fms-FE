/** API error code for "email not verified" (login blocked until verified). */
export const API_CODE_EMAIL_NOT_VERIFIED = 4009;

/**
 * API error body shape: { success: false, message: string, code: number, data?: unknown }
 * Message is at the top level of response.data, not under response.data.data.
 */
export function getApiErrorCode(err: unknown): number | undefined {
  if (!err || typeof err !== 'object') return undefined;
  const withResponse = err as { response?: { data?: unknown } };
  const body = withResponse.response?.data;
  if (body !== undefined && body !== null && typeof body === 'object') {
    const obj = body as Record<string, unknown>;
    const code = obj.code;
    if (typeof code === 'number') return code;
  }
  return undefined;
}

/**
 * Get optional extra data from API error (e.g. { email } for email_not_verified).
 */
export function getApiErrorData(
  err: unknown
): Record<string, unknown> | undefined {
  if (!err || typeof err !== 'object') return undefined;
  const withResponse = err as { response?: { data?: unknown } };
  const body = withResponse.response?.data;
  if (body !== undefined && body !== null && typeof body === 'object') {
    const obj = body as Record<string, unknown>;
    const data = obj.data;
    if (data !== undefined && data !== null && typeof data === 'object') {
      return data as Record<string, unknown>;
    }
  }
  return undefined;
}

export function getApiErrorMessage(
  err: unknown,
  fallback = 'Something went wrong. Please try again.'
): string {
  if (!err || typeof err !== 'object') return fallback;

  const withResponse = err as {
    response?: { data?: unknown };
    message?: string;
  };
  const body = withResponse.response?.data;
  if (
    body !== undefined &&
    body !== null &&
    typeof body === 'object' &&
    body !== null
  ) {
    const obj = body as Record<string, unknown>;
    const msg = obj.message;
    if (msg != null && String(msg).trim()) return String(msg).trim();
  }

  if (withResponse.message && String(withResponse.message).trim()) {
    return String(withResponse.message).trim();
  }

  if (body === undefined || body === null) return fallback;
  const obj =
    typeof body === 'object' && body !== null
      ? (body as Record<string, unknown>)
      : null;
  if (!obj) return fallback;

  const msg = obj.message;
  if (msg != null && String(msg).trim()) return String(msg).trim();

  // Fallbacks for other shapes
  const detail = obj.detail;
  if (typeof detail === 'string' && detail.trim()) return detail.trim();
  if (typeof detail === 'object' && detail !== null && Array.isArray(detail)) {
    const first = (detail as unknown[])[0];
    if (
      first &&
      typeof first === 'object' &&
      first !== null &&
      'msg' in first
    ) {
      const m = (first as { msg: unknown }).msg;
      if (typeof m === 'string' && m.trim()) return m.trim();
    }
  }
  return fallback;
}
