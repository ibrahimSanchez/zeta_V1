import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PaymentMethodService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    try {
      return await this.prismaService.pagos.findMany({
        select: {
          pagocod: true,
          pagonom: true,
        },
      });
    } catch (error) {
      throw new Error("Failed to fetch currency");
    }
  }

  async findOne(pagocod: number) {
    try {
      return await this.prismaService.pagos.findUnique({
        where: {
          pagocod,
        },
        select: {
          pagocod: true,
          pagonom: true,
        },
      });
    } catch (error) {
      throw new Error("Failed to fetch currency");
    }
  }
}
