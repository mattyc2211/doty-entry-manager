import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 lg:px-8 lg:py-32">
      <p className="eyebrow">404</p>
      <h1 className="display rule-red mt-4 text-4xl text-show-ink">Nothing here</h1>
      <p className="mt-5 text-show-charcoal">
        That page does not exist. The show, the qualifying rules and the entry form
        are all one click away.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          to="/"
          className="bg-show-ink px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-show-red"
        >
          Back to the show
        </Link>
        <Link
          to="/enter"
          className="border border-show-ink px-6 py-3.5 text-sm font-medium text-show-ink transition-colors hover:bg-show-ink hover:text-white"
        >
          Start an entry
        </Link>
      </div>
    </div>
  );
}
