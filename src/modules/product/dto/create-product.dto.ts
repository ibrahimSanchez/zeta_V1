import { ApiProperty } from "@nestjs/swagger";
import { productos } from "@prisma/client";
import { Currencies } from "../enums/currencies.enum";

export type CreateProductDto = Omit<productos, ""> & {
  components?: string[];
};

export class SwaggerProductDto {
  @ApiProperty() prodcod: string;
  @ApiProperty() prodnom: string;
  @ApiProperty() family: string;
  @ApiProperty() components?: string[];
  @ApiProperty() componentsExist: boolean;
}

export class SwaggerUpdateProductDto {
  @ApiProperty() prodcod?: string;
  @ApiProperty() prodnom?: string;
  @ApiProperty() tipprodcod?: string;
  @ApiProperty() components?: string;
}

export class SwaggerCreateProductDto {
  @ApiProperty() prodcod: string;
  @ApiProperty() prodnom: string;
  @ApiProperty() tipprodcod: string;
  @ApiProperty() components?: string;
}

export class ProductFetchResponseDto {
  @ApiProperty({
    description: "Código único del producto",
  })
  code: string;

  @ApiProperty({
    description: "Nombre del producto",
  })
  name: string;

  @ApiProperty({
    description: "Código de la familia del producto",
  })
  familyCode: string;

  @ApiProperty({
    description: "Nombre de la familia del producto",
  })
  familyname: string;

  @ApiProperty({
    description: "Código del proveedor del producto",
  })
  supplierCode: string;

  @ApiProperty({
    description: "Nombre del proveedor del producto",
  })
  supplierName: string;

  @ApiProperty({
    description: "Moneda en la que se cotiza el producto",
    enum: [Currencies],
  })
  currency: string;
}
