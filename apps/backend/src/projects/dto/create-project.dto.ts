import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsDateString,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  totalBudget: number;

  @IsOptional()
  @IsDateString()
  expectedCompletion?: string;
}
