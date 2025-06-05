import { Controller, Post, Body } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { Public } from "../auth/decorators/public.decorator";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
} from "@nestjs/swagger";
import {
  SwaggerDatesReportQuery,
  SwaggerClientReportQuery,
  SwaggerSupplierReportQuery,
  SwaggerBrandReportQuery,
  SwaggerClientReportResponse,
  SwaggerSupplierReportResponse,
  SwaggerBrandReportResponse,
  SwaggerBestSellingProduct,
  SwaggerBasicReportResponse,
  SwaggerProfitMarginPerProduct,
  SwaggerItemsInDateRange,
} from "./dto/report.dto";
import { ClientReportQuery, DatesReportQuery, SupplierReportQuery } from "./types/reportTypes";

@ApiTags("Reportes")
@Controller("reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Public()
  @Post("date-report")
  @ApiOperation({
    summary: "Reporte por fechas",
    description: "Genera un reporte de órdenes dentro de un rango de fechas",
  })
  @ApiBody({ type: SwaggerDatesReportQuery })
  @ApiOkResponse({
    description: "Reporte generado exitosamente",
    type: [SwaggerBasicReportResponse],
  })
  async datesReport(@Body() datesReportQuery: DatesReportQuery) {
    return this.reportsService.datesReport(datesReportQuery);
  }

  @Public()
  @Post("client-report")
  @ApiOperation({
    summary: "Reporte por cliente",
    description: "Genera un reporte de órdenes para un cliente específico",
  })
  @ApiBody({ type: SwaggerClientReportQuery })
  @ApiOkResponse({
    description: "Reporte generado exitosamente",
    type: [SwaggerClientReportResponse],
  })
  async clientReport(@Body() clientReportQuery: ClientReportQuery) {
    return await this.reportsService.clientReport(clientReportQuery);
  }

  @Public()
  @Post("supplier-report")
  @ApiOperation({
    summary: "Reporte por proveedor",
    description: "Genera un reporte de órdenes para un proveedor específico",
  })
  @ApiBody({ type: SwaggerSupplierReportQuery })
  @ApiOkResponse({
    description: "Reporte generado exitosamente",
    type: [SwaggerSupplierReportResponse],
  })
  async supplierReport(
    @Body() supplierReportQuery: SupplierReportQuery,
  ) {
    return this.reportsService.supplierReport(supplierReportQuery);
  }

  @Public()
  @Post("brand-report")
  @ApiOperation({
    summary: "Reporte por marca",
    description: "Genera un reporte de órdenes para una marca específica",
  })
  @ApiBody({ type: SwaggerBrandReportQuery })
  @ApiOkResponse({
    description: "Reporte generado exitosamente",
    type: [SwaggerBrandReportResponse],
  })
  async brandReport(@Body() brandReportQuery: SwaggerBrandReportQuery) {
    return this.reportsService.brandReport(brandReportQuery.ordmar);
  }

  @Public()
  @Post("best-selling-products-report")
  @ApiOperation({
    summary: "Reporte de productos más vendidos",
    description:
      "Genera un reporte de los productos más vendidos en un período",
  })
  @ApiBody({ type: SwaggerDatesReportQuery })
  @ApiOkResponse({
    description: "Reporte generado exitosamente",
    type: [SwaggerBestSellingProduct],
  })
  async bestSellingProductsReport(
    @Body() datesReportQuery: DatesReportQuery,
  ) {
    return this.reportsService.bestSellingProductsReport(datesReportQuery);
  }

  @Public()
  @Post("profit-margin-per-product")
  @ApiOperation({
    summary: "Reporte de margen de ganancia de los productos",
    description:
      "Genera un reporte con el margen de ganancia de los productos en un período",
  })
  @ApiBody({ type: SwaggerProfitMarginPerProduct })
  @ApiOkResponse({
    description: "Reporte generado exitosamente",
    type: [SwaggerBestSellingProduct],
  })
  async profitMarginPerProduct(
    @Body() datesReportQuery: DatesReportQuery,
  ) {
    return this.reportsService.profitMarginPerProduct(datesReportQuery);
  }


  @Public()
  @Post("items-in-date-range")
  @ApiOperation({
    summary: "Reporte de items en un rango de fecha",
    description:
      "Genera un reporte con datos de los items en un período",
  })
  @ApiBody({ type: SwaggerDatesReportQuery })
  @ApiOkResponse({
    description: "Reporte generado exitosamente",
    type: [SwaggerItemsInDateRange],
  })
  async itemsInDateRange(@Body() datesReportQuery: DatesReportQuery) {
    return this.reportsService.itemsInDateRange(datesReportQuery);
  }
}
