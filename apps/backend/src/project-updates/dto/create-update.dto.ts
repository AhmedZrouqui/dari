import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateProjectUpdateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  attachmentIds?: string[];
}
