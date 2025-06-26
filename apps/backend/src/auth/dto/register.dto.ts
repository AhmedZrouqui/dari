import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  ValidateIf,
} from 'class-validator';
import { AccountType } from '@dari/types';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsEnum(AccountType)
  accountType!: AccountType;

  @ValidateIf((o) => o.accountType === AccountType.DEVELOPER)
  @IsNotEmpty({
    message: 'Organization name is required for developer accounts.',
  })
  @IsString()
  @MinLength(3)
  organizationName!: string;
}
