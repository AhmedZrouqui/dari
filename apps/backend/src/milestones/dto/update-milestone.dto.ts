import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateMilestoneDto } from './create-milestone.dto';
import { MilestoneStatus } from '@dari/types';

export class UpdateMilestoneDto extends PartialType(CreateMilestoneDto) {
  @IsOptional()
  @IsEnum(MilestoneStatus)
  status?: MilestoneStatus;
}
