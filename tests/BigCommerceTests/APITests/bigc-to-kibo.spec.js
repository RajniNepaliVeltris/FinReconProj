"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const helpers_1 = require("../../../utils/helpers");
const db_1 = require("../../../utils/db");
test_1.test.describe('BigC to Kibo API', () => {
    (0, test_1.test)('should validate API conversion and database insertion', (_a) => __awaiter(void 0, [_a], void 0, function* ({ request }) {
        // Call Mockoon BigC fake API
        const bigCResponse = yield request.get('http://localhost:3001/bigc');
        (0, test_1.expect)(bigCResponse.ok()).toBeTruthy();
        const bigCData = yield bigCResponse.json();
        // Simulate conversion to Kibo format
        const kiboData = (0, helpers_1.convertBigCtoKibo)(bigCData);
        (0, test_1.expect)(kiboData).toMatchObject({
            id: test_1.expect.any(String),
            name: test_1.expect.any(String),
            price: test_1.expect.any(Number),
        });
        // Insert into DB and validate event status
        const eventId = yield (0, db_1.insertEventStatus)(kiboData);
        (0, test_1.expect)(eventId).toBeDefined();
    }));
});
