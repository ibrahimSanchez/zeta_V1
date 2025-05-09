import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CurrencyService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    try {
      return await this.prismaService.monedas.findMany({
        select: {
          moncod: true,
          monnom: true,
        },
      });
    } catch (error) {
      throw new Error("Failed to fetch currency");
    }
  }

  async findOne(moncod: number) {
    try {
      return await this.prismaService.monedas.findUnique({
        where: {
          moncod,
        },
        select: {
          moncod: true,
          monnom: true,
        },
      });
    } catch (error) {
      throw new Error("Failed to fetch currency");
    }
  }
}
