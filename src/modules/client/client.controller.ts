import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ClientService } from "./client.service";
import { Public } from "src/modules/auth/decorators/public.decorator";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";

@Controller("clients")
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Public()
  @Get()
  async getAllClient() {
    return this.clientService.getAllClient();
  }

  @Public()
  @Get(":id")
  async getClientByProvcod(@Param("id") id: string) {
    return this.clientService.getClientByClicod(id);
  }

  @Public()
  @Post()
  async createClient(@Body() createClientDto: CreateClientDto) {
    return this.clientService.createClient(createClientDto);
  }

  @Public()
  @Patch(":id")
  async updateClient(
    @Param("id") id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientService.updateClient(id, updateClientDto);
  }

  @Public()
  @Post("fetch")
  async fetchClients() {
    try {
      return await this.clientService.fetchClients();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "There was a problem fetching articles",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
