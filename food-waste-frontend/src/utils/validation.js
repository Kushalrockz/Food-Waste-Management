const allowedEmailProviders = new Set(["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "edu.in"]);

const normalizeEmail = (value) => (value || "").trim();

export const isValidEmailFormat = (value) => {
  const trimmed = normalizeEmail(value);
  if (!trimmed || /\s/.test(trimmed)) return false;
  const parts = trimmed.split("@");
  if (parts.length !== 2) return false;
  if (!parts[0] || !parts[1]) return false;
  if (parts[1].startsWith(".") || parts[1].endsWith(".")) return false;
  const domainParts = parts[1].split(".");
  return domainParts.length === 2 && !!domainParts[0] && !!domainParts[1];
};

export const isAllowedEmailProvider = (value) => {
  if (!isValidEmailFormat(value)) return false;
  const domain = normalizeEmail(value).split("@", -1)[1].toLowerCase();
  return allowedEmailProviders.has(domain);
};

export const validateEmail = (value) => {
  return isValidEmailFormat(value) && isAllowedEmailProvider(value);
};

export const getEmailProviderMessage = (value) => {
  const trimmed = normalizeEmail(value);
  if (!trimmed) return "Invalid email format.";
  if (/\s/.test(trimmed)) return "Spaces are not allowed";

  const parts = trimmed.split("@");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return "Invalid email format.";
  }

  const domain = parts[1].toLowerCase();
  if (allowedEmailProviders.has(domain)) {
    return "Invalid email format.";
  }

  if (domain.includes("gmial") || domain.includes("gaiml") || domain.includes("gmaill")) {
    return "Invalid email provider. Did you mean gmail.com?";
  }
  if (domain.includes("yahoo")) return "Invalid email provider. Did you mean yahoo.com?";
  if (domain.includes("outlook")) return "Invalid email provider. Did you mean outlook.com?";
  if (domain.includes("hotmail")) return "Invalid email provider. Did you mean hotmail.com?";
  if (domain.includes("edu")) return "Invalid email provider. Did you mean edu.in?";
  return "Invalid email provider. Did you mean gmail.com?";
};

export const validatePassword = (value) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/.test(value);
};

export const validateName = (value) => {
  const trimmed = normalizeEmail(value);
  return trimmed.length >= 3 && /^[A-Za-z\s]+$/.test(trimmed);
};

export const validateContact = (value) => {
  return /^\d{10}$/.test((value || "").trim());
};
