import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { Public } from "../auth/decorators/public.decorator";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Public()
  @Get()
  async getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Public()
  @Get("order/:id")
  async getOrderByOrdcod(@Param("id") id: string) {
    return this.ordersService.getOrderByOrdcod(parseInt(id));
  }

  @Public()
  @Post("create")
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Public()
  @Patch("update/:id")
  async updateOrder(
    @Param("id") id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.updateOrder(parseInt(id), updateOrderDto);
  }

  @Public()
  @Post('delete')
  async deleteOrders(@Body() ordcods: number[]) {
    return this.ordersService.deleteOrders(ordcods);
  }
}
