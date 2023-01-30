import { IsEmail, Length, IsUrl } from 'class-validator';

export class RegisterUserDto {
  @Length(1, 70)
  public firstName: string;

  @Length(1, 70)
  public lastName: string;

  @IsEmail()
  public email: string;

  @IsUrl()
  public photoUrl: string;
}
