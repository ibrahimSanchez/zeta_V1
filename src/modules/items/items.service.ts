import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateItemDto } from "./dto/create-item.dto";
import { UpdateItemDto } from "./dto/update-item.dto";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ItemsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    try {
      return await this.prismaService.items.findMany({
        select: {
          itemcod: true,
          itemcom: true,
          itemest: true,
          itemfec: true,
          itemgas: true,
          itemven: true,
          productos: true,
          prodcod: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          "Database error while fetching items",
        );
      }

      throw new InternalServerErrorException("Unexpected error occurred");
    }
  }

  async findOne(itemcod: number) {
    try {
      return await this.prismaService.items.findUnique({
        where: { itemcod },
        select: {
          itemcod: true,
          itemcom: true,
          itemest: true,
          itemfec: true,
          itemgas: true,
          itemven: true,
          productos: true,
          prodcod: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          "Database error while fetching items",
        );
      }

      throw new InternalServerErrorException("Unexpected error occurred");
    }
  }

  async findItemByProdcod(prodcod: string) {
    try {
      return await this.prismaService.items.findMany({
        where: { prodcod },
        select: {
          itemcod: true,
          itemcom: true,
          itemest: true,
          itemfec: true,
          itemgas: true,
          itemven: true,
          productos: true,
          prodcod: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          "Database error while fetching items",
        );
      }

      throw new InternalServerErrorException("Unexpected error occurred");
    }
  }

  async create(createItemDto: CreateItemDto) {
    const { itemcom, itemest, itemgas, itemven, prodcod } = createItemDto;

    try {
      return await this.prismaService.items.create({
        data: { itemcom, itemest, itemgas, itemven, prodcod },
      });
    } catch (error) {
      if (error.code === "P2003") {
        throw new BadRequestException("Invalid product code");
      }
      console.error("Create item error:", error);
      throw new InternalServerErrorException(
        "An error occurred while creating the item",
      );
    }
  }

  async createMany(createItemDto: CreateItemDto[]) {
    try {
      return await this.prismaService.items.createMany({
        data: createItemDto,
      });
    } catch (error) {
      if (error.code === "P2003") {
        throw new BadRequestException(
          "One or more items have invalid product codes",
        );
      }
      console.error("Create many items error:", error);
      throw new InternalServerErrorException(
        "An error occurred while creating the items",
      );
    }
  }

  async update(itemcod: number, updateItemDto: UpdateItemDto) {
    try {
      const existing = await this.prismaService.items.findUnique({
        where: { itemcod },
      });

      if (!existing) {
        throw new NotFoundException(`Item with itemcod ${itemcod} not found`);
      }

      return await this.prismaService.items.update({
        where: { itemcod },
        data: updateItemDto,
      });
    } catch (error) {
      if (error.code === "P2003") {
        throw new BadRequestException("Invalid product code");
      }
      console.error("Update item error:", error);
      throw new InternalServerErrorException(
        "An error occurred while updating the item",
      );
    }
  }

  async remove(itemcod: number) {
    try {
      const existing = await this.prismaService.items.findUnique({
        where: { itemcod },
      });

      if (!existing) {
        throw new NotFoundException(`Item with itemcod ${itemcod} not found`);
      }

      return await this.prismaService.items.delete({
        where: { itemcod },
      });
    } catch (error) {
      console.error("Delete item error:", error);
      throw new InternalServerErrorException(
        "An error occurred while deleting the item",
      );
    }
  }
}
