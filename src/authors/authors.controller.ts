import { Controller, Get, Param } from '@nestjs/common';
import { AuthorsService } from './authors.service';

@Controller()
export class AuthorsController {

  constructor(
    private readonly authorsService: AuthorsService,
  ) {}

  @Get("authors")
  async getAuthors() {
    return this.authorsService.allAuthors();
  }

  @Get("authors/:author_id")
  async getAuthor(@Param("author_id") authorId: string) {
    return this.authorsService.authorById(authorId);
  }

}
