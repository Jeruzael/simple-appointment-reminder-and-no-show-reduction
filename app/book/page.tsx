import BookingForm from "./BookingForm";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

type ServiceRecord = {
  id: string;
  name: string;
  duration_minutes: number;
  active: boolean;
};

export default async function BookPage() {
  const supabase = getSupabaseAdmin();
  const { data: services } = await supabase
    .from("services")
    .select("id, name, duration_minutes, active")
    .eq("active", true)
    .order("name");

  const safeServices =
    (services as ServiceRecord[] | null)?.map((service) => ({
      id: service.id,
      name: service.name,
      duration_minutes: service.duration_minutes,
    })) ?? [];

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-16">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-10 lg:flex-row">
        <div className="max-w-md space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
            Exorex
          </p>
          <h2 className="text-4xl font-semibold text-zinc-900">
            Simple booking, fewer no-shows.
          </h2>
          <p className="text-base text-zinc-600">
            Book your visit in seconds. We will send confirmation and reminder
            emails to keep things on track.
          </p>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600">
            <p className="font-semibold text-zinc-900">What happens next?</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>Booking received email</li>
              <li>24-hour reminder</li>
              <li>2-hour reminder</li>
            </ul>
          </div>
        </div>
        <BookingForm services={safeServices} />
      </div>
    </div>
  );
}
