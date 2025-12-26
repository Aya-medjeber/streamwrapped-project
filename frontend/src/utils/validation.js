export function isValidEmail(email) {
  const v = String(email || "").trim();
  // simple, safe email pattern
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function validatePassword(pw) {
  const v = String(pw || "");

  const errors = [];
  if (v.length < 8) errors.push("At least 8 characters");
  if (!/[a-z]/.test(v)) errors.push("At least 1 lowercase letter");
  if (!/[A-Z]/.test(v)) errors.push("At least 1 uppercase letter");
  if (!/[0-9]/.test(v)) errors.push("At least 1 number");
  if (!/[^A-Za-z0-9]/.test(v)) errors.push("At least 1 special character");

  return {
    ok: errors.length === 0,
    errors,
  };
}
