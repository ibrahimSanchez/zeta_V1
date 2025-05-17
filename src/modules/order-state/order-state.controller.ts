import { Controller, Get, Param } from "@nestjs/common";
import { OrderStateService } from "./order-state.service";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiOkResponse,
} from "@nestjs/swagger";
import {
  SwaggerOrderStatesResponse,
  SwaggerSingleOrderStateResponse,
} from "./dto/order-state.dto";

@ApiTags('Estados de Orden')
@Controller("order-state")
export class OrderStateController {
  constructor(private readonly orderStateService: OrderStateService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los estados de orden',
    description: 'Devuelve una lista de todos los estados de orden disponibles',
  })
  @ApiOkResponse({
    description: 'Lista de estados de orden obtenida exitosamente',
    type: SwaggerOrderStatesResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Error al obtener los estados de orden',
  })
  findAll() {
    return this.orderStateService.findAll();
  }

  @Get(":id")
  @ApiOperation({
    summary: 'Obtener estado de orden por código',
    description: 'Devuelve los detalles de un estado de orden específico',
  })
  @ApiParam({
    name: 'id',
    description: 'Código del estado de orden',
    type: Number,
  })
  @ApiOkResponse({
    description: 'Estado de orden encontrado',
    type: SwaggerSingleOrderStateResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Estado de orden no encontrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Error al obtener el estado de orden',
  })
  findOne(@Param("id") id: string) {
    return this.orderStateService.findOne(+id);
  }
}