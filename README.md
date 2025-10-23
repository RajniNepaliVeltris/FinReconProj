# Financial Reconciliation Automation Framework

This repository contains a comprehensive QA automation framework designed for end-to-end testing of financial reconciliation processes. Built with TypeScript and Playwright, it supports a wide range of testing scenarios, including UI, API, and database validations.

## ✨ Features

- **End-to-End Testing**: Covers UI interactions, API validations, and direct database checks.
- **Page Object Model (POM)**: Promotes reusable and maintainable UI test code.
- **Data-Driven**: Tests are driven by data from Excel spreadsheets, allowing for easy management of test cases and scenarios.
- **SQL Query Management**: Externalizes SQL queries for clean and maintainable database tests.
- **Environment Configuration**: Uses `.env` for flexible configuration of credentials and endpoints.
- **Categorized Testing**: Supports tagging tests for running specific suites like Smoke, Regression, UI, or API.
- **Comprehensive Reporting**: Generates detailed HTML reports with traces and screenshots for easy debugging.

## 🛠️ Tech Stack

- **Framework**: [Playwright](https://playwright.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server) (`mssql` package)
- **Test Data**: [ExcelJS](https://github.com/exceljs/exceljs) for `.xlsx` file interaction.
- **Environment Variables**: [dotenv](https://github.com/motdotla/dotenv)

## 📂 Folder Structure

```
.
├── data/                # Test data files (Excel, JSON)
├── models/              # TypeScript interfaces and type definitions
├── pages/               # Page Object Model classes
├── queries/             # SQL query files
├── scripts/             # Helper scripts (e.g., test manifest generation)
├── tests/               # Test files (specs)
│   ├── BigCommerceTests/
│   │   ├── APITests/
│   │   ├── DbTests/
│   │   └── UITests/
│   └── PearsonVuesTests/
├── utils/               # Utility helpers (DB connection, Excel reader, API utils)
├── package.json         # Project dependencies and scripts
├── playwright.config.ts # Playwright configuration
└── tsconfig.json        # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- Access to the required SQL Server database.

### 1. Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/RajniNepaliVeltris/FinReconProj.git
cd FinReconProj
npm install
```

### 2. Configuration

Create a `.env` file in the root of the project to store your environment-specific variables. This file should contain credentials for the database and any other services.

**Example `.env` file:**

```
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_SERVER=your_db_server
DB_DATABASE=your_db_name
```

You may also need to configure database connection details in `data/APIData/dbConfig.json` and other sensitive data in the `data` directory.

## 🧪 Running Tests

This framework uses Playwright's test runner. You can execute tests using the npm scripts defined in `package.json`.

### Generate Test Manifest

Before running tests, it's recommended to generate the test manifest from the Excel sheet. This helps in filtering and running only the relevant tests.

```bash
node .\scripts\generateTestManifest.js
```

### Run All Tests

To run all tests in the suite:

```bash
npx playwright test
```

### Run Specific Suites

You can run tests based on their tags:

- **UI Tests**:
  ```bash
  npm run test:ui
  ```

- **API Tests**:
  ```bash
  npm run test:api
  ```

- **Smoke Tests**:
  ```bash
  npm run test:smoke
  ```

- **Regression Tests**:
  ```bash
  npm run test:regression
  ```

- **Run tests sequentially**:
  ```bash
  npm run test:sequential
  ```

### Run in Headed Mode

To watch the browser execute the tests, use the `--headed` flag:

```bash
npx playwright test --headed
```

### Debugging Tests

Playwright provides a powerful debug mode:

```bash
npx playwright test --debug
```

## 📊 Reporting

After each test run, a detailed HTML report is generated in the `test-results/` directory. You can view it by opening the `index.html` file in your browser.

To view the last run's report, use the following command:

```bash
npx playwright show-report
```