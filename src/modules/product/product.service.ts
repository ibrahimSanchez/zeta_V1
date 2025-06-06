import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import axios from "axios";
import * as iconv from "iconv-lite";
import { CreateProductDto } from "./dto/create-product.dto";
import { Currencies } from "./enums/currencies.enum";
import { Prisma, productos } from "@prisma/client";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductTypeService } from "../product-type/product-type.service";
import { ProductResponse } from "./types/productResponse";
import { Logger } from "@nestjs/common"; // Importa Logger

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    private prismaService: PrismaService,
    private readonly productTypeService: ProductTypeService,
  ) {}

  private cleanString(str: string): string {
    return str ? str.replace(/[^\x00-\x7F]/g, "") : str;
  }

  //todo: *********************************************************************************
  async getAllProduct(): Promise<ProductResponse[]> {
    try {
      const allProducts = await this.prismaService.productos.findMany();
      const allProductsTypes = await this.productTypeService.findAll();

      const listProductResponse = allProducts.map((product) => {
        const family = allProductsTypes.find(
          (type) => type.tipprodcod === product.tipprodcod,
        );

        return {
          prodcod: product.prodcod,
          prodnom: product.prodnom,
          family: family || null,
          components: [],
          componentsExist: product.parentproductid ? true : false,
        };
      });

      return listProductResponse;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          "Database error while fetching products",
        );
      }

      throw new InternalServerErrorException("Unexpected error occurred");
    }
  }

  //todo: *********************************************************************************
  async getProductByProdcod(prodcod: string): Promise<ProductResponse> {
    try {
      const foundProduct = await this.prismaService.productos.findUnique({
        where: { prodcod },
      });

      if (!foundProduct) {
        throw new NotFoundException(
          `The product with code ${prodcod} cannot be found`,
        );
      }

      const foundProductType =
        await this.productTypeService.findProductTypeByTipprodcod(
          foundProduct.tipprodcod || "",
        );

      const currentComponents = await this.prismaService.productos.findMany({
        where: {
          parentproductid: prodcod,
        },
      });

      const components = currentComponents.map(({ prodcod, prodnom }) => ({
        prodcod,
        prodnom,
        family: null,
        componentsExist: false,
        components: [],
      }));

      return {
        prodcod: foundProduct.prodcod,
        prodnom: foundProduct.prodnom,
        family: foundProductType || null,
        components,
        componentsExist: true,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException("Invalid product code format");
      }

      throw new InternalServerErrorException(
        "An unexpected error occurred while fetching product information",
      );
    }
  }

  //todo: *********************************************************************************
  async createProduct(createProductDto: CreateProductDto): Promise<productos> {
    const { prodcod, prodnom, tipprodcod, components } = createProductDto;
    try {
      const createResponse = await this.prismaService.productos.create({
        data: {
          prodcod,
          prodnom,
          tipprodcod,
        },
      });

      if (components && components.length > 0) {
        await this.prismaService.productos.updateMany({
          where: {
            prodcod: { in: components },
          },
          data: {
            parentproductid: prodcod,
          },
        });
      }

      return createResponse;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException("product already exists");
        }
        throw new BadRequestException("Invalid product data");
      }
      throw new InternalServerErrorException("Failed to create product");
    }
  }

  //todo: *********************************************************************************
  async updateProduct(
    prodcod: string,
    updateProductDto: UpdateProductDto,
  ): Promise<productos> {
    const { components, ...restData } = updateProductDto;

    try {
      const currentComponents = await this.prismaService.productos.findMany({
        where: {
          parentproductid: prodcod,
        },
        select: {
          prodcod: true,
        },
      });
      const currentComponentCodes = currentComponents.map((c) => c.prodcod);

      const componentsToAdd =
        components?.filter((code) => !currentComponentCodes.includes(code)) ||
        [];
      const componentsToRemove =
        currentComponentCodes.filter((code) => !components?.includes(code)) ||
        [];

      return await this.prismaService.$transaction(async (prisma) => {
        const updatedProduct = await prisma.productos.update({
          where: { prodcod },
          data: restData,
        });

        if (componentsToAdd.length > 0) {
          await prisma.productos.updateMany({
            where: {
              prodcod: { in: componentsToAdd },
            },
            data: {
              parentproductid: prodcod,
            },
          });
        }

        if (componentsToRemove.length > 0) {
          await prisma.productos.updateMany({
            where: {
              prodcod: { in: componentsToRemove },
            },
            data: {
              parentproductid: null,
            },
          });
        }

        return updatedProduct;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundException(`Product with code ${prodcod} not found`);
        }
        throw new BadRequestException("Invalid product data");
      }
      throw new InternalServerErrorException("Failed to update product");
    }
  }

  // //todo: *********************************************************************************
  async fetchArticles(): Promise<any[]> {
    let page = 1;
    let isLastPage = false;
    const articles: any[] = [];

    while (!isLastPage) {
      try {
        console.log(`Fetching page ${page}...`);
        const body = this.getRequestBody(page);
        const response = await axios.post(
          "https://www.zetasoftware.com/rest/APIs/RESTArticulosV2Query",
          body,
          {
            headers: { "Content-Type": "application/json" },
            responseType: "arraybuffer",
          },
        );

        const responseData = JSON.parse(response.data.toString("utf8"));
        const articlesData = responseData.QueryOut.Response;
        isLastPage = responseData.QueryOut.IsLastPage;

        const newArticles = this.transformArticles(articlesData);
        articles.push(...newArticles);
        page++;
      } catch (error) {
        console.error("Error fetching articles:", error);
        throw error;
      }
    }

    // return articles

    console.log(`Fetched ${articles.length} articles`);

    await Promise.allSettled(
      articles.map((article) => this.processArticle(article)),
    );

    return articles;
  }

  private getRequestBody(page: number) {
    return {
      QueryIn: {
        Connection: {
          DesarrolladorCodigo: process.env.DESARROLLADOR_CODIGO,
          DesarrolladorClave: process.env.DESARROLLADOR_CLAVE,
          EmpresaCodigo: process.env.EMPRESA_CODIGO,
          EmpresaClave: process.env.EMPRESA_CLAVE,
          UsuarioCodigo: process.env.USUARIO_CODIGO,
          UsuarioClave: process.env.USUARIO_CLAVE,
          RolCodigo: process.env.ROL_CODIGO,
        },
        Data: {
          Page: page.toString(),
        },
      },
    };
  }

  private transformArticles(dataList: any[]): any[] {
    return dataList.map((data) => ({
      code: this.cleanString(data.Codigo),
      name: this.cleanString(data.Nombre.trim()),
      familyCode: this.cleanString(data.FamiliaCodigo),
      familyname: this.cleanString(data.FamiliaNombre),
      supplierCode: this.cleanString(data.ProveedorCodigo),
      supplierName: this.cleanString(data.ProveedorNombre),
      currency: this.mapCurrency(data.MonedaCodigo),
    }));
  }

  private async processArticle(article: any) {
    try {
      await this.upsertSupplier(article);
      if (article.familyCode.length > 0) await this.upsertProductType(article);
      await this.upsertProduct(article);
    } catch (err) {
      console.error(`Error processing article ${article.code}`, err);
    }
  }

  private async upsertSupplier(article: any) {
    const found = await this.prismaService.proveedores.findUnique({
      where: { provcod: article.supplierCode },
    });

    if (found) {
      await this.prismaService.proveedores.update({
        where: { provcod: article.supplierCode },
        data: { provnom: article.supplierName },
      });
    } else {
      await this.prismaService.proveedores.create({
        data: {
          provcod: article.supplierCode,
          provnom: article.supplierName,
        },
      });
    }
  }
  private async upsertProductType(article: any) {
    const found = await this.prismaService.tipoproductos.findUnique({
      where: { tipprodcod: article.familyCode },
    });

    if (found) {
      await this.prismaService.tipoproductos.update({
        where: { tipprodcod: article.familyCode },
        data: {
          tipprodimp: false,
          tipprodnom: article.familyname,
        },
      });
    } else {
      await this.prismaService.tipoproductos.create({
        data: {
          tipprodcod: article.familyCode,
          tipprodgru: 1,
          tipprodimp: false,
          tipprodnom: article.familyname,
        },
      });
    }
  }
  private async upsertProduct(article: any) {
    const found = await this.prismaService.productos.findUnique({
      where: { prodcod: article.code },
    });

    if (found) {
      await this.prismaService.productos.update({
        where: { prodcod: article.code },
        data: {
          prodnom: article.name,
        },
      });
    } else {
      await this.prismaService.productos.create({
        data: {
          prodcod: article.code,
          prodnom: article.name,
          tipprodcod: article.familyCode,
        },
      });
    }
  }


  async remove(prodcod: string) {
    try {
      const existing = await this.prismaService.productos.findUnique({
        where: { prodcod },
      });

      if (!existing) {
        throw new NotFoundException(
          `Product with prodcod ${prodcod} not found`,
        );
      }

      return await this.prismaService.productos.delete({
        where: { prodcod },
      });
    } catch (error) {
      console.error("Delete product error:", error);
      throw new InternalServerErrorException(
        "An error occurred while deleting the product",
      );
    }
  }

  
  private mapCurrency(monedaCodigo: number): Currencies {
    switch (monedaCodigo) {
      case 1:
        return Currencies.uyu;
      case 2:
        return Currencies.usd;
      case 3:
        return Currencies.eu;
      default:
        return Currencies.uyu;
    }
  }
}
