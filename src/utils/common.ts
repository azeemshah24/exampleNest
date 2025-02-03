import { randomBytes } from 'crypto';
/**
 * Checks if the given value is empty.
 * @param value - The value to check.
 * @returns True if the value is empty, false otherwise.
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'number') {
    return value === 0;
  }

  return Object.keys(value).length === 0;
}

/**
 * Checks if the given value is a valid email address.
 * @param value - The value to check.
 * @returns True if the value is a valid email address, false otherwise.
 */
export function isEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

export function generateUniqueRandomString(length: number): string {
  return randomBytes(length / 2).toString('hex');
}
