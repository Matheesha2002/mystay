import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F6EF] text-[#173F35]">
      {/* Navigation bar */}
      <Navbar />

      {/* Main introduction */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center md:py-32">
        <p className="text-sm font-semibold uppercase tracking-widest">
          A stay made for you
        </p>

        <h1 className="mt-6 text-5xl font-bold leading-tight md:text-7xl">
          Your stay.
          <br />
          Your way.
        </h1>

        <p className="mt-6 text-xl">
          ඔබේ නවාතැන, ඔබේ කැමැත්තට.
        </p>

        <p className="mx-auto mt-5 max-w-xl leading-7 text-[#173F35]/75">
          Choose your room, add your favourite meals and activities,
          and plan a stay that fits your budget.
        </p>

        <a
          href="#how-it-works"
          className="mt-8 inline-block rounded-lg bg-[#173F35] px-7 py-4 font-medium text-white"
        >
          Discover how it works
        </a>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="mx-auto max-w-6xl scroll-mt-8 px-6 pb-20"
      >
        <h2 className="mb-8 text-center text-3xl font-bold">
          A simpler way to plan your stay
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-[#173F35]/15 bg-white p-8">
            <span className="text-sm font-semibold">01</span>
            <h3 className="mt-4 text-xl font-semibold">
              Choose your room
            </h3>
            <p className="mt-3 leading-7 text-gray-600">
              Find a room that suits your guests and your comfort.
            </p>
          </article>

          <article className="rounded-2xl border border-[#173F35]/15 bg-white p-8">
            <span className="text-sm font-semibold">02</span>
            <h3 className="mt-4 text-xl font-semibold">
              Add your favourites
            </h3>
            <p className="mt-3 leading-7 text-gray-600">
              Pick your meals and activities, and check your total.
            </p>
          </article>

          <article className="rounded-2xl border border-[#173F35]/15 bg-white p-8">
            <span className="text-sm font-semibold">03</span>
            <h3 className="mt-4 text-xl font-semibold">
              Request your stay
            </h3>
            <p className="mt-3 leading-7 text-gray-600">
              Send your package to the hotel for review and confirmation.
            </p>
          </article>
        </div>
      </section>

      <Footer />
    </main>
  );
}