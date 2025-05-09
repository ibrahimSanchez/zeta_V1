import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { PrismaService } from "../prisma/prisma.service";
import { SupplierService } from "../supplier/supplier.service";

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService, SupplierService],
})
export class OrdersModule {}
