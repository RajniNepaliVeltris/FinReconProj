# BigCommerce Database Queries

This directory contains SQL query files for BigCommerce database operations.

## Files

- `bigcommerce-order-queries.sql` - Comprehensive order verification queries

## Query Structure

Queries are organized with comments indicating the query name and purpose:

```sql
-- Comprehensive Order Details Query
-- Parameters: @OrderNumber (the order number to verify)
SELECT ... FROM [Order] ... WHERE o.OrderNumber = @OrderNumber;
```

## Usage in Code

Queries are loaded automatically by the `QueryManager` class and can be executed using:

```typescript
const queryManager = QueryManager.getInstance();
const results = await queryManager.executeQuery('comprehensive-order-details', { OrderNumber: '12345' });
```

## Manual SSMS Execution

To run queries manually in SQL Server Management Studio:

1. Connect to the BigCommerce database
2. Replace parameter placeholders with actual values
3. Execute the query

Example:
```sql
DECLARE @OrderNumber VARCHAR(50) = '429113';
-- Then paste the query content
```

## Available Queries

- `comprehensive-order-details` - Full order information with all related data (items, payments, billing, fulfillment, etc.)