import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-[#173F35]/15">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-3xl font-bold">
           MyStay
         </Link>

         <Link
           href="/rooms"
           className="font-medium hover:underline"
          >
             Rooms
         </Link>

        <a
          href="/#how-it-works"
          className="rounded-lg bg-[#173F35] px-5 py-3 text-sm font-medium text-white"
        >
          Explore MyStay
        </a>
      </nav>
    </header>
  );
}