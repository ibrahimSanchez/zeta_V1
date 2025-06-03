import { ApiProperty } from "@nestjs/swagger";

export class CreateReportDto {}

export class SwaggerDatesReportQuery {
  @ApiProperty({ description: "Fecha de inicio para el reporte" })
  startDate: Date;

  @ApiProperty({ description: "Fecha de fin para el reporte" })
  endDate: Date;
}

export class SwaggerClientReportQuery extends SwaggerDatesReportQuery {
  @ApiProperty({ description: "Código del cliente" })
  clicod: string;
  
  @ApiProperty({ description: "Fecha de inicio para el reporte" })
  startDate: Date;

  @ApiProperty({ description: "Fecha de fin para el reporte" })
  endDate: Date;
}

export class SwaggerSupplierReportQuery extends SwaggerDatesReportQuery {
  @ApiProperty({ description: "Código del proveedor" })
  provcod: string;
}

export class SwaggerBrandReportQuery {
  @ApiProperty({ description: "Marca para filtrar el reporte" })
  ordmar: string;
}

export class SwaggerOrderProductReport {
  @ApiProperty({ description: "Código del producto" })
  prodcod: string;

  @ApiProperty({ description: "Código del proveedor" })
  provcod: string;

  @ApiProperty({ description: "Cantidad vendida" })
  ordprodcan: number;

  @ApiProperty({ description: "Precio del producto" })
  ordprodpre: number;

  @ApiProperty({ description: "Precio real del producto" })
  ordprodprereal: number;
}

export class SwaggerBasicReportResponse {
  @ApiProperty({ description: "Código de la orden" })
  ordcod: number;

  @ApiProperty({ description: "Número de factura" })
  ordnumfac: string;

  @ApiProperty({ description: "Fecha de la orden" })
  ordfec: Date;

  @ApiProperty({ description: "Fecha de propuesta" })
  ordfecpro: Date;

  @ApiProperty({ description: "Nombre del estado" })
  estnom: string;

  @ApiProperty({ description: "Nombre del método de pago" })
  pagonom: string;

  @ApiProperty({ description: "Nombre de la moneda" })
  monnom: string;

  @ApiProperty({ description: "Costo total de la orden" })
  ordcos: number;

  @ApiProperty({ description: "Comisión de la orden" })
  ordcom: number;

  @ApiProperty({ description: "Porcentaje de ganancia" })
  profitPercentage: number | string;
}

export class SwaggerClientReportResponse extends SwaggerBasicReportResponse {
  @ApiProperty({ description: "Código del cliente" })
  clicod: string;

  @ApiProperty({ description: "Código BIT del cliente" })
  clicodbit: string;
}

export class SwaggerSupplierReportResponse extends SwaggerBasicReportResponse {
  @ApiProperty({ description: "Código del proveedor" })
  provcod: string;
}

export class SwaggerBrandReportResponse {
  @ApiProperty({ description: "Código de la orden" })
  ordcod: number;

  @ApiProperty({ description: "Fecha de la orden" })
  ordfec: Date;

  @ApiProperty({ description: "Fecha de propuesta" })
  ordfecpro: Date;

  @ApiProperty({ description: "Número de factura" })
  ordnumfac: string;

  @ApiProperty({ description: "Nombre del estado" })
  estnom: string;

  @ApiProperty({
    type: [SwaggerOrderProductReport],
    description: "Productos de la orden",
  })
  productos: SwaggerOrderProductReport[];
}

export class SwaggerBestSellingProduct {
  @ApiProperty({ description: "Código del producto" })
  prodcod: string;

  @ApiProperty({ description: "Nombre del producto" })
  prodnom: string;

  @ApiProperty({ description: "Código del tipo de producto" })
  tipcod: string | null;

  @ApiProperty({ description: "Nombre del tipo de producto" })
  tipnom: string | null;

  @ApiProperty({ description: "Cantidad total vendida" })
  totalSold: number;
}

export class SwaggerProfitMarginPerProduct {
  @ApiProperty({ description: "Fecha de inicio para el reporte" })
  startDate: Date;

  @ApiProperty({ description: "Fecha de fin para el reporte" })
  endDate: Date;

  // @ApiProperty({ description: "Código del producto" })
  // prodcod: string;
}

export class SwaggerItemsInDateRange {
  @ApiProperty({ description: "Número de serie del item" })
  numserie: string;

  @ApiProperty({ description: "Código del producto" })
  prodcod: string;

  @ApiProperty({ description: "Fecha en la que se añade el item" })
  itemfec: Date;

  @ApiProperty({ description: "Garantía del item" })
  itemgar: Date;

  @ApiProperty({ description: "Código de la orden de trabajo" })
  ordcod: number;
}
