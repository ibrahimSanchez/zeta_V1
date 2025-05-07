import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ordenes, Prisma } from "@prisma/client";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";

@Injectable()
export class OrdersService {
  constructor(private prismaService: PrismaService) {}

  //todo: *********************************************************************************
  async getAllOrders() {
    const allOrders = await this.prismaService.ordenes.findMany({
      take: 100,
      select: {
        ordcod: true,
        ordnumfac: true,
        vendcod: true,
        clicod: true,
        ordmon: true,
        ordcos: true,
        ordfecpro: true,
        ordcom: true,
      },
    });

    const allVendors = await this.prismaService.vendedores.findMany({
      select: {
        vendcod: true,
        vendnom: true,
      },
    });

    const allClients = await this.prismaService.clientes.findMany({
      select: {
        clicod: true,
        clinom: true,
        cliruc: true,
        clirazsoc: true,
      },
    });

    const listOrdersResponse = allOrders.map((order) => {
      const vendor = allVendors.find((v) => v.vendcod === order.vendcod);
      const client = allClients.find((c) => c.clicod === order.clicod);

      return {
        ordcod: order.ordcod,
        ordnumfac: order.ordnumfac,
        vendedor: vendor?.vendnom || "N/A",
        clinom: client?.clinom || "N/A",
        ruc: client?.cliruc || "N/A",
        clirazsoc: client?.clirazsoc || "N/A",
        ordmon: order.ordmon || 0,
        ordcos: order.ordcos || 0,
        ordcom: order.ordcom || 0,
        proposal: order.ordfecpro,
      };
    });

    return listOrdersResponse;
  }

