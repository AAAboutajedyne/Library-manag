import { IsDateString, IsOptional, IsString } from "class-validator";

export class FilterBooksByDto {
  @IsOptional() @IsString()
  readonly authorId?: string;
  
  @IsOptional() @IsString()
  readonly genre?: string;

  @IsOptional() @IsDateString()
  readonly publishDate?: string;
}
