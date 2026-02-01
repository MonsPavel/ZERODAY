import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
  await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  await prisma.streak.upsert({
    where: { userId: 1 },
    update: {},
    create: {
      userId: 1,
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
