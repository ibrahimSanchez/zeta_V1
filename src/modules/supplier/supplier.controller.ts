import {
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Get,
  Param,
  Patch,
  Body,
} from "@nestjs/common";
import { SupplierService } from "./supplier.service";
import { Public } from "src/modules/auth/decorators/public.decorator";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";
import { CreateSupplierDto } from "./dto/create-supplier.dto";

@Controller("suppliers")
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Public()
  @Get()
  async getAllSupplier() {
    return this.supplierService.getAllSupplier();
  }

  @Public()
  @Get(":id")
  async getSupplierByProvcod(@Param("id") id: string) {
    return this.supplierService.getSupplierByProvcod(id);
  }

  @Public()
  @Post()
  async createSupplier(@Body() createSupplierDto: CreateSupplierDto) {
    return this.supplierService.createSupplier(createSupplierDto);
  }

  @Public()
  @Patch(":id")
  async updateSupplier(
    @Param("id") id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    return this.supplierService.updateSupplier(id, updateSupplierDto);
  }

  @Public()
  @Post("fetch")
  async fetchSuppliers() {
    try {
      return await this.supplierService.fetchSuppliers();
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
