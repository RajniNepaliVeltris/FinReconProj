import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/KiboPages/Login/loginPage';
import { AddOrderPage } from '../../../pages/KiboPages/Orders/addOrderPage';

test.describe('Kibo – Create Order via URL (UAT)', () => {
  test('should login and create UAT order with env customer', async ({ page }) => {
    const {
      KIBO_ADMIN_USER,
      KIBO_ADMIN_PASSWORD,
      KIBO_CUSTOMER_ID
    } = process.env;

    if (!KIBO_ADMIN_USER || !KIBO_ADMIN_PASSWORD || !KIBO_CUSTOMER_ID) {
      throw new Error('Required environment variables are missing');
    }

    // Login
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(KIBO_ADMIN_USER, KIBO_ADMIN_PASSWORD);

    // Orders
    const addOrderPage = new AddOrderPage(page);
    await addOrderPage.navigateToOrders();
    expect(await addOrderPage.isOrderCreationPageLoaded()).toBeTruthy();

    await addOrderPage.createUATOrderWithCustomer(KIBO_CUSTOMER_ID);

    // Validation
    await expect(page.url().toLowerCase()).toContain('orders');
    console.log(`Order created using customer ID: ${KIBO_CUSTOMER_ID}`);
  });
});
