import { PrismaService } from "src/modules/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { CreateOrdersProductDto } from "./dto/create-orders-product.dto";
import { UpdateOrdersProductDto } from "./dto/update-orders-product.dto";

@Injectable()
export class OrdersProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createOrdersProductDto: CreateOrdersProductDto) {
    const res = await this.prismaService.ordenesproductos.create({
      data: createOrdersProductDto,
    });
    return res;
  }

  async createMany(createOrdersProductDto: CreateOrdersProductDto[]) {
    const res = await this.prismaService.ordenesproductos.createMany({
      data: createOrdersProductDto,
    });
    return res;
  }

  findAll() {
    return `This action returns all ordersProducts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ordersProduct`;
  }

  update(id: number, updateOrdersProductDto: UpdateOrdersProductDto) {
    return `This action updates a #${id} ordersProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} ordersProduct`;
  }
}
