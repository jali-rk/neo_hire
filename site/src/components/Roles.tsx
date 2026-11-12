import { OPEN_APPLICATION, ROLES, type Role, type RoleId } from '../content';
import { mailto } from '../lib/mailto';
import { PlusIcon } from './Icons';

interface Props {
  open: ReadonlySet<RoleId>;
  onToggle: (id: RoleId, open: boolean) => void;
  onApply: (role: string) => void;
}

export default function Roles({ open, onToggle, onApply }: Props) {
  return (
    <section className="section" id="roles" aria-labelledby="roles-title">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">Open roles</p>
            <h2 className="title" id="roles-title">
              Five founding roles.
            </h2>
          </div>
          <p className="intro">
            All roles are employed directly by Aphrodite (Pvt) Ltd and based at the Central Studio in Sri Lanka unless
            noted. Open a role to see the details.
          </p>
        </div>

        <div className="roles">
          {ROLES.map((role) => (
            <RoleItem key={role.id} role={role} open={open.has(role.id)} onToggle={onToggle} onApply={onApply} />
          ))}
        </div>

        <div className="open-app">
          <div>
            <h3>Don’t see your role?</h3>
            <p>We also want to hear from textile technologists, luxury retail hosts and specialist manufacturing partners.</p>
          </div>
          <a className="btn btn-ghost" href="#apply" onClick={() => onApply(OPEN_APPLICATION)}>
            Send an open application
          </a>
        </div>
      </div>
    </section>
  );
}

interface ItemProps {
  role: Role;
  open: boolean;
  onToggle: (id: RoleId, open: boolean) => void;
  onApply: (role: string) => void;
}

function RoleItem({ role, open, onToggle, onApply }: ItemProps) {
  return (
    <details className="role" id={`role-${role.id}`} open={open} onToggle={(e) => onToggle(role.id, e.currentTarget.open)}>
      <summary>
        <span className="letter">{role.letter}</span>
        <span>
          <span className="role-title">{role.title}</span>
          <span className="role-line">{role.summary}</span>
        </span>
        <span className="role-meta">
          {role.type} · {role.place}
          <br />
          {role.experience}
        </span>
        <span className="chev" aria-hidden="true">
          <PlusIcon />
        </span>
      </summary>

      <div className="role-body">
        <div>
          <h4>What you’ll do</h4>
          <ul className="ticks">
            {role.doing.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>What you’ll bring</h4>
          <ul className="ticks">
            {role.bringing.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        {role.note && <p className="role-note">{role.note}</p>}
        <div className="role-actions">
          <a className="btn btn-primary" href="#apply" onClick={() => onApply(role.title)}>
            Apply for this role
          </a>
          <a className="text-link" href={mailto(role.title)}>
            Or apply by email
          </a>
        </div>
      </div>
    </details>
  );
}
