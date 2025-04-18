import {
  Controller,
  Get,
  Body,
  Post,
  UseGuards,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth/jwt-auth.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../auth/enums/role.enum";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Post("/create")
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Get("/:id")
  async getUserById(@Param("id") id: string) {
    return await this.usersService.getUserById(parseInt(id));
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Patch("/update/:id")
  async updateUser(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(parseInt(id), updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Delete("/delete/:id")
  async deleteUser(@Param("id") id: string) {
    return await this.usersService.deleteUser(parseInt(id));
  }
}
