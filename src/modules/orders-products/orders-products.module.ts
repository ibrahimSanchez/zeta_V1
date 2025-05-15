import { Module } from "@nestjs/common";
import { OrdersProductsService } from "./orders-products.service";
import { OrdersProductsController } from "./orders-products.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [OrdersProductsController],
  providers: [OrdersProductsService, PrismaService],
})
export class OrdersProductsModule {}
