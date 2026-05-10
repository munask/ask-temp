import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const bcrypt = await import('bcryptjs')
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { userName: 'admin' },
    update: {},
    create: {
      userName: 'admin',
      fullName: 'Administrator',
      password: hashedPassword,
      role: 'admin',
      isTempPass: false,
    },
  })
  console.log('Created admin user:', admin.userName)

  // Create 97 data records
  const records = []
  for (let i = 1; i <= 97; i++) {
    const month = String(((i - 1) % 12) + 1).padStart(2, '0')
    const day = String(((i - 1) % 28) + 1).padStart(2, '0')
    const year = 2024
    records.push({
      rowNumber: i,
      value: `Record ${i}`,
      date: new Date(`${year}-${month}-${day}`),
    })
  }

  await prisma.dataRecord.deleteMany({})
  await prisma.dataRecord.createMany({ data: records })
  console.log('Created 97 data records')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
