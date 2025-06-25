import {
  IsNotEmpty,
  IsEmail,
  IsNumber,
  Min,
  Max,
  IsUUID,
} from 'class-validator';

export class CreateInvestmentDto {
  @IsEmail()
  @IsNotEmpty()
  investorEmail: string;

  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  equityPercentage: number;
}
