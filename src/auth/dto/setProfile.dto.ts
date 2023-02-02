import { Length, IsUrl } from 'class-validator';

export class SetProfileDto {
  @Length(1, 70)
  public firstName: string;

  @Length(1, 70)
  public lastName: string;

  @IsUrl()
  public photoUrl: string;
}
