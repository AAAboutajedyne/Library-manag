import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksExternalService } from './books.external-service';
import { CreateBookDto } from './dtos/create-book.dto';
import { UpdateBookDto } from './dtos/update-book.dto';
import { FilterBooksByDto } from './dtos/filter-books-by.dto';

@Controller()
export class BooksController {

  constructor(
    private readonly booksService: BooksService,
    private readonly booksExternalService: BooksExternalService
  ) {}

  @Post('authors/:author_id/books')
  async createBook(
    @Param("author_id") authorId: string,
    @Body() body: CreateBookDto
  ) {
    console.log("body: ", body)

    return this.booksService.createBook({
      ...body,
      authorId
    })
  }

  @Patch("books/:book_id")
  async updateBook(
    @Param("book_id") bookId: string,
    @Body() body: UpdateBookDto
  ) {
    return this.booksService.updateBook(bookId, body)
  }

  @Get("books/:book_id")
  async getBook(@Param("book_id") bookId: string) {
    return this.booksService.bookById(bookId);
  }

  @Get("books")
  async getBooks(@Query() filterBy: FilterBooksByDto) {
    console.log("filter by: ", filterBy)
    return this.booksService.allBooks(filterBy);
  }

  @Get("books/:book_id/calculateNote")
  async getBookNote(@Param("book_id") bookId: string) {
    return this.booksService.calculateBookNote(bookId);
  }

  @Get("external-api/books/:isbn")
  async getBookFromExternalApiByIsbn(@Param("isbn") isbn: string) {
    return this.booksExternalService.bookByISBN(isbn);
  }
}
