import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpException,
  HttpStatus,
  HttpCode,
  Delete,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto, ProductFetchResponseDto, SwaggerCreateProductDto, SwaggerProductDto, SwaggerUpdateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Public } from "../auth/decorators/public.decorator";
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

@ApiTags("Productos")
@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: "Obtener todos los productos",
    description:
      "Devuelve una lista completa de todos los productos registrados",
  })
  @ApiOkResponse({
    description: "Lista de productos obtenida exitosamente",
    type: [SwaggerProductDto],
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
  async getAllProduct() {
    return this.productService.getAllProduct();
  }

  @Public()
  @Get(":id")
  @ApiOperation({
    summary: "Obtener producto por código",
    description:
      "Recupera los detalles completos de un producto específico usando su código",
  })
  @ApiParam({
    name: "id",
    description: "Código único del producto",
    example: "PROD001",
  })
  @ApiOkResponse({
    description: "Producto encontrado",
    type: SwaggerProductDto,
  })
  @ApiResponse({
    status: 404,
    description: "Producto no encontrado",
  })
  async getProductByProdcod(@Param("id") id: string) {
    return this.productService.getProductByProdcod(id);
  }

  @Public()
  @Post("create")
  @ApiOperation({
    summary: "Crear nuevo producto",
    description: "Registra un nuevo producto en el sistema",
  })
  @ApiBody({
    type: SwaggerCreateProductDto,
    description: "Datos requeridos para la creación del producto",
  })
  @ApiCreatedResponse({
    description: "Producto creado exitosamente",
    type: SwaggerProductDto,
  })
  @ApiResponse({
    status: 400,
    description: "Datos de entrada inválidos",
  })
  @ApiResponse({
    status: 409,
    description: "El producto ya existe",
  })
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Public()
  @Patch("update/:id")
  @ApiOperation({
    summary: "Actualizar producto",
    description: "Actualiza la información de un producto existente",
  })
  @ApiParam({
    name: "id",
    description: "Código único del producto a actualizar",
    example: "PROD001",
  })
  @ApiBody({
    type: SwaggerUpdateProductDto,
    description: "Datos a actualizar para el producto",
  })
  @ApiOkResponse({
    description: "Producto actualizado exitosamente",
    type: SwaggerProductDto,
  })
  @ApiResponse({
    status: 400,
    description: "Datos de entrada inválidos",
  })
  @ApiResponse({
    status: 404,
    description: "Producto no encontrado",
  })
  async updateProduct(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Public()
  @Post("fetch")
  @ApiOperation({
    summary: "Sincronizar productos",
    description: "Actualiza la lista de productos desde el sistema externo",
  })
  @ApiOkResponse({
    description: "Productos sincronizados exitosamente",
    type: [ProductFetchResponseDto],
  })
  @ApiInternalServerErrorResponse({
    description: "Error al intentar sincronizar los productos",
  })
  async fetchArticles() {
    try {
      return await this.productService.fetchArticles();
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
    @ApiOperation({ summary: "Eliminar un producto" })
    @ApiParam({
      name: "id",
      description: "Codigo del producto a eliminar",
      type: String,
    })
    @ApiResponse({
      status: 200,
      description: "Producto eliminado exitosamente",
      type: SwaggerProductDto,
    })
    @ApiResponse({ status: 404, description: "Producto no encontrado" })
    @ApiResponse({ status: 500, description: "Error interno del servidor" })
    remove(@Param("id") id: string) {
      return this.productService.remove(id);
    }


  
}
