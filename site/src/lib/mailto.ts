import { CONFIG } from '../content';

/** A mailto: link that opens the applicant's email app with a ready-made application. */
export function mailto(role?: string): string {
  const subject = role ? `Application: ${role}` : 'Job application';
  const body = [
    'Name:',
    'Phone / WhatsApp:',
    `Role: ${role ?? ''}`,
    'Years of experience:',
    'Portfolio or LinkedIn link:',
    '',
    'A little about my experience:',
    '',
    '',
    '(Please attach your CV.)',
  ].join('\n');
  return `mailto:${CONFIG.careersEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** True while the careers inbox is still the example placeholder. */
export const emailIsPlaceholder = (): boolean =>
  !CONFIG.careersEmail.trim() || /@example\.(com|org|net)$/i.test(CONFIG.careersEmail.trim());
