import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [
    PrismaService,
    { provide: PrismaClient, useExisting: PrismaService }
  ],
  exports: [PrismaClient]
})
export class SharedModule {}
