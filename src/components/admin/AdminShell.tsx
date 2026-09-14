import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { ShowMark } from '@/components/show/ShowMark';
import { cn } from '@/lib/utils';

/**
 * The organiser area's own header. It sits outside the public site's shell on
 * purpose: the show's navigation is no use while reconciling payments, and the
 * two things an organiser does here (entries, organisers) are the whole menu.
 */
export function AdminShell({
  onSignOut,
  children,
}: {
  onSignOut: () => void;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-wash">
      <header className="border-b border-show-rule bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5 sm:gap-6 lg:px-8">
          {/* At phone width the mark wraps to three lines and crowds the
              nav, which is the part that has to work. */}
          <ShowMark size="sm" className="hidden sm:flex" />

          <nav className="flex h-full items-stretch gap-5 text-sm">
            <AdminNavLink to="/admin" end>
              Entries
            </AdminNavLink>
            <AdminNavLink to="/admin/organisers">Organisers</AdminNavLink>
          </nav>

          <button
            type="button"
            onClick={onSignOut}
            aria-label="Sign out"
            className="ml-auto inline-flex items-center gap-2 text-sm text-show-charcoal hover:text-show-ink"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {children}
    </div>
  );
}

function AdminNavLink({
  to,
  end,
  children,
}: {
  to: string;
  end?: boolean;
  children: ReactNode;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          '-mb-px inline-flex items-center border-b-2 transition-colors',
          isActive
            ? 'border-show-ink font-medium text-show-ink'
            : 'border-transparent text-show-charcoal hover:text-show-ink',
        )
      }
    >
      {children}
    </NavLink>
  );
}
