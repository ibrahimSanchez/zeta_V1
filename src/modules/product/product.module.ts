import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { PrismaService } from "../prisma/prisma.service";
import { ProductTypeModule } from "../product-type/product-type.module";
import { SupplierModule } from "../supplier/supplier.module";

@Module({
  imports: [ProductTypeModule, SupplierModule],
  controllers: [ProductController],
  providers: [ProductService, PrismaService],
  exports: [ProductService],
})
export class ProductModule {}
