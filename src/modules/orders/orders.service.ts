import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ordenes, Prisma } from "@prisma/client";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { SupplierService } from "../supplier/supplier.service";
import { PaymentMethodService } from "../payment-method/payment-method.service";
import { CurrencyService } from "../currency/currency.service";
import { ClientService } from "../client/client.service";
import { Logger } from "@nestjs/common";

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  constructor(
    private prismaService: PrismaService,
    private readonly supplierService: SupplierService,
    private readonly currencyService: CurrencyService,
    private readonly paymentMethodService: PaymentMethodService,
    private readonly clientService: ClientService,
  ) {}

  //todo: *********************************************************************************
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

      const { ordcos, ordmon, ordcom } = order;
      let profitPercentage;
      if (ordcos === null || ordmon === null || ordcom === null) {
        profitPercentage = "N/A";
      } else {
        const g = ordmon - ordcos;
        profitPercentage = (g / ordcos) * 100;
      }
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
        proposal: this.formatDateRes(order.ordfecpro),
        profitPercentage,
      };
    });

    // console.log(listOrdersResponse)
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
          ordobs: true,
          moncod: true,
          estcod: true,
        },
      });

      if (!foundOrder) {
        throw new NotFoundException(
          `The order with code ${ordcod} cannot be found`,
        );
      }

      let state;
      if (foundOrder.estcod) {
        const foundState = await this.prismaService.estados.findFirst({
          where: {
            estcod: foundOrder.estcod,
          },
          select: {
            estnom: true,
          },
        });
        state = foundState?.estnom;
      } else state = "N/A";

      const foundVendor = await this.prismaService.vendedores.findUnique({
        where: { vendcod: foundOrder.vendcod },
        select: {
          vendcod: true,
          vendnom: true,
        },
      });

      const foundSuppliers = await this.supplierService.getAllSupplier();

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
            prodvent: true,
            ordprodcan: true,
            provcod: true,
            prodgast: true,
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
          items: {
            select: {
              numserie: true,
              itemcod: true,
              itemcom: true,
              itemest: true,
              itemfec: true,
              itemgar: true,
              itemgas: true,
              itemven: true,
            },
          },
        },
      });

      const foundProductTypes =
        await this.prismaService.tipoproductos.findMany();

      const prodMap = new Map<
        string,
        {
          prodvent: number;
          prodcost: number;
          ordprodcan: number;
          provcod: string | null;
          prodgast: number;
        }
      >();
      foundOrderProducts.forEach((p) => {
        prodMap.set(p.prodcod, {
          prodvent: p.prodvent || 0,
          prodcost: p.prodcost || 0,
          ordprodcan: p.ordprodcan || 0,
          provcod: p.provcod || null,
          prodgast: p.prodgast || 0,
        });
      });

      const tipoMap = new Map<string, string>();
      foundProductTypes.forEach((tipo) => {
        tipoMap.set(tipo.tipprodcod, tipo.tipprodnom || "N/A");
      });

      const productsWithCost = products.map((product) => ({
        ...product,
        items: product.items.map((item) => ({
          ...item,
          itemfec: this.formatDateRes(item.itemfec),
          itemgar: this.formatDateRes(item.itemgar),
        })),
        prodvent: prodMap.get(product.prodcod)?.prodvent || 0,
        prodgast: prodMap.get(product.prodcod)?.prodgast || 0,
        prodcost: prodMap.get(product.prodcod)?.prodcost || 0,
        ordprodcan: prodMap.get(product.prodcod)?.ordprodcan || 0,
        tipprodnom: tipoMap.get(product.tipprodcod ?? "") || "N/A",
        provnom:
          foundSuppliers.find(
            (s) => s.provcod === prodMap.get(product.prodcod)?.provcod,
          )?.provnom || "N/A",
        provcod:
          foundSuppliers.find(
            (s) => s.provcod === prodMap.get(product.prodcod)?.provcod,
          )?.provcod || null,
      }));

      let foundCurrencies;
      if (foundOrder.moncod)
        foundCurrencies = await this.currencyService.findOne(foundOrder.moncod);

      let foundPaymentMethods;
      if (foundOrder.pagocod)
        foundPaymentMethods = await this.paymentMethodService.findOne(
          foundOrder.pagocod,
        );
      // return productsWithCost;

      const OrderResponse = {
        ordcod: foundOrder.ordcod,
        ordfec: foundOrder.ordfec,
        pagocod: foundOrder.pagocod,
        pagonom: foundPaymentMethods?.pagonom || null,
        moncod: foundOrder.moncod,
        monnom: foundCurrencies?.monnom || null,
        estcod: foundOrder.estcod,
        estnom: state,
        ordnumfac: foundOrder.ordnumfac,
        ordobs: foundOrder.ordobs || "N/A",
        vendcod: foundOrder.vendcod || "N/A",
        vendnom: foundVendor?.vendnom || "N/A",
        clicod: foundOrder.clicod || "N/A",
        clinom: foundClient.clinom || "N/A",
        cliruc: foundClient.cliruc || "N/A",
        clirazsoc: foundClient.clirazsoc || "N/A",
        clidir: foundClient.clidir || "N/A",
        ordcom: foundOrder.ordcom || 0,
        ordfecpro: this.formatDateRes(foundOrder.ordfecpro),
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
      ordfec,
      ordfecpro,
      ordnumfac,
      vendcod,
      clicod,
      ordcom,
      ordmon,
      ordcos,
      ordnuev,
      pagocod,
      estcod,
      moncod,
      ordobs,
      orderProduct,
    } = createOrderDto;

    try {
      const foundClient = await this.clientService.getClientByClicod(
        clicod || "",
      );

      // Obtener último ordcod
      const lastOrder = await this.prismaService.ordenes.findFirst({
        orderBy: { ordcod: "desc" },
        select: { ordcod: true },
      });

      const nextOrdcod = lastOrder?.ordcod ? lastOrder.ordcod + 1 : 1;

      // Preparar datos de la orden
      const orderData = {
        ordcod: nextOrdcod,
        ordfec: ordfec ? this.toIsoString(ordfec.toString()) : null,
        ordfecpro: ordfecpro ? this.toIsoString(ordfecpro.toString()) : null,
        ordnumfac,
        vendcod,
        clicod,
        ordcom,
        ordmon,
        estcod,
        moncod,
        ordcos,
        pagocod,
        ordnuev,
        ordobs,
        ordins: false,
        ordent: false,
        ordace: false,
        ordretcli: false,
        ordretdec: false,
        ordentven: false,
        ordinstec: false,
        ordrev: false,
        clidir: foundClient.clidir || "",
      };

      // Obtener último ordprodcod
      const lastOrderProdCod =
        await this.prismaService.ordenesproductos.findFirst({
          orderBy: { ordprodcod: "desc" },
          select: { ordprodcod: true },
        });

      const nextProdOrdCod = lastOrderProdCod?.ordprodcod
        ? lastOrderProdCod.ordprodcod + 1
        : 1;

      // Preparar productos
      const productsToCreate = orderProduct.map((product, index) => ({
        ordcod: nextOrdcod,
        ordprodcod: nextProdOrdCod + index,
        prodcod: product.prodcod,
        prodcost: product.prodcost,
        prodvent: product.prodvent,
        ordprodcan: product.ordprodcan,
        provcod: product.provcod,
        ordprodlle: false,
        prodgast: product.prodgast,
      }));

      // Extraer ítems de los productos
      const itemsToCreate = orderProduct.flatMap((product) => {
        if (product.items?.length) {
          return product.items.map((item) => ({
            itemcom: item.itemcom,
            itemest: item.itemest,
            itemgas: item.itemgas,
            itemven: item.itemven,
            prodcod: product.prodcod,
            numserie: item.numserie,
            itemgar: item.itemgar
              ? this.toIsoString(item.itemgar.toString())
              : null,
          }));
        }
        return [];
      });

      // Ejecutar transacción en pasos
      let createdOrder;

      // Extrae productos únicos de orderProduct para insertar en tabla productos
      const baseProductsToCreate = orderProduct.map((product) => ({
        prodcod: product.prodcod,
        prodnom: "Nombre temporal", // Ajusta según tu lógica
        tipprodcod: null,
        parentproductid: null,
      }));

      await this.prismaService.$transaction(async (tx) => {
        createdOrder = await tx.ordenes.create({ data: orderData });

        // Asegúrate que los productos base existan en la tabla productos
        await tx.productos.createMany({
          data: baseProductsToCreate,
          skipDuplicates: true, // Evita errores si ya existen
        });

        await tx.ordenesproductos.createMany({
          data: productsToCreate,
          skipDuplicates: true,
        });

        if (itemsToCreate.length > 0) {
          await tx.items.createMany({
            data: itemsToCreate,
            skipDuplicates: true,
          });
        }
      });

      // Retornar respuesta al cliente
      return {
        ...createdOrder,
        products: productsToCreate,
        items: itemsToCreate, // opcional, si deseas incluirlos
      };
    } catch (error) {
      // console.log(error)
      this.logger.error("Error al crear la orden:", error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException("La orden ya existe en la base de datos");
        }
        throw new BadRequestException("Datos de orden inválidos");
      }

      if (error?.status && error?.response) {
        throw error;
      }

      throw new InternalServerErrorException("Error al procesar la orden");
    }
  }

  //todo: *********************************************************************************
  async updateOrder(
    ordcod: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<any> {
    const {
      ordfec,
      ordfecpro,
      ordnumfac,
      vendcod,
      clicod,
      ordcom,
      ordmon,
      ordcos,
      ordnuev,
      pagocod,
      estcod,
      moncod,
      ordobs,
      clidir,
      orderProduct,
    } = updateOrderDto;

    try {
      const existingOrder = await this.prismaService.ordenes.findUnique({
        where: { ordcod },
      });

      if (!existingOrder) {
        throw new NotFoundException(`Order with code ${ordcod} not found`);
      }

      const lastOrderProdCod =
        await this.prismaService.ordenesproductos.findFirst({
          orderBy: { ordprodcod: "desc" },
          select: { ordprodcod: true },
        });

      const nextProdOrdCod = lastOrderProdCod?.ordprodcod
        ? lastOrderProdCod.ordprodcod + 1
        : 1;

      const safeOrderProduct = orderProduct ?? []; // ✅ manejo seguro

      const productsToInsert = safeOrderProduct.map((product, index) => ({
        ordcod,
        ordprodcod: nextProdOrdCod + index,
        prodcod: product.prodcod,
        provcod: product.provcod,
        ordprodcan: product.ordprodcan,
        ordprodlle: false,
        prodcost: product.prodcost,
        prodvent: product.prodvent,
        prodgast: product.prodgast,
      }));

      const itemsToInsert = safeOrderProduct.flatMap(
        (product) =>
          product.items?.map((item) => ({
            itemcom: item.itemcom,
            numserie: item.numserie,
            itemest: item.itemest,
            itemgas: item.itemgas,
            itemven: item.itemven,
            itemgar: this.toIsoString(item.itemgar?.toString()) || null,
            prodcod: product.prodcod,
          })) ?? [],
      );

      const baseProductsToCreate = safeOrderProduct.map((product) => ({
        prodcod: product.prodcod,
        prodnom: "Nombre temporal",
        tipprodcod: null,
        parentproductid: null,
      }));

      const result = await this.prismaService.$transaction(async (tx) => {
        const updatedOrder = await tx.ordenes.update({
          where: { ordcod },
          data: {
            ordfec: this.toIsoString(ordfec?.toString()),
            ordfecpro,
            ordnumfac,
            vendcod,
            clicod,
            ordcom,
            ordmon,
            ordcos,
            ordnuev,
            pagocod,
            estcod,
            moncod,
            ordobs,
            clidir,
          },
        });

        // Asegurar productos base en la tabla "productos"
        await tx.productos.createMany({
          data: baseProductsToCreate,
          skipDuplicates: true,
        });

        // Eliminar productos y ítems anteriores
        await tx.ordenesproductos.deleteMany({ where: { ordcod } });
        await tx.items.deleteMany({
          where: {
            prodcod: {
              in: safeOrderProduct.map((p) => p.prodcod),
            },
          },
        });

        // Insertar productos nuevos
        await tx.ordenesproductos.createMany({
          data: productsToInsert,
          skipDuplicates: true,
        });

        // Insertar ítems nuevos
        if (itemsToInsert.length > 0) {
          await tx.items.createMany({
            data: itemsToInsert,
            skipDuplicates: true,
          });
        }

        return updatedOrder;
      });

      return {
        ...result,
        products: productsToInsert,
        items: itemsToInsert,
      };
    } catch (error) {
      console.log(error);
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
  async deleteOrders(params: { codes: number[] }) {
    try {
      const { codes } = params;

      // Usar una transacción para eliminar en ambas tablas
      const result = await this.prismaService.$transaction([
        // 1. Primero eliminar los productos relacionados
        this.prismaService.ordenesproductos.deleteMany({
          where: { ordcod: { in: codes } },
        }),
        // 2. Luego eliminar las órdenes
        this.prismaService.ordenes.deleteMany({
          where: { ordcod: { in: codes } },
        }),

        // Obtener los prodcods para la eliminación posterior (esta operación forma parte de la transacción)
        this.prismaService.ordenesproductos.findMany({
          where: { ordcod: { in: codes } },
          select: {
            prodcod: true,
          },
        }),
        
      ]);

      // Extraer el resultado del findMany (es el último elemento del array retornado por $transaction)
        const foundProductOrders = result[2];
      // 2. Recolectar todos los prodcod únicos de los resultados obtenidos.
        const prodCodesToEliminate = [...new Set(foundProductOrders.map(item => item.prodcod))];
      //3. Eliminar item de los productos
      if (prodCodesToEliminate.length > 0) { // Asegúrate de que haya algo que eliminar
          await this.prismaService.items.deleteMany({
          where: {
            prodcod: { in: prodCodesToEliminate }, // Usar la cláusula 'in' para eficiencia
          },
        });
      }
        
      const [deletedProducts, deletedOrders] = result;

      if (deletedOrders.count === 0) {
        throw new NotFoundException(
          `No se encontraron órdenes con IDs: ${codes}`,
        );
      }

      return {
        message: `Se eliminaron ${deletedOrders.count} orden(es) y ${deletedProducts.count} producto(s) asociados.`,
      };
    } catch (error) {
      console.error("Error al eliminar órdenes:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          "Error de base de datos al eliminar órdenes",
        );
      }
      throw error; // Re-lanza otros errores (como el NotFoundException)
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
