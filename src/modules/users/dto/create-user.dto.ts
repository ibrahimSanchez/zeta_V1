import { ApiProperty } from "@nestjs/swagger";
import { usuarios } from "@prisma/client";

export type CreateUserDto = Omit<usuarios, ""> & {};

export class SwaggerUserDto {
  @ApiProperty() usunom: string;
  @ApiProperty() usucla: string;
  @ApiProperty() usucod: number;
  @ApiProperty() tipusucod: number;
}

export class SwaggerCreateUserResponse {
  @ApiProperty() usunom: string;
  @ApiProperty() usucod: number;
  @ApiProperty() tipusucod: number;
}

export class SwaggerUpdateUserDto {
  @ApiProperty() usunom?: string;
  @ApiProperty() usucla?: string;
  @ApiProperty() usucod?: number;
  @ApiProperty() tipusucod?: number;
}

export class SwaggerDeleteUserDto {
  @ApiProperty() message: string;
}
