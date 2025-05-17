import { Controller, Get } from "@nestjs/common";
import { ProductTypeService } from "./product-type.service";
import { Public } from "../auth/decorators/public.decorator";
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiInternalServerErrorResponse
} from '@nestjs/swagger';
import { SwaggerProductTypeDto } from "./dto/create-product-type.dto";

@ApiTags('Tipos de Producto')
@Controller("products-type")
export class ProductTypeController {
  constructor(private readonly productTypeService: ProductTypeService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Obtener todos los tipos de producto',
    description: 'Devuelve una lista completa de todos los tipos de producto registrados en el sistema'
  })
  @ApiOkResponse({
    description: 'Lista de tipos de producto obtenida exitosamente',
    type: [SwaggerProductTypeDto]
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno del servidor al procesar la solicitud'
  })
  findAll() {
    return this.productTypeService.findAll();
  }
}