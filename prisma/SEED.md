# Database Seed

This document describes the test data that gets seeded into the database.

## Test Users

The seed file creates three test users with different roles:

### 1. Regular User
- **Name:** User
- **Email:** test-1@lawhub.pl
- **Password:** Qazwsx12@
- **Role:** USER
- **DaikinCoins:** 100
- **Location:** Warsaw, Main Street 1, 00-001
- **Phone:** +48123456789

### 2. Employee
- **Name:** Employee
- **Email:** test-2@lawhub.pl
- **Password:** Qazwsx12@
- **Role:** EMPLOYEE
- **DaikinCoins:** 50
- **Location:** Krakow, Second Street 2, 30-001
- **Phone:** +48987654321

### 3. Admin
- **Name:** Admin
- **Email:** test-3@lawhub.pl
- **Password:** Qazwsx12@
- **Role:** ADMIN
- **DaikinCoins:** 1000
- **Location:** Gdansk, Admin Avenue 3, 80-001
- **Phone:** +48555666777

## Sample Order

The seed creates one order associated with the regular user:

- **Order ID:** ORD-2024-001
- **Customer:** test-1@lawhub.pl
- **Purchase Date:** January 15, 2024
- **Next Service Date:** January 15, 2025
- **Total Price:** 5499.99 PLN
- **DaikinCoins Earned:** 549

### Products in Order

1. **Daikin Emura FTXJ25MW Wall Mounted Air Conditioner 2.5kW**
   - Product ID: DAIKIN-AC-001
   - Price: 2999.99 PLN
   - Quantity: 1
   - Warranty: 5 years

2. **Daikin Stylish FTXA25AW Wall Mounted Air Conditioner 2.5kW**
   - Product ID: DAIKIN-AC-002
   - Price: 2500.00 PLN
   - Quantity: 1
   - Warranty: 5 years

## Running the Seed

To seed the database, run:

```bash
npx prisma db seed
```

To reset and reseed the database:

```bash
npx prisma migrate reset
```

This will drop the database, run all migrations, and automatically run the seed.
