import { useEffect, useRef } from 'react';
import { ROLE_FOOTNOTE, type Role } from '../content';
import { mailto } from '../lib/mailto';
import { CloseIcon } from './Icons';

interface Props {
  role: Role;
  open: boolean;
  onClose: () => void;
  onApply: () => void;
}

/** Full role details in a side panel (a native modal dialog: focus is trapped, Escape closes it). */
export default function RoleDialog({ role, open, onClose, onApply }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const titleId = `role-${role.id}-title`;

  return (
    <dialog
      ref={ref}
      className="role-dialog"
      id={`role-${role.id}`}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        // A click on the backdrop (outside the panel) closes it.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dialog-panel">
        <div className="dialog-head">
          <p className="role-type">{role.type}</p>
          <button className="dialog-close" type="button" onClick={onClose}>
            <CloseIcon />
            <span>Close</span>
          </button>
        </div>

        <div className="dialog-body">
          <h2 id={titleId}>{role.title}</h2>
          <dl className="role-facts">
            <div>
              <dt>Team</dt>
              <dd>{role.team}</dd>
            </div>
            <div>
              <dt>Experience</dt>
              <dd>{role.experience}</dd>
            </div>
          </dl>

          <h3>About the role</h3>
          <p>{role.summary}</p>

          <h3>What we’re looking for</h3>
          <ul className="ticks">
            {role.requirements.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>

        <div className="dialog-foot">
          <div className="dialog-actions">
            <a
              className="btn btn-primary"
              href="#apply"
              onClick={(e) => {
                // Close first: closing returns focus to the card's button, which would
                // otherwise scroll the page back to the roles after jumping to the form.
                e.preventDefault();
                ref.current?.close();
                onApply();
                document.getElementById('apply')?.scrollIntoView();
                window.history.replaceState(null, '', '#apply');
              }}
            >
              Apply for this role
            </a>
            <a className="text-link" href={mailto(role.title)}>
              Apply by email
            </a>
          </div>
          <p className="footnote">{ROLE_FOOTNOTE}</p>
        </div>
      </div>
    </dialog>
  );
}
