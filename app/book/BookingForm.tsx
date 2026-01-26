"use client";

import { useState } from "react";

type Service = {
  id: string;
  name: string;
  duration_minutes: number;
};

type BookingResponse = {
  appointment_id: string;
  manage_token: string;
  confirm_token: string;
  start_time: string;
  end_time: string;
};

export default function BookingForm({ services }: { services: Service[] }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BookingResponse | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus("submitting");
    setResult(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data?.error ?? "Unable to create appointment.");
        setStatus("idle");
        return;
      }

      setResult(data);
      setStatus("success");
      form.reset();
    } catch (err) {
      setError("Network error. Please try again.");
      setStatus("idle");
    }
  }

  return (
    <div className="w-full max-w-2xl rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-semibold text-zinc-900">
        Book an appointment
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        Business hours: 10:00-20:00 Asia/Manila. Times are in 15-minute
        increments.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            name="customer_name"
            required
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-zinc-400 focus:outline-none"
            placeholder="Alex Dela Cruz"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="customer_email"
              required
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-zinc-400 focus:outline-none"
              placeholder="alex@email.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700" htmlFor="phone">
              Phone (optional)
            </label>
            <input
              id="phone"
              type="tel"
              name="customer_phone"
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-zinc-400 focus:outline-none"
              placeholder="0917 000 0000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700" htmlFor="service">
            Service
          </label>
          <select
            id="service"
            name="service_id"
            required
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-zinc-400 focus:outline-none"
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} ({service.duration_minutes} min)
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700" htmlFor="start">
            Date and time
          </label>
          <input
            id="start"
            type="datetime-local"
            name="start_time"
            required
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-zinc-400 focus:outline-none"
          />
          <p className="text-xs text-zinc-500">
            We treat this time as Asia/Manila.
          </p>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {status === "success" && result ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Booking received. Manage your appointment here:{" "}
            <a className="underline" href={`/a/${result.manage_token}`}>
              /a/{result.manage_token}
            </a>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "submitting" ? "Booking..." : "Book appointment"}
        </button>
      </form>
    </div>
  );
}
