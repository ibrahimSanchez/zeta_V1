import {
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Body,
  HttpCode,
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { Public } from "../auth/decorators/public.decorator";
import { UpdateOrderDto } from "./dto/update-order.dto";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
} from "@nestjs/swagger";
import {
  CreateOrderDto,
  SwaggerCreateOrderDto,
  SwaggerDeleteOrdersDto,
  SwaggerDuplicateOrderDto,
  SwaggerOrderResponseDto,
  SwaggerUpdateOrderDto,
} from "./dto/create-order.dto";

@ApiTags("Órdenes")
@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: "Obtener todas las órdenes",
    description: "Devuelve una lista resumida de todas las órdenes registradas",
  })
  @ApiOkResponse({
    description: "Lista de órdenes obtenida exitosamente",
    type: [Object],
  })
  async getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Public()
  @Get("order/:id")
  @ApiOperation({
    summary: "Obtener orden por código",
    description: "Recupera los detalles completos de una orden específica",
  })
  @ApiParam({
    name: "id",
    description: "Código único de la orden",
  })
  @ApiOkResponse({
    description: "Orden encontrada",
    type: SwaggerOrderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: "Orden no encontrada",
  })
  async getOrderByOrdcod(@Param("id") id: string) {
    return this.ordersService.getOrderByOrdcod(parseInt(id));
  }

  @Public()
  @Post("create")
  @ApiOperation({
    summary: "Crear nueva orden",
    description: "Registra una nueva orden en el sistema",
  })
  @ApiBody({
    type: SwaggerCreateOrderDto,
    description: "Datos requeridos para la creación de la orden",
  })
  @ApiCreatedResponse({
    description: "Orden creada exitosamente",
    type: SwaggerOrderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Datos de entrada inválidos",
  })
  @ApiResponse({
    status: 409,
    description: "La orden ya existe",
  })
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Public()
  @Post("duplicate")
  @ApiOperation({
    summary: "Duplicar orden",
    description: "Duplica una orden en el sistema",
  })
  @ApiBody({
    type: SwaggerDuplicateOrderDto,
    description: "Datos requeridos para duplicar la orden",
  })
  @ApiCreatedResponse({
    description: "Orden duplicada exitosamente",
    type: SwaggerOrderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Datos de entrada inválidos",
  })
  async duplicateOrder(@Body() body: { ordcod: number }) {
    return this.ordersService.duplicateOrder(body.ordcod);
  }

  @Public()
  @Patch("update/:id")
  @ApiOperation({
    summary: "Actualizar orden",
    description: "Actualiza la información de una orden existente",
  })
  @ApiParam({
    name: "id",
    description: "Código único de la orden a actualizar",
  })
  @ApiBody({
    type: SwaggerUpdateOrderDto,
    description: "Datos a actualizar para la orden",
  })
  @ApiOkResponse({
    description: "Orden actualizada exitosamente",
    type: SwaggerOrderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Datos de entrada inválidos",
  })
  @ApiResponse({
    status: 404,
    description: "Orden no encontrada",
  })
  async updateOrder(
    @Param("id") id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.updateOrder(parseInt(id), updateOrderDto);
  }

  @Public()
  @Post("delete")
  @HttpCode(200)
  @ApiOperation({
    summary: "Eliminar órdenes",
    description: "Elimina múltiples órdenes según sus códigos",
  })
  @ApiBody({
    description: "Lista de códigos de órdenes a eliminar",
    type: SwaggerDeleteOrdersDto,
  })
  @ApiOkResponse({
    description: "Órdenes eliminadas exitosamente",
  })
  @ApiResponse({
    status: 400,
    description: "Datos de entrada inválidos",
  })
  @ApiResponse({
    status: 404,
    description: "Órdenes no encontradas",
  })
  async deleteOrders(@Body() body: { codes: number[] }) {
    return this.ordersService.deleteOrders(body);
  }


}
