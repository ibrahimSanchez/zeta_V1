import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { OrdersProductsService } from "./orders-products.service";
import { CreateOrdersProductDto } from "./dto/create-orders-product.dto";
import { UpdateOrdersProductDto } from "./dto/update-orders-product.dto";
import { Public } from "../auth/decorators/public.decorator";

@Controller("orders-products")
export class OrdersProductsController {
  constructor(private readonly ordersProductsService: OrdersProductsService) {}

  @Public()
  @Post("create")
  create(@Body() createOrdersProductDto: CreateOrdersProductDto) {
    return this.ordersProductsService.create(createOrdersProductDto);
  }

  @Get()
  findAll() {
    return this.ordersProductsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ordersProductsService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateOrdersProductDto: UpdateOrdersProductDto,
  ) {
    return this.ordersProductsService.update(+id, updateOrdersProductDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.ordersProductsService.remove(+id);
  }
}
