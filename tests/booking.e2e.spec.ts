import { test, expect } from "@playwright/test";

test("booking page loads", async ({ page }) => {
  await page.goto("/book");
  await expect(page.getByRole("heading", { name: "Book an appointment" })).toBeVisible();
  await expect(page.getByLabel("Full name")).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Service")).toBeVisible();
  await expect(page.getByLabel("Date and time")).toBeVisible();
});
