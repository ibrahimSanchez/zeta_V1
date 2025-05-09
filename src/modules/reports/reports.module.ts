import { Module } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { ReportsController } from "./reports.controller";
import { PrismaService } from "../prisma/prisma.service";
import { OrderStateService } from "../order-state/order-state.service";
import { CurrencyService } from "../currency/currency.service";
import { PaymentMethodService } from "../payment-method/payment-method.service";

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, PrismaService, OrderStateService, CurrencyService, PaymentMethodService],
})
export class ReportsModule {}
