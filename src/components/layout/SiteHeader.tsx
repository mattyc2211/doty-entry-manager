import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ShowMark } from '@/components/show/ShowMark';
import { cn } from '@/lib/utils';

const NAV = [
  { to: '/about', label: 'The show' },
  { to: '/judges', label: 'Judges' },
  { to: '/qualifying', label: 'Qualifying' },
  { to: '/sponsors', label: 'Sponsors' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-show-rule bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5 lg:px-8">
        {/* The full logo is too detailed to survive a 64px header: the script
            line and the Royal Canin lockup both go to mush. It gets room on the
            home page and in the footer instead, and the header carries the
            legible wordmark. */}
        <Link to="/" onClick={() => setOpen(false)}>
          <ShowMark size="sm" />
        </Link>

        <nav className="ml-auto hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'text-sm text-show-charcoal transition-colors hover:text-show-ink',
                  isActive && 'text-show-ink',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/enter"
            className="bg-show-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-show-red-deep"
          >
            Enter
          </Link>
        </nav>

        <button
          type="button"
          className="ml-auto p-2 text-show-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-show-rule bg-white md:hidden">
          <div className="mx-auto max-w-6xl px-5 py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  'block border-b border-show-rule py-3 text-sm text-show-charcoal',
                  pathname === item.to && 'text-show-ink',
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/enter"
              onClick={() => setOpen(false)}
              className="mt-4 block bg-show-red px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Enter
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
