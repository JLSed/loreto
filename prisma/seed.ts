import { Prisma, PrismaClient } from '@prisma/client'

import { faker } from '@faker-js/faker'

import {
  AuditAction,
  AuditAffectedTable,
  BookStatus,
  BoxOrderStatus,
  ModeOfPayment,
  TransactionItemType,
  TransactionType,
  UserRole,
} from '../src/common/enums/enums.db'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const seedUsers = () => {
    const numberOfUsers = 14
    return prisma.user.createMany({
      skipDuplicates: true,
      data: [
        {
          email: 'eechemane29@gmail.com',
          username: 'eric echemane',
          role: 1,
          verified: true,
          firstName: 'Eric',
          lastName: 'Echemane',
          contactNumber: '08123456789',
        },
        {
          email: 'cashmireloreto@gmail.com',
          username: 'cashie loreto',
          role: 1,
          verified: true,
          firstName: 'Cashie',
          lastName: 'Loreto',
        },
        {
          email: 'mjcabaluna15@gmail.com',
          username: 'Mike Jefferson',
          role: 1,
          verified: true,
          firstName: 'Mike',
          lastName: 'Cabaluna',
        },
        {
          email: 'belluso.justinejamesict11d@gmail.com',
          username: 'Justinejames A. Belluso',
          role: 1,
          verified: true,
          firstName: 'Justinejames A.',
          lastName: 'Belluso',
        },
        // ...Array.from({ length: numberOfUsers }).map(
        //   () =>
        //     ({
        //       email: faker.internet.email(),
        //       username: faker.person.fullName(),
        //       role: faker.helpers.arrayElement([
        //         UserRole.Customer,
        //         UserRole.Staff,
        //       ]),
        //       verified: true,
        //       firstName: faker.person.firstName(),
        //       lastName: faker.person.lastName(),
        //       contactNumber: faker.phone.number(),
        //       joinedAt: faker.date.recent({ days: 100 }),
        //     } as Prisma.UserCreateManyInput)
        // ),
      ],
    })
  }

  await seedUsers()

  // const seedVehicles = () => {
  //   return prisma.vehicle.createMany({
  //     data: [
  //       {
  //         model: 'MD F6',
  //         name: 'Isuzu Truck ZXR',
  //         photoUrl:
  //           'https://res.cloudinary.com/dmwjwtg1g/image/upload/v1711165562/loreto/avh6qfq8dswpoomg6plw.jpg',
  //         plateNumber: 'KJA-1234',
  //         purchaseDate: new Date('2021-03-29'),
  //         serviceFeePerHour: 500,
  //         lastMaintenance: new Date('2022-03-29'),
  //       },
  //       {
  //         model: 'H100',
  //         name: 'Hyundai Truck',
  //         photoUrl:
  //           'https://res.cloudinary.com/dmwjwtg1g/image/upload/v1711165562/loreto/hfrls2roy2efj2k1yffo.webp',
  //         plateNumber: 'HTA-1234',
  //         purchaseDate: new Date('2021-01-29'),
  //         serviceFeePerHour: 200,
  //         lastMaintenance: new Date('2022-01-29'),
  //       },
  //     ],
  //   })
  // }

  // await Promise.all([seedUsers(), seedVehicles()])

  // const [users, vehicles] = await Promise.all([
  //   prisma.user.findMany(),
  //   prisma.vehicle.findMany(),
  // ])

  // const seedTransactions = () => {
  //   const numberOfTransactions = 14
  //   return prisma.transaction.createMany({
  //     data: Array.from({ length: numberOfTransactions }).map(
  //       () =>
  //         ({
  //           amount: +faker.finance.amount({ min: 1000, max: 10000 }),
  //           fromUserId: faker.helpers.arrayElement(users).id,
  //           itemType: faker.helpers.enumValue(TransactionItemType),
  //           modeOfPayment: faker.helpers.enumValue(ModeOfPayment),
  //           type: faker.helpers.enumValue(TransactionType),
  //         } as Prisma.TransactionCreateManyInput)
  //     ),
  //   })
  // }

  // await seedTransactions()
  // const transactions = await prisma.transaction.findMany()

  // const seedBookings = () => {
  //   const numberOfBookings = 14
  //   return prisma.booking.createMany({
  //     data: Array.from({ length: numberOfBookings }).map(
  //       () =>
  //         ({
  //           bookerId: faker.helpers.arrayElement(users).id,
  //           vehicleId: faker.helpers.arrayElement(vehicles).id,
  //           pickupDate: faker.date.soon({ days: 5 }),
  //           pickUpLocation: faker.location.streetAddress(),
  //           destination: faker.location.streetAddress(),
  //           status: faker.helpers.enumValue(BookStatus),
  //           transactionId: faker.helpers.arrayElement(transactions).id,
  //         } as Prisma.BookingCreateManyInput)
  //     ),
  //   })
  // }

  // const boxes = await prisma.box.findMany()

  // const seedBoxOrders = () => {
  //   return prisma.boxOrder.createMany({
  //     data: [
  //       ...Array.from({ length: 10 }).map(
  //         () =>
  //           ({
  //             boxId: faker.helpers.arrayElement(boxes).id,
  //             userId: faker.helpers.arrayElement(users).id,
  //             status: BoxOrderStatus.InCart,
  //             createdAt: faker.date.recent({ days: 30 }),
  //           } as Prisma.BoxOrderCreateManyInput)
  //       ),
  //       ...Array.from({ length: 10 }).map(
  //         () =>
  //           ({
  //             boxId: faker.helpers.arrayElement(boxes).id,
  //             userId: faker.helpers.arrayElement(users).id,
  //             status: BoxOrderStatus.OrderCompleted,
  //             completedAt: faker.date.recent({ days: 10 }),
  //             createdAt: faker.date.recent({ days: 30 }),
  //           } as Prisma.BoxOrderCreateManyInput)
  //       ),
  //       ...Array.from({ length: 10 }).map(
  //         () =>
  //           ({
  //             boxId: faker.helpers.arrayElement(boxes).id,
  //             userId: faker.helpers.arrayElement(users).id,
  //             status: BoxOrderStatus.OrderReceived,
  //             receivedAt: faker.date.recent({ days: 10 }),
  //             createdAt: faker.date.recent({ days: 30 }),
  //           } as Prisma.BoxOrderCreateManyInput)
  //       ),
  //       ...Array.from({ length: 10 }).map(
  //         () =>
  //           ({
  //             boxId: faker.helpers.arrayElement(boxes).id,
  //             userId: faker.helpers.arrayElement(users).id,
  //             status: BoxOrderStatus.OutForDelivery,
  //             outForDeliveryAt: new Date(),
  //             createdAt: faker.date.recent({ days: 30 }),
  //           } as Prisma.BoxOrderCreateManyInput)
  //       ),
  //       ...Array.from({ length: 10 }).map(
  //         () =>
  //           ({
  //             boxId: faker.helpers.arrayElement(boxes).id,
  //             userId: faker.helpers.arrayElement(users).id,
  //             status: BoxOrderStatus.PaymentInfoConfirmed,
  //             paymentConfirmedAt: faker.date.recent({ days: 10 }),
  //             createdAt: faker.date.recent({ days: 30 }),
  //           } as Prisma.BoxOrderCreateManyInput)
  //       ),
  //       ...Array.from({ length: 10 }).map(
  //         () =>
  //           ({
  //             boxId: faker.helpers.arrayElement(boxes).id,
  //             userId: faker.helpers.arrayElement(users).id,
  //             status: BoxOrderStatus.Placed,
  //             placedAt: faker.date.recent({ days: 2 }),
  //             createdAt: faker.date.recent({ days: 30 }),
  //           } as Prisma.BoxOrderCreateManyInput)
  //       ),
  //       ...Array.from({ length: 10 }).map(
  //         () =>
  //           ({
  //             boxId: faker.helpers.arrayElement(boxes).id,
  //             userId: faker.helpers.arrayElement(users).id,
  //             status: BoxOrderStatus.ProcessingOrder,
  //             processingAt: faker.date.recent({ days: 3 }),
  //             createdAt: faker.date.recent({ days: 30 }),
  //           } as Prisma.BoxOrderCreateManyInput)
  //       ),
  //       ...Array.from({ length: 5 }).map(
  //         () =>
  //           ({
  //             boxId: faker.helpers.arrayElement(boxes).id,
  //             userId: faker.helpers.arrayElement(users).id,
  //             status: BoxOrderStatus.cancelled,
  //             cancelledAt: faker.date.recent({ days: 10 }),
  //             createdAt: faker.date.recent({ days: 30 }),
  //           } as Prisma.BoxOrderCreateManyInput)
  //       ),
  //     ],
  //   })
  // }

  // const seedApartments = () => {
  //   return prisma.apartment.create({
  //     data: {
  //       address: faker.address.streetAddress(),
  //       area: 40,
  //       bedrooms: 1,
  //       toiletAndBath: 1,
  //       maxOccupantsPerUnit: 3,
  //       monthlyRentalPrice: 5_000,
  //       withCarParkingSpace: true,
  //       withMotorcycleParkingSpace: true,
  //     },
  //   })
  // }

  // await Promise.all([seedBookings(), seedBoxOrders(), seedApartments()])
  // const [boxOrders, bookings] = await Promise.all([
  //   prisma.boxOrder.findMany(),
  //   prisma.booking.findMany(),
  // ])

  // const seedAuditLogs = () => {
  //   return prisma.auditLog.createMany({
  //     data: Array.from({ length: 28 }).map(() => {
  //       const affectedTable = faker.helpers.enumValue(AuditAffectedTable)
  //       let table: any[] = boxes

  //       switch (affectedTable) {
  //         case AuditAffectedTable.BoxOrder:
  //           table = boxOrders
  //           break
  //         case AuditAffectedTable.Box:
  //           table = boxes
  //           break
  //         case AuditAffectedTable.Transaction:
  //           table = transactions
  //           break
  //         case AuditAffectedTable.User:
  //           table = users
  //           break
  //         case AuditAffectedTable.Vehicle:
  //           table = vehicles
  //           break
  //         case AuditAffectedTable.Bookings:
  //           table = bookings
  //           break
  //         default:
  //           break
  //       }

  //       return {
  //         affectedTable,
  //         action: faker.helpers.enumValue(AuditAction),
  //         actorId: faker.helpers.arrayElement(users).id,
  //         affectedRowId: faker.helpers.arrayElement(table).id,
  //       } as Prisma.AuditLogCreateManyInput
  //     }),
  //   })
  // }

  // await seedAuditLogs()

  console.log('Database seeded successfully.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
