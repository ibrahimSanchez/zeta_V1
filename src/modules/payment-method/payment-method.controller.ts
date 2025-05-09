import { Controller, Get, Param } from "@nestjs/common";
import { PaymentMethodService } from "./payment-method.service";
import { Public } from "../auth/decorators/public.decorator";

@Controller("payment-method")
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Public()
  @Get()
  findAll() {
    return this.paymentMethodService.findAll();
  }

  @Public()
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.paymentMethodService.findOne(+id);
  }
}
