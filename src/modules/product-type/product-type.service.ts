import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, tipoproductos } from "@prisma/client";
import { CreateProductTypeDto } from "./dto/create-product-type.dto";
import { UpdateProductTypeDto } from "./dto/update-product-type.dto";

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

  //todo: *********************************************************************************
  async createProductType(
    CreateProductTypeDto: CreateProductTypeDto,
  ): Promise<tipoproductos> {
    const { tipprodcod, tipprodgru, tipprodimp, tipprodnom } =
      CreateProductTypeDto;

    try {
      if (!tipprodnom || tipprodnom.trim().length === 0) {
        throw new BadRequestException("Product type name cannot be empty");
      }

      if (tipprodnom.length > 50) {
        throw new BadRequestException(
          "Product type name exceeds maximum length of 50 characters",
        );
      }
      return this.prismaService.tipoproductos.create({
        data: {
          tipprodcod,
          tipprodgru,
          tipprodimp,
          tipprodnom,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException("Product type already exists");
        }
        throw new BadRequestException("Invalid product type data");
      }
      throw new InternalServerErrorException("Failed to create product type");
    }
  }

  //todo: *********************************************************************************
  async updateSupplier(
    tipprodcod: string,
    updateProductTypeDto: UpdateProductTypeDto,
  ): Promise<tipoproductos> {
    try {
      return await this.prismaService.tipoproductos.update({
        where: { tipprodcod },
        data: updateProductTypeDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundException(
            `Product type with code ${tipprodcod} not found`,
          );
        }
        throw new BadRequestException("Invalid product type data");
      }
      throw new InternalServerErrorException("Failed to update product type");
    }
  }

  async findProductTypeByTipprodcod(tipprodcod: string) {
    try {
      return await this.prismaService.tipoproductos.findUnique({
        where: { tipprodcod },
      });
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
