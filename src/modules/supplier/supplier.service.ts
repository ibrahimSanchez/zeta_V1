import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import axios from "axios";
import * as iconv from "iconv-lite";
import { Contact } from "src/interfaces";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";
import { Prisma, proveedores } from "@prisma/client";
import { CreateSupplierDto } from "./dto/create-supplier.dto";

@Injectable()
export class SupplierService {
  constructor(private prismaService: PrismaService) {}

  private cleanString(str: string): string {
    return str ? str.replace(/[^\x00-\x7F]/g, "") : str;
  }
  private parseRut(rut: string | null): number | null {
    if (rut) {
      const parsedRut = parseInt(rut);
      return isNaN(parsedRut) ? null : parsedRut;
    } else return null;
  }

  //todo: *********************************************************************************
  async getAllSuppliersNamesCodes() {
    try {
      return await this.prismaService.proveedores.findMany({
        select: {
          provcod: true,
          provnom: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          "Database error while fetching suppliers",
        );
      }

      throw new InternalServerErrorException("Unexpected error occurred");
    }
  }

  //todo: *********************************************************************************
  async getAllSupplier(): Promise<proveedores[]> {
    try {
      return await this.prismaService.proveedores.findMany();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          "Database error while fetching suppliers",
        );
      }

      throw new InternalServerErrorException("Unexpected error occurred");
    }
  }

  //todo: *********************************************************************************
  async getSupplierByProvcod(provcod: string): Promise<proveedores> {
    try {
      const foundSupplier = await this.prismaService.proveedores.findUnique({
        where: { provcod },
      });

      if (!foundSupplier) {
        throw new NotFoundException(
          `The supplier with code ${provcod} cannot be found`,
        );
      }
      return foundSupplier;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException("Invalid supplier code format");
      }

      throw new InternalServerErrorException(
        "An unexpected error occurred while fetching supplier information",
      );
    }
  }

  //todo: *********************************************************************************
  async createSupplier(
    createSupplierDto: CreateSupplierDto,
  ): Promise<proveedores> {
    const { provnom, provcod } = createSupplierDto;

    try {
      if (!provnom || provnom.trim().length === 0) {
        throw new BadRequestException("Supplier name cannot be empty");
      }

      if (provnom.length > 50) {
        throw new BadRequestException(
          "Supplier name exceeds maximum length of 50 characters",
        );
      }
      return this.prismaService.proveedores.create({
        data: {
          provcod,
          provnom,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException("Supplier already exists");
        }
        throw new BadRequestException("Invalid supplier data");
      }
      throw new InternalServerErrorException("Failed to create supplier");
    }
  }

  //todo: *********************************************************************************
  async updateSupplier(
    provcod: string,
    updateSupplierDto: UpdateSupplierDto,
  ): Promise<proveedores> {
    try {
      return await this.prismaService.proveedores.update({
        where: { provcod },
        data: updateSupplierDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundException(
            `Supplier with code ${provcod} not found`,
          );
        }
        throw new BadRequestException("Invalid supplier data");
      }
      throw new InternalServerErrorException("Failed to update supplier");
    }
  }

  //todo: *********************************************************************************
  async fetchSuppliers(): Promise<any> {
    let page = 1;
    let isLastPage = false;
    const suppliers: any[] = [];

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
        console.log(`Sending request to supplier-API for page ${page}...`);
        const response = await axios.post(
          "https://www.zetasoftware.com/rest/APIs/RESTContactosV1Query",
          body,
          {
            headers: {
              "Content-Type": "application/json",
            },
            responseType: "arraybuffer",
            transformResponse: [
              (data) => {
                try {
                  return JSON.parse(
                    Buffer.from(data, "binary").toString("utf8"),
                  );
                } catch (e) {
                  console.error("Error parsing response data:", e);
                  throw new Error("Failed to parse response data");
                }
              },
            ],
          },
        );

        const responseData = response.data.QueryOut;
        const supplierData = responseData.Response;
        isLastPage = responseData.IsLastPage;

        return supplierData;

        const newSuppliers = supplierData
          .filter((data: Contact) => data.EsProveedor === "S")
          .map((data: Contact) => {
            const supplier: any = {};
            supplier.code = data.Codigo;
            supplier.name = data.Nombre.trim();

            supplier.code = this.cleanString(supplier.code);
            supplier.name = this.cleanString(supplier.name);

            return supplier;
          });

        suppliers.push(...newSuppliers);
        page++;
      } catch (error) {
        console.error(
          "Error fetching suppliers:",
          error.response ? error.response.data : error.message,
        );
        throw new Error(
          `Failed to fetch suppliers on page ${page}: ${error.message}`,
        );
      }
    }

    console.log(`Successfully fetched ${suppliers.length} suppliers`);

    for (const supplier of suppliers) {
      try {
        const foundSupplier = await this.prismaService.proveedores.findUnique({
          where: { provcod: supplier.code },
        });
        if (foundSupplier) {
          await this.updateSupplier(supplier.code, {
            provnom: supplier.name,
          });
        } else {
          await this.createSupplier({
            provnom: supplier.name,
            provcod: supplier.code,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    return suppliers;
  }

  
    async remove(provcod: string) {
    try {
      const existing = await this.prismaService.proveedores.findUnique({
        where: { provcod },
      });

      if (!existing) {
        throw new NotFoundException(
          `Supplier with provcod ${provcod} not found`,
        );
      }

      return await this.prismaService.proveedores.delete({
        where: { provcod },
      });
    } catch (error) {
      console.error("Delete supplier error:", error);
      throw new InternalServerErrorException(
        "An error occurred while deleting the supplier",
      );
    }
  }


}
