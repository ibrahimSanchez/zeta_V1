import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  // Todo:*************************************************************************
  async create(createUserDto: CreateUserDto) {
    const { usunom, usucla, tipusucod, usucod } = createUserDto;

    try {
      return await this.prismaService.usuarios.create({
        data: { usunom, usucla, tipusucod, usucod },
        select: {
          usucod: true,
          usunom: true,
          tipusucod: true,
        },
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
          usucod: true,
          tipusucod: true,
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
        select: {
          usucod: true,
          usunom: true,
          tipusucod: true,
        },
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
        select: {
          tipusucod: true,
          tipusunom: true,
        },
      });

      return userType?.tipusunom;
    } catch (error) {
      throw new BadRequestException("An error has occurred");
    }
  }

  //todo: *********************************************************************************
  async updateUser(usucod: number, updateUserDto: UpdateUserDto) {
    try {
      return await this.prismaService.usuarios.update({
        where: { usucod },
        data: updateUserDto,
        select: {
          usucod: true,
          usunom: true,
          tipusucod: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundException(`User with code ${usucod} not found`);
        }
        throw new BadRequestException("Invalid user data");
      }
      throw new InternalServerErrorException("Failed to update user");
    }
  }

  async deleteUser(codes: number[]) {
    try {
      const deleted = await this.prismaService.usuarios.deleteMany({
        where: { usucod: { in: codes } },
      });

      if (deleted.count === 0) {
        throw new NotFoundException(`No users found with the given codes`);
      }

      return {
        message: `Deleted ${deleted.count} user(s) successfully.`,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          "Database error while deleting users",
        );
      }

      throw new InternalServerErrorException("Failed to delete users");
    }
  }
}
