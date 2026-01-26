# User Stories

- Purpose: Capture user stories and acceptance criteria.
- Audience: Product, developers, QA.
- Owner: Exorex
- Last updated: 2026-01-26
- Related: ../00-Overview/Scope.md
- Status: Active

## User story: Book an appointment
- As a customer, I want to book a service at a time slot so that I can reserve a visit.

## Acceptance criteria
- Booking form collects name and contact method (email or phone).
- System creates an appointment with start and end times.
- Customer receives a confirmation message with a manage link.
- Time selection uses 15-minute increments within business hours (10:00-20:00).

## User story: Manage appointment
- As a customer, I want to confirm, reschedule, or cancel so that I can manage my visit.

## Acceptance criteria
- Manage link is tokenized and does not require login.
- Confirm and cancel update appointment status.
- Reschedule updates start and end times and invalidates prior reminder flags.
- Cancel or reschedule is blocked within 3 hours of start time.

## User story: Admin check-in
- As staff, I want to check in a customer so that attendance is tracked.

## Acceptance criteria
- Admin can view today appointments by status.
- Check-in sets status to attended and prevents no-show automation.
- Admin uses magic link authentication.

## Notes / edge cases
- Reschedule within X hours can be restricted if needed.
- Cancel or reschedule is blocked after start time.
