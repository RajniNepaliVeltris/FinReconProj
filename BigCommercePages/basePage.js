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
exports.BasePage = void 0;
// This file represents the base page functionality for BigCommerce.
class BasePage {
    constructor(page) {
        this.page = page;
    }
    navigateTo(url) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.goto(url);
            console.log(`Navigated to: ${url}`);
        });
    }
    waitForElement(locator) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.waitForSelector(locator);
            console.log(`Waited for element: ${locator}`);
        });
    }
    clickElement(locator) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.click(locator);
            console.log(`Clicked on element: ${locator}`);
        });
    }
    enterText(locator, text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.fill(locator, text);
            console.log(`Entered text: ${text} into element: ${locator}`);
        });
    }
    verifyPageTitle(expectedTitle) {
        return __awaiter(this, void 0, void 0, function* () {
            const actualTitle = yield this.page.title();
            if (actualTitle !== expectedTitle) {
                throw new Error(`Page title mismatch. Expected: ${expectedTitle}, Found: ${actualTitle}`);
            }
            console.log(`Page title verified: ${expectedTitle}`);
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            const logoutButtonLocator = "//button[@id='logout']"; // Example locator
            const logoutButton = this.page.locator(logoutButtonLocator);
            if (yield logoutButton.isVisible()) {
                yield logoutButton.click();
                console.log("Logged out from BigCommerce");
            }
        });
    }
    isElementVisible(locator) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.page.isVisible(locator);
        });
    }
    getElementText(locator) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.page.textContent(locator)) || '';
        });
    }
    selectDropdownOption(locator, option) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.selectOption(locator, { label: option });
        });
    }
    scrollToElement(locator) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator(locator).scrollIntoViewIfNeeded();
        });
    }
    takeScreenshot(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.screenshot({ path: fileName });
        });
    }
    expandSideMenuOption(locator) {
        return __awaiter(this, void 0, void 0, function* () {
            const element = this.page.locator(locator);
            const classAttribute = yield element.getAttribute('class');
            if (classAttribute && classAttribute.includes('collapsed')) {
                yield element.click();
            }
        });
    }
    collapseSideMenuOption(locator) {
        return __awaiter(this, void 0, void 0, function* () {
            const element = this.page.locator(locator);
            const classAttribute = yield element.getAttribute('class');
            if (classAttribute && !classAttribute.includes('collapsed')) {
                yield element.click();
            }
        });
    }
}
exports.BasePage = BasePage;
