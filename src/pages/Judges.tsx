import { JUDGES_2026 } from '@/data/judges';
import { useShow } from '@/hooks/useShow';

export default function Judges() {
  const { show } = useShow();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
      <p className="eyebrow">The panel</p>
      <h1 className="display rule-red mt-4 text-[clamp(2.25rem,6vw,4rem)] text-show-ink">
        International judges
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-show-charcoal">
        Three judges from outside New Zealand, so that every dog in the ring is
        assessed by someone who has never seen it before.
      </p>

      <ol className="mt-14 border-t border-show-rule">
        {JUDGES_2026.map((judge, i) => (
          <li
            key={judge.name}
            className="grid gap-2 border-b border-show-rule py-8 sm:grid-cols-[3rem_1fr_auto] sm:gap-8"
          >
            <span className="code text-sm text-show-charcoal">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h2 className="display-md text-2xl text-show-ink">{judge.name}</h2>
            <span className="text-show-charcoal sm:text-right">{judge.country}</span>
          </li>
        ))}
      </ol>

      {show && (
        <p className="mt-10 text-sm text-show-charcoal">
          Judging assignments for {show.year} are announced closer to the show.
        </p>
      )}
    </div>
  );
}
