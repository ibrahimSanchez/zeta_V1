import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class ProductTypeService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    try {
      return await this.prismaService.tipoproductos.findMany();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          "Database error while fetching tipoproductos",
        );
      }

      throw new InternalServerErrorException("Unexpected error occurred");
    }
  }
}
