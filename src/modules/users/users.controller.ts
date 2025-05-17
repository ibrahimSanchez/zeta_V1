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
import { CreateUserDto, SwaggerCreateUserResponse, SwaggerDeleteUserDto, SwaggerUpdateUserDto, SwaggerUserDto } from "./dto/create-user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth/jwt-auth.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../auth/enums/role.enum";
import { UpdateUserDto } from "./dto/update-user.dto";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiHeader
} from '@nestjs/swagger';


@ApiTags('Usuarios')
@ApiBearerAuth('JWT-auth')
@ApiHeader({
  name: 'Authorization',
  description: 'Token JWT requerido para acceso administrativo',
  required: true
})
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //todo: *********************************************************************************************
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Post("/create")
  @ApiOperation({ 
    summary: 'Crear nuevo usuario', 
    description: 'Endpoint exclusivo para administradores para crear nuevos usuarios' 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario creado exitosamente',
    type: SwaggerCreateUserResponse
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Se requiere rol de administrador' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'El correo electrónico ya está registrado' 
  })
  @ApiBody({ 
    type: SwaggerUserDto,
    description: 'Datos requeridos para la creación del usuario' 
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }


  //todo: *********************************************************************************************
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ 
    summary: 'Obtener todos los usuarios', 
    description: 'Devuelve una lista paginada de todos los usuarios registrados' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuarios obtenida exitosamente',
    type: [SwaggerCreateUserResponse]
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Se requiere rol de administrador' 
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de página para paginación',
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Límite de resultados por página',
    example: 10
  })
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  //todo: *********************************************************************************************
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Get("/:id")
  @ApiOperation({ 
    summary: 'Obtener usuario por ID', 
    description: 'Recupera los detalles completos de un usuario específico' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario encontrado',
    type: SwaggerCreateUserResponse
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Se requiere rol de administrador' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado' 
  })
  @ApiParam({
    name: 'id',
    description: 'ID numérico del usuario',
    example: 1
  })
  async getUserById(@Param("id") id: string) {
    return await this.usersService.getUserById(parseInt(id));
  }

  //todo: *********************************************************************************************
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Patch("/update/:id")
  @ApiOperation({ 
    summary: 'Actualizar usuario', 
    description: 'Actualiza la información de un usuario existente' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario actualizado exitosamente',
    type: SwaggerCreateUserResponse
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Se requiere rol de administrador' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado' 
  })
  @ApiParam({
    name: 'id',
    description: 'ID numérico del usuario a actualizar',
    example: 1
  })
  @ApiBody({ 
    type: SwaggerUpdateUserDto,
    description: 'Datos a actualizar para el usuario' 
  })
  async updateUser(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(parseInt(id), updateUserDto);
  }

  //todo: *********************************************************************************************
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Post("/delete")
  @ApiOperation({ 
    summary: 'Eliminar usuarios', 
    description: 'Elimina uno o múltiples usuarios (borrado lógico o físico según implementación)' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuarios eliminados exitosamente',
    type: SwaggerDeleteUserDto // Asume que tienes un DTO para respuestas de eliminación
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Se requiere rol de administrador' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Uno o más usuarios no encontrados' 
  })
  @ApiBody({
    type: [Number],
    description: 'Array de IDs de usuarios a eliminar',
    examples: {
      multiple: {
        value: [1, 2, 3],
        description: 'Eliminar múltiples usuarios'
      },
      single: {
        value: [1],
        description: 'Eliminar un único usuario'
      }
    }
  })
  async deleteUser(@Body() codes: number[]) {
    return await this.usersService.deleteUser(codes);
  }
}
