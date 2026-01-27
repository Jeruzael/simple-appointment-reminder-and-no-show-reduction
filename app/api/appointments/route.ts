import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  BUFFER_MINUTES,
  BUSINESS_TIMEZONE,
  isOnSlotIncrement,
  isWithinBusinessHours,
  parseManilaLocalToUtc,
} from "@/lib/time";
import { getResendClient } from "@/lib/email";

type BookingPayload = {
  service_id?: string;
  start_time?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
};

type ServiceRecord = {
  id: string;
  name: string;
  duration_minutes: number;
  active: boolean;
};

function randomToken() {
  return crypto.randomBytes(24).toString("hex");
}

async function parsePayload(req: NextRequest): Promise<BookingPayload> {
  const contentType = req.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await req.json()) as BookingPayload;
  }

  const form = await req.formData();
  return {
    service_id: String(form.get("service_id") ?? ""),
    start_time: String(form.get("start_time") ?? ""),
    customer_name: String(form.get("customer_name") ?? ""),
    customer_email: String(form.get("customer_email") ?? ""),
    customer_phone: String(form.get("customer_phone") ?? ""),
  };
}

export async function POST(req: NextRequest) {
  try {
    const payload = await parsePayload(req);
    const { service_id, start_time, customer_name, customer_email, customer_phone } =
      payload;

    if (!service_id || !start_time || !customer_name || !customer_email) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const parsed = parseManilaLocalToUtc(start_time);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    if (!isOnSlotIncrement(parsed.manila)) {
      return NextResponse.json(
        { error: "Time must be in 15-minute increments." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("id, name, duration_minutes, active")
      .eq("id", service_id)
      .single<ServiceRecord>();

    if (serviceError || !service) {
      return NextResponse.json({ error: "Invalid service." }, { status: 400 });
    }

    if (!service.active) {
      return NextResponse.json(
        { error: "Service is not available." },
        { status: 400 }
      );
    }

    const durationMinutes = Number(service.duration_minutes);
    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
      return NextResponse.json(
        { error: "Invalid service duration." },
        { status: 400 }
      );
    }

    const endManila = parsed.manila.plus({
      minutes: durationMinutes + BUFFER_MINUTES,
    });

    if (!isWithinBusinessHours(parsed.manila, endManila)) {
      return NextResponse.json(
        {
          error: `Time must be within business hours (10:00-20:00 ${BUSINESS_TIMEZONE}).`,
        },
        { status: 400 }
      );
    }

    const startUtc = parsed.utc.toISO();
    const endUtc = endManila.toUTC().toISO();

    const { data: overlap, error: overlapError } = await supabase
      .from("appointments")
      .select("id")
      .lt("start_time", endUtc)
      .gt("end_time", startUtc)
      .neq("status", "cancelled")
      .limit(1);

    if (overlapError) {
      return NextResponse.json(
        { error: "Unable to validate availability." },
        { status: 500 }
      );
    }

    if (overlap && overlap.length > 0) {
      return NextResponse.json(
        { error: "Selected time is not available." },
        { status: 409 }
      );
    }

    const confirm_token = randomToken();
    const manage_token = randomToken();

    const { data: appointment, error: insertError } = await (supabase
      .from("appointments") as any)
      .insert({
        service_id,
        customer_name,
        customer_email,
        customer_phone,
        start_time: startUtc,
        end_time: endUtc,
        status: "booked",
        confirm_token,
        manage_token,
      })
      .select("id, start_time, end_time")
      .single();

    if (insertError || !appointment) {
      return NextResponse.json(
        { error: "Unable to create appointment." },
        { status: 500 }
      );
    }

    const baseUrl = process.env.APP_BASE_URL;
    const fromAddress = process.env.EMAIL_FROM_ADDRESS;
    if (!baseUrl || !fromAddress) {
      return NextResponse.json(
        { error: "Email configuration missing." },
        { status: 500 }
      );
    }

    const manageUrl = `${baseUrl}/a/${manage_token}`;
    const resend = getResendClient();
    await resend.emails.send({
      from: fromAddress,
      to: customer_email,
      subject: "Booking received",
      html: `
        <p>Hi ${customer_name},</p>
        <p>Your booking is confirmed. You can manage your appointment here:</p>
        <p><a href="${manageUrl}">${manageUrl}</a></p>
        <p>Timezone: ${BUSINESS_TIMEZONE}</p>
      `,
    });

    return NextResponse.json({
      appointment_id: appointment.id,
      manage_token,
      confirm_token,
      start_time: appointment.start_time,
      end_time: appointment.end_time,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected error creating appointment." },
      { status: 500 }
    );
  }
}
