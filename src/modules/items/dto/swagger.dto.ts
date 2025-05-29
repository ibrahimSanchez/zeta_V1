import { ApiProperty } from "@nestjs/swagger";

export class SwaggerItemResponseDto {
  @ApiProperty({ description: "Código único del item", example: 1 })
  itemcod: number;

  @ApiProperty({
    description: "Comentario del item",
  })
  itemcom: string;

  @ApiProperty({ description: "Estado del item", example: true })
  itemest: boolean;

  @ApiProperty({
    description: "Fecha de creación del item",
  })
  itemfec: Date;

  @ApiProperty({
    description: "Fecha de garantía del item",
  })
  itemgar: Date;

  @ApiProperty({ description: "Costo del item", example: 100.5 })
  itemgas: number;

  @ApiProperty({ description: "Precio de venta del item", example: 150.75 })
  itemven: number;

  @ApiProperty({
    description: "Información del producto asociado",
    type: Object,
  })
  productos: any;

  @ApiProperty({
    description: "Código del producto asociado",
  })
  prodcod: string;
}

export class SwaggerCreateItemDto {
  @ApiProperty({
    description: "Comentario del item",
    required: false,
  })
  itemcom?: string;

  @ApiProperty({
    description: "Estado del item",
    required: false,
  })
  itemest?: boolean;

  @ApiProperty({
    description: "Fecha de garantía del item",
  })
  itemgar?: Date;

  @ApiProperty({ description: "Costo del item", example: 100.5 })
  itemgas: number;

  @ApiProperty({ description: "Precio de venta del item", example: 150.75 })
  itemven: number;

  @ApiProperty({
    description: "Código del producto asociado",
  })
  prodcod: string;
}

export class SwaggerUpdateItemDto {
  @ApiProperty({
    description: "Comentario del item",
    required: false,
  })
  itemcom?: string;

  @ApiProperty({
    description: "Estado del item",
    required: false,
  })
  itemest?: boolean;

  @ApiProperty({
    description: "Costo del item",
    required: false,
  })
  itemgas?: number;


  @ApiProperty({
    description: "Fecha de garantía del item",
  })
  itemgar?: Date;


  @ApiProperty({
    description: "Precio de venta del item",
    required: false,
  })
  itemven?: number;

  @ApiProperty({
    description: "Código del producto asociado",
    required: false,
  })
  prodcod?: string;
}
