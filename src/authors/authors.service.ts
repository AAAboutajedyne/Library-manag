import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from "@prisma/client"

@Injectable()
export class AuthorsService {
  
  constructor(
    private readonly prisma: PrismaClient,
  ) {}
  
  /**
   * @param authorId 
   * @returns author
   * @throws NotFoundException
   */
  async authorById(authorId: string) {
    const author = await this.prisma.author.findUnique({
      where: { id: authorId },
    })

    if(!author) {
      throw new NotFoundException(`Author(${authorId}) not found !`)
    }

    return author;
  }

  /**
   * @returns Author[]
   */
  async allAuthors() {
    return await this.prisma.author.findMany();
  }

}



