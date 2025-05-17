import { Controller, Get, Param } from "@nestjs/common";
import { CurrencyService } from "./currency.service";
import { Public } from "../auth/decorators/public.decorator";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiOkResponse,
} from "@nestjs/swagger";
import {
  SwaggerCurrencyResponse,
  SwaggerSingleCurrencyResponse,
} from "./dto/currency.dto";

@ApiTags('Monedas')
@Controller("currency")
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Obtener todas las monedas',
    description: 'Devuelve una lista de todas las monedas disponibles',
  })
  @ApiOkResponse({
    description: 'Lista de monedas obtenida exitosamente',
    type: SwaggerCurrencyResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Error al obtener las monedas',
  })
  findAll() {
    return this.currencyService.findAll();
  }

  @Public()
  @Get(":id")
  @ApiOperation({
    summary: 'Obtener moneda por código',
    description: 'Devuelve los detalles de una moneda específica',
  })
  @ApiParam({
    name: 'id',
    description: 'Código de la moneda',
    type: Number,
  })
  @ApiOkResponse({
    description: 'Moneda encontrada',
    type: SwaggerSingleCurrencyResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Moneda no encontrada',
  })
  @ApiResponse({
    status: 500,
    description: 'Error al obtener la moneda',
  })
  findOne(@Param("id") id: string) {
    return this.currencyService.findOne(+id);
  }
}