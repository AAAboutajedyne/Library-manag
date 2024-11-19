import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';

@Module({
  imports: [
    SharedModule,
  ],
  providers: [AuthorsService],
  controllers: [AuthorsController],
})
export class AuthorsModule {}
