const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Checking orders...\n');
  
  // Get all orders
  const orders = await prisma.order.findMany({
    select: {
      id: true,
      orderId: true,
      customerEmail: true,
      nextDateOfService: true,
      dateOfPurchase: true,
    },
  });

  console.log(`Total orders: ${orders.length}\n`);

  if (orders.length > 0) {
    console.log('Orders:');
    orders.forEach(order => {
      console.log(`  Order ID: ${order.orderId}`);
      console.log(`  Customer Email: ${order.customerEmail}`);
      console.log(`  Next Service Date: ${order.nextDateOfService}`);
      console.log(`  Date of Purchase: ${order.dateOfPurchase}`);
      console.log('---');
    });
  }

  // Get orders with nextDateOfService
  const ordersWithService = await prisma.order.findMany({
    where: {
      nextDateOfService: {
        not: null,
      },
    },
    select: {
      id: true,
      orderId: true,
      customerEmail: true,
      nextDateOfService: true,
    },
  });

  console.log(`\nOrders with service date: ${ordersWithService.length}`);
  
  if (ordersWithService.length > 0) {
    ordersWithService.forEach(order => {
      console.log(`  ${order.orderId} - ${order.customerEmail} - ${order.nextDateOfService}`);
    });
  }

  // Get all users
  const users = await prisma.user.findMany({
    select: {
      email: true,
      role: true,
      name: true,
    },
  });

  console.log(`\n\nUsers (${users.length}):`);
  users.forEach(user => {
    console.log(`  ${user.name} (${user.email}) - Role: ${user.role}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
