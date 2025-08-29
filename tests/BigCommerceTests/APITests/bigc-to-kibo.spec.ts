import { test, expect } from '@playwright/test';
import { convertBigCtoKibo } from '../../../utils/helpers';
import { insertEventStatus } from '../../../utils/db';

test.describe('BigC to Kibo API', () => {
  test('should validate API conversion and database insertion', async ({ request }) => {
    // Call Mockoon BigC fake API
    const bigCResponse = await request.get('http://localhost:3001/bigc');
    expect(bigCResponse.ok()).toBeTruthy();
    const bigCData = await bigCResponse.json();

    // Simulate conversion to Kibo format
    const kiboData = convertBigCtoKibo(bigCData);
    expect(kiboData).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      price: expect.any(Number),
    });

    // Insert into DB and validate event status
    const eventId = await insertEventStatus(kiboData);
    expect(eventId).toBeDefined();
  });
});