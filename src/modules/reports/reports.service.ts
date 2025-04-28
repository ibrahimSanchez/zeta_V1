import { Injectable } from "@nestjs/common";
import {
  ClientReportQuery,
  DatesReportQuery,
  SupplierReportQuery,
} from "./types/reportTypes";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ReportsService {
  constructor(private readonly prismaService: PrismaService) {}

  //todo: *********************************************************************************
  async clientReport(clientReportQuery: ClientReportQuery) {
    // : Promise<ClientReportResponse>
    const { clicod, endDate, startDate } = clientReportQuery;

    try {
      const foundOrder = await this.prismaService.ordenes.findMany({
        where: {
          clicod,
          ordfec: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          ordcod: true,
          clicod: true,
          ordfec: true,
          ordnumfac: true,
          estcod: true,
          pagocod: true,
          moncod: true,
          ordcos: true,
          ordfecpro: true,
        },
      });

      const foundClient = await this.prismaService.clientes.findUnique({
        where: {
          clicod,
        },
        select: {
          clicodbit: true,
        },
      });

      return { foundOrder, foundClient };
    } catch (error) {}
  }

  //todo: *********************************************************************************
  async supplierReport(supplierReportQuery: SupplierReportQuery) {
    const { provcod, startDate, endDate } = supplierReportQuery;

    try {
      const ordenesProductos =
        await this.prismaService.ordenesproductos.findMany({
          where: { provcod },
          select: {
            ordcod: true,
            provcod: true,
          },
        });

      if (ordenesProductos.length === 0) {
        return [];
      }

      const ordcods = ordenesProductos.map((op) => op.ordcod);

      const ordenes = await this.prismaService.ordenes.findMany({
        where: {
          ordcod: { in: ordcods },
          ordfec: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          ordcod: true,
          clicod: true,
          ordfec: true,
          ordnumfac: true,
          estcod: true,
          pagocod: true,
          moncod: true,
          ordcos: true,
          ordfecpro: true,
        },
      });

      const report = ordenes.map((orden) => {
        const ordenProducto = ordenesProductos.find(
          (op) => op.ordcod === orden.ordcod,
        );

        return {
          ordcod: orden.ordcod,
          provcod: ordenProducto?.provcod ?? null,
          ordfec: orden.ordfec,
          ordfecpro: orden.ordfecpro,
          ordnumfac: orden.ordnumfac,
          estcod: orden.estcod,
          pagocod: orden.pagocod,
          moncod: orden.moncod,
          ordcos: orden.ordcos,
        };
      });

      return report;
    } catch (error) {
      console.error("Error fetching supplier report", error);
      throw new Error("Failed to fetch supplier report");
    }
  }

  //todo: *********************************************************************************
  async brandReport(ordmar: string) {
    try {
      const foundOrders = await this.prismaService.ordenes.findMany({
        where: { ordmar },
        select: {
          ordcod: true,
          ordfec: true,
          ordnumfac: true,
          estcod: true,
          ordfecpro: true,
        },
      });

      if (foundOrders.length === 0) {
        return [];
      }

      const ordcods = foundOrders.map((order) => order.ordcod);

      const foundProducts = await this.prismaService.ordenesproductos.findMany({
        where: {
          ordcod: { in: ordcods },
        },
        select: {
          ordcod: true,
          prodcod: true,
          ordprodcan: true,
          ordprodpre: true,
          ordprodprereal: true,
          provcod: true,
        },
      });

      const report = foundOrders.map((order) => {
        const productos = foundProducts
          .filter((product) => product.ordcod === order.ordcod)
          .map((product) => ({
            prodcod: product.prodcod,
            provcod: product.provcod,
            ordprodcan: product.ordprodcan,
            ordprodpre: product.ordprodpre,
            ordprodprereal: product.ordprodprereal,
          }));

        return {
          ordcod: order.ordcod,
          ordfec: order.ordfec,
          ordfecpro: order.ordfecpro,
          ordnumfac: order.ordnumfac,
          estcod: order.estcod,
          productos,
        };
      });

      return report;
    } catch (error) {
      console.error("Error fetching brand report", error);
      throw new Error("Failed to fetch brand report");
    }
  }

  //todo: *********************************************************************************
  async datesReport(datesReportQuery: DatesReportQuery) {
    const { startDate, endDate } = datesReportQuery;

    try {
      const foundOrders = await this.prismaService.ordenes.findMany({
        where: {
          ordfec: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          ordcod: true,
          clicod: true,
          ordfec: true,
          ordfecpro: true,
          ordnumfac: true,
          estcod: true,
          pagocod: true,
          moncod: true,
          ordcos: true,
        },
      });

      if (foundOrders.length === 0) {
        return [];
      }

      const ordcods = foundOrders.map((order) => order.ordcod);

      const foundProducts = await this.prismaService.ordenesproductos.findMany({
        where: {
          ordcod: { in: ordcods },
        },
        select: {
          ordcod: true,
          prodcod: true,
          provcod: true,
          ordprodcan: true,
          ordprodpre: true,
          ordprodprereal: true,
        },
      });

      const report = foundOrders.map((order) => {
        const productos = foundProducts
          .filter((product) => product.ordcod === order.ordcod)
          .map((product) => ({
            prodcod: product.prodcod,
            provcod: product.provcod,
            ordprodcan: product.ordprodcan,
            ordprodpre: product.ordprodpre,
            ordprodprereal: product.ordprodprereal,
          }));

        return {
          ordcod: order.ordcod,
          clicod: order.clicod,
          ordfec: order.ordfec,
          ordfecpro: order.ordfecpro,
          ordnumfac: order.ordnumfac,
          estcod: order.estcod,
          pagocod: order.pagocod,
          moncod: order.moncod,
          ordcos: order.ordcos,
          productos,
        };
      });

      return report;
    } catch (error) {
      console.error("Error fetching dates report", error);
      throw new Error("Failed to fetch dates report");
    }
  }

  //todo: *********************************************************************************
  async bestSellingProductsReport(datesReportQuery: DatesReportQuery) {
    const { startDate, endDate } = datesReportQuery;

    try {
      const foundOrders = await this.prismaService.ordenes.findMany({
        where: {
          ordfec: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          ordcod: true,
        },
      });

      if (foundOrders.length === 0) {
        return [];
      }

      const ordcods = foundOrders.map((order) => order.ordcod);

      const foundProducts = await this.prismaService.ordenesproductos.findMany({
        where: {
          ordcod: { in: ordcods },
        },
        select: {
          prodcod: true,
          ordprodcan: true,
        },
      });

      if (foundProducts.length === 0) {
        return [];
      }

      const productSalesMap = new Map<string, number>();

      foundProducts.forEach((product) => {
        if (!product.prodcod) return;
        const currentSales = productSalesMap.get(product.prodcod) || 0;
        productSalesMap.set(
          product.prodcod,
          currentSales + (product.ordprodcan || 0),
        );
      });

      const productCodes = Array.from(productSalesMap.keys());

      const productsData = await this.prismaService.productos.findMany({
        where: {
          prodcod: { in: productCodes },
        },
        select: {
          prodcod: true,
          prodnom: true,
        },
      });

      const productNameMap = new Map(
        productsData.map((product) => [product.prodcod, product.prodnom]),
      );

      const sortedProducts = Array.from(productSalesMap.entries())
        .map(([prodcod, totalSold]) => ({
          prodcod,
          prodnom: productNameMap.get(prodcod) || null,
          totalSold,
        }))
        .sort((a, b) => b.totalSold - a.totalSold);

      return sortedProducts;
    } catch (error) {
      console.error("Error fetching best selling products report", error);
      throw new Error("Failed to fetch best selling products report");
    }
  }
}
