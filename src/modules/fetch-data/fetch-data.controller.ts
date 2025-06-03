import { Controller, Get } from "@nestjs/common";
import { FetchDataService } from "./fetch-data.service";
import { Public } from "../auth/decorators/public.decorator";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller("fetch-data")
export class FetchDataController {
  constructor(private readonly fetchDataService: FetchDataService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Cargar datos desde APIs externas" })
  @ApiResponse({
    status: 200,
    description:
      "Carga completada. Se indica el estado de clientes, proveedores y productos.",
    schema: {
      example: {
        message: "Data loading completed",
        results: {
          clients: { success: true },
          suppliers: { success: false, error: "Connection timeout" },
          products: { success: true },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: "Error inesperado durante la carga de datos",
  })
  loadData() {
    return this.fetchDataService.loadData();
  }
}
