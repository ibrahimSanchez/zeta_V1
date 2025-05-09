import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class OrderStateService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    try {
      return await this.prismaService.estados.findMany({
        select: {
          estcod: true,
          estnom: true,
        },
      });
    } catch (error) {
      throw new Error("Failed to fetch order-states");
    }
  }

  async findOne(estcod: number) {
    try {
      return await this.prismaService.estados.findUnique({
        where: { estcod },
        select: {
          estcod: true,
          estnom: true,
        },
      });
    } catch (error) {
      throw new Error("Failed to fetch order-state");
    }
  }
}
