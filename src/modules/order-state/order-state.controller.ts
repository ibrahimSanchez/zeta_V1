import { Controller, Get, Param } from "@nestjs/common";
import { OrderStateService } from "./order-state.service";

@Controller("order-state")
export class OrderStateController {
  constructor(private readonly orderStateService: OrderStateService) {}

  @Get()
  findAll() {
    return this.orderStateService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.orderStateService.findOne(+id);
  }
}
