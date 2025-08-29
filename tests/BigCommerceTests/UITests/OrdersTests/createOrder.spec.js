"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const addOrderPage_1 = require("../../../../BigCommercePages/Orders/addOrderPage");
const homepage_1 = require("../../../../BigCommercePages/homepage");
const testData = __importStar(require("../../../../data/orderTestData.json"));
test_1.test.describe('Order Creation Tests', () => {
    let homePage;
    let addOrderPage;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        homePage = new homepage_1.Homepage(page);
        addOrderPage = new addOrderPage_1.AddOrderPage(page);
        // Navigate to homepage and go to Add Order page
        yield homePage.navigateAndVerifyMenuSideMenuOption('Orders', 'Add');
    }));
    for (const orderData of testData.testOrders) {
        (0, test_1.test)(`Create order - ${orderData.description}`, () => __awaiter(void 0, void 0, void 0, function* () {
            //await addOrderPage.createOrder(orderData);
            // Add verification steps as needed
            // For example, verify order appears in the orders list
            yield homePage.navigateAndVerifyMenuSideMenuOption('Orders', 'Search');
            // Add verification logic here
        }));
    }
});
