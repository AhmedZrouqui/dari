import { IsDefined, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @IsDefined()
  email!: string;

  @MinLength(6)
  @IsNotEmpty()
  @IsDefined()
  password!: string;
}
