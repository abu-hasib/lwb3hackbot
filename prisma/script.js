const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const files = await prisma.file.findMany();

  // console.log({ files });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

module.exports = {
  prisma,
};
