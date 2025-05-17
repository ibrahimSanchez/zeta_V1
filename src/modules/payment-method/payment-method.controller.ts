import { Controller, Get, Param } from "@nestjs/common";
import { PaymentMethodService } from "./payment-method.service";
import { Public } from "../auth/decorators/public.decorator";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiOkResponse,
} from "@nestjs/swagger";
import {
  SwaggerPaymentMethodsResponse,
  SwaggerSinglePaymentMethodResponse,
} from "./dto/payment-method.dto";

@ApiTags('Métodos de Pago')
@Controller("payment-method")
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Obtener todos los métodos de pago',
    description: 'Devuelve una lista de todos los métodos de pago disponibles',
  })
  @ApiOkResponse({
    description: 'Lista de métodos de pago obtenida exitosamente',
    type: SwaggerPaymentMethodsResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Error al obtener los métodos de pago',
  })
  findAll() {
    return this.paymentMethodService.findAll();
  }

  @Public()
  @Get(":id")
  @ApiOperation({
    summary: 'Obtener método de pago por código',
    description: 'Devuelve los detalles de un método de pago específico',
  })
  @ApiParam({
    name: 'id',
    description: 'Código del método de pago',
    type: Number,
  })
  @ApiOkResponse({
    description: 'Método de pago encontrado',
    type: SwaggerSinglePaymentMethodResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Método de pago no encontrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Error al obtener el método de pago',
  })
  findOne(@Param("id") id: string) {
    return this.paymentMethodService.findOne(+id);
  }
}