import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Contact } from "src/interfaces";
import axios from "axios";
import * as iconv from "iconv-lite";
import { clientes, Prisma } from "@prisma/client";
import { CreateClientDto } from "./dto/create-client.dto";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateClientDto } from "./dto/update-client.dto";

@Injectable()
export class ClientService {
  constructor(private prismaService: PrismaService) {}

  private cleanString(str: string): string {
    return str ? str.replace(/[^\x00-\x7F]/g, "") : str;
  }

  //todo: *********************************************************************************
  async getAllClientsNamesCodes() {
    try {
      return await this.prismaService.clientes.findMany({
        select: {
          clicod: true,
          clinom: true
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          "Database error while fetching clients",
        );
      }

      throw new InternalServerErrorException("Unexpected error occurred");
    }
  }

  //todo: *********************************************************************************
  async getAllClient(): Promise<clientes[]> {
    try {
      return await this.prismaService.clientes.findMany();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          "Database error while fetching clients",
        );
      }

      throw new InternalServerErrorException("Unexpected error occurred");
    }
  }

  //todo: *********************************************************************************
  async getClientByClicod(clicod: string): Promise<clientes> {
    try {
      const foundClient = await this.prismaService.clientes.findUnique({
        where: { clicod },
      });

      if (!foundClient) {
        throw new NotFoundException(
          `The client with code ${clicod} cannot be found`,
        );
      }
      return foundClient;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException("Invalid client code format");
      }

      throw new InternalServerErrorException(
        "An unexpected error occurred while fetching client information",
      );
    }
  }

  //todo: *********************************************************************************
  async createClient(createClientDto: CreateClientDto): Promise<clientes> {
    const { clicod, clicodbit, clidir, cliest, clinom, clirazsoc, cliruc } =
      createClientDto;

    try {
      return this.prismaService.clientes.create({
        data: { clicod, clicodbit, clidir, cliest, clinom, clirazsoc, cliruc },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException("Client already exists");
        }
        throw new BadRequestException("Invalid client data");
      }
      throw new InternalServerErrorException("Failed to create client");
    }
  }

  //todo: *********************************************************************************
  async updateClient(
    clicod: string,
    updateClientDto: UpdateClientDto,
  ): Promise<clientes> {
    try {
      return await this.prismaService.clientes.update({
        where: { clicod },
        data: updateClientDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundException(`Client with code ${clicod} not found`);
        }
        throw new BadRequestException("Invalid client data");
      }
      throw new InternalServerErrorException("Failed to update client");
    }
  }

  //todo: *********************************************************************************
  async fetchClients(): Promise<any> {
    let page = 1;
    let isLastPage = false;
    const clients: any[] = [];

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
        console.log(`Sending request to Client-API for page ${page}...`);
        const response = await axios.post(
          "https://www.zetasoftware.com/rest/APIs/RESTContactosV1Query",
          body,
          {
            headers: {
              "Content-Type": "application/json",
            },
            responseType: "arraybuffer",
          },
        );

        const responseData = JSON.parse(response.data.toString("utf8"));
        const clientData = responseData.QueryOut.Response;
        isLastPage = responseData.QueryOut.IsLastPage;

        // return clientData
        const newClients = clientData
          .filter((data: Contact) => data.EsCliente === "S")
          .map((data: Contact) => {
            const client: any = {};
            client.name = data.Nombre.trim();
            client.ruc = data.RUT;
            client.companyName = data.RazonSocial;
            client.address = data.DireccionCompleta;
            client.code = data.Codigo;

            // client.state = data.DepartamentoNombre;
            // client.registration_date = new Date(data.FechaAlta);
            // client.isActive = data.ContactoActivo === "S" ? "S" : "N";

            client.code = this.cleanString(client.code);
            client.name = this.cleanString(client.name);
            client.companyName = this.cleanString(client.companyName);
            client.address = this.cleanString(client.address);
            client.state = this.cleanString(client.state);
            client.isActive = this.cleanString(client.isActive);

            return client;
          });

        clients.push(...newClients);
        page++;
      } catch (error) {
        console.error(
          "Error fetching clients:",
          error.response ? error.response.data : error.message,
        );
        throw new Error(
          `Failed to fetch clients on page ${page}: ${error.message}`,
        );
      }
    }
    console.log(`Successfully fetched ${clients.length} clients`);

    for (const client of clients) {
      try {
        const foundSupplier = await this.prismaService.clientes.findUnique({
          where: { clicod: client.code },
        });

        if (foundSupplier) {
          await this.updateClient(client.code, {
            clicodbit: client.code,
            clinom: client.name || null,
            clidir: client.address || null,
            clirazsoc: client.companyName || null,
            cliruc: client.ruc || null,
            cliest: true,
          });
        } else {
          await this.createClient({
            clicod: client.code,
            clicodbit: client.code || null,
            clinom: client.name || null,
            clidir: client.address || null,
            clirazsoc: client.companyName || null,
            cliruc: client.ruc || null,
            cliest: true,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }

    return clients;
  }
}
