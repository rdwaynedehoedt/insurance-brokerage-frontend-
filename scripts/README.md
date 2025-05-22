# Database Management Scripts

These scripts help manage the insurance brokerage database structure and sample data.

## Setup

1. Install dependencies first:
   ```
   cd scripts
   npm install
   ```

2. Configure your database connection:
   
   The scripts use these default connection details:
   - Host: localhost
   - User: root
   - Password: password
   - Database: insurance_brokerage
   
   If your database configuration is different, set these environment variables before running:
   ```
   DB_HOST=your_host
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=your_database
   ```

## Available Scripts

### Remove Sales Rep Field

This script removes the `sales_rep_id` field from the clients table to separate manager data from sales rep data.

```
npm run remove-sales-rep
```

### Insert Sample Data

This script inserts sample client data without sales_rep_id field.

```
npm run insert-sample-data
```

## Database Schema Changes

The script will make the following changes to your database schema:

1. Remove the `sales_rep_id` column from the `clients` table
2. Update the front-end code to no longer reference this field

## Notes

- The `insert-sample-data` script will TRUNCATE (clear) the clients table before inserting new data
- Make sure to backup any important data before running these scripts
- These scripts should be run on development environment first before applying to production 