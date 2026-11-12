import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import {
  AFTER_YOU_APPLY,
  COMPANY,
  CONFIG,
  EXPERIENCE_OPTIONS,
  NDA_ACKNOWLEDGEMENT,
  OPEN_APPLICATION,
  ROLE_OPTIONS,
} from '../content';
import { emailIsPlaceholder, mailto } from '../lib/mailto';
import {
  EMPTY_VALUES,
  FIELD_ORDER,
  normaliseLink,
  validateAll,
  validateField,
  type FieldKey,
  type FormErrors,
  type FormValues,
} from '../lib/validate';
import { CheckIcon, UploadIcon } from './Icons';

export interface ApplyRequest {
  role: string;
  /** Changes on every request, so asking for the same role twice still works. */
  n: number;
}

const STORAGE_KEY = 'aph-applied';
const FIELD_ID: Record<FieldKey, string> = {
  role: 'f-role',
  name: 'f-name',
  email: 'f-email',
  phone: 'f-phone',
  exp: 'f-exp',
  link: 'f-link',
  cv: 'f-cv',
  nda: 'f-nda',
};
const AUTO_REPLY = `Thank you for applying to ${COMPANY}. We have received your application.`;

export default function Apply({ request }: { request: ApplyRequest | null }) {
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  // Latest values, so handlers that run back to back never work from a stale copy.
  const valuesRef = useRef<FormValues>(EMPTY_VALUES);
  const setForm = (next: FormValues) => {
    valuesRef.current = next;
    setValues(next);
  };
  const [file, setFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<{ name: string; role: string } | null>(null);
  const [nextUrl, setNextUrl] = useState('');
  const successRef = useRef<HTMLDivElement>(null);

  const formAction = `https://formsubmit.co/${encodeURIComponent(CONFIG.formsubmitId.trim() || CONFIG.careersEmail.trim())}`;

  /* Where FormSubmit sends people back to, and the "sent" state when they return. */
  useEffect(() => {
    setNextUrl(`${window.location.origin}${window.location.pathname}?applied=1#apply`);

    if (new URLSearchParams(window.location.search).has('applied')) {
      let saved = { name: '', role: '' };
      try {
        saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null') ?? saved;
      } catch {
        /* storage unavailable */
      }
      setSent(saved);
      window.history.replaceState(null, '', `${window.location.pathname}#apply`);
      requestAnimationFrame(() => successRef.current?.focus({ preventScroll: true }));
    }

    // Coming back with the browser's back button: let them send again.
    const onPageShow = () => setSending(false);
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  /* "Apply" buttons elsewhere on the page pre-select the role. */
  useEffect(() => {
    if (!request) return;
    setSent(null);
    setForm({ ...valuesRef.current, role: request.role });
    setErrors((e) => ({ ...e, role: '' }));
    const t = window.setTimeout(() => document.getElementById(FIELD_ID.name)?.focus({ preventScroll: true }), 600);
    return () => window.clearTimeout(t);
  }, [request]);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    const next = { ...valuesRef.current, [key]: value };
    setForm(next);
    // Re-check a field that's showing an error, so it clears as soon as it's fixed.
    if (key in FIELD_ID) {
      const field = key as FieldKey;
      setErrors((e) => (e[field] ? { ...e, [field]: validateField(field, next, file, CONFIG.maxUploadMB) } : e));
    }
  }

  function checkOnBlur(key: FieldKey) {
    let v = valuesRef.current;
    if (key === 'link') {
      const link = normaliseLink(v.link);
      if (link !== v.link) {
        v = { ...v, link };
        setForm(v);
      }
    }
    const raw = v[key as keyof FormValues];
    if (typeof raw === 'string' && raw.trim()) {
      setErrors((e) => ({ ...e, [key]: validateField(key, v, file, CONFIG.maxUploadMB) }));
    }
  }

  function onFile(e: ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0] ?? null;
    setFile(picked);
    setErrors((er) => ({ ...er, cv: validateField('cv', valuesRef.current, picked, CONFIG.maxUploadMB) }));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    setStatus('');
    const current = { ...valuesRef.current, link: normaliseLink(valuesRef.current.link) };
    const found = validateAll(current, file, CONFIG.maxUploadMB);
    const failed = FIELD_ORDER.filter((k) => found[k]);
    setErrors(found);

    if (failed.length) {
      e.preventDefault();
      setStatus(failed.length === 1 ? 'Fix the highlighted field to continue.' : `Fix the ${failed.length} highlighted fields to continue.`);
      document.getElementById(FIELD_ID[failed[0]])?.focus();
      return;
    }
    if (window.location.protocol === 'file:') {
      e.preventDefault();
      setStatus('This is a preview copy, so nothing was sent. Applications go through once the site is online.');
      return;
    }
    if (emailIsPlaceholder()) {
      e.preventDefault();
      setStatus('Online applications aren’t switched on yet. Please try again later.');
      console.warn('Aphrodite careers: set CONFIG.careersEmail in src/content.ts to the inbox that should receive applications.');
      return;
    }

    // Send the tidied link (e.g. "behance.net/x" → "https://behance.net/x"), even if the
    // person pressed Enter without leaving the field.
    if (current.link !== valuesRef.current.link) {
      setForm(current);
      const linkInput = e.currentTarget.elements.namedItem('Portfolio');
      if (linkInput instanceof HTMLInputElement) linkInput.value = current.link;
    }
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ name: current.name.trim(), role: current.role }));
    } catch {
      /* storage unavailable */
    }
    setSending(true);
    // No preventDefault: the browser posts the form, CV included, to FormSubmit,
    // which emails it to CONFIG.careersEmail and sends the person back here.
  }

  function startAgain() {
    setForm(EMPTY_VALUES);
    setFile(null);
    setFileKey((k) => k + 1);
    setErrors({});
    setStatus('');
    setSending(false);
    setSent(null);
    window.setTimeout(() => document.getElementById(FIELD_ID.role)?.focus(), 0);
  }

  const err = (key: FieldKey) => errors[key] || '';
  const invalid = (key: FieldKey) => (errors[key] ? true : undefined);
  const firstName = sent?.name.split(/\s+/)[0];

  return (
    <section className="section apply dark" id="apply" aria-labelledby="apply-title">
      <div className="wrap">
        <div className="section-head" data-reveal="head">
          <div>
            <p className="eyebrow">Apply</p>
            <h2 className="title" id="apply-title">
              Apply to <em>Aphrodite.</em>
            </h2>
          </div>
          <p className="intro">
            Choose a role, add your details and attach your CV and portfolio. Your application goes directly to our hiring
            team.
          </p>
        </div>

        <div className="apply-grid" data-reveal>
          <div>
            {sent ? (
              <div className="success" ref={successRef} tabIndex={-1}>
                <div className="success-mark" aria-hidden="true">
                  <CheckIcon />
                </div>
                <h3>Application sent.</h3>
                <p>
                  {firstName ? `Thank you, ${firstName}. ` : 'Thank you. '}
                  Your application{sent.role && sent.role !== OPEN_APPLICATION ? ` for ${sent.role}` : ''} has reached our
                  hiring team, who review technical submissions to arrange NDA briefings and studio trials.
                </p>
                <div className="actions">
                  <a className="btn btn-light" href="#careers">
                    Back to the roles
                  </a>
                  <button className="btn btn-outline-light" type="button" onClick={startAgain}>
                    Send another application
                  </button>
                </div>
              </div>
            ) : (
              <form className="form" method="POST" encType="multipart/form-data" action={formAction} noValidate onSubmit={onSubmit}>
                {/* Delivery settings for FormSubmit */}
                <input type="hidden" name="_subject" value={`Application: ${values.role} (${values.name.trim()})`} />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_next" value={nextUrl} />
                <input type="hidden" name="_autoresponse" value={AUTO_REPLY} />
                <div className="hp" aria-hidden="true">
                  <label htmlFor="f-honey">Leave this empty</label>
                  <input type="text" id="f-honey" name="_honey" tabIndex={-1} autoComplete="off" />
                </div>

                <Field id="f-role" label="Position" error={err('role')} full>
                  <select
                    className="input"
                    id="f-role"
                    name="Position"
                    value={values.role}
                    onChange={(e) => update('role', e.target.value)}
                    aria-invalid={invalid('role')}
                    aria-describedby="f-role-err"
                  >
                    <option value="">Choose a position</option>
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </Field>

                <Field id="f-name" label="Full name" error={err('name')}>
                  <input
                    className="input"
                    id="f-name"
                    name="Name"
                    type="text"
                    autoComplete="name"
                    value={values.name}
                    onChange={(e) => update('name', e.target.value)}
                    onBlur={() => checkOnBlur('name')}
                    aria-invalid={invalid('name')}
                    aria-describedby="f-name-err"
                  />
                </Field>

                <Field id="f-phone" label="Phone (WhatsApp)" error={err('phone')}>
                  <input
                    className="input"
                    id="f-phone"
                    name="Phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+94 77 123 4567"
                    value={values.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    onBlur={() => checkOnBlur('phone')}
                    aria-invalid={invalid('phone')}
                    aria-describedby="f-phone-err"
                  />
                </Field>

                <Field id="f-email" label="Email" error={err('email')}>
                  <input
                    className="input"
                    id="f-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="name@example.com"
                    value={values.email}
                    onChange={(e) => update('email', e.target.value)}
                    onBlur={() => checkOnBlur('email')}
                    aria-invalid={invalid('email')}
                    aria-describedby="f-email-err"
                  />
                </Field>

                <Field id="f-exp" label="Industry experience" error={err('exp')}>
                  <select
                    className="input"
                    id="f-exp"
                    name="Experience"
                    value={values.exp}
                    onChange={(e) => update('exp', e.target.value)}
                    aria-invalid={invalid('exp')}
                    aria-describedby="f-exp-err"
                  >
                    <option value="">Choose one</option>
                    {EXPERIENCE_OPTIONS.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </Field>

                <Field id="f-link" label="Portfolio, Behance or LinkedIn" optional error={err('link')} full>
                  <input
                    className="input"
                    id="f-link"
                    name="Portfolio"
                    type="url"
                    inputMode="url"
                    placeholder="https://"
                    value={values.link}
                    onChange={(e) => update('link', e.target.value)}
                    onBlur={() => checkOnBlur('link')}
                    aria-invalid={invalid('link')}
                    aria-describedby="f-link-err"
                  />
                </Field>

                <div className="field field-full">
                  <span className="label" id="cv-label">
                    CV and portfolio <span className="optional">(optional)</span>
                  </span>
                  <div className="file">
                    <input
                      key={fileKey}
                      id="f-cv"
                      name="attachment"
                      type="file"
                      accept=".pdf,.doc,.docx,.zip,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/zip"
                      onChange={onFile}
                      aria-labelledby="cv-label cv-help"
                      aria-invalid={invalid('cv')}
                      aria-describedby="f-cv-err"
                    />
                    <div className="file-face">
                      <span className="file-icon" aria-hidden="true">
                        <UploadIcon />
                      </span>
                      <span className="file-text">
                        <span className="file-name">{file ? file.name : 'Choose a file'}</span>
                        <span className="file-help" id="cv-help">
                          {file
                            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB · choose again to replace`
                            : `PDF, Word or ZIP, up to ${CONFIG.maxUploadMB} MB`}
                        </span>
                      </span>
                    </div>
                  </div>
                  <p className="err" id="f-cv-err">
                    {err('cv')}
                  </p>
                </div>

                <Field id="f-note" label="Technical strengths and notice period" optional full>
                  <textarea
                    className="input"
                    id="f-note"
                    name="Technical strengths and notice period"
                    placeholder="For example: the machines you use, your CAD or CLO 3D skills, and when you could start."
                    value={values.note}
                    onChange={(e) => update('note', e.target.value)}
                  />
                </Field>

                <div className="field field-full">
                  <label className="check">
                    <input
                      type="checkbox"
                      id="f-nda"
                      name="NDA acknowledged"
                      value="Yes"
                      checked={values.nda}
                      onChange={(e) => update('nda', e.target.checked)}
                      aria-invalid={invalid('nda')}
                      aria-describedby="f-nda-err"
                    />
                    <span>{NDA_ACKNOWLEDGEMENT}</span>
                  </label>
                  <p className="err" id="f-nda-err">
                    {err('nda')}
                  </p>
                </div>

                <div className="submit-row">
                  <button className="btn btn-light" type="submit" disabled={sending}>
                    {sending ? 'Sending…' : 'Send application'}
                  </button>
                  <p className="form-status" role="status" aria-live="polite">
                    {status}
                  </p>
                </div>
              </form>
            )}
          </div>

          <aside>
            <div className="aside-card">
              <h3>After you apply</h3>
              <ol className="next-steps">
                {AFTER_YOU_APPLY.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>
            <EmailCard />
          </aside>
        </div>
      </div>
    </section>
  );
}

interface FieldProps {
  id: string;
  label: string;
  optional?: boolean;
  full?: boolean;
  error?: string;
  children: ReactNode;
}

function Field({ id, label, optional, full, error, children }: FieldProps) {
  return (
    <div className={`field${full ? ' field-full' : ''}`}>
      <label htmlFor={id}>
        {label} {optional && <span className="optional">(optional)</span>}
      </label>
      {children}
      {error !== undefined && (
        <p className="err" id={`${id}-err`}>
          {error}
        </p>
      )}
    </div>
  );
}

function EmailCard() {
  const [copied, setCopied] = useState('');

  async function copy() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(CONFIG.careersEmail);
      ok = true;
    } catch {
      ok = false;
    }
    setCopied(ok ? 'Copied' : 'Copy failed. Select the address above.');
    window.setTimeout(() => setCopied(''), 2500);
  }

  return (
    <div className="aside-card">
      <h3>Prefer email?</h3>
      <p>Send your CV with the position in the subject line.</p>
      <span className="mail">{CONFIG.careersEmail}</span>
      <div className="aside-actions">
        <a className="btn btn-light btn-sm" href={mailto()}>
          Write an email
        </a>
        <button className="btn btn-outline-light btn-sm" type="button" onClick={copy}>
          Copy address
        </button>
        <span className="copy-status" role="status" aria-live="polite">
          {copied}
        </span>
      </div>
    </div>
  );
}
