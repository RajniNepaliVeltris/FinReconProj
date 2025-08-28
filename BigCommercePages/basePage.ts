// This file represents the base page functionality for BigCommerce.

export class BigCommerceBasePage {
  constructor() {
    // Initialize common elements and functionality
  }

  navigateTo(url: string) {
    // Implementation to navigate to a specific URL
    window.location.href = url;
    console.log(`Navigated to: ${url}`);
  }

  waitForElement(locator: string) {
    // Implementation to wait for an element to be visible
    const interval = setInterval(() => {
      const element = document.evaluate(locator, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (element && (element as HTMLElement).offsetParent !== null) {
        clearInterval(interval);
        console.log(`Element is visible: ${locator}`);
      }
    }, 100);
  }

  clickElement(locator: string) {
    // Implementation to click on an element
    const element = document.evaluate(locator, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (element) {
      (element as HTMLElement).click();
      console.log(`Clicked on element: ${locator}`);
    }
  }

  enterText(locator: string, text: string) {
    // Implementation to enter text into an input field
    const element = document.evaluate(locator, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (element && (element as HTMLInputElement).tagName === "INPUT") {
      const inputElement = element as HTMLInputElement;
      inputElement.value = text;
      inputElement.dispatchEvent(new Event("input"));
      console.log(`Entered text: ${text} into element: ${locator}`);
    }
  }

  navigateToDashboard() {
    // Implementation to navigate to the BigCommerce dashboard
    const dashboardUrl = "https://www.bigcommerce.com/dashboard"; // Example URL
    window.location.href = dashboardUrl;
    console.log("Navigated to BigCommerce dashboard");
  }

  verifyPageTitle(expectedTitle: string) {
    // Implementation to verify the page title matches the expected title
    const actualTitle = document.title;
    if (actualTitle === expectedTitle) {
      console.log(`Page title verified: ${expectedTitle}`);
    } else {
      console.error(`Page title mismatch. Expected: ${expectedTitle}, Found: ${actualTitle}`);
    }
  }

  logout() {
    // Implementation to log out from the BigCommerce account
    const logoutButtonLocator = "//button[@id='logout']"; // Example locator
    const logoutButton = document.evaluate(logoutButtonLocator, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (logoutButton) {
      (logoutButton as HTMLElement).click();
      console.log("Logged out from BigCommerce");
    }
  }

  isElementVisible(locator: string): boolean {
    // Implementation to check if an element is visible
    const element = document.evaluate(locator, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (element) {
      const rect = (element as HTMLElement).getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }
    return false;
  }

  getElementText(locator: string): string {
    // Implementation to get the text of an element
    const element = document.evaluate(locator, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    return element ? (element as HTMLElement).innerText : "";
  }

  selectDropdownOption(locator: string, option: string) {
    // Implementation to select an option from a dropdown
    const element = document.evaluate(locator, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (element && (element as HTMLElement).tagName === "SELECT") {
      const selectElement = element as HTMLSelectElement;
      const options = Array.from(selectElement.options);
      const targetOption = options.find(opt => opt.text === option);
      if (targetOption) {
        selectElement.value = targetOption.value;
        selectElement.dispatchEvent(new Event("change"));
      }
    }
  }

  scrollToElement(locator: string) {
    // Implementation to scroll to a specific element
    const element = document.evaluate(locator, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (element) {
      (element as HTMLElement).scrollIntoView({ behavior: "smooth" });
    }
  }

  takeScreenshot(fileName: string) {
    // Implementation to take a screenshot
    console.log(`Taking screenshot is not directly supported in plain JavaScript. Use a testing framework like Playwright or Puppeteer.`);
  }

  expandSideMenuOption(locator: string) {
    // Implementation to expand a side menu option
    const element = document.evaluate(locator, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (element && (element as HTMLElement).classList.contains("collapsed")) {
      (element as HTMLElement).click();
      console.log(`Expanded side menu option: ${locator}`);
    }
  }

  collapseSideMenuOption(locator: string) {
    // Implementation to collapse a side menu option
    const element = document.evaluate(locator, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (element && !(element as HTMLElement).classList.contains("collapsed")) {
      (element as HTMLElement).click();
      console.log(`Collapsed side menu option: ${locator}`);
    }
  }
}