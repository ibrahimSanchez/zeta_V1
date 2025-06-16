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
import { SwaggerProfitMarginPerProduct } from "./dto/report.dto";

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
    // console.log("clientReportQuery", clientReportQuery);
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
        orderBy: { ordfec: "desc" },
        where: {
          clicod,
          ordfec: {
            gte: this.toIsoString(startDate.toString()) || undefined,
            lte: this.toIsoString(endDate.toString()) || undefined,
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
        let profitPercentage, commission;
        if (ordcos === null || ordmon === null || ordcom === null) {
          profitPercentage = "N/A";
          commission = "N/A";
        } else {
          profitPercentage = this.calProfitPercentage(
            ordmon,
            ordcos,
          ).profitPercentage;
          commission = this.calProfitPercentage(ordmon, ordcos).commission;
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
          ordfec: this.formatDateRes(order.ordfec),
          ordfecpro: this.formatDateRes(order.ordfecpro),
          estnom: state?.estnom,
          pagonom: paymentMethod?.pagonom,
          monnom: currency?.monnom,
          clicodbit: foundClient.clicodbit || "N/A",
          ordmon: order.ordmon || 0,
          ordcos: order.ordcos || 0,
          ordcom: order.ordcom || 0,
          profitPercentage,
          // commission,
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
        orderBy: { ordfec: "desc" },
        where: {
          ordcod: { in: ordcods },
          ordfec: {
            gte: this.toIsoString(startDate.toString()) || undefined,
            lte: this.toIsoString(endDate.toString()) || undefined,
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

        let profitPercentage, commission;
        if (ordcos === null || ordmon === null || ordcom === null) {
          profitPercentage = "N/A";
          commission = "N/A";
        } else {
          profitPercentage = this.calProfitPercentage(
            ordmon,
            ordcos,
          ).profitPercentage;
          commission = this.calProfitPercentage(ordmon, ordcos).commission;
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
          ordfec: this.formatDateRes(order.ordfec),
          ordfecpro: this.formatDateRes(order.ordfecpro),
          estnom: state?.estnom,
          pagonom: paymentMethod?.pagonom,
          monnom: currency?.monnom,
          ordmon: order.ordmon || 0,
          ordcos: order.ordcos || 0,
          ordcom: order.ordcom || 0,
          profitPercentage,
          // commission,
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
        orderBy: { ordfec: "desc" },
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
          ordfec: this.formatDateRes(order.ordfec),
          ordfecpro: this.formatDateRes(order.ordfecpro),
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
        // take: 1000,
        where: {
          // ordcos: {
          //   not: null,
          // },
          // ordmon: {
          //   not: null,
          // },
          ordfec: {
            gte: this.toIsoString(startDate.toString()) || undefined,
            lte: this.toIsoString(endDate.toString()) || undefined,
          },
        },
        orderBy: { ordfec: "desc" },
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
      // console.log("foundOrders", foundOrders);
      const foundStates = await this.orderStateService.findAll();
      const foundCurrencies = await this.currencyService.findAll();
      const foundPaymentMethods = await this.paymentMethodService.findAll();

      const report = foundOrders.map((order) => {
        const { ordcos, ordmon, ordcom, estcod, moncod, pagocod } = order;

        let profitPercentage, commission;
        if (ordcos === null || ordmon === null || ordcom === null) {
          profitPercentage = "N/A";
          commission = "N/A";
        } else {
          profitPercentage = this.calProfitPercentage(
            ordmon,
            ordcos,
          ).profitPercentage;
          commission = this.calProfitPercentage(ordmon, ordcos).commission;
        }
        const state = foundStates.find((s) => s.estcod === estcod);
        const currency = foundCurrencies.find((c) => c.moncod === moncod);
        const paymentMethod = foundPaymentMethods.find(
          (pm) => pm.pagocod === pagocod,
        );
        // console.log("order", order);
        return {
          ordcod: order.ordcod,
          ordnumfac: order.ordnumfac,

          clicod: order.clicod,
          ordfec: this.formatDateRes(order.ordfec),
          ordfecpro: this.formatDateRes(order.ordfecpro),
          estnom: state?.estnom,
          pagonom: paymentMethod?.pagonom,
          monnom: currency?.monnom,
          ordmon: order.ordmon || 0,
          ordcos: order.ordcos || 0,
          ordcom: order.ordcom || 0,
          profitPercentage,
          // commission,
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
            gte: this.toIsoString(startDate.toString()) || undefined,
            lte: this.toIsoString(endDate.toString()) || undefined,
          },
        },
        orderBy: { ordfec: "desc" },
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

  async profitMarginPerProduct(
    datesReportQuery: SwaggerProfitMarginPerProduct,
  ) {
    const { startDate, endDate } = datesReportQuery;

    const foundOrders = await this.prismaService.ordenes.findMany({
      // take: 100,
      where: {
        ordfec: {
          gte: this.toIsoString(startDate.toString()) || undefined,
          lte: this.toIsoString(endDate.toString()) || undefined,
        },
      },
      orderBy: { ordfec: "desc" },
      select: {
        ordcod: true,
        ordfec: true,
      },
    });

    const orderCodes = foundOrders.map((order) => order.ordcod);

    if (orderCodes.length === 0) {
      return [];
    }

    const ordersProducts = await this.prismaService.ordenesproductos.findMany({
      where: {
        ordcod: { in: orderCodes },
      },
      select: {
        ordcod: true,
        prodcod: true,
        prodcost: true,
        prodvent: true,
        provcod: true,
      },
    });

    if (ordersProducts.length === 0) {
      return [];
    }

    const productsCodes = Array.from(
      new Set(ordersProducts.map((op) => op.prodcod)),
    );

    const suppliersCodes = Array.from(
      new Set(ordersProducts.map((op) => op.provcod)),
    );

    const [products, suppliers] = await Promise.all([
      this.prismaService.productos.findMany({
        where: {
          prodcod: { in: productsCodes },
        },
        select: {
          prodcod: true,
          prodnom: true,
        },
      }),
      this.prismaService.proveedores.findMany({
        where: {
          provcod: { in: suppliersCodes },
        },
        select: {
          provcod: true,
          provnom: true,
        },
      }),
    ]);

    const productMap = Object.fromEntries(
      products.map((p) => [p.prodcod, p.prodnom]),
    );

    const supplierMap = Object.fromEntries(
      suppliers.map((s) => [s.provcod, s.provnom]),
    );

    const ordersDateMap = Object.fromEntries(
      foundOrders.map((o) => [o.ordcod, o.ordfec]),
    );

    const report = ordersProducts.map((op, index) => ({
      code: index + 1,
      prodnom: productMap[op.prodcod] ?? "N/A",
      ordcod: op.ordcod,
      prodcod: op.prodcod,
      prodcost: op.prodcost,
      prodvent: op.prodvent,
      provcod: op.provcod,
      provnom: supplierMap[op.provcod] ?? "N/A",
      date: this.formatDateRes(ordersDateMap[op.ordcod]),
      profitMargin: this.calProfitPercentage(op.prodvent, op.prodcost)
        .profitPercentage,
      commission: this.calProfitPercentage(op.prodvent, op.prodcost).commission,
    }));

    return report;
  }

  async itemsInDateRange(datesReportQuery: DatesReportQuery) {
    const { startDate, endDate } = datesReportQuery;

    try {
      const foundItems = await this.prismaService.items.findMany({
        where: {
          itemfec: {
            gte: this.toIsoString(startDate.toString()) || undefined,
            lte: this.toIsoString(endDate.toString()) || undefined,
          },
        },
        select: {
          numserie: true,
          prodcod: true,
          itemfec: true,
          itemgar: true,
          itemest: true,
          ordprodcod: true,
        },
      });

      const prodcods = [...new Set(foundItems.map((item) => item.prodcod))];

      const ordenes = await this.prismaService.ordenesproductos.findMany({
        where: {
          prodcod: { in: prodcods },
        },
        select: {
          prodcod: true,
          ordcod: true,
        },
      });

      const ordMap = new Map<string, number>();
      ordenes.forEach((o) => {
        if (
          o.ordcod !== null &&
          o.ordcod !== undefined &&
          o.prodcod !== null &&
          o.prodcod !== undefined
        ) {
          if (!ordMap.has(o.prodcod)) {
            ordMap.set(o.prodcod, o.ordcod);
          }
        }
      });

      const report = foundItems.map((item) => ({
        ...item,
        itemgar: this.formatDateRes(item.itemgar),
        itemfec: this.formatDateRes(item.itemfec),
        ordcod: ordMap.get(item.prodcod) ?? null,
        itemest: item.itemest,
      }));

      return report;
    } catch (error) {
      console.error("Error fetching report", error);
      throw new Error("Failed to fetch report");
    }
  }

  calProfitPercentage(ordmon: number | null, ordcos: number | null) {
    if (!ordmon || !ordcos) return { profitPercentage: null, commission: null };

    // console.log(ordmon, ordcos);
    const mon: number = ordmon - ordcos;
    const profitPercentage: number = (mon / ordcos) * 100;

    const commission: number = mon * 0.1;
    return { profitPercentage, commission };
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
    return new Date(fecha).toISOString();
  }
}