  //todo: *********************************************************************************
  async getOrderByOrdcod(ordcod: number) {
    try {
      const foundOrder = await this.prismaService.ordenes.findUnique({
        where: { ordcod },
        select: {
          ordcod: true,
          ordfec: true,
          ordnumfac: true,
          vendcod: true,
          clicod: true,
          ordfecpro: true,
          ordmon: true,
          ordcos: true,
          ordcom: true,
          ordnuev: true,
          pagocod: true,
        },
      });

      if (!foundOrder) {
        throw new NotFoundException(
          `The order with code ${ordcod} cannot be found`,
        );
      }
      const foundVendor = await this.prismaService.vendedores.findUnique({
        where: { vendcod: foundOrder.vendcod },
        select: {
          vendcod: true,
          vendnom: true,
        },
      });

      let foundClient;
      if (foundOrder.clicod) {
        foundClient = await this.prismaService.clientes.findUnique({
          where: { clicod: foundOrder.clicod },
          select: {
            clicod: true,
            clinom: true,
            cliruc: true,
            clirazsoc: true,
            clidir: true,
          },
        });
      } else foundClient = null;
      const foundOrderProducts =
        await this.prismaService.ordenesproductos.findMany({
          where: { ordcod },
          select: {
            prodcod: true,
            prodcost: true,
          },
        });

      const prodcods = [...new Set(foundOrderProducts.map((p) => p.prodcod))];

      if (prodcods.length === 0) {
        return [];
      }

      const products = await this.prismaService.productos.findMany({
        where: {
          prodcod: { in: prodcods },
        },
        select: {
          prodcod: true,
          prodnom: true,
          tipprodcod: true,
          parentproductid: true,
        },
      });

      const costMap = new Map(
        foundOrderProducts.map((p) => [p.prodcod, p.prodcost]),
      );

      const productsWithCost = products.map((product) => ({
        ...product,
        prodcost: costMap.get(product.prodcod) || 0,
      }));

      // return productsWithCost;

      const OrderResponse = {
        ordcod: foundOrder.ordcod,
        ordfec: foundOrder.ordfec,
        ordnumfac: foundOrder.ordnumfac,
        vendcod: foundOrder.vendcod || "N/A",
        vendnom: foundVendor?.vendnom || "N/A",
        clicod: foundOrder.clicod || "N/A",
        clinom: foundClient.clinom || "N/A",
        cliruc: foundClient.cliruc || "N/A",
        clirazsoc: foundClient.clirazsoc || "N/A",
        clidir: foundClient.clidir || "N/A",
        ordcom: foundOrder.ordcom || 0,
        ordfecpro: foundOrder.ordfecpro,
        ordmon: foundOrder.ordmon || 0,
        ordcos: foundOrder.ordcos || 0,
        ordnuev: foundOrder.ordnuev,
        products: productsWithCost,
        productCant: prodcods.length,
      };

      return OrderResponse;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(error);
        throw new BadRequestException("Invalid order code format");
      }

      throw new InternalServerErrorException(
        "An unexpected error occurred while fetching order information",
      );
    }
  }

  //todo: *********************************************************************************
  async createOrder(createOrderDto: CreateOrderDto) {
    const {
      ordcod,
      ordfec,
      ordnumfac,
      vendcod,
      clicod,
      ordfecpro,
      ordmon,
      ordcos,
      ordcom,
      pagocod,
      clidir,
      estcod,
      orderProduct,
    } = createOrderDto;

    try {
      await this.prismaService.ordenes.create({
        data: {
          ordcod,
          vendcod,
          clidir,
          ordfec,
          ordfecpro,
          estcod,
          ordnumfac,
          clicod,
          ordmon,
          ordcos,
          ordcom,
          pagocod,
          ordnuev: "V1",
        },
      });

      const dataToInsert = orderProduct.map((product) => ({
        ordcod,
        ordprodcod: product.ordprodcod,
        prodcod: product.prodcod,
        provcod: product.provcod,
        ordprodcon: product.ordprodcon,
        ordprodcan: product.ordprodcan,
        ordprodpre: product.prodcost,
        ordprodlle: false,
        prodcost: product.prodcost,
      }));

      await this.prismaService.ordenesproductos.createMany({
        data: dataToInsert,
        skipDuplicates: true,
      });

      return createOrderDto;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException("order already exists");
        }
        throw new BadRequestException("Invalid order data");
      }
      throw new InternalServerErrorException("Failed to create order");
    }
  }

  //todo: *********************************************************************************
  async updateOrder(
    ordcod: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<ordenes> {
    const {
      ordfec,
      ordnumfac,
      vendcod,
      clicod,
      ordfecpro,
      ordmon,
      ordcos,
      ordcom,
      pagocod,
      clidir,
      estcod,
      orderProduct,
    } = updateOrderDto;

    try {
      const updatedOrder = await this.prismaService.ordenes.update({
        where: { ordcod },
        data: {
          ordfec,
          ordnumfac,
          vendcod,
          clicod,
          ordfecpro,
          ordmon,
          ordcos,
          ordcom,
          pagocod,
          clidir,
          estcod,
        },
      });

      if (orderProduct && orderProduct.length > 0) {
        await this.prismaService.ordenesproductos.deleteMany({
          where: { ordcod },
        });

        const dataToInsert = orderProduct.map((product) => ({
          ordcod,
          ordprodcod: product.ordprodcod,
          prodcod: product.prodcod,
          provcod: product.provcod,
          ordprodcon: product.ordprodcon,
          ordprodcan: product.ordprodcan,
          ordprodpre: product.prodcost,
          ordprodlle: false,
          prodcost: product.prodcost,
        }));

        await this.prismaService.ordenesproductos.createMany({
          data: dataToInsert,
          skipDuplicates: true,
        });
      }

      return updatedOrder;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundException(`Order with code ${ordcod} not found`);
        }
        throw new BadRequestException("Invalid order data");
      }
      throw new InternalServerErrorException("Failed to update order");
    }
  }

  //todo: *********************************************************************************
  async deleteOrders(ordcods: number[]) {
    try {
      const deleted = await this.prismaService.ordenes.deleteMany({
        where: { ordcod: { in: ordcods } },
      });

      if (deleted.count === 0) {
        throw new NotFoundException(`No orders found with the given codes`);
      }

      return {
        message: `Deleted ${deleted.count} order(s) successfully.`,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          "Database error while deleting order(s)",
        );
      }

      throw new InternalServerErrorException("Failed to delete order(s)");
    }
  }
}
