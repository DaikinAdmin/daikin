import { PrismaClient } from './prisma/client/index.js';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:admin@localhost:5432/daikin_local?schema=public'
    }
  }
});

async function main() {
  const banners = await prisma.banners.findMany({
    select: {
      id: true,
      locale: true,
      location: true,
      isMobile: true,
      isActive: true,
      img: true,
      link: true,
    }
  });
  
  console.log('\n=== ALL BANNERS IN DATABASE ===');
  console.log(JSON.stringify(banners, null, 2));
  console.log('\nTotal banners:', banners.length);
  
  const activeBanners = banners.filter(b => b.isActive);
  console.log('Active banners:', activeBanners.length);
  
  const plBanners = banners.filter(b => b.locale === 'pl');
  console.log('PL locale banners:', plBanners.length);
  
  const homeTopBanners = banners.filter(b => b.location === 'home_top');
  console.log('home_top location banners:', homeTopBanners.length);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
