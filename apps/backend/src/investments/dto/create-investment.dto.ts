import {
  IsNotEmpty,
  IsEmail,
  IsNumber,
  Min,
  Max,
  IsUUID,
  IsDefined,
} from 'class-validator';

export class CreateInvestmentDto {
  @IsEmail()
  @IsNotEmpty()
  @IsDefined()
  investorEmail!: string;

  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  projectId!: string;

  @IsNumber()
  @Min(0)
  @IsDefined()
  amount!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsDefined()
  equityPercentage!: number;
}
