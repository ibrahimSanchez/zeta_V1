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
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Public } from "../auth/decorators/public.decorator";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Public()
  @Get()
  async getAllProduct() {
    return this.productService.getAllProduct();
  }

  @Public()
  @Get(":id")
  async getProductByProdcod(@Param("id") id: string) {
    return this.productService.getProductByProdcod(id);
  }

  @Public()
  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Public()
  @Patch(":id")
  async updateProduct(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Public()
  @Post("fetch")
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
}
