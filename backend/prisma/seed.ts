import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const ALL_RESOURCES = [
  'dashboard', 'profile', 'settings', 'data', 'data-report',
  'showcase', 'users', 'roles', 'permissions',
]

const ALL_ACTIONS = ['read', 'write', 'edit', 'delete', 'lock', 'export', 'import', 'approve', 'manage']

async function main() {
  const bcrypt = await import('bcryptjs')
  const hashedPassword = await bcrypt.hash('admin123', 10)

  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      displayName: 'مسؤول النظام',
      description: 'صلاحيات كاملة على جميع الموارد',
      permissions: {
        create: ALL_RESOURCES.flatMap((resource) =>
          ALL_ACTIONS.map((action) => ({ resource, action }))
        ),
      },
    },
  })

  const editorRole = await prisma.role.upsert({
    where: { name: 'editor' },
    update: {},
    create: {
      name: 'editor',
      displayName: 'محرر',
      description: 'صلاحيات تعديل على البيانات',
      permissions: {
        create: [
          { resource: 'dashboard', action: 'read' },
          { resource: 'profile', action: 'manage' },
          { resource: 'settings', action: 'read' },
          { resource: 'data', action: 'manage' },
          { resource: 'data-report', action: 'read' },
          { resource: 'data-report', action: 'write' },
          { resource: 'showcase', action: 'read' },
        ],
      },
    },
  })

  const viewerRole = await prisma.role.upsert({
    where: { name: 'viewer' },
    update: {},
    create: {
      name: 'viewer',
      displayName: 'مشاهد',
      description: 'صلاحيات قراءة فقط',
      permissions: {
        create: [
          { resource: 'dashboard', action: 'read' },
          { resource: 'profile', action: 'manage' },
          { resource: 'settings', action: 'read' },
          { resource: 'data', action: 'read' },
          { resource: 'data-report', action: 'read' },
          { resource: 'showcase', action: 'read' },
        ],
      },
    },
  })

  // Create admin user linked to admin role
  await prisma.user.upsert({
    where: { userName: 'admin' },
    update: {},
    create: {
      userName: 'admin',
      fullName: 'Administrator',
      password: hashedPassword,
      role: 'admin',
      roleId: adminRole.id,
      isTempPass: false,
    },
  })

  console.log('Created roles:', adminRole.name, editorRole.name, viewerRole.name)

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
