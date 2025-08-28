# QA Automation Framework

This repository contains a modular and extendable QA automation framework built with TypeScript and Playwright. It supports UI, API, Smoke, and Regression testing.

## Folder Structure

```
├── tests/
│   ├── ui/                # UI tests
│   │   └── login.spec.ts  # Sample UI test
│   ├── api/               # API tests
│   │   └── bigc-to-kibo.spec.ts  # Sample API test
│   ├── smoke/             # Smoke tests
│   ├── regression/        # Regression tests
├── mocks/                 # Mockoon configs for fake BigC API
├── postman/               # Postman collections + Newman runner config
├── utils/                 # Utility functions
│   ├── db.ts              # SQL Server DB utility
│   ├── apiUtils.ts        # Helpers for API calls
│   └── helpers.ts         # Common utilities
├── playwright.config.ts   # Playwright configuration
├── package.json           # NPM scripts and dependencies
├── .env                   # Environment variables (DB + API credentials)
├── README.md              # Project documentation
```

## Features

1. **UI Testing**: Built with Playwright and Page Object Model.
2. **API Testing**: Uses Playwright's request API.
3. **Postman Integration**: Run collections in CI/CD pipelines.
4. **Mockoon Integration**: Consume fake BigC API.
5. **Database Utility**: SQL Server operations using `mssql` library.
6. **Test Tagging**: Run specific test categories using tags.
7. **Reporting**: HTML and JSON reports with screenshots and videos on failure.

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env`:
   ```env
   DB_USER=<your-db-user>
   DB_PASSWORD=<your-db-password>
   DB_SERVER=<your-db-server>
   DB_NAME=<your-db-name>
   BASE_URL=<your-app-url>
   ```

4. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Running Tests

- Run UI tests:
  ```bash
  npm run test:ui
  ```

- Run API tests:
  ```bash
  npm run test:api
  ```

- Run Smoke tests:
  ```bash
  npm run test:smoke
  ```

- Run Regression tests:
  ```bash
  npm run test:regression
  ```

## Reporting

Test results are available in the `test-results` folder. Open `test-results/index.html` to view the HTML report.

## License

This project is licensed under the MIT License.