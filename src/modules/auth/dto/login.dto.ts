import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  usunom: string;

  @IsNotEmpty()
  @IsString()
  usucla: string;
}



export class SwaggerLoginDto {
  @ApiProperty() usunom: string;
  @ApiProperty() usucla: string;
}

export class SwaggerLoginResponse {
  @ApiProperty() token: string;
 
}
