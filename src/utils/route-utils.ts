/**
 * Encode JSON string to URL-safe base64
 */
export function encodeJsonForUrl(json: string): string {
  return btoa(encodeURIComponent(json));
}

/**
 * Decode base64 string from URL to JSON
 */
export function decodeJsonFromUrl(encoded: string): string | null {
  try {
    return decodeURIComponent(atob(encoded));
  } catch {
    return null;
  }
}

/**
 * Validate JSON size for URL (2MB browser limit)
 */
export function validateJsonSize(json: string): {
  valid: boolean;
  error?: string;
} {
  const encoded = encodeJsonForUrl(json);
  const maxSize = 2 * 1024 * 1024; // 2MB

  if (encoded.length > maxSize) {
    return {
      valid: false,
      error: `JSON too large (${(encoded.length / 1024 / 1024).toFixed(2)}MB). Max: 2MB`,
    };
  }

  return { valid: true };
}
