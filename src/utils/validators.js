// Email validation
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Password validation (matches backend requirements)
export const validatePassword = (password) => {
  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/(?=.*\d)/.test(password)) {
    return "Password must contain at least one number";
  }
  return null;
};

// Phone number validation
export const validatePhoneNumber = (phone) => {
  const re = /^[\d\s\-\+\(\)]+$/;
  if (!phone) return "Phone number is required";
  if (phone.length < 10) return "Phone number is too short";
  if (!re.test(phone)) return "Invalid phone number format";
  return null;
};

// Date validation (not in future)
export const validateDateOfBirth = (date) => {
  if (!date) return "Date of birth is required";
  const birthDate = new Date(date);
  const today = new Date();

  if (birthDate > today) {
    return "Date of birth cannot be in the future";
  }

  const age = today.getFullYear() - birthDate.getFullYear();
  if (age < 18) {
    return "Must be at least 18 years old";
  }

  return null;
};

// Required field validation
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return `${fieldName} is required`;
  }
  return null;
};

// Percentage validation (0-100)
export const validatePercentage = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return "Must be a valid number";
  if (num < 0 || num > 100) return "Must be between 0 and 100";
  return null;
};

// File validation
export const validateFile = (file, maxSizeMB = 16) => {
  const allowedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!file) return "File is required";

  if (!allowedTypes.includes(file.type)) {
    return "File type not allowed. Please upload PDF, PNG, JPG, GIF, DOC, or DOCX files";
  }

  const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  if (file.size > maxSize) {
    return `File size must be less than ${maxSizeMB}MB`;
  }

  return null;
};

// Postal/ZIP code validation
export const validatePostalCode = (code, country = "US") => {
  if (!code) return "Postal code is required";

  // Basic validation for different countries
  const patterns = {
    US: /^\d{5}(-\d{4})?$/,
    UK: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
    CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
  };

  const pattern = patterns[country] || /^[\w\s-]{3,10}$/;
  if (!pattern.test(code)) {
    return "Invalid postal code format";
  }

  return null;
};

// URL validation
export const validateURL = (url) => {
  if (!url) return null; // Optional field
  try {
    new URL(url);
    return null;
  } catch {
    return "Invalid URL format";
  }
};

// Tax ID / Registration number validation
export const validateTaxId = (taxId) => {
  if (!taxId) return "Tax ID is required";
  // Basic validation - alphanumeric with hyphens
  const re = /^[A-Z0-9\-]{5,20}$/i;
  if (!re.test(taxId)) {
    return "Invalid Tax ID format";
  }
  return null;
};
