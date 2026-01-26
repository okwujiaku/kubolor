import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create categories
  const categories = [
    { name: 'SEO', slug: 'seo' },
    { name: 'AI Writing', slug: 'ai-writing' },
    { name: 'Content Strategy', slug: 'content-strategy' },
    { name: 'Monetization', slug: 'monetization' },
    { name: 'Marketing', slug: 'marketing' },
    { name: 'Technology', slug: 'technology' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    console.log(`✓ Created category: ${category.name}`);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
