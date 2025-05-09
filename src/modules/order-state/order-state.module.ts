import { Module } from "@nestjs/common";
import { OrderStateService } from "./order-state.service";
import { OrderStateController } from "./order-state.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [OrderStateController],
  providers: [OrderStateService, PrismaService],
  exports: [OrderStateService],
})
export class OrderStateModule {}
