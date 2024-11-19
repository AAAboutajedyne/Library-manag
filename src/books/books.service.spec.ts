import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { FULL_NOTE, MIN_NOTE } from './books.constants';
import * as dayjs from "dayjs"

type MockedPrisma = {
  [K in 'book' | 'author']?: {
    [P in keyof PrismaClient[K]]?: jest.Mock
  }
}
const createMockedPrisma = (): MockedPrisma => ({
  book: {
    update: jest.fn(),
    findUnique: jest.fn(),
  }
})

describe('BooksService', () => {
  let service: BooksService;
  let prisma: MockedPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: PrismaClient, useValue: createMockedPrisma() },
        BooksService
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    prisma = module.get<MockedPrisma>(PrismaClient);
  });

  describe("bookById", () => {
    describe("when book with ID exists", () => {
      it("should return that book", async () => {
        // Arrange
        const expectedBook = {
          id: "84d27e48-cc7b-4064-ba8a-23b452bb0119",
          title: "Clean Architecture",
          genre: "IT",
          publishDate: "2017-09-10T00:00:00.000Z",
          authorId: "fbf92ebe-7a3d-4f9b-a9a0-62e6983db153",
          author: {
              id: "fbf92ebe-7a3d-4f9b-a9a0-62e6983db153",
              name: "Robert C. Martin",
              note: 7
          }
        }
        prisma.book.findUnique.mockResolvedValue(expectedBook);

        // Act
        const book = await service.bookById("84d27e48-cc7b-4064-ba8a-23b452bb0119")

        // Assert
        expect(book).toEqual(expectedBook)
      })
    })
    describe("otherwise", () => {
      it("should throw 'NotFoundException'", async () => {
        // Arrange
        prisma.book.findUnique.mockResolvedValue(null);

        // Act
        const promise = service.bookById("84d27e48-cc7b-4064-ba8a-23b452bb0119")


        // Assert
        return expect(promise).rejects.toThrow(NotFoundException)
      })
    })
  })

  describe("updateBook", () => {
    describe("when book with ID exists", () => {
      it("should return the updated book", async () => {
        // Arrange
        const expectedBook: Prisma.BookUncheckedUpdateInput = {
          id: "d5ed9d00-8233-4ef8-b322-e36b3a90f50e",
          title: "Test2",
          genre: "IT",
          publishDate: "2002-02-02T00:00:00.000Z",
          authorId: "eb8bf839-cd9a-47e6-825d-78a1a7334796",
        }
        prisma.book.update.mockResolvedValue(expectedBook);
        
        // Act
        const book = await service.updateBook(
          "d5ed9d00-8233-4ef8-b322-e36b3a90f50e",
          {
            "title": "Test2"
          }
        )
        
        // Assert
        expect(book).toEqual(expectedBook)
      })
    })
    describe("otherwise", () => {
      it("should throw 'UnprocessableEntityException'", async () => {
        // Arrange
        prisma.book.update.mockRejectedValue(
          new PrismaClientKnownRequestError('Dependent record not found!', {
            code: "P2025",
            clientVersion: ""
          })
        );

        // Act
        const promise = service.updateBook(
          "d5ed9d00-8233-4ef8-b322-e36b3a90f50e",
          {
            "title": "Test2"
          }
        )

        // Assert
        return expect(promise).rejects.toThrow(UnprocessableEntityException)
      }) 
    })
  });

  describe("calculateBookNote", () => {
    describe("when book is published 1 year ago, and author note is 9", () => {
      it("should return 9", async () => {
        // Arrange
        const aBook = {
          publishDate: dayjs().subtract(1, 'year').toDate(),
          author: {
            note: 9
          }
        }
        prisma.book.findUnique.mockResolvedValue(aBook)

        // Act
        const { note } = await service.calculateBookNote("")

        // Assert
        expect(note).toBe(9)
      }) 
    })
    describe("when book is published 1 year ago, and author note is 5", () => {
      it("should return 9", async () => {
        // Arrange
        const aBook = {
          publishDate: dayjs().subtract(1, 'year').toDate(),
          author: {
            note: 5
          }
        }
        prisma.book.findUnique.mockResolvedValue(aBook)

        // Act
        const { note } = await service.calculateBookNote("")

        // Assert
        expect(note).toBe(7)
      }) 
    })
    describe("when book is published 3 years ago, and author note is 1", () => {
      it("should return 4", async () => {
        // Arrange
        const aBook = {
          publishDate: dayjs().subtract(3, 'years').toDate(),
          author: {
            note: 1
          }
        }
        prisma.book.findUnique.mockResolvedValue(aBook)

        // Act
        const { note } = await service.calculateBookNote("")

        // Assert
        expect(note).toBe(4)
      }) 
    })
    describe("when book is published more than 9 years, and author note is 1", () => {
      it("should return the min (2)", async () => {
        // Arrange
        const aBook = {
          publishDate: dayjs().subtract(9, 'years').toDate(),
          author: {
            note: 1
          }
        }
        prisma.book.findUnique.mockResolvedValue(aBook)

        // Act
        const { note } = await service.calculateBookNote("")

        // Assert
        expect(note).toBe(MIN_NOTE)
      }) 
    })


  })

});


describe("BooksService", () => {
  describe("bookNoteBasedOnPublishDate ", () => {
    describe("when book is published within 6 months", () => {
      it("should return full note (10)", () => {
        // Arrange
        const publishDate = dayjs().subtract(5, 'months').toDate()

        // Act
        const note = BooksService.bookNoteBasedOnPublishDate(publishDate)
        
        // Assert
        expect(note).toBe(FULL_NOTE)
      })
    })
    describe("when book is published between 6 months, and 1 year and half", () => {
      it("should return 9", () => {
        // Arrange
        const publishDate = dayjs().subtract(1, 'year').toDate()

        // Act
        const note = BooksService.bookNoteBasedOnPublishDate(publishDate)
        
        // Assert
        expect(note).toBe(9)
      })
    })
    describe("when book is published between 1 year and half, and 2 years and half", () => {
      it("should return 8", () => {
        // Arrange
        const publishDate = dayjs().subtract(2, 'years').toDate()

        // Act
        const note = BooksService.bookNoteBasedOnPublishDate(publishDate)
        
        // Assert
        expect(note).toBe(8)
      })
    })
    describe("when book is published between 2 years and half, and 3 years and half", () => {
      it("should return 7", () => {
        // Arrange
        const publishDate = dayjs().subtract(3, 'years').toDate()

        // Act
        const note = BooksService.bookNoteBasedOnPublishDate(publishDate)
        
        // Assert
        expect(note).toBe(7)
      })
    })
    describe("when book is published more than 9 years", () => {
      it("should return the min (2)", () => {
        // Arrange
        const publishDate = dayjs().subtract(9, 'years').toDate()

        // Act
        const note = BooksService.bookNoteBasedOnPublishDate(publishDate)
        
        // Assert
        expect(note).toBe(MIN_NOTE)
      })
    })
  });
})