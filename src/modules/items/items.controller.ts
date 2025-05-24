import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ItemsService } from "./items.service";
import { CreateItemDto } from "./dto/create-item.dto";
import { UpdateItemDto } from "./dto/update-item.dto";
import { Public } from "../auth/decorators/public.decorator";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import {
  SwaggerCreateItemDto,
  SwaggerItemResponseDto,
  SwaggerUpdateItemDto,
} from "./dto/swagger.dto";

@ApiTags("Items")
@Controller("items")
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Obtener todos los items" })
  @ApiResponse({
    status: 200,
    description: "Lista de items retornada exitosamente",
    type: [SwaggerItemResponseDto],
  })
  @ApiResponse({ status: 500, description: "Error interno del servidor" })
  findAll() {
    return this.itemsService.findAll();
  }

  @Public()
  @Get(":id")
  @ApiOperation({ summary: "Obtener un item por ID" })
  @ApiParam({ name: "id", description: "ID del item", type: Number })
  @ApiResponse({
    status: 200,
    description: "Item encontrado",
    type: SwaggerItemResponseDto,
  })
  @ApiResponse({ status: 404, description: "Item no encontrado" })
  @ApiResponse({ status: 500, description: "Error interno del servidor" })
  findOne(@Param("id") id: string) {
    return this.itemsService.findOne(+id);
  }

  @Public()
  @Get("product/:id")
  @ApiOperation({ summary: "Obtener items por código de producto" })
  @ApiParam({ name: "id", description: "Código del producto", type: String })
  @ApiResponse({
    status: 200,
    description: "Items encontrados",
    type: [SwaggerItemResponseDto],
  })
  @ApiResponse({ status: 500, description: "Error interno del servidor" })
  findItemByProdcod(@Param("id") id: string) {
    return this.itemsService.findItemByProdcod(id);
  }

  @Public()
  @Post("create")
  @ApiOperation({ summary: "Crear un nuevo item" })
  @ApiBody({ type: SwaggerCreateItemDto })
  @ApiResponse({
    status: 201,
    description: "Item creado exitosamente",
    type: SwaggerItemResponseDto,
  })
  @ApiResponse({ status: 400, description: "Código de producto inválido" })
  @ApiResponse({ status: 500, description: "Error interno del servidor" })
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @Public()
  @Post("create-many")
  @ApiOperation({ summary: "Crear múltiples items" })
  @ApiBody({ type: [SwaggerCreateItemDto] })
  @ApiResponse({
    status: 201,
    description: "Items creados exitosamente",
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: "Uno o más códigos de producto son inválidos",
  })
  @ApiResponse({ status: 500, description: "Error interno del servidor" })
  createMany(@Body() createItemDto: CreateItemDto[]) {
    return this.itemsService.createMany(createItemDto);
  }

  @Public()
  @Patch(":id")
  @ApiOperation({ summary: "Actualizar un item" })
  @ApiParam({
    name: "id",
    description: "ID del item a actualizar",
    type: Number,
  })
  @ApiBody({ type: SwaggerUpdateItemDto })
  @ApiResponse({
    status: 200,
    description: "Item actualizado exitosamente",
    type: SwaggerItemResponseDto,
  })
  @ApiResponse({ status: 400, description: "Código de producto inválido" })
  @ApiResponse({ status: 404, description: "Item no encontrado" })
  @ApiResponse({ status: 500, description: "Error interno del servidor" })
  update(@Param("id") id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(+id, updateItemDto);
  }

  @Public()
  @Delete(":id")
  @ApiOperation({ summary: "Eliminar un item" })
  @ApiParam({ name: "id", description: "ID del item a eliminar", type: Number })
  @ApiResponse({
    status: 200,
    description: "Item eliminado exitosamente",
    type: SwaggerItemResponseDto,
  })
  @ApiResponse({ status: 404, description: "Item no encontrado" })
  @ApiResponse({ status: 500, description: "Error interno del servidor" })
  remove(@Param("id") id: string) {
    return this.itemsService.remove(+id);
  }
}
