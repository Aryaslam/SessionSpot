import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            School Class Booking
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Request classrooms for your club, and let school administrators
            review, approve, or reject them.
          </p>
        </div>

        <div className="grid gap-3">
          <Link
            href="/school-admin/login"
            className="rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
          >
            School Admin
          </Link>
          <Link
            href="/club-admin/login"
            className="rounded-md border border-neutral-300 dark:border-neutral-700 py-2.5 text-sm font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Club Admin
          </Link>
        </div>
      </div>
    </main>
  );
}
