# QA Automation Framework

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Test Coverage](https://img.shields.io/badge/coverage-90%25-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

This repository contains a modular and extendable QA automation framework built with TypeScript and Playwright. It supports UI, API, Smoke, and Regression testing.

## Table of Contents

1. [Folder Structure](#folder-structure)
2. [Key Features](#key-features)
3. [Prerequisites](#prerequisites)
4. [Setup Instructions](#setup-instructions)
5. [Running Tests](#running-tests)
6. [Reporting](#reporting)
7. [Advanced Utilities](#advanced-utilities)
8. [Troubleshooting](#troubleshooting)
9. [Contribution Guidelines](#contribution-guidelines)
10. [License](#license)

## Folder Structure

The project is organized as follows:

```
├── tests/
│   ├── BigCommerceTests/
│   │   ├── APITests/
│   │   │   ├── bigc-to-kibo.spec.ts
│   │   │   ├── customer-creation-conversion.spec.ts
│   │   ├── DbTests/
│   │   │   └── CreateOrderDBTests.spec.ts
│   │   ├── UITests/
│   │   │   ├── LoginTests/
│   │   │   │   └── login.spec.ts
│   │   │   ├── OrdersTests/
│   │   │   │   ├── createCustomProductOrder.spec.ts
│   │   │   │   ├── createStandardProductOrder.spec.ts
│   ├── PearsonVuesTests/
│   │   ├── UITests/
│   │   │   └── Reports.spec.ts
│   ├── excel-reader.test.ts
├── pages/
│   ├── abc/
│   ├── BigCommercePages/
│   │   ├── Base/
│   │   │   └── basePage.ts
│   │   ├── Dashboard/
│   │   │   └── homepage.ts
│   │   ├── Login/
│   │   │   └── loginPage.ts
│   │   ├── Orders/
│   │   │   ├── addOrderPage.ts
│   │   │   ├── allOrdersPage.ts
│   │   ├── Products/
│   │   │   ├── addProduct.ts
│   │   │   ├── allProducts.ts
│   ├── PerasonVuewPages/
│   │   └── LoginPage.ts
├── data/
│   ├── BigC_Ecomm_TestCases_AutomationMasterSheet.xlsx
│   ├── TestCases.json
│   ├── APIData/
│   │   ├── customerPayload.json
│   │   ├── dbConfig.json
│   │   ├── webhookSecret.json
│   ├── BigCommerceData/
│   │   ├── addOrdersJson.json
│   │   ├── addProductData.json
│   │   ├── loginTestData.json
│   │   ├── orderTestData.json
│   ├── PersonVueData/
├── queries/
│   ├── bigcommerce-order-queries.sql
│   └── README.md
├── mocks/
├── models/
│   └── OrderTypes.ts
├── postman/
├── test-results/
│   ├── index.html
│   └── report.json
├── utils/
│   ├── apiUtils.ts
│   ├── baseTest.ts
│   ├── db.ts
│   ├── excelReader.ts
│   ├── helpers.ts
│   ├── queryManager.ts
│   ├── testConfig.ts
│   ├── uiInteractions.ts
│   └── uiInteractions.ts.bak
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── fix-playwright.ps1
├── start-chrome-debug.ps1
├── fulfillment-table.png
├── shipping-details-1.png
├── README.md
```

## Key Features

1. **Modular UI Testing**: Built with Playwright and a Page Object Model, supporting reusable and maintainable UI test components for BigCommerce and Pearson Vue platforms.
2. **Comprehensive API Testing**: Utilizes Playwright's request API and custom utilities for robust API validation, including data-driven scenarios.
3. **Database Verification Testing**: Advanced database testing with comprehensive SQL queries for order verification, supporting both automated tests and manual SSMS execution.
4. **Query Management System**: Centralized SQL query management with parameterized queries, automatic loading, and separation of SQL logic from test code.
5. **Postman & Mockoon Integration**: Supports running Postman collections for API workflows and Mockoon for simulating/faking APIs in test environments.
6. **Database Utility**: SQL Server operations via the `mssql` library, enabling direct DB validation and test data setup.
7. **Test Tagging & Categorization**: Easily run targeted test suites (UI, API, DB, Smoke, Regression) using tags and organized folder structure.
8. **Rich Reporting**: Generates HTML and JSON reports, including screenshots and videos on failure, for easy debugging and sharing results.
9. **Data-Driven Testing**: Flexible test data management using JSON and Excel files, supporting scalable and maintainable test scenarios.
10. **Advanced UI Interactions**: Includes a robust `UIInteractions` utility for handling complex or problematic UI elements, with fallback strategies and iframe support.
11. **Enhanced Table Verification**: Smart comparison of both input and displayed/highlighted values in tables, with normalization for currency, numbers, and detailed error reporting.
12. **Modular Test Infrastructure**:
    - `BaseTest` class for centralized browser setup and teardown
    - `TestConfig` class for environment-based test configuration
    - `ExcelReader` utility for comprehensive Excel data operations
    - `QueryManager` class for SQL query management and execution
    - Singleton patterns for efficient resource management
13. **Extensible Utilities**: Utility modules for API, DB, Excel reading, query management, and more, making the framework adaptable to new requirements.
14. **Chrome Debug Session Support**: Ability to run tests using an existing Chrome instance with preserved login state for faster, session-persistent test execution and debugging.

## Prerequisites

Ensure you have the following installed before setting up the project:

- **Node.js**: Version 16.x or higher
- **npm**: Version 7.x or higher
- **Git**: For cloning the repository
- **SQL Server**: For database testing
- **PowerShell**: For running optional scripts on Windows

## Setup Instructions

Follow these steps to set up the project:

1. **Clone the repository**
   ```powershell
   git clone https://github.com/RajniNepaliVeltris/FinReconProj.git
   cd FinReconProj
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Configure environment variables**
   - Create a `.env` file in the project root with your DB and app credentials:
   ```env
   # Main Database (FinRecon)
   DB_USER=admin
   DB_PASSWORD=admin123
   DB_SERVER=localhost
   DB_NAME=FinReconDB

   # BigCommerce Database
   BIGC_DB_USER=bigc_admin
   BIGC_DB_PASSWORD=bigc_password
   BIGC_DB_SERVER=bigc_server
   BIGC_DB_NAME=BigCommerceDB

   # Application
   BASE_URL=http://localhost:3000
   ```
   - For API and DB config, update files in `data/APIData/` as needed (e.g., `dbConfig.json`, `webhookSecret.json`).

4. **Install Playwright browsers**
   ```powershell
   npx playwright install
   ```

5. **(Optional) Windows PowerShell scripts**
   - Use `fix-playwright.ps1` to resolve Playwright issues on Windows if needed.
   - Use `start-chrome-debug.ps1` to launch Chrome with remote debugging for session-persistent tests.

## Running Tests


You can run tests using npm scripts or directly with Playwright. All commands below work in PowerShell on Windows.

- **Run all UI tests**
   ```powershell
   npm run test:ui
   # or
   npx playwright test tests/BigCommerceTests/UITests/ --headed
   ```

- **Run all API tests**
   ```powershell
   npm run test:api
   # or
   npx playwright test tests/BigCommerceTests/APITests/
   ```

- **Run all Database tests**
   ```powershell
   npm run test:db
   # or
   npx playwright test tests/BigCommerceTests/DbTests/
   ```

- **Run all Smoke tests**
   ```powershell
   npm run test:smoke
   ```

- **Run all Regression tests**
   ```powershell
   npm run test:regression
   ```

- **Run a specific test file**
   ```powershell
   npx playwright test tests/BigCommerceTests/UITests/OrdersTests/createStandardProductOrder.spec.ts
   ```

- **Run database verification test**
   ```powershell
   npx playwright test tests/BigCommerceTests/DbTests/CreateOrderDBTests.spec.ts
   ```

- **Run tests with Chrome debug session**
   ```powershell
   .\start-chrome-debug.ps1
   npx playwright test --project=existing-chrome
   ```

Test results and reports will be generated in the `test-results` folder after execution.

## Reporting

Test execution generates detailed reports in the `test-results` folder:

- **HTML Report**: Open `test-results/index.html` in your browser for a visual summary of all test runs, including pass/fail status, error details, and links to screenshots/videos.
- **JSON Report**: For integration or analysis, use `test-results/report.json`.
- **Screenshots & Videos**: On test failure, screenshots and videos are automatically captured and linked in the HTML report for easy debugging.

### Example Output

#### HTML Report Screenshot
![HTML Report Example](https://via.placeholder.com/800x400?text=HTML+Report+Example)

#### Test Results JSON
```json
{
  "totalTests": 50,
  "passed": 45,
  "failed": 5,
  "duration": "5m 30s"
}
```

## Advanced Utilities

### Postman & Mockoon Integration

- **Postman**: Import the Postman collections provided in the `postman/` folder to test API workflows.
- **Mockoon**: Use the Mockoon configuration files to simulate APIs for testing. Refer to the [Mockoon documentation](https://mockoon.com/) for setup instructions.

## Troubleshooting

### Common Issues

1. **Playwright Installation Errors**:
   - Ensure you have the correct Node.js version installed.
   - Run `
1. **Fork the Repository**:
   - Click the "Fork" button at the top of this repository.

2. **Clone Your Fork**:
   ```powershell
   git clone <your-fork-url>
   cd <repository-folder>
   ```

3. **Create a New Branch**:
   ```powershell
   git checkout -b feature/your-feature-name
   ```

4. **Make Changes**:
   - Follow the existing code style and structure.
   - Write clear commit messages.

5. **Run Tests**:
   - Ensure all tests pass before submitting your changes.

6. **Submit a Pull Request**:
   - Push your changes to your fork.
   - Open a pull request to the `master` branch of this repository.

## License

This project is licensed under the MIT License.