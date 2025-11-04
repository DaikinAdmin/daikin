import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Hash the password
  const hashedPassword = await bcrypt.hash('Qazwsx12@', 10);

  // Create User 1 - Regular User
  const user1 = await auth.api.signUpEmail({
    body: {
      name: 'User',
      email: 'user-1@ammproject.com',
      role: "user",
      password: 'Qazwsx12@'
    }
  });
  await prisma.userDetails.upsert({
    where: { userId: user1.user.id },
    update: {},
    create: {
      userId: user1.user.id,
      daikinCoins: 100,
      phoneNumber: '+48123456789',
      city: 'Warsaw',
      street: 'Main Street',
      apartmentNumber: '1',
      postalCode: '00-001',
    },
  });

  // Create User 2 - Employee
  const user2 = await auth.api.signUpEmail({
    body: {
      name: 'Employee',
      email: 'user-2@ammproject.com',
      role: "employee",
      password: 'Qazwsx12@'
    }
  });
  await prisma.userDetails.upsert({
    where: { userId: user2.user.id },
    update: {},
    create: {
      userId: user2.user.id,
      daikinCoins: 0,
      phoneNumber: '+48123456780',
      city: 'Warsaw',
      street: 'Main Street',
      apartmentNumber: '2',
      postalCode: '00-002',
    },
  });

  // Create User 2 - Employee
  const user3 = await auth.api.signUpEmail({
    body: {
      name: 'Admin',
      email: 'user-3@ammproject.com',
      role: "admin",
      password: 'Qazwsx12@'
    }
  });
  await prisma.userDetails.upsert({
    where: { userId: user3.user.id },
    update: {},
    create: {
      userId: user3.user.id,
      daikinCoins: 100,
      phoneNumber: '+48123456780',
      city: 'Warsaw',
      street: 'Main Street',
      apartmentNumber: '3',
      postalCode: '00-003',
    },
  });

  console.log('✅ Created users:', {
    user1: user1.user.email,
    user2: user2.user.email,
    user3: user3.user.email,
  });

  // Create an order with products
  const order = await prisma.order.create({
    data: {
      orderId: 'ORD-2024-001',
      customerEmail: user1.user.email,
      dateOfPurchase: new Date('2024-11-15'),
      nextDateOfService: new Date('2025-11-15'),
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
