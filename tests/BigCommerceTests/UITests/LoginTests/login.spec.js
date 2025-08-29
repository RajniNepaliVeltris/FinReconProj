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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const loginPage_1 = require("../../../../BigCommercePages/loginPage");
const loginTestData_json_1 = __importDefault(require("../../../../data/loginTestData.json"));
test_1.test.describe('Login Page', () => {
    loginTestData_json_1.default.loginTests.forEach(({ description, username, password, expectedUrl, expectedWelcomeText, expectedError }) => {
        (0, test_1.test)(description, (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            const loginPage = new loginPage_1.LoginPage(page);
            yield loginPage.navigateToLoginPage();
            yield loginPage.login(username, password);
            if (expectedUrl) {
                yield (0, test_1.expect)(page).toHaveURL(expectedUrl);
                if (expectedWelcomeText) {
                    yield (0, test_1.expect)(page.locator('h1')).toHaveText(expectedWelcomeText);
                }
            }
            if (expectedError) {
                yield (0, test_1.expect)(page.locator('#errorMessage')).toHaveText(expectedError);
            }
        }));
    });
});
