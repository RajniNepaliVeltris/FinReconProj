import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/KiboPages/Login/loginPage';
import { AddOrderPage } from '../../../pages/KiboPages/Orders/addOrderPage';

test.describe('Kibo – Create Order via URL (UAT)', () => {
  test('should login and create UAT order with hardcoded customer', async ({ page }, testInfo) => {

    testInfo.annotations.push(
      { type: 'test-type', description: 'E2E' },
      { type: 'feature', description: 'Order Creation' }
    );

    const {
      KIBO_ADMIN_USER,
      KIBO_ADMIN_PASSWORD,
    } = process.env;

    if (!KIBO_ADMIN_USER || !KIBO_ADMIN_PASSWORD) {
      throw new Error('Required environment variables are missing');
    }

    const customerId = '1027'; // hardcode customer ID here
    let currentStep = '';

    try {
      // ---------- Login ----------
      currentStep = 'Login to Kibo Admin';
      await test.step(currentStep, async () => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login(KIBO_ADMIN_USER, KIBO_ADMIN_PASSWORD);
      });

      // ---------- Navigate to Orders ----------
      currentStep = 'Navigate to Orders Page';
      await test.step(currentStep, async () => {
        const addOrderPage = new AddOrderPage(page);
        await addOrderPage.navigateToOrders();
        expect(await addOrderPage.isOrderCreationPageLoaded()).toBeTruthy();
      });

      // ---------- Create Order ----------
      currentStep = 'Create UAT Order with Existing Customer';
      await test.step(currentStep, async () => {
        const addOrderPage = new AddOrderPage(page);
        await addOrderPage.createUATOrderWithCustomer(customerId);
      });

      // ---------- Validation ----------
      currentStep = 'Validate Order Creation';
      await test.step(currentStep, async () => {
        await expect(page.url().toLowerCase()).toContain('orders');
        console.log(`Order created successfully using customer ID: ${customerId}`);
      });

    } catch (error) {
      console.error(
        `Failure at step: ${currentStep} | Customer ID: ${customerId}`,
        error
      );
      throw error;
    }
  });
});
