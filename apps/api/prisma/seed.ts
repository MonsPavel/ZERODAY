import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const LEGACY_EMAIL = 'legacy@zeroday.local';
const LEGACY_PASSWORD_HASH = 'legacy-password-hash';

const achievements = [
  {
    code: 'FIRST_TASK_DONE',
    title: 'First task done',
    description: 'Complete your first task.',
  },
  {
    code: 'FIRST_FINISHED_DAY',
    title: 'First finished day',
    description: 'Finish all tasks in a day.',
  },
  {
    code: 'NO_ZERO_3',
    title: 'No zero days',
    description: 'Complete at least one task for 3 days in a row.',
  },
  {
    code: 'PERFECT_DAY',
    title: 'Perfect day',
    description: 'Complete all tasks in a single day.',
  },
  {
    code: 'STREAK_7',
    title: 'Streak 7',
    description: 'Reach a 7 day streak.',
  },
];

async function main() {
  const isDev = process.env.NODE_ENV !== 'production';
  const allowSeed = isDev || process.env.SEED_ALLOW === '1';
  if (!allowSeed) {
    console.log('Seed skipped: NODE_ENV is production. Set SEED_ALLOW=1 to override.');
    return;
  }

  const user = await prisma.user.upsert({
    where: { email: LEGACY_EMAIL },
    update: {},
    create: {
      email: LEGACY_EMAIL,
      passwordHash: LEGACY_PASSWORD_HASH,
    },
  });

  await prisma.streak.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      currentInt: 0,
      bestInt: 0,
    },
  });

  await Promise.all(
    achievements.map((achievement) =>
      prisma.achievement.upsert({
        where: { code: achievement.code },
        update: {},
        create: achievement,
      }),
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
