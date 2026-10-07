export type ValidationResult<T> = { value: T } | { error: string };

export function requestBodyRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

export function getUnknownFieldError(
  body: Record<string, unknown>,
  allowedFields: readonly string[],
): string | undefined {
  const unknownField = Object.keys(body).find(
    (field) => !allowedFields.includes(field),
  );
  return unknownField ? `unknown field: ${unknownField}` : undefined;
}

export function getMissingRequiredFieldError(
  body: Record<string, unknown>,
  requiredFields: readonly string[],
): string | undefined {
  const missingField = requiredFields.find(
    (field) => !Object.hasOwn(body, field),
  );
  return missingField ? `${missingField} is required` : undefined;
}

export function validateTitle(value: unknown): ValidationResult<string> {
  if (typeof value !== "string") {
    return { error: "title must be a string" };
  }
  const title = value.trim();
  if (title.length < 1 || title.length > 200) {
    return { error: "title must be 1 to 200 characters after trimming" };
  }
  return { value: title };
}

export function validateNotes(
  value: unknown,
): ValidationResult<string | null> {
  if (value !== null && typeof value !== "string") {
    return { error: "notes must be a string or null" };
  }
  const notes = typeof value === "string" ? value.trim() || null : null;
  if (notes !== null && notes.length > 2000) {
    return { error: "notes must not exceed 2000 characters after trimming" };
  }
  return { value: notes };
}

export function isCalendarDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1 || month < 1 || month > 12) {
    return false;
  }

  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [
    31,
    isLeapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  return day >= 1 && day <= daysInMonth[month - 1];
}

export function validateCalendarDate(
  value: unknown,
  fieldName: string,
): ValidationResult<string | null> {
  if (value === null) {
    return { value: null };
  }
  if (typeof value !== "string" || !isCalendarDate(value)) {
    return {
      error: `${fieldName} must be null or a real YYYY-MM-DD date`,
    };
  }
  return { value };
}
