import {
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Get,
  Param,
  Patch,
  Body,
  Delete,
} from "@nestjs/common";
import { SupplierService } from "./supplier.service";
import { Public } from "src/modules/auth/decorators/public.decorator";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";
import {
  CreateSupplierDto,
  SupplierFetchResponseDto,
  SwaggerCreateSupplierResponse,
  SwaggerSupplierDto,
  SwaggerUpdateSupplierDto,
} from "./dto/create-supplier.dto";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
} from "@nestjs/swagger";
import { SwaggerCreateUserResponse } from "../users/dto/create-user.dto";

@ApiTags("Proveedores")
@Controller("suppliers")
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Public()
  @Get("names-codes")
  @ApiOperation({
    summary: "Obtener nombres y códigos de proveedores",
    description:
      "Devuelve una lista simplificada con solo nombres y códigos de todos los proveedores",
  })
  @ApiOkResponse({
    description: "Lista de nombres y códigos obtenida exitosamente",
    type: [SwaggerSupplierDto],
  })
  async getAllSuppliersNamesCodes() {
    return this.supplierService.getAllSuppliersNamesCodes();
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: "Obtener todos los proveedores",
    description:
      "Devuelve una lista completa de todos los proveedores registrados",
  })
  @ApiOkResponse({
    description: "Lista de proveedores obtenida exitosamente",
    type: [SwaggerSupplierDto],
  })
  async getAllSupplier() {
    return this.supplierService.getAllSupplier();
  }

  @Public()
  @Get(":id")
  @ApiOperation({
    summary: "Obtener proveedor por código",
    description:
      "Recupera los detalles completos de un proveedor específico usando su código",
  })
  @ApiParam({
    name: "id",
    description: "Código único del proveedor",
    example: "PROV001",
  })
  @ApiOkResponse({
    description: "Proveedor encontrado",
    type: SwaggerCreateUserResponse,
  })
  @ApiResponse({
    status: 404,
    description: "Proveedor no encontrado",
  })
  async getSupplierByProvcod(@Param("id") id: string) {
    return this.supplierService.getSupplierByProvcod(id);
  }

  @Public()
  @Post()
  @ApiOperation({
    summary: "Crear nuevo proveedor",
    description: "Registra un nuevo proveedor en el sistema",
  })
  @ApiBody({
    type: SwaggerSupplierDto,
    description: "Datos requeridos para la creación del proveedor",
  })
  @ApiCreatedResponse({
    description: "Proveedor creado exitosamente",
    type: SwaggerCreateSupplierResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Datos de entrada inválidos",
  })
  @ApiResponse({
    status: 409,
    description: "El proveedor ya existe",
  })
  async createSupplier(@Body() createSupplierDto: CreateSupplierDto) {
    return this.supplierService.createSupplier(createSupplierDto);
  }

  @Public()
  @Patch(":id")
  @ApiOperation({
    summary: "Actualizar proveedor",
    description: "Actualiza la información de un proveedor existente",
  })
  @ApiParam({
    name: "id",
    description: "Código único del proveedor a actualizar",
    example: "PROV001",
  })
  @ApiBody({
    type: SwaggerUpdateSupplierDto,
    description: "Datos a actualizar para el proveedor",
  })
  @ApiOkResponse({
    description: "Proveedor actualizado exitosamente",
    type: SwaggerCreateSupplierResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Datos de entrada inválidos",
  })
  @ApiResponse({
    status: 404,
    description: "Proveedor no encontrado",
  })
  async updateSupplier(
    @Param("id") id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    return this.supplierService.updateSupplier(id, updateSupplierDto);
  }

  @Public()
  @Post("fetch")
  @ApiOperation({
    summary: "Sincronizar proveedores",
    description: "Actualiza la lista de proveedores desde el sistema externo",
  })
  @ApiOkResponse({
    description: "Proveedores sincronizados exitosamente",
    type: [SupplierFetchResponseDto],
  })
  @ApiInternalServerErrorResponse({
    description: "Error al intentar sincronizar los proveedores",
  })
  async fetchSuppliers() {
    try {
      return await this.supplierService.fetchSuppliers();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "There was a problem fetching articles",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  @Public()
  @Delete("delete/:id")
  @ApiOperation({ summary: "Eliminar un proveedor" })
  @ApiParam({
    name: "id",
    description: "Codigo del proveedor a eliminar",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: "Proveedor eliminado exitosamente",
    type: SwaggerSupplierDto,
  })
  @ApiResponse({ status: 404, description: "Proveedor no encontrado" })
  @ApiResponse({ status: 500, description: "Error interno del servidor" })
  remove(@Param("id") id: string) {
    return this.supplierService.remove(id);
  }


}
