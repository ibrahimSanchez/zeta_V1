import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { PrismaService } from "../prisma/prisma.service";
import { SupplierService } from "../supplier/supplier.service";
import { CurrencyService } from "../currency/currency.service";
import { PaymentMethodService } from "../payment-method/payment-method.service";
import { ClientService } from "../client/client.service";
import { MinioService } from "../minio/minio.service";

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    PrismaService,
    SupplierService,
    CurrencyService,
    PaymentMethodService,
    ClientService,
    MinioService,
  ],
})
export class OrdersModule {}
