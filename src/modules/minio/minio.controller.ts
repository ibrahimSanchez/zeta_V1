import {
  Controller,
  Post,
  UseInterceptors,
  Get,
  Param,
  Delete,
  Body,
  Res,
  UploadedFiles,
  NotFoundException,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { MinioService } from "./minio.service";
import { Public } from "../auth/decorators/public.decorator";
import { Response } from "express";
import * as archiver from "archiver";
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiResponse,
} from "@nestjs/swagger";
import {
  // DeleteFilesResponseDto,
  FilesListResponseDto,
  SwaggerUploadDto,
  SwaggerUploadResponseDto,
} from "./dto/minio.dto";

@Controller("files")
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Public()
  @Post("upload")
  @ApiOperation({
    summary: "Subir archivos",
    description: "Subir archivos al servidor de minio",
  })
  @ApiBody({
    type: SwaggerUploadDto,
    description: "Datos para subir archivos",
  })
  @ApiOkResponse({
    description: "Archivos subidos exitosamente",
    type: SwaggerUploadResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Datos de entrada inválidos",
  })
  @ApiResponse({
    status: 404,
    description: "La ordenproducto no se encuentra",
  })
  @UseInterceptors(FilesInterceptor("files"))
  async uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() data: { key: string },
  ) {
    if (!files || files.length === 0) {
      throw new Error("No file uploaded");
    }

    return this.minioService.uploadFiles(files, data.key);
  }

  @Public()
  @Get(":key")
  @ApiOperation({
    summary: "Descargar archivo",
    description:
      "Descarga un archivo específico del almacenamiento usando su clave única",
  })
  @ApiParam({
    name: "key",
    description: "Clave única que identifica el archivo a descargar",
    example: "documento-123.pdf",
    type: String,
  })
  @ApiProduces("application/octet-stream")
  @ApiResponse({
    status: 200,
    description: "Archivo descargado exitosamente",
    content: {
      "application/octet-stream": {
        schema: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "El archivo no fue encontrado",
    content: {
      "application/json": {
        example: {
          statusCode: 404,
          message:
            "El archivo con clave documento-123.pdf no existe en el almacenamiento",
          error: "Not Found",
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: "Error interno del servidor",
    content: {
      "application/json": {
        example: {
          statusCode: 500,
          message: "Failed to retrieve file: Error description",
          error: "Internal Server Error",
        },
      },
    },
  })
  async getFile(@Param("key") key: string, @Res() res: Response) {
    const { stream, meta } = await this.minioService.downloadFileByKey(key);

    res.set({
      "Content-Type": meta.contentType,
      "Content-Length": meta.contentLength,
      "Content-Disposition": `attachment; filename="${key}"`,
    });

    stream.pipe(res);
  }

  @Public()
  @Get("download-all/:key")
  @ApiOperation({
    summary: "Descargar múltiples archivos como ZIP",
    description:
      "Descarga todos los archivos que coincidan con el prefijo de clave como un archivo ZIP comprimido. Ideal para descargar conjuntos de PDFs relacionados.",
  })
  @ApiParam({
    name: "key",
    description: "Prefijo de clave para buscar archivos (puede ser parcial)",
    example: "facturas-2023/",
    type: String,
  })
  @ApiProduces("application/zip")
  @ApiResponse({
    status: 200,
    description: "Archivo ZIP generado exitosamente",
    content: {
      "application/zip": {
        schema: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "No se encontraron archivos con el prefijo especificado",
    content: {
      "application/json": {
        example: {
          statusCode: 404,
          message: "No files found",
          error: "Not Found",
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: "Error al generar el archivo ZIP",
    content: {
      "application/json": {
        example: {
          statusCode: 500,
          message: "Failed to create ZIP: Error description",
          error: "Internal Server Error",
        },
      },
    },
  })
  async downloadAllFiles(@Param("key") key: string, @Res() res: Response) {
    const files = await this.minioService.getFilesByKeyPrefix(key);

    if (!files || files.length === 0) {
      throw new NotFoundException("No files found");
    }

    const archive = archiver("zip", {
      zlib: { level: 9 }, 
    });

    archive.on("error", (err) => {
      throw new Error(`Failed to create ZIP: ${err.message}`);
    });

    const safeKey = key.replace(/[^a-zA-Z0-9-_]/g, "_");

    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${safeKey}_files.zip"`,
    });

    archive.pipe(res);

    for (const file of files) {
      archive.append(file.stream, { name: file.meta.filename });
    }

    await archive.finalize();
  }

  @Public()
  @Delete("delete/:key")
  @ApiOperation({
    summary: "Eliminar archivos por prefijo",
    description:
      "Elimina todos los archivos cuyos nombres comiencen con el prefijo especificado",
  })
  @ApiParam({
    name: "key",
    description: "Prefijo de clave para eliminar archivos",
    example: "user_uploads_123/",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: "Archivos eliminados exitosamente",
    // type: DeleteFilesResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: "No se encontraron archivos con el prefijo especificado",
    content: {
      "application/json": {
        example: {
          statusCode: 404,
          message: "No files found with the specified prefix",
          error: "Not Found",
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: "Error al eliminar los archivos",
    content: {
      "application/json": {
        example: {
          statusCode: 500,
          message: "Failed to delete files",
          error: "Internal Server Error",
        },
      },
    },
  })
  async deleteFile(@Param("key") key: string) {
    return await this.minioService.deleteFiles(key);
  }

  @Public()
  @Get("all/:key")
  @ApiOperation({
    summary: "Listar archivos por prefijo",
    description:
      "Obtiene un listado de todos los archivos cuyos nombres comiencen con el prefijo especificado",
  })
  @ApiParam({
    name: "key",
    description: "Prefijo de clave para buscar archivos",
    example: "user_uploads_123/",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: "Listado de archivos obtenido exitosamente",
    type: FilesListResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: "No se encontraron archivos con el prefijo especificado",
    content: {
      "application/json": {
        example: {
          statusCode: 404,
          message: "No files found with the specified prefix",
          error: "Not Found",
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: "Error al obtener el listado de archivos",
    content: {
      "application/json": {
        example: {
          statusCode: 500,
          message: "Failed to retrieve files list",
          error: "Internal Server Error",
        },
      },
    },
  })
  async getFilesByKeyPrefix(@Param("key") key: string) {
    const files = await this.minioService.getFilesByKeyPrefix(key);

    return {
      count: files.length,
      files: files.map((file) => ({
        filename: file.meta.filename,
        size: file.meta.contentLength,
        type: file.meta.contentType,
      })),
    };
  }
}
