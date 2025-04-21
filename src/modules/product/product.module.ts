import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { PrismaService } from "../prisma/prisma.service";
import { ProductTypeModule } from "../product-type/product-type.module";

@Module({
  imports: [ProductTypeModule],
  controllers: [ProductController],
  providers: [ProductService, PrismaService],
})
export class ProductModule {}
