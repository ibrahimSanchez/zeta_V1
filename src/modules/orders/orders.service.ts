import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class OrdersService {
  constructor(private prismaService: PrismaService) {}

  async getAllOrders() {
    const allOrders = await this.prismaService.ordenes.findMany({
      select: {
        ordcod: true,
        ordnumfac: true,
        vendcod: true,
        clicod: true,
        ordmon: true,
        ordcos: true,
        ordfecpro: true,
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
        ordmon: order.ordmon || "N/A",
        ordcos: order.ordcos,
        proposal: order.ordfecpro,
      };
    });

    return listOrdersResponse;
  }
}
