import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/doctors", label: "Doctors" },
  { href: "/patients", label: "Patients" },
];

export function Sidebar() {
  return (
    <aside className="w-full border-b border-zinc-200 p-4 md:w-56 md:border-b-0 md:border-r">
      <p className="mb-4 text-lg font-semibold">Doctor Tracker</p>
      <nav className="flex gap-4 md:flex-col md:gap-2">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="text-zinc-700 hover:text-black">
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
