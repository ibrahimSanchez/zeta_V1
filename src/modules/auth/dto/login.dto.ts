import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  usunom: string;

  @IsNotEmpty()
  @IsString()
  usucla: string;
}
