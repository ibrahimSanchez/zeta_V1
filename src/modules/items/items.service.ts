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
      const foundItems = await this.prismaService.items.findMany({
        select: {
          itemcod: true,
          itemcom: true,
          itemest: true,
          itemfec: true,
          itemgas: true,
          itemven: true,
          productos: true,
          prodcod: true,
          itemgar: true,
          numserie: true,
        },
      });

      const itemsRes = foundItems.map((i) => ({
        ...i,
        itemfec: this.formatDateRes(i.itemfec),
        itemgar: this.formatDateRes(i.itemgar),
      }));

      return itemsRes;
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
      const foundItem = await this.prismaService.items.findUnique({
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
          itemgar: true,
          numserie: true,
        },
      });

      if (foundItem) {
        return {
          ...foundItem,
          itemfec: this.formatDateRes(foundItem.itemfec),
          itemgar: this.formatDateRes(foundItem.itemgar),
        };
      }

      return foundItem;
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
      const foundItems = await this.prismaService.items.findMany({
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
          itemgar: true,
          numserie: true,
        },
      });

      const itemsRes = foundItems.map((i) => ({
        ...i,
        itemfec: this.formatDateRes(i.itemfec),
        itemgar: this.formatDateRes(i.itemgar),
      }));

      return itemsRes;
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
    const {
      itemcom,
      itemest,
      itemgas,
      itemven,
      prodcod,
      numserie,
      itemgar,
      ordprodcod,
    } = createItemDto;

    try {
      return await this.prismaService.items.create({
        data: {
          itemcom,
          itemest,
          itemgas,
          itemven,
          prodcod,
          numserie,
          ordprodcod,
          itemgar: this.toIsoString(itemgar?.toString()),
        },
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
    const createItemData = createItemDto.map((i) => ({
      ...i,
      itemgar: this.toIsoString(i.itemgar?.toString()),
    }));

    try {
      return await this.prismaService.items.createMany({
        data: createItemData,
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
    const updateItemData = {
      ...updateItemDto,
      itemgar: this.toIsoString(updateItemDto.itemgar?.toString()),
    };

    try {
      const existing = await this.prismaService.items.findUnique({
        where: { itemcod },
      });

      if (!existing) {
        throw new NotFoundException(`Item with itemcod ${itemcod} not found`);
      }

      return await this.prismaService.items.update({
        where: { itemcod },
        data: updateItemData,
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

  formatDateRes(fechaIso: Date | null): string | null {
    if (!fechaIso) return null;
    const date = new Date(fechaIso);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  toIsoString(fecha: string | null | undefined): string | null {
    if (!fecha) return null;
    const [year, month, day] = fecha.split("-");
    const date = new Date(
      Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), 0, 0, 0, 0),
    );
    return date.toISOString();
  }
}
