import { ApiProperty } from "@nestjs/swagger";
import { tipoproductos } from "@prisma/client";

export type CreateProductTypeDto = Omit<tipoproductos, ""> & {};

export class SwaggerProductTypeDto {
  @ApiProperty() tipprodcod: string;
  @ApiProperty() tipprodgru: number;
  @ApiProperty() tipprodnom: string;
  @ApiProperty() tipprodimp: boolean;
}
