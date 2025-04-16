import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  // Todo:*************************************************************************
  async create(createUserDto: CreateUserDto) {
    const { usunom, usucla, tipusucod, usucod } = createUserDto;

    try {
      return await this.prismaService.usuarios.create({
        data: { usunom, usucla, tipusucod, usucod },
      });
    } catch (error) {
      throw new HttpException(
        `Error creating user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Todo:*************************************************************************
  async getAllUsers() {
    try {
      const allUsers = await this.prismaService.usuarios.findMany({
        select: {
          usunom: true,
        },
      });

      return allUsers;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  // Todo:*************************************************************************
  async getUserById(usucod: number) {
    try {
      return await this.prismaService.usuarios.findUnique({
        where: { usucod },
      });
    } catch (error) {
      throw new BadRequestException("An error has occurred");
    }
  }

  // Todo:*************************************************************************
  async getUserByUsunom(usunom: string) {
    try {
      return await this.prismaService.usuarios.findFirst({
        where: { usunom },
      });
    } catch (error) {
      throw new BadRequestException("An error has occurred");
    }
  }

  // Todo:*************************************************************************
  async getUserTypeByTipusucod(tipusucod: number) {
    try {
      const userType = await this.prismaService.tipousuarios.findUnique({
        where: { tipusucod },
      });

      return userType?.tipusunom;
    } catch (error) {
      throw new BadRequestException("An error has occurred");
    }
  }
}
