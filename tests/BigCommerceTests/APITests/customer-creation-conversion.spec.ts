import { test, expect, request } from '@playwright/test';
import webhookSecret from '../../../data/APIData/webhookSecret.json';
import customerPayload from '../../../data/APIData/customerPayload.json';
import dbConfig from '../../../data/APIData/dbConfig.json';
import sql from 'mssql';

// Utility functions for DB/API checks can be imported or implemented here

// Test data and endpoints
const webhookUrl = 'https://vue-dv-mhubfinrecon-func2-bigc-webhook.azurewebsites.net/api/ProcessWebhook';
const gipApiUrl = 'http://localhost:3001/bigc';

// ...existing code...

test.describe('Customer Creation Conversion Flow', () => {
  test('Step 1: Trigger webhook and verify WebhookEvents', async ({ request }) => {
    // 1. Trigger webhook
    const response = await request.post(webhookUrl, {
      data: customerPayload,
      headers: {
        'x-webhook-secret': webhookSecret["x-webhook-secret"]
      }
    });

    // Log API response status and body for debugging
    const responseBody = await response.text();
    console.log('Webhook API response:', response.status(), responseBody);
    expect(response.ok()).toBeTruthy();

    // 2. Query WebhookEvents table to verify entry (Pending status)
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(`SELECT TOP 1 * FROM WebhookEvents WHERE EventId = '${customerPayload.data.id}' ORDER BY 1 DESC`);
    expect(result.recordset.length).toBeGreaterThan(0);
    console.log('WebhookEvents record:', result.recordset[0]);
  expect(result.recordset[0].Status).toBe('Pending');
    await pool.close();
  });

  test('Step 2: Simulate scheduler and verify GIPKIBOPayloadQueues', async ({ request }) => {
    // 1. Simulate WebhookReceiveAzureFunction (if API available, call it; else mock)
    // 2. Call GIP API to fetch customer data
    const gipResponse = await request.get(gipApiUrl);
    expect(gipResponse.ok()).toBeTruthy();
    // 3. TODO: Query GIPKIBOPayloadQueues table to verify Kibo-format JSON (Pending status)
    //    (Implement DB/API check or mock)
  });

  test('Step 3: Simulate ProcessGipKiboPayloadJob and verify FinRecon-dev tables', async () => {
    // 1. Simulate ProcessGipKiboPayloadJob (if API available, call it; else mock)
    // 2. TODO: Query FinRecon-dev tables to verify data transfer
    //    (Implement DB/API check or mock)
  });

  test('Step 4: Validate settlement report data', async () => {
    // 1. TODO: Query/report on settlement data for Customer, Order, Return
    //    (Implement DB/API check or mock)
  });
});
