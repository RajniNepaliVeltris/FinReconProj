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
exports.LoginPage = void 0;
const test_1 = require("@playwright/test");
const basePage_1 = require("./basePage");
class LoginPage extends basePage_1.BasePage {
    constructor(page) {
        super(page);
    }
    navigateToLoginPage() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.goto('https://www.bigcommerce.com/login');
        });
    }
    login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.fill('#username', username);
            yield this.page.fill('#password', password);
            yield this.page.click('#loginButton');
        });
    }
    verifyLoginSuccess() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, test_1.expect)(this.page.locator('#dashboard')).toBeVisible();
        });
    }
    verifyLoginFailure() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, test_1.expect)(this.page.locator('#errorMessage')).toBeVisible();
        });
    }
}
exports.LoginPage = LoginPage;
