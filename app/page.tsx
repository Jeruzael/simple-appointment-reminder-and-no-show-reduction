export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-20 lg:flex-row lg:items-center">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.4em] text-zinc-400">
            Appointment reminders
          </p>
          <h1 className="text-4xl font-semibold leading-tight lg:text-5xl">
            A cleaner way to book, confirm, and show up.
          </h1>
          <p className="max-w-xl text-base text-zinc-300">
            Built for salons and barbershops who want fewer no-shows without
            complicated software.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/book"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
            >
              Book an appointment
            </a>
            <a
              href="/admin/login"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
            >
              Admin login
            </a>
          </div>
        </div>
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <h2 className="text-lg font-semibold">What this MVP includes</h2>
          <ul className="mt-4 space-y-3 text-sm text-zinc-300">
            <li>Booking form and manage link</li>
            <li>Resend confirmation emails</li>
            <li>24h and 2h reminders</li>
            <li>Admin check-in view</li>
            <li>No-show automation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
