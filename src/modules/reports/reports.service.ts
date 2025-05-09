import { Injectable, NotFoundException } from "@nestjs/common";
import {
  ClientReportQuery,
  DatesReportQuery,
  SupplierReportQuery,
} from "./types/reportTypes";
import { PrismaService } from "../prisma/prisma.service";
import { OrderStateService } from "../order-state/order-state.service";
import { CurrencyService } from "../currency/currency.service";
import { PaymentMethodService } from "../payment-method/payment-method.service";

@Injectable()
export class ReportsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly orderStateService: OrderStateService,
    private readonly currencyService: CurrencyService,
    private readonly paymentMethodService: PaymentMethodService,
  ) {}

  //todo: *********************************************************************************
  async clientReport(clientReportQuery: ClientReportQuery) {
    const { clicod, startDate, endDate } = clientReportQuery;

    try {
      const foundClient = await this.prismaService.clientes.findUnique({
        where: {
          clicod,
        },
        select: {
          clicodbit: true,
        },
      });

      if (!foundClient) {
        throw new NotFoundException(
          `The client with code ${clicod} cannot be found`,
        );
      }

      const foundOrders = await this.prismaService.ordenes.findMany({
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
          ordfecpro: true,
          ordnumfac: true,
          ordcos: true,
          ordcom: true,
          ordmon: true,

          estcod: true,
          pagocod: true,
          moncod: true,
        },
      });

      if (foundOrders.length === 0) {
        return [];
      }

      const foundStates = await this.orderStateService.findAll();
      const foundCurrencies = await this.currencyService.findAll();
      const foundPaymentMethods = await this.paymentMethodService.findAll();

      const report = foundOrders.map((order) => {
        const { ordcos, ordmon, ordcom, estcod, moncod, pagocod } = order;
        let profitPercentage;
        if (ordcos === null || ordmon === null || ordcom === null) {
          profitPercentage = "N/A";
        } else {
          const g = ordmon - ordcos - ordcom * 100;
          profitPercentage = g / ordmon;
        }

        const state = foundStates.find((s) => s.estcod === estcod);
        const currency = foundCurrencies.find((c) => c.moncod === moncod);
        const paymentMethod = foundPaymentMethods.find(
          (pm) => pm.pagocod === pagocod,
        );

        return {
          ordcod: order.ordcod,
          ordnumfac: order.ordnumfac,
          clicod: order.clicod,
          ordfec: order.ordfec,
          ordfecpro: order.ordfecpro,
          estnom: state?.estnom,
          pagonom: paymentMethod?.pagonom,
          monnom: currency?.monnom,
          clicodbit: foundClient.clicodbit || "N/A",
          ordcos: order.ordcos || 0,
          ordcom: order.ordcom || 0,
          profitPercentage,
        };
      });

      return report;
    } catch (error) {
      console.error("Error fetching client report", error);
      throw new Error("Failed to fetch client report");
    }
  }

  //todo: *********************************************************************************
  async supplierReport(supplierReportQuery: SupplierReportQuery) {
    const { provcod, startDate, endDate } = supplierReportQuery;

    try {
      const providerProducts =
        await this.prismaService.ordenesproductos.findMany({
          where: { provcod },
          select: { ordcod: true },
        });

      const ordcods = [...new Set(providerProducts.map((p) => p.ordcod))];

      if (ordcods.length === 0) {
        return [];
      }

      const foundOrders = await this.prismaService.ordenes.findMany({
        where: {
          ordcod: { in: ordcods },
          ordfec: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          ordcod: true,
          ordfec: true,
          ordfecpro: true,
          ordnumfac: true,
          estcod: true,
          pagocod: true,
          moncod: true,
          ordcos: true,
          ordcom: true,
          ordmon: true,
        },
      });

      if (foundOrders.length === 0) {
        return [];
      }

      const foundStates = await this.orderStateService.findAll();
      const foundCurrencies = await this.currencyService.findAll();
      const foundPaymentMethods = await this.paymentMethodService.findAll();

      const report = foundOrders.map((order) => {
        const { ordcos, ordmon, ordcom, estcod, moncod, pagocod } = order;

        let profitPercentage;
        if (ordcos === null || ordmon === null || ordcom === null) {
          profitPercentage = "N/A";
        } else {
          const g = ordmon - ordcos - ordcom * 100;
          profitPercentage = g / ordmon;
        }
        const state = foundStates.find((s) => s.estcod === estcod);
        const currency = foundCurrencies.find((c) => c.moncod === moncod);
        const paymentMethod = foundPaymentMethods.find(
          (pm) => pm.pagocod === pagocod,
        );

        return {
          ordcod: order.ordcod,
          ordnumfac: order.ordnumfac,
          provcod,
          ordfec: order.ordfec,
          ordfecpro: order.ordfecpro,
          estnom: state?.estnom,
          pagonom: paymentMethod?.pagonom,
          monnom: currency?.monnom,

          ordcos: order.ordcos || 0,
          ordcom: order.ordcom || 0,
          profitPercentage,
        };
      });

      return report;
    } catch (error) {
      console.error("Error fetching provider report", error);
      throw new Error("Failed to fetch provider report");
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

      const foundStates = await this.orderStateService.findAll();

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
        const state = foundStates.find((s) => s.estcod === order.estcod);
        return {
          ordcod: order.ordcod,
          ordfec: order.ordfec,
          ordfecpro: order.ordfecpro,
          ordnumfac: order.ordnumfac,
          estnom: state?.estnom,
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
          ordcom: true,
          ordmon: true,
        },
      });

      if (foundOrders.length === 0) {
        return [];
      }
      const foundStates = await this.orderStateService.findAll();
      const foundCurrencies = await this.currencyService.findAll();
      const foundPaymentMethods = await this.paymentMethodService.findAll();

      const report = foundOrders.map((order) => {
        const { ordcos, ordmon, ordcom, estcod, moncod, pagocod } = order;
 
        let profitPercentage;
        if (ordcos === null || ordmon === null || ordcom === null)
          profitPercentage = "N/A";
        else {
          const g = ordmon - ordcos - ordcom * 100;
          profitPercentage = g / ordmon;
        }
        const state = foundStates.find((s) => s.estcod === estcod);
        const currency = foundCurrencies.find((c) => c.moncod === moncod);
        const paymentMethod = foundPaymentMethods.find(
          (pm) => pm.pagocod === pagocod,
        );

        return {
          ordcod: order.ordcod,
          ordnumfac: order.ordnumfac,

          clicod: order.clicod,
          ordfec: order.ordfec,
          ordfecpro: order.ordfecpro,
          estnom: state?.estnom,
          pagonom: paymentMethod?.pagonom,
          monnom: currency?.monnom,

          ordcos: order.ordcos || 0,
          ordcom: order.ordcom || 0,
          profitPercentage,
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

      if (foundOrders.length === 0) return [];

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

      if (foundProducts.length === 0) return [];

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
          tipprodcod: true,
        },
      });

      const tipcods = Array.from(
        new Set(
          productsData
            .map((p) => p.tipprodcod)
            .filter((cod): cod is string => cod !== null),
        ),
      );

      const tiposData = await this.prismaService.tipoproductos.findMany({
        where: {
          tipprodcod: { in: tipcods },
        },
        select: {
          tipprodcod: true,
          tipprodnom: true,
        },
      });

      const tipoNombreMap = new Map(
        tiposData.map((tipo) => [tipo.tipprodcod, tipo.tipprodnom]),
      );

      const productDataMap = new Map(
        productsData.map((product) => [
          product.prodcod,
          {
            prodnom: product.prodnom,
            tipcod: product.tipprodcod,
            tipnom: product.tipprodcod
              ? tipoNombreMap.get(product.tipprodcod) || null
              : null,
          },
        ]),
      );

      const sortedProducts = Array.from(productSalesMap.entries())
        .map(([prodcod, totalSold]) => {
          const productInfo = productDataMap.get(prodcod) || {
            prodnom: null,
            tipcod: null,
            tipnom: null,
          };

          return {
            prodcod,
            prodnom: productInfo.prodnom,
            tipcod: productInfo.tipcod,
            tipnom: productInfo.tipnom,
            totalSold,
          };
        })
        .sort((a, b) => b.totalSold - a.totalSold);

      return sortedProducts;
    } catch (error) {
      console.error("Error fetching best selling products report", error);
      throw new Error("Failed to fetch best selling products report");
    }
  }
}
