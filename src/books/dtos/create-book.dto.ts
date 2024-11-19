import { IsDateString, IsString } from "class-validator"

export class CreateBookDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly genre: string;

  @IsDateString()
  readonly publishDate: string;
}