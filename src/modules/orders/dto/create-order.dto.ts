import { ordenes } from "@prisma/client";
import { OrderProductType } from "../types/orderProductsType";
import { ApiProperty } from "@nestjs/swagger";
import { SwaggerCreateItemDto } from "src/modules/items/dto/swagger.dto";

export type CreateOrderDto = Omit<ordenes, "ordcod"> & {
  orderProduct: OrderProductType[];
};

// DTOs for Swagger documentation
export class SwaggerOrderProductDto {
  @ApiProperty({ description: "Product code" })
  prodcod: string;

  @ApiProperty({ description: "Supplier code" })
  provcod: string;

  @ApiProperty({ description: "Product cost" })
  prodcost: number;

  @ApiProperty({ description: "Product sale price" })
  prodvent: number;

  @ApiProperty({ description: "Product quantity" })
  ordprodcan: number;

  @ApiProperty({ description: "items of a product" })
  items: SwaggerCreateItemDto[];
}

export class SwaggerCreateOrderDto {
  @ApiProperty({ description: "Order date" })
  ordfec: Date;

  @ApiProperty({ description: "Proposal date" })
  ordfecpro: Date;

  @ApiProperty({ description: "Invoice number" })
  ordnumfac: string;

  @ApiProperty({ description: "Salesperson code" })
  vendcod: string;

  @ApiProperty({ description: "Client code" })
  clicod: string;

  @ApiProperty({ description: "Order commission" })
  ordcom: number;

  @ApiProperty({ description: "Order amount" })
  ordmon: number;

  @ApiProperty({ description: "Order cost" })
  ordcos: number;

  @ApiProperty({ description: "Is new order" })
  ordnuev: boolean;

  @ApiProperty({ description: "Payment method code" })
  pagocod: string;

  @ApiProperty({ description: "Status code" })
  estcod: string;

  @ApiProperty({ description: "Currency code" })
  moncod: string;

  @ApiProperty({ description: "Order observations" })
  ordobs: string;

  @ApiProperty({
    type: [SwaggerOrderProductDto],
    description: "Order products",
  })
  orderProduct: SwaggerOrderProductDto[];
}

export class SwaggerUpdateOrderDto {
  @ApiProperty({ description: "Order date", required: false })
  ordfec?: Date;

  @ApiProperty({ description: "Proposal date", required: false })
  ordfecpro?: Date;

  @ApiProperty({ description: "Invoice number", required: false })
  ordnumfac?: string;

  @ApiProperty({ description: "Salesperson code", required: false })
  vendcod?: string;

  @ApiProperty({ description: "Client code", required: false })
  clicod?: string;

  @ApiProperty({ description: "Order commission", required: false })
  ordcom?: number;

  @ApiProperty({ description: "Order amount", required: false })
  ordmon?: number;

  @ApiProperty({ description: "Order cost", required: false })
  ordcos?: number;

  @ApiProperty({ description: "Is new order", required: false })
  ordnuev?: boolean;

  @ApiProperty({ description: "Payment method code", required: false })
  pagocod?: string;

  @ApiProperty({ description: "Status code", required: false })
  estcod?: string;

  @ApiProperty({ description: "Currency code", required: false })
  moncod?: string;

  @ApiProperty({ description: "Order observations", required: false })
  ordobs?: string;

  @ApiProperty({ description: "Client address", required: false })
  clidir?: string;

  @ApiProperty({
    type: [SwaggerOrderProductDto],
    description: "Order products",
    required: false,
  })
  orderProduct?: SwaggerOrderProductDto[];
}

export class SwaggerDeleteOrdersDto {
  @ApiProperty({
    type: [Number],
    description: "Array of order codes to delete",
  })
  codes: number[];
}

export class SwaggerOrderResponseDto {
  @ApiProperty({ description: "Order code" })
  ordcod: number;

  @ApiProperty({ description: "Order date" })
  ordfec: Date;

  @ApiProperty({ description: "Payment method code" })
  pagocod: string;

  @ApiProperty({ description: "Payment method name" })
  pagonom: string | null;

  @ApiProperty({ description: "Currency code" })
  moncod: string;

  @ApiProperty({ description: "Currency name" })
  monnom: string | null;

  @ApiProperty({ description: "Status code" })
  estcod: string;

  @ApiProperty({ description: "Status name" })
  estnom: string;

  @ApiProperty({ description: "Invoice number" })
  ordnumfac: string;

  @ApiProperty({ description: "Order observations" })
  ordobs: string;

  @ApiProperty({ description: "Salesperson code" })
  vendcod: string;

  @ApiProperty({ description: "Salesperson name" })
  vendnom: string;

  @ApiProperty({ description: "Client code" })
  clicod: string;

  @ApiProperty({ description: "Client name" })
  clinom: string;

  @ApiProperty({ description: "Client RUC" })
  cliruc: string;

  @ApiProperty({ description: "Client business name" })
  clirazsoc: string;

  @ApiProperty({ description: "Client address" })
  clidir: string;

  @ApiProperty({ description: "Order commission" })
  ordcom: number;

  @ApiProperty({ description: "Proposal date" })
  ordfecpro: Date;

  @ApiProperty({ description: "Order amount" })
  ordmon: number;

  @ApiProperty({ description: "Order cost" })
  ordcos: number;

  @ApiProperty({ description: "Is new order" })
  ordnuev: boolean;

  @ApiProperty({ type: [Object], description: "Order products" })
  products: any[];

  @ApiProperty({ description: "Product count" })
  productCant: number;
}

export class SwaggerDuplicateOrderDto {
  @ApiProperty({ description: "Codigo de orden" })
  ordcod: number;
}
