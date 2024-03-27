import { PrismaService } from "../src/database/prisma.service";
const prisma = new PrismaService();
async function main() {
    // await prisma.client.productCardModel.create({
    //     data: {
    //         title: 'Card 1'
    //     }
    // })
    // await prisma.client.productCardModel.create({
    //     data: {
    //         title: 'Card 2'
    //     }
    // })
    // await prisma.client.productCardModel.create({
    //     data: {
    //         title: 'Card 3'
    //     }
    // })
}

main()
    .then(async () => {
        await prisma.client.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.client.$disconnect()
        process.exit(1)
    })

 