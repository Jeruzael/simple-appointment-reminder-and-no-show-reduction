import { DateTime } from "luxon";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { BUSINESS_TIMEZONE } from "@/lib/time";

type PageProps = {
  params: { token: string };
};

export default async function ManageAppointmentPage({ params }: PageProps) {
  const supabase = getSupabaseAdmin();
  const { data: appointment } = await supabase
    .from("appointments")
    .select("id, customer_name, start_time, end_time, status, services(name)")
    .eq("manage_token", params.token)
    .maybeSingle();

  if (!appointment) {
    return (
      <div className="min-h-screen bg-zinc-50 px-6 py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-zinc-200 bg-white p-8">
          <h1 className="text-2xl font-semibold text-zinc-900">
            Appointment not found
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Please check your link or contact the salon.
          </p>
        </div>
      </div>
    );
  }

  const start = DateTime.fromISO(appointment.start_time, { zone: "utc" }).setZone(
    BUSINESS_TIMEZONE
  );
  const end = DateTime.fromISO(appointment.end_time, { zone: "utc" }).setZone(
    BUSINESS_TIMEZONE
  );

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-16">
      <div className="mx-auto max-w-xl rounded-2xl border border-zinc-200 bg-white p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
          Manage appointment
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-zinc-900">
          Hi {appointment.customer_name}
        </h1>
        <div className="mt-6 space-y-2 text-sm text-zinc-600">
          <p>
            <span className="font-semibold text-zinc-900">Service:</span>{" "}
            {appointment.services?.name ?? "Appointment"}
          </p>
          <p>
            <span className="font-semibold text-zinc-900">Date:</span>{" "}
            {start.toFormat("ccc, LLL d")}
          </p>
          <p>
            <span className="font-semibold text-zinc-900">Time:</span>{" "}
            {start.toFormat("h:mm a")} - {end.toFormat("h:mm a")}{" "}
            {BUSINESS_TIMEZONE}
          </p>
          <p>
            <span className="font-semibold text-zinc-900">Status:</span>{" "}
            {appointment.status}
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
          Confirmation, reschedule, and cancel actions will appear here in the
          next phase.
        </div>
      </div>
    </div>
  );
}
