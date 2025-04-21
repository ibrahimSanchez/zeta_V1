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
import { ListProductResponse } from "./types/listProductResponse";

@Injectable()
export class ProductService {
  constructor(
    private prismaService: PrismaService,
    private readonly productTypeService: ProductTypeService,
  ) {}

  private cleanString(str: string): string {
    return str ? str.replace(/[^\x00-\x7F]/g, "") : str;
  }

  //todo: *********************************************************************************
  async getAllProduct(): Promise<ListProductResponse[]> {
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
  async getProductByProdcod(prodcod: string): Promise<productos> {
    try {
      const foundProduct = await this.prismaService.productos.findUnique({
        where: { prodcod },
      });

      if (!foundProduct) {
        throw new NotFoundException(
          `The product with code ${prodcod} cannot be found`,
        );
      }
      return foundProduct;
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
    const { prodcod, prodnom, tipprodcod } = createProductDto;

    try {
      return this.prismaService.productos.create({
        data: {
          prodcod,
          prodnom,
          tipprodcod,
        },
      });
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
    try {
      return await this.prismaService.productos.update({
        where: { prodcod },
        data: updateProductDto,
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

  //todo: *********************************************************************************
  async fetchArticles(): Promise<any> {
    let page = 1;
    let isLastPage = false;
    const articles: any[] = [];

    axios.interceptors.response.use(
      (response) => {
        if (response.headers["content-type"].includes("charset=ISO-8859-1")) {
          response.data = iconv.decode(
            Buffer.from(response.data),
            "ISO-8859-1",
          );
        }
        return response;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    while (!isLastPage) {
      const body = {
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
      try {
        console.log(`Sending request to Article-API for page ${page}...`);
        const response = await axios.post(
          "https://www.zetasoftware.com/rest/APIs/RESTArticulosV2Query",
          body,
          {
            headers: {
              "Content-Type": "application/json",
            },
            responseType: "arraybuffer",
          },
        );

        const responseData = JSON.parse(response.data.toString("utf8"));
        const articlesData = responseData.QueryOut.Response;
        isLastPage = responseData.QueryOut.IsLastPage;

        const newArticles = articlesData.map((data) => {
          const article: any = {};
          let articleCurrency: Currencies = Currencies.uyu;
          if (data.MonedaCodigo == 1) {
            articleCurrency = Currencies.uyu;
          } else if (data.MonedaCodigo == 2) {
            articleCurrency = Currencies.usd;
          } else if (data.MonedaCodigo == 3) {
            articleCurrency = Currencies.eu;
          }

          article.code = data.Codigo;
          article.familyCode = data.FamiliaCodigo;
          article.barcode = data.CodigoBarras;
          article.name = data.Nombre.trim();
          article.familyname = data.FamiliaNombre;
          article.unitCost = parseFloat(data.Costo);
          article.supplierCode = data.ProveedorCodigo;
          article.supplierName = data.ProveedorNombre;
          article.armedBy = data.ProveedorNombre;
          // article.expiration = data.Vencimiento ? new Date(data.Vencimiento) : null;
          article.codeMark = data.MarcaCodigo;
          article.nameMark = data.MarcaNombre;
          article.currency = articleCurrency;
          article.unitaryAmount = data.Costo;
          article.components = [];

          article.code = this.cleanString(article.code);
          article.familyCode = this.cleanString(article.familyCode);
          article.name = this.cleanString(article.name);
          article.barcode = this.cleanString(article.barcode);
          article.familyname = this.cleanString(article.familyname);
          article.armedBy = this.cleanString(article.armedBy);

          return article;
        });

        articles.push(...newArticles);
        page++;
      } catch (error) {
        console.error("Error fetching articles:", error);
        throw error;
      }
    }
    console.log(`Successfully fetched ${articles.length} articles`);

    for (const article of articles) {
      try {
        const foundProduct = await this.prismaService.productos.findUnique({
          where: { prodcod: article.code },
        });
        if (foundProduct) {
          await this.updateProduct(article.code, {
            prodnom: article.name,
          });
        } else {
          await this.createProduct({
            prodnom: article.name,
            prodcod: article.code,
            tipprodcod: article.familyCode,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    return articles;
  }
}
