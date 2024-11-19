import { PrismaClient } from '@prisma/client'
            
const prisma = new PrismaClient()

async function main() {
  // create authors
  const [kevHenneyAuthor, uncleBob, ericEvans] = await prisma.$transaction([
    prisma.author.create({
      data: {
        name: "Kevlin Henney",
        note: 7
      }, 
    }),
    prisma.author.create({
      data: {
        name: "Robert C. Martin",
        note: 7
      }
    }),
    prisma.author.create({
      data: {
        name: "Eric Evans",
        note: 8
      }
    })
  ])
  console.log("Author added: ", kevHenneyAuthor);
  console.log("Author added: ", uncleBob);
  console.log("Author added: ", ericEvans);

  /** Kevlin Henney books */
  const kevHenneyBooks = await prisma.book.createMany({
    data: [
      {
        title: "97 Things Every Programmer Should Know",
        genre: "IT",
        authorId: kevHenneyAuthor.id,
        publishDate: new Date("2010-02-01")
      }
    ]
  })
  console.log(`Books (${kevHenneyBooks.count}) for ${kevHenneyAuthor.name} was added`);

  /** Robert C. Martin books */
  const uncleBobBooks = await prisma.book.createMany({
    data: [
      {
        title: "Clean Code",
        genre: "IT",
        authorId: uncleBob.id,
        publishDate: new Date("2008-07-01")
      },
      {
        title: "Clean Architecture",
        genre: "IT",
        authorId: uncleBob.id,
        publishDate: new Date("2017-09-10")
      }
    ]
  })
  console.log(`Books (${uncleBobBooks.count}) for ${uncleBob.name} was added`);

  /** Eric Evans books */
  const ericEvansBooks = await prisma.book.createMany({
    data: [
      {
        title: "Domain-driven design",
        genre: "IT",
        authorId: ericEvans.id,
        publishDate: new Date("2003-08-20")
      }
    ]
  })
  console.log(`Books (${ericEvansBooks.count}) for ${ericEvans.name} was added`);  
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