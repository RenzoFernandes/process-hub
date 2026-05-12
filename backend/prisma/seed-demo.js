const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const demoWorkspaceId = "00000000-0000-0000-0000-000000000001";
const demoEmail = "demo@processhub.com";
const demoPassword = "123456";

async function main() {
  const passwordHash = await bcrypt.hash(demoPassword, 10);

  await prisma.organization.upsert({
    where: { id: demoWorkspaceId },
    update: {
      name: "Demo Workspace",
      slug: "demo-workspace",
    },
    create: {
      id: demoWorkspaceId,
      name: "Demo Workspace",
      slug: "demo-workspace",
    },
  });

  await prisma.user.upsert({
    where: { email: demoEmail },
    update: {
      name: "Usuario Demo",
      passwordHash,
      organizationId: demoWorkspaceId,
    },
    create: {
      name: "Usuario Demo",
      email: demoEmail,
      passwordHash,
      organizationId: demoWorkspaceId,
    },
  });

  console.log(`Demo pronto: ${demoEmail} / ${demoPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
