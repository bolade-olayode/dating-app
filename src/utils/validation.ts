// Email validation using RFC 5322 simplified pattern
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Phone validation - checks minimum digits based on country
export const isValidPhone = (phone: string, dialCode: string): boolean => {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  // Most countries have 7-15 digit phone numbers (excluding country code)
  // Nigeria: 10 digits, US/Canada: 10 digits, UK: 10-11 digits
  const minLength = 7;
  const maxLength = 15;

  return digitsOnly.length >= minLength && digitsOnly.length <= maxLength;
};

// Password validation - minimum 8 characters
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

// Format phone number for display (adds spaces for readability)
export const formatPhoneNumber = (phone: string): string => {
  const digitsOnly = phone.replace(/\D/g, '');

  // Format as: XXX XXX XXXX (for 10 digits)
  if (digitsOnly.length <= 3) return digitsOnly;
  if (digitsOnly.length <= 6) return `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3)}`;
  return `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 6)} ${digitsOnly.slice(6, 10)}`;
};

// Error messages
export const ValidationErrors = {
  EMAIL_REQUIRED: 'Email address is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PHONE_REQUIRED: 'Phone number is required',
  PHONE_INVALID: 'Please enter a valid phone number',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
};
