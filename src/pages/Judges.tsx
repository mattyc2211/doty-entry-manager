import { JUDGES_2026 } from '@/data/judges';
import { useShow } from '@/hooks/useShow';

export default function Judges() {
  const { show } = useShow();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
      <h1 className="display rule-red text-[clamp(2.25rem,6vw,4rem)] text-show-ink">
        International judges
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-show-charcoal">
        Three judges from outside New Zealand, so every dog in the ring is
        assessed by someone who has never seen it before.
      </p>

      <dl className="mt-12 border-t border-show-rule">
        {JUDGES_2026.map((judge) => (
          <div
            key={judge.name}
            className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b border-show-rule py-6"
          >
            <dt className="display-md text-2xl text-show-ink">{judge.name}</dt>
            <dd className="text-show-charcoal">{judge.country}</dd>
          </div>
        ))}
      </dl>

      {show && (
        <p className="mt-6 text-sm text-show-charcoal">
          Judging assignments for {show.year} are announced closer to the show.
        </p>
      )}
    </div>
  );
}
