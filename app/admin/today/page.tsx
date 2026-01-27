"use client";

import { useEffect, useMemo, useState } from "react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { BUSINESS_TIMEZONE } from "@/lib/time";

type Appointment = {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  start_time: string;
  end_time: string;
  status: string;
  services?: { name: string } | null;
};

const STATUS_OPTIONS = [
  "booked",
  "confirmed",
  "rescheduled",
  "attended",
  "no_show",
  "cancelled",
];

export default function AdminTodayPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("booked");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dayRange = useMemo(() => {
    const now = DateTime.now().setZone(BUSINESS_TIMEZONE);
    const start = now.startOf("day").toUTC().toISO();
    const end = now.endOf("day").toUTC().toISO();
    return { start, end };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      const supabase = getSupabaseBrowserClient();
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        router.replace("/admin/login");
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("appointments")
        .select(
          "id, customer_name, customer_email, customer_phone, start_time, end_time, status, services(name)"
        )
        .gte("start_time", dayRange.start)
        .lte("start_time", dayRange.end)
        .order("start_time", { ascending: true });

      if (!mounted) return;

      if (fetchError) {
        setError("Unable to load appointments.");
        setLoading(false);
        return;
      }

      setAppointments((data ?? []) as Appointment[]);
      setLoading(false);
    }

    load();

    return () => {
      mounted = false;
    };
  }, [dayRange.start, dayRange.end, router]);

  async function handleCheckIn(appointmentId: string) {
    const supabase = getSupabaseBrowserClient();
    const { error: updateError } = await supabase
      .from("appointments")
      .update({ status: "attended" })
      .eq("id", appointmentId);

    if (updateError) {
      setError("Unable to check in appointment.");
      return;
    }

    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === appointmentId
          ? { ...appointment, status: "attended" }
          : appointment
      )
    );
  }

  const filtered = appointments.filter((appointment) =>
    statusFilter ? appointment.status === statusFilter : true
  );

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              Admin today
            </p>
            <h1 className="text-2xl font-semibold text-zinc-900">
              Today’s appointments
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              Asia/Manila timezone • {DateTime.now().setZone(BUSINESS_TIMEZONE).toFormat("DDD")}
            </p>
          </div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm"
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-sm text-zinc-600">
            Loading appointments...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-sm text-zinc-600">
            No appointments for this filter.
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((appointment) => {
              const start = DateTime.fromISO(appointment.start_time, {
                zone: "utc",
              }).setZone(BUSINESS_TIMEZONE);
              const end = DateTime.fromISO(appointment.end_time, {
                zone: "utc",
              }).setZone(BUSINESS_TIMEZONE);

              return (
                <div
                  key={appointment.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">
                        {appointment.customer_name}
                      </p>
                      <p className="text-sm text-zinc-600">
                        {appointment.services?.name ?? "Service"} •{" "}
                        {start.toFormat("h:mm a")} - {end.toFormat("h:mm a")}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {appointment.customer_email || appointment.customer_phone || "No contact"}
                      </p>
                    </div>
                    <div className="flex flex-col items-start gap-2 sm:items-end">
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
                        {appointment.status.replace("_", " ")}
                      </span>
                      {appointment.status !== "attended" ? (
                        <button
                          type="button"
                          onClick={() => handleCheckIn(appointment.id)}
                          className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white"
                        >
                          Check in
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
