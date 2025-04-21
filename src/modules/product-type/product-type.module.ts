import { Module } from "@nestjs/common";
import { ProductTypeService } from "./product-type.service";
import { ProductTypeController } from "./product-type.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [ProductTypeController],
  providers: [ProductTypeService, PrismaService],
  exports: [ProductTypeService],
})
export class ProductTypeModule {}
