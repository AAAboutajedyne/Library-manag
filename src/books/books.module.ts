import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { SharedModule } from 'src/shared/shared.module';
import { BooksExternalService } from './books.external-service';

@Module({
  imports: [
    SharedModule,
  ],
  providers: [BooksService, BooksExternalService],
  controllers: [BooksController],
})
export class BooksModule {}
