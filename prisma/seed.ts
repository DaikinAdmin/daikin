import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Hash the password
  const hashedPassword = await bcrypt.hash('Qazwsx12@', 10);

  // Create User 1 - Regular User
  const user1 = await prisma.user.upsert({
    where: { email: 'test-1@lawhub.pl' },
    update: {},
    create: {
      name: 'User',
      email: 'test-1@lawhub.pl',
      emailVerified: true,
      role: Role.USER,
      username: 'user1',
      displayUsername: 'user1',
      userDetails: {
        create: {
          daikinCoins: 100,
          phoneNumber: '+48123456789',
          city: 'Warsaw',
          street: 'Main Street',
          apartmentNumber: '1',
          postalCode: '00-001',
        },
      },
      Account: {
        create: {
          accountId: 'user1-account',
          providerId: 'credential',
          password: hashedPassword,
        },
      },
    },
  });

  // Create User 2 - Employee
  const user2 = await prisma.user.upsert({
    where: { email: 'test-2@lawhub.pl' },
    update: {},
    create: {
      name: 'Employee',
      email: 'test-2@lawhub.pl',
      emailVerified: true,
      role: Role.EMPLOYEE,
      username: 'employee1',
      displayUsername: 'employee1',
      userDetails: {
        create: {
          daikinCoins: 50,
          phoneNumber: '+48987654321',
          city: 'Krakow',
          street: 'Second Street',
          apartmentNumber: '2',
          postalCode: '30-001',
        },
      },
      Account: {
        create: {
          accountId: 'employee1-account',
          providerId: 'credential',
          password: hashedPassword,
        },
      },
    },
  });

  // Create User 3 - Admin
  const user3 = await prisma.user.upsert({
    where: { email: 'test-3@lawhub.pl' },
    update: {},
    create: {
      name: 'Admin',
      email: 'test-3@lawhub.pl',
      emailVerified: true,
      role: Role.ADMIN,
      username: 'admin1',
      displayUsername: 'admin1',
      userDetails: {
        create: {
          daikinCoins: 1000,
          phoneNumber: '+48555666777',
          city: 'Gdansk',
          street: 'Admin Avenue',
          apartmentNumber: '3',
          postalCode: '80-001',
        },
      },
      Account: {
        create: {
          accountId: 'admin1-account',
          providerId: 'credential',
          password: hashedPassword,
        },
      },
    },
  });

  console.log('✅ Created users:', {
    user1: user1.email,
    user2: user2.email,
    user3: user3.email,
  });

  // Create an order with products
  const order = await prisma.order.create({
    data: {
      orderId: 'ORD-2024-001',
      customerEmail: user1.email,
      dateOfPurchase: new Date('2024-01-15'),
      nextDateOfService: new Date('2025-01-15'),
      totalPrice: 5499.99,
      daikinCoins: 549,
      products: {
        create: [
          {
            productId: 'DAIKIN-AC-001',
            productDescription: 'Daikin Emura FTXJ25MW Wall Mounted Air Conditioner 2.5kW',
            warranty: '5 years',
            price: 2999.99,
            quantity: 1,
            totalPrice: 2999.99,
          },
          {
            productId: 'DAIKIN-AC-002',
            productDescription: 'Daikin Stylish FTXA25AW Wall Mounted Air Conditioner 2.5kW',
            warranty: '5 years',
            price: 2500.00,
            quantity: 1,
            totalPrice: 2500.00,
          },
        ],
      },
    },
    include: {
      products: true,
    },
  });

  console.log('✅ Created order:', {
    orderId: order.orderId,
    customerEmail: order.customerEmail,
    totalPrice: order.totalPrice,
    productsCount: order.products.length,
  });

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
