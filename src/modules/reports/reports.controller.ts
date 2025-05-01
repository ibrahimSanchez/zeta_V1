import { Body, Controller, Post } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { Public } from "../auth/decorators/public.decorator";
import {
  BrandReportQuery,
  ClientReportQuery,
  DatesReportQuery,
  SupplierReportQuery,
} from "./types/reportTypes";

@Controller("reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}


  @Public()
  @Post("date-report")
  async datesReport(@Body() datesReportQuery: DatesReportQuery) {
    return this.reportsService.datesReport(datesReportQuery);
  }


  @Public()
  @Post("client-report")
  async clientReport(@Body() clientReportQuery: ClientReportQuery) {
    return this.reportsService.clientReport(clientReportQuery);
  }

  @Public()
  @Post("supplier-report")
  async supplierReport(@Body() supplierReportQuery: SupplierReportQuery) {
    return this.reportsService.supplierReport(supplierReportQuery);
  }

  @Public()
  @Post("brand-report")
  async brandReport(@Body() brandReportQuery: BrandReportQuery) {
    return this.reportsService.brandReport(brandReportQuery.ordmar);
  }


  @Public()
  @Post("best-selling-products-report")
  async bestSellingProductsReport(@Body() datesReportQuery: DatesReportQuery) {
    return this.reportsService.bestSellingProductsReport(datesReportQuery);
  }

}
