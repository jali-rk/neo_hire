export interface FormValues {
  role: string;
  name: string;
  email: string;
  phone: string;
  exp: string;
  city: string;
  link: string;
  note: string;
  consent: boolean;
}

export type FieldKey = 'role' | 'name' | 'email' | 'phone' | 'exp' | 'link' | 'cv' | 'consent';
export type FormErrors = Partial<Record<FieldKey, string>>;

/** Order matters: the first invalid field gets focus. */
export const FIELD_ORDER: FieldKey[] = ['role', 'name', 'email', 'phone', 'exp', 'link', 'cv', 'consent'];

export const EMPTY_VALUES: FormValues = {
  role: '',
  name: '',
  email: '',
  phone: '',
  exp: '',
  city: '',
  link: '',
  note: '',
  consent: false,
};

/** Adds https:// to links typed without it, like "behance.net/name". */
export function normaliseLink(value: string): string {
  const v = value.trim();
  return v && !/^https?:\/\//i.test(v) ? `https://${v}` : v;
}

const LINK_ERROR = 'Enter a full link, like https://behance.net/yourname.';

/** Returns an error message, or an empty string when the field is fine. */
export function validateField(key: FieldKey, v: FormValues, file: File | null, maxMB: number): string {
  switch (key) {
    case 'role':
      return v.role ? '' : 'Choose the role you’re applying for.';
    case 'name':
      return v.name.trim().length >= 2 ? '' : 'Enter your full name.';
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()) ? '' : 'Enter an email address, like name@example.com.';
    case 'phone':
      return (v.phone.match(/\d/g) ?? []).length >= 9 ? '' : 'Enter a phone number we can call, like +94 77 123 4567.';
    case 'exp':
      return v.exp ? '' : 'Choose your years of experience.';
    case 'link': {
      const link = normaliseLink(v.link);
      if (!link) return '';
      try {
        return new URL(link).hostname.includes('.') ? '' : LINK_ERROR;
      } catch {
        return LINK_ERROR;
      }
    }
    case 'cv':
      if (!file) return '';
      if (!/\.(pdf|docx?)$/i.test(file.name)) return 'Attach your CV as a PDF or Word file.';
      if (file.size > maxMB * 1024 * 1024) {
        return `This file is larger than ${maxMB} MB. Attach a smaller file, or add a link to it in the portfolio field.`;
      }
      return '';
    case 'consent':
      return v.consent ? '' : 'Tick the box so we can use your details for this application.';
  }
}

export function validateAll(v: FormValues, file: File | null, maxMB: number): FormErrors {
  const errors: FormErrors = {};
  for (const key of FIELD_ORDER) {
    const message = validateField(key, v, file, maxMB);
    if (message) errors[key] = message;
  }
  return errors;
}
