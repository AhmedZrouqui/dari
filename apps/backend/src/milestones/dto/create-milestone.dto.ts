import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsUUID,
} from 'class-validator';

export class CreateMilestoneDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  targetDate?: string;

  @IsUUID()
  @IsNotEmpty()
  projectId: string;
}
