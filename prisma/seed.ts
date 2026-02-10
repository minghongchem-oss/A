import { PrismaClient, PackVisibility } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const demo = await prisma.user.upsert({
    where: { email: 'demo@tuxun.play' },
    update: {},
    create: { email: 'demo@tuxun.play', name: 'Demo' }
  });

  await prisma.pack.upsert({
    where: { slug: 'featured-world' },
    update: {},
    create: {
      slug: 'featured-world',
      name: '世界精选',
      description: '默认公开地图包',
      visibility: PackVisibility.PUBLIC,
      regionIds: ['world'],
      ownerId: demo.id
    }
  });
}

main().finally(() => prisma.$disconnect());
