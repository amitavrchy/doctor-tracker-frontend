import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <p className="text-sm font-bold text-teal-700">404</p>
      <h1 className="mt-3 text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-slate-500">
        We couldn’t find the page you’re looking for.
      </p>
      <Link
        className="mt-6 font-semibold text-teal-700 underline"
        href="/dashboard"
      >
        Return to dashboard
      </Link>
    </main>
  );
}
