// Form validation utilities

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return re.test(password);
};

export const validatePhone = (phone) => {
  // Indonesian phone number format
  const re = /^(\+62|62|0)[0-9]{9,12}$/;
  return re.test(phone.replace(/\s/g, ''));
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  return value && value.length <= maxLength;
};

export const validateNumber = (value) => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};

export const validatePositiveNumber = (value) => {
  return validateNumber(value) && parseFloat(value) > 0;
};

export const validatePrice = (value) => {
  return validatePositiveNumber(value) && parseFloat(value) >= 1000;
};

export const getValidationError = (field, value, rules = {}) => {
  if (rules.required && !validateRequired(value)) {
    return `${field} wajib diisi`;
  }

  if (value && rules.minLength && !validateMinLength(value, rules.minLength)) {
    return `${field} minimal ${rules.minLength} karakter`;
  }

  if (value && rules.maxLength && !validateMaxLength(value, rules.maxLength)) {
    return `${field} maksimal ${rules.maxLength} karakter`;
  }

  if (value && rules.email && !validateEmail(value)) {
    return 'Format email tidak valid';
  }

  if (value && rules.password && !validatePassword(value)) {
    return 'Password minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka';
  }

  if (value && rules.phone && !validatePhone(value)) {
    return 'Format nomor telepon tidak valid';
  }

  if (value && rules.number && !validateNumber(value)) {
    return `${field} harus berupa angka`;
  }

  if (value && rules.positiveNumber && !validatePositiveNumber(value)) {
    return `${field} harus berupa angka positif`;
  }

  if (value && rules.price && !validatePrice(value)) {
    return 'Harga minimal Rp 1.000';
  }

  return null;
};

