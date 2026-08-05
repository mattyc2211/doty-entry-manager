import { Link } from 'react-router-dom';
import { ShowMark } from '@/components/show/ShowMark';
import { useShow } from '@/hooks/useShow';
import { formatShowDate } from '@/lib/format';

export function SiteFooter() {
  const { show } = useShow();

  return (
    <footer className="mt-auto border-t border-show-rule bg-white">
      <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <ShowMark size="lg" />
            {show && (
              <p className="code mt-4 text-xs text-show-charcoal">
                {formatShowDate(show.showDate)}
              </p>
            )}
          </div>

          <nav className="flex flex-col gap-2 text-sm text-show-charcoal">
            <Link to="/about" className="hover:text-show-ink">
              The show
            </Link>
            <Link to="/judges" className="hover:text-show-ink">
              Judges
            </Link>
            <Link to="/qualifying" className="hover:text-show-ink">
              Qualifying
            </Link>
            <Link to="/sponsors" className="hover:text-show-ink">
              Sponsors
            </Link>
            <Link to="/admin" className="hover:text-show-ink">
              Organisers
            </Link>
          </nav>
        </div>

        <p className="mt-10 border-t border-show-rule pt-6 text-xs text-show-charcoal">
          Run under Dogs New Zealand regulations.
        </p>
      </div>
    </footer>
  );
}
