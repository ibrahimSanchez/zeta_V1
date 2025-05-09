import { Controller, Get, Param } from "@nestjs/common";
import { CurrencyService } from "./currency.service";
import { Public } from "../auth/decorators/public.decorator";

@Controller("currency")
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Public()
  @Get()
  findAll() {
    return this.currencyService.findAll();
  }

  @Public()
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.currencyService.findOne(+id);
  }
}
