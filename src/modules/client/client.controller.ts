import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ClientService } from "./client.service";
import { Public } from "src/modules/auth/decorators/public.decorator";
import {
  ClientFetchResponseDto,
  CreateClientDto,
  SwaggerClientCodesNamesResponseDto,
  SwaggerClientDto,
  SwaggerUpdateClientDto,
} from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiQuery,
} from "@nestjs/swagger";

@ApiTags("Clientes")
@Controller("clients")
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Public()
  @Get("names-codes")
  @ApiOperation({
    summary: "Obtener nombres y códigos de clientes",
    description:
      "Devuelve una lista simplificada con solo nombres y códigos de todos los clientes",
  })
  @ApiOkResponse({
    description: "Lista de nombres y códigos obtenida exitosamente",
    type: [SwaggerClientCodesNamesResponseDto],
  })
  async getAllClientsNamesCodes() {
    return this.clientService.getAllClientsNamesCodes();
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: "Obtener todos los clientes",
    description:
      "Devuelve una lista completa de todos los clientes registrados",
  })
  @ApiOkResponse({
    description: "Lista de clientes obtenida exitosamente",
    type: [SwaggerClientDto],
  })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Número de página para paginación",
    example: 1,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Límite de resultados por página",
    example: 10,
  })
  async getAllClient() {
    return this.clientService.getAllClient();
  }

  @Public()
  @Get(":id")
  @ApiOperation({
    summary: "Obtener cliente por código",
    description:
      "Recupera los detalles completos de un cliente específico usando su código",
  })
  @ApiParam({
    name: "id",
    description: "Código único del cliente",
    example: "CLI001",
  })
  @ApiOkResponse({
    description: "Cliente encontrado",
    type: SwaggerClientDto,
  })
  @ApiResponse({
    status: 404,
    description: "Cliente no encontrado",
  })
  async getClientByProvcod(@Param("id") id: string) {
    return this.clientService.getClientByClicod(id);
  }

  @Public()
  @Post()
  @ApiOperation({
    summary: "Crear nuevo cliente",
    description: "Registra un nuevo cliente en el sistema",
  })
  @ApiBody({
    type: SwaggerClientDto,
    description: "Datos requeridos para la creación del cliente",
  })
  @ApiCreatedResponse({
    description: "Cliente creado exitosamente",
    type: SwaggerClientDto,
  })
  @ApiResponse({
    status: 400,
    description: "Datos de entrada inválidos",
  })
  @ApiResponse({
    status: 409,
    description: "El cliente ya existe",
  })
  async createClient(@Body() createClientDto: CreateClientDto) {
    return this.clientService.createClient(createClientDto);
  }

  @Public()
  @Patch(":id")
  @ApiOperation({
    summary: "Actualizar cliente",
    description: "Actualiza la información de un cliente existente",
  })
  @ApiParam({
    name: "id",
    description: "Código único del cliente a actualizar",
    example: "CLI001",
  })
  @ApiBody({
    type: SwaggerUpdateClientDto,
    description: "Datos a actualizar para el cliente",
  })
  @ApiOkResponse({
    description: "Cliente actualizado exitosamente",
    type: SwaggerClientDto,
  })
  @ApiResponse({
    status: 400,
    description: "Datos de entrada inválidos",
  })
  @ApiResponse({
    status: 404,
    description: "Cliente no encontrado",
  })
  async updateClient(
    @Param("id") id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientService.updateClient(id, updateClientDto);
  }

  @Public()
  @Post("fetch")
  @ApiOperation({
    summary: "Sincronizar clientes",
    description: "Actualiza la lista de clientes desde el sistema externo",
  })
  @ApiOkResponse({
    description: "Clientes sincronizados exitosamente",
    type: [ClientFetchResponseDto],
  })
  @ApiInternalServerErrorResponse({
    description: "Error al intentar sincronizar los clientes",
  })
  async fetchClients() {
    try {
      return await this.clientService.fetchClients();
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
}
