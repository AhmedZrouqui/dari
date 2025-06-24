import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  organizationName: string;
}
