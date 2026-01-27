import { test, expect } from "@playwright/test";

function getNextManilaSlot() {
  const manilaNow = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })
  );
  const slot = new Date(manilaNow);
  slot.setHours(10, 0, 0, 0);
  if (slot <= manilaNow) {
    slot.setDate(slot.getDate() + 1);
  }

  const yyyy = slot.getFullYear();
  const mm = String(slot.getMonth() + 1).padStart(2, "0");
  const dd = String(slot.getDate()).padStart(2, "0");
  const hh = String(slot.getHours()).padStart(2, "0");
  const min = String(slot.getMinutes()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

test("booking page loads", async ({ page }) => {
  await page.goto("/book");
  await expect(page.getByRole("heading", { name: "Book an appointment" })).toBeVisible();
  await expect(page.getByLabel("Full name")).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Service")).toBeVisible();
  await expect(page.getByLabel("Date and time")).toBeVisible();
});

test("admin login page loads", async ({ page }) => {
  await page.goto("/admin/login");
  await expect(page.getByRole("heading", { name: "Admin login" })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
});

test("manage link shows not found state for invalid token", async ({ page }) => {
  await page.goto("/a/invalid-token");
  await expect(page.getByRole("heading", { name: "Appointment not found" })).toBeVisible();
});

test("manage link loads for a real appointment", async ({ page, request }) => {
  const serviceId = process.env.TEST_SERVICE_ID;
  test.skip(!serviceId, "Set TEST_SERVICE_ID to a valid services.id");

  const startTime = getNextManilaSlot();
  const response = await request.post("/api/appointments", {
    data: {
      service_id: serviceId,
      start_time: startTime,
      customer_name: "Playwright Tester",
      customer_email: process.env.TEST_CUSTOMER_EMAIL ?? "jeruzael.d@gmail.com",
      customer_phone: "",
    },
  });

  expect(response.ok()).toBeTruthy();
  const data = await response.json();

  await page.goto(`/a/${data.manage_token}`);
  await expect(page.getByText("Manage appointment")).toBeVisible();
  await expect(page.getByText("Playwright Tester")).toBeVisible();
});
