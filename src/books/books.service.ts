import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { PrismaClient } from "@prisma/client"
import { CreateBookDto } from './dtos/create-book.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UpdateBookDto } from './dtos/update-book.dto';
import { FilterBooksByDto } from './dtos/filter-books-by.dto';
import { FULL_NOTE, MIN_NOTE } from './books.constants';
import * as R from "ramda"
import * as dayjs from "dayjs"

@Injectable()
export class BooksService {
  
  constructor(
    private readonly prisma: PrismaClient,
  ) {}
  
  /**
   * @param book 
   * @returns book
   * @throws UnprocessableEntityException
   */
  async createBook(book: CreateBookDto & { authorId: string }) {
    try {
      return await this.prisma.book.create({
        data: {
          title: book.title,
          genre: book.genre,
          publishDate: new Date(book.publishDate),
          author: {
            connect: { id: book.authorId }
          }
        }
      })
    } catch(e) {
      console.error(e)
      if(e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        throw new UnprocessableEntityException(`Author(${book.authorId}) was not found !`)
      } else {
        throw e
      }
    }
  }

  /**
   * @param bookId 
   * @param newBook 
   * @returns book
   * @throws UnprocessableEntityException
   */
  async updateBook(bookId: string, newBook: UpdateBookDto) {
    try {
      return await this.prisma.book.update({
        where: { id: bookId },
        data: {
          ...newBook,
          ...(
            R.isNotNil(newBook.publishDate) && R.isNotEmpty(newBook.publishDate) && 
              { publishDate: new Date(newBook.publishDate) }
          ),
        }
      })
    } catch(e) {
      console.error(e)
      if(e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        throw new UnprocessableEntityException(`Book(${bookId}) not found !`)
      } else {
        throw e
      }
    }
  }

  /**
   * @param bookId 
   * @returns book
   * @throws NotFoundException
   */
  async bookById(bookId: string) {
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
      include: {
        author: true
      }
    })

    if(!book) {
      throw new NotFoundException(`Book(${bookId}) not found !`)
    }

    return book;
  }

  /**
   * @param filterBy: FilterBooksByDto
   * @returns Book[]
   * 
   */
  async allBooks(filterBy: FilterBooksByDto) {
    return await this.prisma.book.findMany({
      where: {
        ...filterBy,
        ...(
          R.isNotNil(filterBy.publishDate) && R.isNotEmpty(filterBy.publishDate) && 
            { publishDate: new Date(filterBy.publishDate) }
        ),
      },
      orderBy: {
        publishDate: 'desc'
      }
    });
  }

  /**
   * 
   * @param bookId 
   * @returns Book & { note: number }
   * @throws NotFoundException
   */
  async calculateBookNote(bookId: string) {
    const book = await this.bookById(bookId)
    // console.log("calculating book note: ", book, BooksService.bookNoteBasedOnPublishDate(book.publishDate))
    
    return {
      note: R.clamp(
        MIN_NOTE,
        FULL_NOTE,
        R.compose(Math.round, R.mean)([
          BooksService.bookNoteBasedOnPublishDate(book.publishDate),
          book.author.note
        ])
      )
    }
  }

  static bookNoteBasedOnPublishDate(bookPublishDate: Date) {
    const publishDate = dayjs(bookPublishDate);
    const now = dayjs();
  
    const publishDateFromNowInMonths = now.diff(publishDate, 'month', true)
    const publishDateFromNowInYears = now.diff(publishDate, 'year', true)
        
    /**
     * Algo:
     * <= 6 months                                        => 10 (10 - 0)
     * > 6 months && <= 1 year and 6 months               => 9  (10 - 1)
     * > 1 year and 6 months && <= 2 years and 6 months   => 8  (10 - 2)
     * > 2 years and 6 months  && <= 3 years and 6 months => 7  (10 - 3)
     * ...
     */
    return (publishDateFromNowInMonths <= 6) 
      ? FULL_NOTE
      : Math.max(
        FULL_NOTE - Math.round(publishDateFromNowInYears), 
        MIN_NOTE
      )
  }

}



