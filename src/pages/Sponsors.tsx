import royalCanin from '@/assets/royal-canin-logo.png';

/**
 * A sponsor page that is mostly one logo should look deliberate rather than
 * sparse, so the title sponsor gets the full width and the page says what the
 * sponsorship actually is.
 */
export default function Sponsors() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
      <h1 className="display rule-red text-[clamp(2.25rem,6vw,4rem)] text-show-ink">
        Sponsors
      </h1>

      <section className="mt-14 border border-show-rule">
        <div className="h-[6px] bg-show-red" />
        <div className="grid items-center gap-10 p-10 sm:grid-cols-[16rem_1fr] lg:p-14">
          {/* The supplied file is square with the logo sitting in its upper
              third, so it is cropped to the artwork instead of rendering with a
              block of dead space underneath it. */}
          <img
            src={royalCanin}
            alt="Royal Canin"
            className="h-24 w-full max-w-[16rem] justify-self-center object-cover object-[center_25%]"
          />
          <div>
            <p className="label">Title sponsor</p>
            <h2 className="display-md mt-3 text-2xl text-show-ink">Royal Canin</h2>
            <p className="mt-4 max-w-lg leading-relaxed text-show-charcoal">
              Royal Canin is the title sponsor of the New Zealand Premier Show Dog
              of the Year, and the show carries their name.
            </p>
          </div>
        </div>
      </section>

      <p className="mt-10 max-w-xl text-show-charcoal">
        Interested in supporting the show? Contact the organisers.
      </p>
    </div>
  );
}
