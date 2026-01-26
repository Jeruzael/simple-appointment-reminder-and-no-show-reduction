# API Spec

- Purpose: Define backend endpoints and expected behavior.
- Audience: Developers, QA.
- Owner: Exorex
- Last updated: 2026-01-26
- Related: ./Architecture.md
- Status: Active

## POST /api/appointments
Create a booking.

Request
- service_id
- start_time
- customer_name
- customer_email (optional)
- customer_phone (optional)

Response
- appointment_id
- manage_token
- confirm_token
- start_time
- end_time

Rules
- 15-minute slot increments
- Business hours 10:00-20:00 Asia/Manila
- End time = start time + service duration + 5-minute buffer
- No overlaps (single resource)

Errors
- 400: validation errors
- 409: time conflict

## POST /api/appointments/confirm
Confirm a booking.

Request
- confirm_token

Response
- status = confirmed

Errors
- 400: invalid token

## POST /api/appointments/cancel
Cancel a booking.

Request
- manage_token

Response
- status = cancelled

Rules
- Cancellation allowed only until 3 hours before start_time

Errors
- 400: invalid token
- 409: cannot cancel after start_time

## POST /api/appointments/reschedule
Reschedule a booking.

Request
- manage_token
- new_start_time

Response
- status = rescheduled
- start_time
- end_time

Rules
- Reschedule allowed only until 3 hours before start_time
- 15-minute slot increments, business hours 10:00-20:00 Asia/Manila
- No overlaps (single resource)

Errors
- 400: invalid token
- 409: time conflict or too close to start_time

## POST /api/admin/checkin
Mark attendance.

Auth
- Admin session required

Request
- appointment_id

Response
- status = attended

Errors
- 401: unauthorized
- 404: appointment not found
