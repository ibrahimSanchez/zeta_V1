import { Controller, Get } from "@nestjs/common";
import { ProductTypeService } from "./product-type.service";
import { Public } from "../auth/decorators/public.decorator";

@Controller("products-type")
export class ProductTypeController {
  constructor(private readonly productTypeService: ProductTypeService) {}

  @Public()
  @Get()
  findAll() {
    return this.productTypeService.findAll();
  }
}
