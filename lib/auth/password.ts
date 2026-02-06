/**
 * Password validation for signup/reset.
 * Requirements: min 8 characters, at least 1 number.
 */

export interface PasswordValidation {
  valid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function getPasswordStrengthChecks(password: string) {
  return {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
  };
}
